import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// In development: Load .env with override to ensure Neon DB URL takes precedence
// over any stale DATABASE_URL in the system environment.
// In production (Vercel): Skip dotenv override - Vercel injects env vars natively.
if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(process.cwd(), '.env'), override: true })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure Neon connection strings are set at runtime (fallback for any environment)
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
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
