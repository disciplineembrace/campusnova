import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/admin-auth'

/**
 * One-time database initialization endpoint.
 * This creates the PasswordResetOTP table and seeds the admin user.
 * After first successful run, this can be removed.
 * 
 * Secured with a secret token to prevent unauthorized access.
 */
export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    // Simple auth check - must match JWT_SECRET or a known value
    const expectedSecret = process.env.JWT_SECRET || 'educampushub-jwt-secret-2024-secure'
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results: string[] = []

    // 1. Try to check if PasswordResetOTP table exists
    try {
      await db.passwordResetOTP.findFirst()
      results.push('✅ PasswordResetOTP table exists')
    } catch {
      results.push('❌ PasswordResetOTP table missing - run prisma db push')
    }

    // 2. Check existing admin user
    const adminEmail = 'disciplineembrace@gmail.com'
    const adminPassword = '@deval1808'
    const adminPhone = '9974331007'

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

    // 3. Test database connectivity
    const userCount = await db.user.count()
    const listingCount = await db.listing.count()
    results.push(`✅ DB connected: ${userCount} users, ${listingCount} listings`)

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('DB init error:', error)
    return NextResponse.json({ 
      error: 'Initialization failed', 
      details: error.message 
    }, { status: 500 })
  }
}
