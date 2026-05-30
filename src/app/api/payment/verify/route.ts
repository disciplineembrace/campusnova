import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { checkApiRateLimit, isValidUTR } from '@/lib/api-security'

// POST: Submit payment proof (UTR number or screenshot)
// Sets payment to 'pending_verification' - admin must manually approve
export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimit = checkApiRateLimit(request)
    if (rateLimit && !rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { paymentId, userId, utrNumber, screenshotUrl } = await request.json()

    if (!paymentId || !userId) {
      return NextResponse.json({ error: 'Payment ID and User ID are required' }, { status: 400 })
    }

    if (!utrNumber && !screenshotUrl) {
      return NextResponse.json({ error: 'Please provide either UTR number or payment screenshot' }, { status: 400 })
    }

    // Validate UTR format if provided
    if (utrNumber && !isValidUTR(utrNumber)) {
      return NextResponse.json({ error: 'Invalid UTR number format. Must be 6-12 digits.' }, { status: 400 })
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
          status: { in: ['pending', 'pending_verification', 'verified'] },
          id: { not: paymentId },
        }
      })
      if (existingUtr) {
        return NextResponse.json({ error: 'This UTR number has already been used for another payment' }, { status: 409 })
      }
    }

    // Update payment with proof - set to pending_verification for admin review
    // Credits are NOT granted here - admin must approve from the admin panel
    const updatedPayment = await db.payment.update({
      where: { id: paymentId },
      data: {
        utrNumber: utrNumber || null,
        screenshotUrl: screenshotUrl || null,
        status: 'pending_verification',
      }
    })

    // Create audit log for proof submission
    await db.auditLog.create({
      data: {
        actorId: userId,
        action: 'payment_proof_submitted',
        targetType: 'payment',
        targetId: paymentId,
        details: JSON.stringify({
          amount: payment.amount,
          utrNumber: utrNumber || null,
          hasScreenshot: !!screenshotUrl,
          method: 'upi_qr',
        }),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted! Admin will verify within 24 hours. You will be notified once verified.',
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        amount: updatedPayment.amount,
      }
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Failed to submit payment proof' }, { status: 500 })
  }
}
