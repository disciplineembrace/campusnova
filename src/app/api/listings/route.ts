import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const listing = await db.listing.findUnique({
        where: { id },
        include: { seller: true }
      })
      if (!listing) {
        return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
      }
      await db.listing.update({ where: { id }, data: { views: { increment: 1 } } })
      return NextResponse.json({ listing: { ...listing, views: listing.views + 1 } })
    }

    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const course = searchParams.get('course')
    const semester = searchParams.get('semester')
    const search = searchParams.get('search')
    const condition = searchParams.get('condition')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const featured = searchParams.get('featured')
    const listingType = searchParams.get('listingType')
    const board = searchParams.get('board')
    const standard = searchParams.get('standard')
    const isDigital = searchParams.get('isDigital')

    const where: Record<string, unknown> = { isSold: false }

    if (category && category !== 'all') where.category = category
    if (city && city !== 'all') where.city = city
    if (course) where.course = { contains: course }
    if (semester && semester !== 'all') where.semester = semester
    if (condition) where.condition = condition
    if (featured === 'true') where.isFeatured = true
    if (listingType && listingType !== 'all') where.listingType = listingType
    if (board && board !== 'all') where.board = board
    if (standard && standard !== 'all') where.standard = standard
    if (isDigital === 'true') where.isDigital = true
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { course: { contains: search } },
        { college: { contains: search } },
        { subcategory: { contains: search } },
      ]
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sortBy === 'price-low') orderBy = { sellingPrice: 'asc' }
    else if (sortBy === 'price-high') orderBy = { sellingPrice: 'desc' }
    else if (sortBy === 'popular') orderBy = { views: 'desc' }

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        include: { seller: { select: { id: true, name: true, college: true, city: true, isVerified: true, rating: true, avatar: true } } },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.listing.count({ where })
    ])

    return NextResponse.json({ listings, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('Listings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, originalPrice, sellingPrice, category, subcategory, listingType, course, semester, standard, board, college, city, condition, whatsappNumber, sellerId, isDigital, fileUrl, images } = body

    // Validate required fields
    if (!title || !description || !category || !city || !condition || !whatsappNumber || !sellerId) {
      return NextResponse.json({ error: 'Missing required fields: title, description, category, city, condition, whatsappNumber, sellerId are required' }, { status: 400 })
    }

    // Validate selling price
    if (!sellingPrice || sellingPrice <= 0) {
      return NextResponse.json({ error: 'Selling price must be greater than 0' }, { status: 400 })
    }

    // Validate whatsapp number (Indian 10-digit)
    if (!/^\d{10}$/.test(whatsappNumber.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Invalid WhatsApp number format' }, { status: 400 })
    }

    // Parse and validate images
    let imagesJson = '[]'
    if (images) {
      try {
        const parsed = typeof images === 'string' ? JSON.parse(images) : images
        if (Array.isArray(parsed)) {
          // Validate each URL is a safe path
          const safeUrls = parsed.filter((url: string) => {
            if (typeof url !== 'string') return false
            // Only allow relative paths from our upload directory
            return url.startsWith('/uploads/') && !url.includes('..')
          })
          imagesJson = JSON.stringify(safeUrls)
        }
      } catch {
        imagesJson = '[]'
      }
    }

    // Rate limiting: Check if seller has created too many listings recently
    const recentListings = await db.listing.count({
      where: {
        sellerId,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
      }
    })
    if (recentListings >= 5) {
      return NextResponse.json({ error: 'Too many listings created recently. Please wait a few minutes.' }, { status: 429 })
    }

    const listing = await db.listing.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        originalPrice: originalPrice || 0,
        sellingPrice: sellingPrice || 0,
        category,
        subcategory: subcategory || null,
        listingType: listingType || 'sell',
        course: course || null,
        semester: semester || null,
        standard: standard || null,
        board: board || null,
        college: college || null,
        city,
        condition,
        whatsappNumber: whatsappNumber.replace(/\s/g, ''),
        sellerId,
        images: imagesJson,
        isDigital: isDigital || false,
        fileUrl: fileUrl || null,
      },
      include: { seller: true }
    })

    await db.user.update({ where: { id: sellerId }, data: { totalSales: { increment: 1 } } })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error) {
    console.error('Listings POST error:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 })
    }

    const listing = await db.listing.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json({ listing })
  } catch (error) {
    console.error('Listings PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 })
    }

    await db.wishlist.deleteMany({ where: { listingId: id } })
    await db.report.deleteMany({ where: { listingId: id } })
    await db.listing.delete({ where: { id } })

    return NextResponse.json({ message: 'Listing deleted' })
  } catch (error) {
    console.error('Listings DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
}
