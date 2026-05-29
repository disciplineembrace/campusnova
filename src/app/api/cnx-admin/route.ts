import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookies, hasPermission, revokeAdminSession, type AdminRole } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

// Verify admin for every request
async function verifyAdmin(request: Request) {
  const admin = await getAdminFromCookies()
  if (!admin) return null

  const user = await db.user.findUnique({ where: { id: admin.userId } })
  if (!user || !user.isAdmin || user.isBanned) return null

  return { ...admin, user }
}

// GET - Fetch admin data (stats, users, reports, listings)
export async function GET(request: Request) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'stats'

  if (type === 'stats') {
    const [totalUsers, totalListings, activeListings, totalReports, unresolvedReports, featuredListings] = await Promise.all([
      db.user.count(),
      db.listing.count(),
      db.listing.count({ where: { isSold: false } }),
      db.report.count(),
      db.report.count({ where: { isResolved: false } }),
      db.listing.count({ where: { isFeatured: true } }),
    ])
    const categoryStats = await db.listing.groupBy({ by: ['category'], _count: { category: true }, where: { isSold: false } })
    const cityStats = await db.listing.groupBy({ by: ['city'], _count: { city: true }, where: { isSold: false }, orderBy: { _count: { city: 'desc' } }, take: 5 })
    const totalViews = await db.listing.aggregate({ _sum: { views: true } })
    const recentListings = await db.listing.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { seller: { select: { name: true, college: true } } } })

    return NextResponse.json({ totalUsers, totalListings, activeListings, totalReports, unresolvedReports, featuredListings, totalViews: totalViews._sum.views || 0, categoryStats, cityStats, recentListings })
  }

  if (type === 'users') {
    const users = await db.user.findMany({ include: { _count: { select: { listings: true } } }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ users })
  }

  if (type === 'reports') {
    const reports = await db.report.findMany({ include: { listing: { select: { id: true, title: true } }, reporter: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ reports })
  }

  if (type === 'listings') {
    const listings = await db.listing.findMany({ include: { seller: { select: { id: true, name: true, email: true, college: true } } }, orderBy: { createdAt: 'desc' }, take: 50 })
    return NextResponse.json({ listings })
  }

  if (type === 'audit-logs') {
    if (!hasPermission(admin.role as AdminRole, 'all')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const logs = await db.auditLog.findMany({ include: { actor: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' }, take: 100 })
    return NextResponse.json({ logs })
  }

  if (type === 'payments') {
    if (!hasPermission(admin.role as AdminRole, 'manage_payments')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const payments = await db.payment.findMany({
      include: { user: { select: { id: true, name: true, email: true, college: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ payments })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

// POST - Admin actions
export async function POST(request: Request) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { action, targetId, details } = body
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()

  try {
    switch (action) {
      case 'delete_listing': {
        if (!hasPermission(admin.role as AdminRole, 'delete_listing')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.wishlist.deleteMany({ where: { listingId: targetId } })
        await db.report.deleteMany({ where: { listingId: targetId } })
        await db.listing.delete({ where: { id: targetId } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'delete_listing', targetType: 'listing', targetId, ipAddress: ip } })
        return NextResponse.json({ success: true })
      }
      case 'ban_user': {
        if (!hasPermission(admin.role as AdminRole, 'ban_user')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.user.update({ where: { id: targetId }, data: { isBanned: true } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'ban_user', targetType: 'user', targetId, ipAddress: ip, details: details || null } })
        return NextResponse.json({ success: true })
      }
      case 'unban_user': {
        if (!hasPermission(admin.role as AdminRole, 'ban_user')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.user.update({ where: { id: targetId }, data: { isBanned: false } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'unban_user', targetType: 'user', targetId, ipAddress: ip } })
        return NextResponse.json({ success: true })
      }
      case 'verify_seller': {
        if (!hasPermission(admin.role as AdminRole, 'verify_seller')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.user.update({ where: { id: targetId }, data: { isVerified: true } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'verify_seller', targetType: 'user', targetId, ipAddress: ip } })
        return NextResponse.json({ success: true })
      }
      case 'feature_listing': {
        if (!hasPermission(admin.role as AdminRole, 'feature_listing')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.listing.update({ where: { id: targetId }, data: { isFeatured: true } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'feature_listing', targetType: 'listing', targetId, ipAddress: ip } })
        return NextResponse.json({ success: true })
      }
      case 'unfeature_listing': {
        if (!hasPermission(admin.role as AdminRole, 'feature_listing')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.listing.update({ where: { id: targetId }, data: { isFeatured: false } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'unfeature_listing', targetType: 'listing', targetId, ipAddress: ip } })
        return NextResponse.json({ success: true })
      }
      case 'verify_listing': {
        if (!hasPermission(admin.role as AdminRole, 'verify_seller')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.listing.update({ where: { id: targetId }, data: { isVerified: true } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'verify_listing', targetType: 'listing', targetId, ipAddress: ip } })
        return NextResponse.json({ success: true })
      }
      case 'resolve_report': {
        if (!hasPermission(admin.role as AdminRole, 'manage_reports')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.report.update({ where: { id: targetId }, data: { isResolved: true } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'resolve_report', targetType: 'report', targetId, ipAddress: ip } })
        return NextResponse.json({ success: true })
      }
      case 'approve_payment': {
        if (!hasPermission(admin.role as AdminRole, 'manage_payments')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        const payment = await db.payment.findUnique({ where: { id: targetId } })
        if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
        if (payment.status === 'verified') return NextResponse.json({ error: 'Already verified' }, { status: 400 })
        await db.payment.update({ where: { id: targetId }, data: { status: 'verified', verifiedAt: new Date() } })
        await db.user.update({ where: { id: payment.userId }, data: { paidUploadCredits: { increment: payment.uploadCredit } } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'approve_payment', targetType: 'payment', targetId, ipAddress: ip, details: JSON.stringify({ amount: payment.amount, userId: payment.userId }) } })
        return NextResponse.json({ success: true })
      }
      case 'reject_payment': {
        if (!hasPermission(admin.role as AdminRole, 'manage_payments')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        await db.payment.update({ where: { id: targetId }, data: { status: 'rejected' } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'reject_payment', targetType: 'payment', targetId, ipAddress: ip, details: details || null } })
        return NextResponse.json({ success: true })
      }
      case 'grant_credits': {
        if (!hasPermission(admin.role as AdminRole, 'all')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        const credits = Number(details?.credits) || 1
        await db.user.update({ where: { id: targetId }, data: { paidUploadCredits: { increment: credits } } })
        await db.auditLog.create({ data: { actorId: admin.userId, action: 'grant_credits', targetType: 'user', targetId, ipAddress: ip, details: JSON.stringify({ credits }) } })
        return NextResponse.json({ success: true })
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Admin action error:', error)
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}

// DELETE - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('cnx_admin_session')?.value
    if (token) {
      await revokeAdminSession(token)
    }
  } catch {
    // ignore errors during logout
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('cnx_admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/cnx-admin-panel',
    maxAge: 0,
  })
  return response
}
