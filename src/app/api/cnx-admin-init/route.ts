import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword } from '@/lib/admin-auth'

/**
 * Database initialization endpoint.
 * Uses Neon serverless driver (HTTP) instead of Prisma (TCP) for reliable
 * serverless connectivity. This creates tables and seeds the admin user.
 * 
 * Secured with a hardcoded secret to prevent unauthorized access.
 */
const INIT_SECRET = 'EduCampusHub-Init-2024-Secure'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const secret = body.secret || ''
    
    if (secret !== INIT_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results: string[] = []

    // 1. Create PasswordResetOTP table if not exists (using raw SQL via neon)
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS "PasswordResetOTP" (
          "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
          "email" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "otpCode" TEXT NOT NULL,
          "isVerified" BOOLEAN NOT NULL DEFAULT false,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "usedAt" TIMESTAMP(3)
        )
      `
      await sql`CREATE INDEX IF NOT EXISTS "PasswordResetOTP_email_idx" ON "PasswordResetOTP"("email")`
      await sql`CREATE INDEX IF NOT EXISTS "PasswordResetOTP_otpCode_idx" ON "PasswordResetOTP"("otpCode")`
      await sql`CREATE INDEX IF NOT EXISTS "PasswordResetOTP_expiresAt_idx" ON "PasswordResetOTP"("expiresAt")`
      results.push('✅ PasswordResetOTP table ready')
    } catch (tableError: any) {
      results.push(`❌ PasswordResetOTP table error: ${tableError.message?.substring(0, 150)}`)
    }

    // 2. Seed/Update admin user
    const adminEmail = 'disciplineembrace@gmail.com'
    const adminPassword = '@deval1808'
    const adminPhone = '9974331007'

    try {
      const hash = await hashPassword(adminPassword)
      
      // Check if admin exists
      const existing = await sql`
        SELECT id, "isAdmin" FROM "User" WHERE email = ${adminEmail}
      `
      
      if (existing.length > 0) {
        // Update existing admin
        await sql`
          UPDATE "User" SET 
            "isAdmin" = true,
            "adminRole" = 'super_admin',
            "passwordHash" = ${hash},
            "mustChangePassword" = false,
            "isVerified" = true,
            phone = ${adminPhone},
            name = 'EduCampusHub Admin',
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE email = ${adminEmail}
        `
        results.push(`✅ Admin user updated: ${adminEmail} / phone: ${adminPhone}`)
      } else {
        // Create admin user
        await sql`
          INSERT INTO "User" (id, email, name, "isAdmin", "adminRole", "passwordHash", "mustChangePassword", "isVerified", phone, city, "freeUploadUsed", "paidUploadCredits", "totalBooksUploaded", rating, "totalSales", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${adminEmail}, 'EduCampusHub Admin', true, 'super_admin', ${hash}, false, true, ${adminPhone}, 'Delhi', 0, 0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `
        results.push(`✅ Admin user created: ${adminEmail} / phone: ${adminPhone}`)
      }
    } catch (adminError: any) {
      results.push(`❌ Admin user error: ${adminError.message?.substring(0, 150)}`)
    }

    // 3. Test database connectivity
    try {
      const userResult = await sql`SELECT COUNT(*)::int as count FROM "User"`
      const listingResult = await sql`SELECT COUNT(*)::int as count FROM "Listing"`
      results.push(`✅ DB connected: ${userResult[0]?.count || 0} users, ${listingResult[0]?.count || 0} listings`)
    } catch (dbError: any) {
      results.push(`❌ DB connectivity error: ${dbError.message?.substring(0, 150)}`)
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
