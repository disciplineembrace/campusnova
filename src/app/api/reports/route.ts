import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const reports = await db.report.findMany({
      include: {
        listing: { select: { id: true, title: true } },
        reporter: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Reports GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { listingId, reporterId, reason } = await request.json()
    if (!listingId || !reporterId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const report = await db.report.create({ data: { listingId, reporterId, reason } })
    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error('Reports POST error:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, isResolved } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }
    const report = await db.report.update({ where: { id }, data: { isResolved } })
    return NextResponse.json({ report })
  } catch (error) {
    console.error('Reports PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
}
