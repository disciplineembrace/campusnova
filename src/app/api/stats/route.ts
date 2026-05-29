import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getAdminFromCookies } from '@/lib/admin-auth'

export async function GET() {
  try {
    // Check if admin is authenticated - if so, return full stats
    const admin = await getAdminFromCookies()

    // Public stats (limited)
    const [activeListings, categoryStats] = await Promise.all([
      db.listing.count({ where: { isSold: false } }),
      db.listing.groupBy({
        by: ['category'],
        _count: { category: true },
        where: { isSold: false },
      }),
    ])

    // If admin, return full stats
    if (admin) {
      const [totalUsers, totalListings, totalReports, unresolvedReports, featuredListings] = await Promise.all([
        db.user.count(),
        db.listing.count(),
        db.report.count(),
        db.report.count({ where: { isResolved: false } }),
        db.listing.count({ where: { isFeatured: true } }),
      ])

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
    }

    // Non-admin: return limited public stats only
    const totalUsers = await db.user.count()
    const uniqueColleges = await db.user.findMany({
      where: { college: { not: null } },
      select: { college: true },
      distinct: ['college'],
    })

    return NextResponse.json({
      userCount: totalUsers,
      listingCount: activeListings,
      collegeCount: uniqueColleges.length,
      activeListings,
      categoryStats: categoryStats.map(c => ({ category: c.category, count: c._count.category })),
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
