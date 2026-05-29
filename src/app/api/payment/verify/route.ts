import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// POST: Submit payment proof (UTR number or screenshot)
export async function POST(request: Request) {
  try {
    const { paymentId, userId, utrNumber, screenshotUrl } = await request.json()

    if (!paymentId || !userId) {
      return NextResponse.json({ error: 'Payment ID and User ID are required' }, { status: 400 })
    }

    if (!utrNumber && !screenshotUrl) {
      return NextResponse.json({ error: 'Please provide either UTR number or payment screenshot' }, { status: 400 })
    }

    // Find the payment
    const payment = await db.payment.findUnique({ where: { id: paymentId } })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (payment.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (payment.status !== 'pending') {
      return NextResponse.json({ error: 'Payment is already processed' }, { status: 400 })
    }

    // Check if payment has expired
    if (new Date() > payment.expiresAt) {
      await db.payment.update({
        where: { id: paymentId },
        data: { status: 'expired' }
      })
      return NextResponse.json({ error: 'Payment session has expired. Please create a new one.' }, { status: 410 })
    }

    // Prevent duplicate UTR submissions
    if (utrNumber) {
      const existingUtr = await db.payment.findFirst({
        where: {
          utrNumber,
          status: { in: ['pending', 'verified'] },
          id: { not: paymentId },
        }
      })
      if (existingUtr) {
        return NextResponse.json({ error: 'This UTR number has already been used for another payment' }, { status: 409 })
      }
    }

    // Update payment with proof - auto-verify since it's UPI manual payment
    const updatedPayment = await db.payment.update({
      where: { id: paymentId },
      data: {
        utrNumber: utrNumber || null,
        screenshotUrl: screenshotUrl || null,
        status: 'verified',
        verifiedAt: new Date(),
      }
    })

    // Grant upload credit to user
    await db.user.update({
      where: { id: userId },
      data: {
        paidUploadCredits: { increment: 1 },
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        actorId: userId,
        action: 'payment_verified',
        targetType: 'payment',
        targetId: paymentId,
        details: JSON.stringify({
          amount: payment.amount,
          utrNumber: utrNumber || null,
          method: 'upi_qr',
        }),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment verified! 1 upload credit added to your account.',
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        amount: updatedPayment.amount,
        verifiedAt: updatedPayment.verifiedAt,
      }
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
