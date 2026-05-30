import { db } from '@/lib/db'
import { hashPassword } from '@/lib/admin-auth'

async function seedAdmin() {
  const adminEmail = 'disciplineembrace@gmail.com'
  const adminPassword = '@deval1808'
  const adminPhone = '9974331007'

  try {
    // Check if admin already exists
    const existing = await db.user.findUnique({ where: { email: adminEmail } })

    if (existing) {
      // Update existing user to be admin with correct password and phone
      const hash = await hashPassword(adminPassword)
      await db.user.update({
        where: { email: adminEmail },
        data: {
          isAdmin: true,
          adminRole: 'super_admin',
          passwordHash: hash,
          mustChangePassword: false, // Admin set their own password
          isVerified: true,
          phone: adminPhone,
          name: 'EduCampusHub Admin',
        }
      })
      console.log(`✅ Admin ${adminEmail} updated with new password and phone.`)
    } else {
      // Create new admin user
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
      console.log(`✅ Admin account created: ${adminEmail}`)
    }

    console.log('\n📋 Admin credentials:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log(`   Phone: ${adminPhone}`)
    console.log(`   Panel: /cnx-admin-panel`)
    console.log(`   Role: super_admin`)
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

seedAdmin()
