import { createHmac, timingSafeEqual, randomBytes } from 'crypto'
import { db } from './db'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'campusnova-jwt-secret-2024-secure'
const ADMIN_COOKIE_NAME = 'cnx_admin_session'
const SESSION_DURATION = 4 * 60 * 60 * 1000 // 4 hours

export type AdminRole = 'super_admin' | 'moderator' | 'support_admin'

export interface AdminPayload {
  userId: string
  email: string
  role: AdminRole
  iat: number
  exp: number
}

// Create a signed token using HMAC (no external dependency needed)
function createSignedToken(payload: AdminPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

// Verify a signed token
function verifySignedToken(token: string): AdminPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, body, signature] = parts
    const expectedSignature = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)
    if (sigBuffer.length !== expectedBuffer.length) return null
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as AdminPayload

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) return null

    return payload
  } catch {
    return null
  }
}

// Generate JWT token for admin session
export async function createAdminSession(userId: string, email: string, role: AdminRole, ipAddress?: string, userAgent?: string) {
  try {
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + (4 * 60 * 60) // 4 hours

    const payload: AdminPayload = { userId, email, role, iat, exp }
    const token = createSignedToken(payload)

    await db.adminSession.create({
      data: {
        userId,
        token,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt: new Date(exp * 1000),
      }
    })

    return token
  } catch (error) {
    console.error('Create admin session error:', error)
    throw error
  }
}

// Verify admin JWT token
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const payload = verifySignedToken(token)
    if (!payload) return null

    // Check session in DB
    const session = await db.adminSession.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!session || session.isRevoked || session.expiresAt < new Date() || session.user.isBanned) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

// Get admin from cookies (server-side only)
export async function getAdminFromCookies(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    if (!token) return null
    return verifyAdminToken(token)
  } catch {
    return null
  }
}

// Revoke admin session
export async function revokeAdminSession(token: string) {
  try {
    await db.adminSession.update({
      where: { token },
      data: { isRevoked: true }
    })
  } catch {
    // Session may not exist
  }
}

// Clean expired sessions
export async function cleanExpiredSessions() {
  try {
    await db.adminSession.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    })
  } catch {
    // Ignore cleanup errors
  }
}

// Role permissions
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['all'],
  moderator: ['delete_listing', 'ban_user', 'verify_seller', 'manage_reports', 'feature_listing'],
  support_admin: ['manage_reports', 'verify_seller'],
}

export function hasPermission(role: AdminRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role]
  if (!perms) return false
  if (perms.includes('all')) return true
  return perms.includes(permission)
}
