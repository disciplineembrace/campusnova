import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/admin-auth'

/**
 * One-time database initialization endpoint.
 * This checks/creates the PasswordResetOTP table and seeds the admin user.
 * 
 * Secured with a hardcoded secret to prevent unauthorized access.
 * Remove this endpoint after initialization is complete.
 */
const INIT_SECRET = 'EduCampusHub-Init-2024-Secure'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const secret = body.secret || ''
    
    // Auth check with fixed secret
    if (secret !== INIT_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results: string[] = []

    // 1. Try to check if PasswordResetOTP table exists
    try {
      await db.passwordResetOTP.findFirst()
      results.push('✅ PasswordResetOTP table exists')
    } catch (tableError: any) {
      results.push(`❌ PasswordResetOTP table issue: ${tableError.message?.substring(0, 100) || 'missing'}`)
    }

    // 2. Check existing admin user
    const adminEmail = 'disciplineembrace@gmail.com'
    const adminPassword = '@deval1808'
    const adminPhone = '9974331007'

    try {
      const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } })
      
      if (existingAdmin) {
        // Update admin with new password and phone
        const hash = await hashPassword(adminPassword)
        await db.user.update({
          where: { email: adminEmail },
          data: {
            isAdmin: true,
            adminRole: 'super_admin',
            passwordHash: hash,
            mustChangePassword: false,
            isVerified: true,
            phone: adminPhone,
            name: 'EduCampusHub Admin',
          }
        })
        results.push(`✅ Admin user updated: ${adminEmail} / phone: ${adminPhone}`)
      } else {
        // Create admin user
        const hash = await hashPassword(adminPassword)
        await db.user.create({
          data: {
            email: adminEmail,
            name: 'EduCampusHub Admin',
            isAdmin: true,
            adminRole: 'super_admin',
            passwordHash: hash,
            mustChangePassword: false,
            isVerified: true,
            phone: adminPhone,
            city: 'Delhi',
          }
        })
        results.push(`✅ Admin user created: ${adminEmail} / phone: ${adminPhone}`)
      }
    } catch (adminError: any) {
      results.push(`❌ Admin user error: ${adminError.message?.substring(0, 150) || 'unknown'}`)
    }

    // 3. Test database connectivity
    try {
      const userCount = await db.user.count()
      const listingCount = await db.listing.count()
      results.push(`✅ DB connected: ${userCount} users, ${listingCount} listings`)
    } catch (dbError: any) {
      results.push(`❌ DB connectivity error: ${dbError.message?.substring(0, 150) || 'unknown'}`)
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('DB init error:', error)
    return NextResponse.json({ 
      error: 'Initialization failed', 
      details: error.message 
    }, { status: 500 })
  }
}
