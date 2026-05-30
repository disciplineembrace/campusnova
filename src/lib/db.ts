import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Always load .env with override FIRST, before any Prisma client instantiation
const envResult = config({ path: resolve(process.cwd(), '.env'), override: true })

// If DATABASE_URL is still not a PostgreSQL URL, try to set it from the loaded .env
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
  if (envResult.parsed?.DATABASE_URL) {
    process.env.DATABASE_URL = envResult.parsed.DATABASE_URL
  }
}
if (!process.env.DIRECT_URL || !process.env.DIRECT_URL.startsWith('postgresql://')) {
  if (envResult.parsed?.DIRECT_URL) {
    process.env.DIRECT_URL = envResult.parsed.DIRECT_URL
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Validate that required environment variables are set
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
  console.error('ERROR: DATABASE_URL is not properly configured. Current value:', process.env.DATABASE_URL?.substring(0, 30))
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
