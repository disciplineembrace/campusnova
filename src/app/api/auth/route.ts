import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { checkApiRateLimit, isValidEmail, sanitizeString } from '@/lib/api-security'

export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimit = checkApiRateLimit(request)
    if (rateLimit && !rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
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

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
