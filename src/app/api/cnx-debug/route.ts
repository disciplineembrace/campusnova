import { NextResponse } from 'next/server'

/**
 * Debug endpoint - TEMPORARY - remove after fixing DB connection
 * Shows the DATABASE_URL configuration (masked) to diagnose connection issues
 */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL || ''
  const directUrl = process.env.DIRECT_URL || ''
  
  // Mask the password in the connection string
  const maskPassword = (url: string) => {
    if (!url) return 'NOT SET'
    try {
      // Format: postgresql://user:password@host/db
      const match = url.match(/^(postgresql:\/\/[^:]+:)([^@]+)(@.+)$/)
      if (match) {
        return `${match[1]}***${match[3]}`
      }
      return url.substring(0, 30) + '...'
    } catch {
      return 'PARSE_ERROR'
    }
  }

  return NextResponse.json({
    DATABASE_URL: maskPassword(dbUrl),
    DIRECT_URL: maskPassword(directUrl),
    hasDbUrl: !!dbUrl,
    hasDirectUrl: !!directUrl,
    dbUrlStartsWith: dbUrl ? dbUrl.substring(0, 15) : 'N/A',
    nodeEnv: process.env.NODE_ENV,
  })
}
