import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file with override to ensure Neon DB URL takes precedence
// over any stale DATABASE_URL in the system environment
config({ path: resolve(process.cwd(), '.env'), override: true })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure Neon connection strings are set at runtime (in case dotenv override didn't apply)
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
  console.warn('[db] Warning: DATABASE_URL not properly set, attempting Neon fallback')
  process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_3gplhuJ5Fxre@ep-shy-king-aox8a8db-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
}
if (!process.env.DIRECT_URL || !process.env.DIRECT_URL.startsWith('postgresql://')) {
  process.env.DIRECT_URL = 'postgresql://neondb_owner:npg_3gplhuJ5Fxre@ep-shy-king-aox8a8db.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
