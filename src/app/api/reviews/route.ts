import { NextResponse } from 'next/server'

// Static testimonials for the homepage
// In production, these would come from a database
const TESTIMONIALS = [
  {
    id: 'rev-1',
    rating: 5,
    comment: 'Saved over ₹2000 on my engineering textbooks! The books were in great condition and the seller was very responsive on WhatsApp. Highly recommend CampusNova to every student.',
    reviewer: { name: 'Priya Sharma', college: 'IIT Delhi' },
  },
  {
    id: 'rev-2',
    rating: 5,
    comment: 'Found NEET preparation books at 70% off. The quality was much better than expected. This platform is a game-changer for students on a budget.',
    reviewer: { name: 'Rahul Patel', college: 'AIIMS Delhi' },
  },
  {
    id: 'rev-3',
    rating: 4,
    comment: 'Sold my old UPSC books within 2 days! The process was super easy and I helped another aspirant save money. Win-win for everyone.',
    reviewer: { name: 'Ananya Singh', college: 'JNU Delhi' },
  },
  {
    id: 'rev-4',
    rating: 5,
    comment: 'Best platform for second-hand books in India. I bought all my semester books here and saved thousands. The direct WhatsApp chat makes everything smooth.',
    reviewer: { name: 'Vikram Joshi', college: 'BITS Pilani' },
  },
  {
    id: 'rev-5',
    rating: 4,
    comment: 'Great variety of books available. Found rare medical textbooks that were out of stock everywhere else. Delivery was quick and the seller was helpful.',
    reviewer: { name: 'Sneha Reddy', college: 'CMC Vellore' },
  },
  {
    id: 'rev-6',
    rating: 5,
    comment: 'As a CA student, finding affordable study material was always a challenge. CampusNova solved that! Got all my reference books at amazing prices.',
    reviewer: { name: 'Arjun Mehta', college: 'SRCC Delhi' },
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '6'), 20)

    const reviews = TESTIMONIALS.slice(0, limit)

    return NextResponse.json({ reviews, total: TESTIMONIALS.length })
  } catch (error) {
    console.error('Reviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
