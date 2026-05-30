import { PrismaClient } from '@prisma/client'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env with override
const envResult = config({ path: resolve(process.cwd(), '.env'), override: true })

// Set env vars from .env if not already set
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

// Validate
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
  console.error('ERROR: DATABASE_URL is not properly configured. Current value:', process.env.DATABASE_URL?.substring(0, 30))
}

// Create Neon SQL function for HTTP-based queries (works in serverless)
export const sql = neon(process.env.DATABASE_URL || '')

// Standard PrismaClient - uses TCP which may fail in serverless
// But we keep it for local development and as primary in non-serverless contexts
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
