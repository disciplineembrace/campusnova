import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [totalUsers, totalListings, activeListings, totalReports, unresolvedReports, featuredListings] = await Promise.all([
      db.user.count(),
      db.listing.count(),
      db.listing.count({ where: { isSold: false } }),
      db.report.count(),
      db.report.count({ where: { isResolved: false } }),
      db.listing.count({ where: { isFeatured: true } }),
    ])

    const categoryStats = await db.listing.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { isSold: false },
    })

    const cityStats = await db.listing.groupBy({
      by: ['city'],
      _count: { city: true },
      where: { isSold: false },
      orderBy: { _count: { city: 'desc' } },
      take: 5,
    })

    const totalViews = await db.listing.aggregate({ _sum: { views: true } })

    const recentListings = await db.listing.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { seller: { select: { name: true, college: true } } }
    })

    return NextResponse.json({
      totalUsers,
      totalListings,
      activeListings,
      totalReports,
      unresolvedReports,
      featuredListings,
      totalViews: totalViews._sum.views || 0,
      categoryStats: categoryStats.map(c => ({ category: c.category, count: c._count.category })),
      cityStats: cityStats.map(c => ({ city: c.city, count: c._count.city })),
      recentListings,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
