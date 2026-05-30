import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createAdminSession, verifyPassword, hashPassword, validatePasswordStrength, type AdminRole } from '@/lib/admin-auth'

// Rate limiting in-memory (production would use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

// POST - Admin login with email + password
export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json()

    // ─── Change Password Action ───
    if (action === 'change_password') {
      const { currentPassword, newPassword } = await request.json()

      if (!email || !currentPassword || !newPassword) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
      }

      const user = await db.user.findUnique({ where: { email } })
      if (!user || !user.isAdmin || !user.passwordHash) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }

      const isValid = await verifyPassword(currentPassword, user.passwordHash)
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }

      const validation = validatePasswordStrength(newPassword)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.errors.join('. ') }, { status: 400 })
      }

      const newHash = await hashPassword(newPassword)
      await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newHash,
          mustChangePassword: false,
        }
      })

      return NextResponse.json({ success: true, message: 'Password changed successfully' })
    }

    // ─── Login Action ───
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Rate limiting by IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
    const now = Date.now()
    const attempt = loginAttempts.get(ip)

    if (attempt && attempt.count >= MAX_ATTEMPTS && now - attempt.lastAttempt < LOCKOUT_DURATION) {
      return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 })
    }

    if (attempt && now - attempt.lastAttempt > LOCKOUT_DURATION) {
      loginAttempts.delete(ip)
    }

    // Step 1: Find admin user by email
    let user
    try {
      user = await db.user.findUnique({ where: { email } })
    } catch (dbError) {
      console.error('DB lookup error:', dbError)
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    }

    if (!user || !user.isAdmin || user.isBanned) {
      const current = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(ip, { count: current.count + 1, lastAttempt: now })
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Step 2: Verify password with bcrypt
    if (!user.passwordHash) {
      // Admin has no password set yet - shouldn't happen but handle gracefully
      return NextResponse.json({ error: 'Account not configured. Contact super admin.' }, { status: 403 })
    }

    const passwordValid = await verifyPassword(password, user.passwordHash)
    if (!passwordValid) {
      const current = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(ip, { count: current.count + 1, lastAttempt: now })
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Step 3: Create session token
    const role = (user.adminRole || 'support_admin') as AdminRole
    let token
    try {
      const userAgent = request.headers.get('user-agent') || undefined
      token = await createAdminSession(user.id, user.email, role, ip, userAgent)
    } catch (sessionError) {
      console.error('Session creation error:', sessionError)
      // Fallback: create token without DB session (stateless)
      const { createHmac } = await import('crypto')
      const JWT_SECRET = process.env.JWT_SECRET || 'educampushub-jwt-secret-2024-secure'
      const iat = Math.floor(Date.now() / 1000)
      const exp = iat + (4 * 60 * 60)
      const payload = { userId: user.id, email: user.email, role, iat, exp }
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
      const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
      const signature = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
      token = `${header}.${body}.${signature}`
    }

    // Reset rate limit on success
    loginAttempts.delete(ip)

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.adminRole || 'support_admin',
        mustChangePassword: user.mustChangePassword,
      }
    })

    response.cookies.set('cnx_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/cnx-admin-panel',
      maxAge: 4 * 60 * 60, // 4 hours
    })

    return response
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
