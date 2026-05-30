import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
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
 * Uses @neondatabase/serverless which connects over HTTPS,
 * bypassing TCP connection issues in serverless environments.
 */
function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('CRITICAL: DATABASE_URL is not set!')
    // Return a basic client that will fail gracefully
    return new PrismaClient({
      log: ['error'],
    })
  }

  // Use Neon serverless adapter for Neon databases
  if (databaseUrl.includes('neon.tech')) {
    try {
      // Create the Neon SQL function for HTTP-based queries
      const sql: NeonQueryFunction<false, false> = neon(databaseUrl)
      const adapter = new PrismaNeon(sql)
      
      const client = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
      
      console.log('✅ Prisma client created with Neon serverless adapter')
      return client
    } catch (adapterError) {
      console.error('Neon adapter creation failed:', adapterError)
      // Fall through to standard client
    }
  }
  
  // Fallback: Standard PrismaClient with TCP connection
  console.log('Using standard PrismaClient (TCP)')
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
