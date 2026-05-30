import { NextResponse } from 'next/server'

/**
 * Debug endpoint - TEMPORARY - remove after fixing DB connection
 * Tests DB connectivity and reveals connection string (masked) 
 */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL || ''
  const directUrl = process.env.DIRECT_URL || ''
  
  // Mask only the middle of the password
  const maskPassword = (url: string) => {
    if (!url) return 'NOT SET'
    try {
      const match = url.match(/^(postgresql:\/\/[^:]+:)([^@]+)(@.+)$/)
      if (match) {
        const pwd = match[2]
        if (pwd.length > 8) {
          return `${match[1]}${pwd.substring(0, 4)}...${pwd.substring(pwd.length - 4)}${match[3]}`
        }
        return `${match[1]}***${match[3]}`
      }
      return url.substring(0, 30) + '...'
    } catch {
      return 'PARSE_ERROR'
    }
  }

  // Test Neon serverless driver connection
  let dbTest = 'not_tested'
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(dbUrl)
    const result = await sql`SELECT 1 as test`
    dbTest = 'SUCCESS: ' + JSON.stringify(result[0])
  } catch (e: any) {
    dbTest = 'FAILED: ' + e.message?.substring(0, 200)
  }

  // Test Prisma connection
  let prismaTest = 'not_tested'
  try {
    const { db } = await import('@/lib/db')
    const result = await db.$queryRaw`SELECT 1 as test`
    prismaTest = 'SUCCESS: ' + JSON.stringify(result)
  } catch (e: any) {
    prismaTest = 'FAILED: ' + e.message?.substring(0, 200)
  }

  return NextResponse.json({
    DATABASE_URL_masked: maskPassword(dbUrl),
    DIRECT_URL_masked: maskPassword(directUrl),
    neonDriverTest: dbTest,
    prismaTest,
    nodeEnv: process.env.NODE_ENV,
  })
}
