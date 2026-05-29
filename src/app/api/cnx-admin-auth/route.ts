import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createAdminSession, type AdminRole } from '@/lib/admin-auth'

// Rate limiting in-memory (production would use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export async function POST(request: Request) {
  try {
    const { email, secretKey } = await request.json()

    // Rate limiting by IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
    const now = Date.now()
    const attempt = loginAttempts.get(ip)

    if (attempt && attempt.count >= MAX_ATTEMPTS && now - attempt.lastAttempt < LOCKOUT_DURATION) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
    }

    if (attempt && now - attempt.lastAttempt > LOCKOUT_DURATION) {
      loginAttempts.delete(ip)
    }

    // Verify admin credentials
    const user = await db.user.findUnique({ where: { email } })

    if (!user || !user.isAdmin || user.isBanned) {
      // Increment failed attempts
      const current = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(ip, { count: current.count + 1, lastAttempt: now })
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify secret key (admin must provide this)
    const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'campusnova-admin-2024'
    if (secretKey !== ADMIN_SECRET) {
      const current = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(ip, { count: current.count + 1, lastAttempt: now })
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const userAgent = request.headers.get('user-agent') || undefined
    const token = await createAdminSession(user.id, user.email, (user.adminRole || 'support_admin') as AdminRole, ip, userAgent)

    // Reset rate limit on success
    loginAttempts.delete(ip)

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      admin: { id: user.id, name: user.name, email: user.email, role: user.adminRole || 'support_admin' }
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
