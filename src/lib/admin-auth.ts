import jwt from 'jsonwebtoken'
import { db } from './db'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'campusnova-admin-secret-key-2024-secure'
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

// Generate JWT token for admin session
export async function createAdminSession(userId: string, email: string, role: AdminRole, ipAddress?: string, userAgent?: string) {
  const token = jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '4h' })

  await db.adminSession.create({
    data: {
      userId,
      token,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    }
  })

  return token
}

// Verify admin JWT token
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminPayload

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
  await db.adminSession.update({
    where: { token },
    data: { isRevoked: true }
  })
}

// Clean expired sessions
export async function cleanExpiredSessions() {
  await db.adminSession.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  })
}

// Role permissions
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['all'],
  moderator: ['delete_listing', 'ban_user', 'verify_seller', 'manage_reports', 'feature_listing'],
  support_admin: ['manage_reports', 'verify_seller'],
}

export function hasPermission(role: AdminRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role]
  if (perms.includes('all')) return true
  return perms.includes(permission)
}
