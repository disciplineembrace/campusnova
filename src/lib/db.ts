import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import { neon } from '@neondatabase/serverless'
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

// Create Prisma client with Neon serverless adapter for better Vercel compatibility
// Falls back to standard PrismaClient if Neon adapter isn't available
function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL
  
  // Try to use Neon serverless adapter for HTTP-based connections (better for serverless)
  if (databaseUrl && databaseUrl.includes('neon.tech')) {
    try {
      const sql = neon(databaseUrl)
      const adapter = new PrismaNeon(sql)
      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    } catch (adapterError) {
      console.warn('Neon adapter failed, falling back to standard PrismaClient:', adapterError)
      // Fall through to standard client
    }
  }
  
  // Standard PrismaClient for non-Neon databases or as fallback
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
