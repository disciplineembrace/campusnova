import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { checkApiRateLimit, isValidEmail, sanitizeString } from '@/lib/api-security'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Strip sensitive fields from user object before returning
function sanitizeUser(user: Record<string, unknown>) {
  const { passwordHash, adminSessions, auditLogs, sessions, ...safe } = user
  return safe
}

// Password strength validation: 8+ chars, uppercase, lowercase, digit, special char
function isPasswordStrong(password: string): boolean {
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  return hasUppercase && hasLowercase && hasDigit && hasSpecial
}

// Create a session token and UserSession record
async function createUserSession(userId: string, request: Request) {
  const token = jwt.sign(
    { userId, type: 'user_session' },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '30d' }
  )

  const forwarded = request.headers.get('x-forwarded-for')
  const ipAddress = forwarded?.split(',')[0]?.trim() || null
  const userAgent = request.headers.get('user-agent') || null
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await db.userSession.create({
    data: {
      userId,
      token,
      ipAddress,
      userAgent,
      expiresAt,
    },
  })

  return token
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimit = checkApiRateLimit(request)
    if (rateLimit && !rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const { action } = body

    // ─── REGISTER ─────────────────────────────────────────────
    if (action === 'register') {
      const { name, email, password, phone } = body

      // Validate required fields
      if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
        return NextResponse.json({ error: 'Name must be between 2 and 100 characters' }, { status: 400 })
      }

      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }

      if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 })
      }

      if (!password || typeof password !== 'string') {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 })
      }

      if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
      }

      if (!isPasswordStrong(password)) {
        return NextResponse.json({ error: 'Password must include uppercase, lowercase, number, and special character' }, { status: 400 })
      }

      const sanitizedEmail = email.toLowerCase().trim()
      const sanitizedName = sanitizeString(name.trim(), 100)

      // Check if email already exists
      const existingUser = await db.user.findUnique({ where: { email: sanitizedEmail } })
      if (existingUser) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
      }

      // Hash password with bcrypt (12 rounds)
      const passwordHash = await bcrypt.hash(password, 12)

      // Create user
      const user = await db.user.create({
        data: {
          email: sanitizedEmail,
          name: sanitizedName,
          phone: phone ? sanitizeString(phone.trim(), 20) : null,
          passwordHash,
          isVerified: false,
        },
      })

      // Create session
      const token = await createUserSession(user.id, request)

      const safeUser = sanitizeUser(user as unknown as Record<string, unknown>)

      return NextResponse.json({
        user: safeUser,
        token,
        message: 'Account created successfully!',
      }, { status: 201 })
    }

    // ─── LOGIN ────────────────────────────────────────────────
    if (action === 'login') {
      const { email, password } = body

      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }

      if (!password || typeof password !== 'string') {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 })
      }

      const sanitizedEmail = email.toLowerCase().trim()

      // Find user by email
      const user = await db.user.findUnique({ where: { email: sanitizedEmail } })
      if (!user || !user.passwordHash) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }

      // Compare password with bcrypt
      const passwordMatch = await bcrypt.compare(password, user.passwordHash)
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }

      // Check if banned
      if (user.isBanned) {
        return NextResponse.json({ error: 'This account has been banned' }, { status: 403 })
      }

      // Create session
      const token = await createUserSession(user.id, request)

      const safeUser = sanitizeUser(user as unknown as Record<string, unknown>)

      const response = NextResponse.json({
        user: safeUser,
        token,
      })

      // Set httpOnly cookie
      response.cookies.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })

      return response
    }

    // ─── LOGOUT ───────────────────────────────────────────────
    if (action === 'logout') {
      const { token } = body

      if (token) {
        // Revoke the session token
        await db.userSession.updateMany({
          where: { token, isRevoked: false },
          data: { isRevoked: true },
        })
      }

      const response = NextResponse.json({ message: 'Logged out successfully' })

      // Clear the session cookie
      response.cookies.set('session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      })

      return response
    }

    // ─── DEFAULT (backward compat: email-only flow) ───────────
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim()

    let user = await db.user.findUnique({ where: { email: sanitizedEmail } })

    if (!user) {
      // Create new user with sanitized name from email
      const nameFromEmail = sanitizeString(
        sanitizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        100
      )
      user = await db.user.create({
        data: {
          email: sanitizedEmail,
          name: nameFromEmail,
        }
      })
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'Account has been banned' }, { status: 403 })
    }

    const safeUser = sanitizeUser(user as unknown as Record<string, unknown>)

    return NextResponse.json({ user: safeUser })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
