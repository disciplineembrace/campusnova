import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// POST: Expire pending payments that have passed their expiry time
export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json()

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
    }

    const payment = await db.payment.findUnique({ where: { id: paymentId } })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (payment.status !== 'pending') {
      return NextResponse.json({ error: 'Payment is not pending' }, { status: 400 })
    }

    // Mark as expired
    await db.payment.update({
      where: { id: paymentId },
      data: { status: 'expired' }
    })

    return NextResponse.json({ success: true, message: 'Payment session expired' })
  } catch (error) {
    console.error('Payment expire error:', error)
    return NextResponse.json({ error: 'Failed to expire payment' }, { status: 500 })
  }
}
