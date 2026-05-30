import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '@/lib/db'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false
      
      // Find or create user
      let dbUser = await db.user.findUnique({ where: { email: user.email } })
      if (!dbUser) {
        dbUser = await db.user.create({
          data: {
            email: user.email,
            name: user.name || user.email.split('@')[0],
            avatar: user.image || null,
            isVerified: true, // Google-verified email
          }
        })
      } else if (!dbUser.isVerified) {
        // Verify their email since Google confirmed it
        await db.user.update({ where: { id: dbUser.id }, data: { isVerified: true } })
      }
      
      if (dbUser.isBanned) return false
      return true
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user?.email) {
        const dbUser = await db.user.findUnique({ where: { email: session.user.email } })
        if (dbUser) {
          (session.user as Record<string, unknown>).id = dbUser.id
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.JWT_SECRET,
})

export { handler as GET, handler as POST }
