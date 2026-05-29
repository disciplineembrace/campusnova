import { db } from '@/lib/db'
import { hashPassword } from '@/lib/admin-auth'

async function seedAdmin() {
  const adminEmail = 'disciplineembrace@gmail.com'
  const defaultPassword = 'CampusNova@2024!'

  try {
    // Check if admin already exists
    const existing = await db.user.findUnique({ where: { email: adminEmail } })

    if (existing) {
      if (existing.isAdmin) {
        // Update existing user to be admin with password if not set
        if (!existing.passwordHash) {
          const hash = await hashPassword(defaultPassword)
          await db.user.update({
            where: { email: adminEmail },
            data: {
              isAdmin: true,
              adminRole: 'super_admin',
              passwordHash: hash,
              mustChangePassword: true,
              isVerified: true,
            }
          })
          console.log(`✅ Admin password set for ${adminEmail}. Must change on first login.`)
        } else {
          console.log(`ℹ️  Admin ${adminEmail} already has a password set.`)
        }
      } else {
        // Promote existing user to admin
        const hash = await hashPassword(defaultPassword)
        await db.user.update({
          where: { email: adminEmail },
          data: {
            isAdmin: true,
            adminRole: 'super_admin',
            passwordHash: hash,
            mustChangePassword: true,
            isVerified: true,
          }
        })
        console.log(`✅ User ${adminEmail} promoted to admin. Must change password on first login.`)
      }
    } else {
      // Create new admin user
      const hash = await hashPassword(defaultPassword)
      await db.user.create({
        data: {
          email: adminEmail,
          name: 'CampusNova Admin',
          isAdmin: true,
          adminRole: 'super_admin',
          passwordHash: hash,
          mustChangePassword: true,
          isVerified: true,
          city: 'Delhi',
        }
      })
      console.log(`✅ Admin account created: ${adminEmail}`)
      console.log(`   Default password: ${defaultPassword}`)
      console.log(`   ⚠️  Must change password on first login!`)
    }

    console.log('\n📋 Admin credentials:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${defaultPassword}`)
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
