import { PrismaNeon } from '@prisma/adapter-neon'
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

/**
 * Create Prisma client using the Neon serverless adapter.
 * 
 * The adapter uses @neondatabase/serverless which connects over HTTPS,
 * bypassing TCP connection issues in serverless environments (Vercel).
 * This resolves "Can't reach database server" errors that occur with
 * Prisma's default TCP-based connection engine.
 */
function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  // Use Neon serverless adapter for all Neon databases
  if (databaseUrl.includes('neon.tech')) {
    try {
      const sql = neon(databaseUrl)
      const adapter = new PrismaNeon(sql)
      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    } catch (adapterError) {
      console.warn('Neon adapter failed, falling back to standard PrismaClient:', adapterError)
    }
  }
  
  // Fallback: Standard PrismaClient
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
