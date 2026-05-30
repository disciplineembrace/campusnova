import { NextResponse } from 'next/server'

/**
 * TEMPORARY - Reveals full DATABASE_URL for DB migration
 * REMOVE THIS ENDPOINT AFTER FIXING DB CONNECTION
 */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL || ''
  const directUrl = process.env.DIRECT_URL || ''
  
  // Test connection with the URL
  let testResult = 'not_tested'
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(dbUrl)
    const result = await sql`SELECT current_database(), current_user, COUNT(*) as user_count FROM "User"`
    testResult = JSON.stringify(result[0])
  } catch (e: any) {
    testResult = 'FAILED: ' + e.message?.substring(0, 200)
  }

  return NextResponse.json({
    DATABASE_URL: dbUrl,
    DIRECT_URL: directUrl,
    test: testResult,
  })
}
