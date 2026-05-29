import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/wishlist?userId=xxx — Fetch user's wishlist with listing details
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const wishlistItems = await db.wishlist.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                college: true,
                city: true,
                isVerified: true,
                rating: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      wishlist: wishlistItems.map(item => ({
        id: item.id,
        listingId: item.listingId,
        listing: item.listing,
        createdAt: item.createdAt,
      })),
      total: wishlistItems.length,
    })
  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

// POST /api/wishlist — Add or remove from wishlist (toggle)
// Body: { userId, listingId }
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, listingId } = body

    if (!userId || !listingId) {
      return NextResponse.json(
        { error: 'userId and listingId are required' },
        { status: 400 }
      )
    }

    // Verify the listing exists
    const listing = await db.listing.findUnique({ where: { id: listingId } })
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Verify the user exists
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if already wishlisted
    const existing = await db.wishlist.findUnique({
      where: {
        userId_listingId: { userId, listingId },
      },
    })

    if (existing) {
      // Remove from wishlist
      await db.wishlist.delete({
        where: { id: existing.id },
      })

      // Decrement saves count on listing
      await db.listing.update({
        where: { id: listingId },
        data: { saves: { decrement: 1 } },
      })

      return NextResponse.json({
        wishlisted: false,
        message: 'Removed from wishlist',
      })
    } else {
      // Add to wishlist
      const wishlistItem = await db.wishlist.create({
        data: { userId, listingId },
      })

      // Increment saves count on listing
      await db.listing.update({
        where: { id: listingId },
        data: { saves: { increment: 1 } },
      })

      return NextResponse.json(
        {
          wishlisted: true,
          wishlistItem,
          message: 'Added to wishlist',
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 })
  }
}
