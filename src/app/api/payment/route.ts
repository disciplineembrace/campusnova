import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { checkApiRateLimit } from '@/lib/api-security'

const UPI_ID = process.env.UPI_ID || 'sagathiyapradip1137-3@oksbi'
const PAYMENT_AMOUNT = 10
const FREE_UPLOAD_LIMIT = 5
const PAYMENT_EXPIRY_MINUTES = 5

// GET: Check upload credit status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        freeUploadUsed: true,
        paidUploadCredits: true,
        totalBooksUploaded: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const freeRemaining = Math.max(0, FREE_UPLOAD_LIMIT - user.freeUploadUsed)
    const totalCredits = freeRemaining + user.paidUploadCredits
    const canUpload = totalCredits > 0

    return NextResponse.json({
      freeUploadUsed: user.freeUploadUsed,
      freeUploadLimit: FREE_UPLOAD_LIMIT,
      freeRemaining,
      paidUploadCredits: user.paidUploadCredits,
      totalBooksUploaded: user.totalBooksUploaded,
      totalCredits,
      canUpload,
      pricePerUpload: PAYMENT_AMOUNT,
    })
  } catch (error) {
    console.error('Upload status error:', error)
    return NextResponse.json({ error: 'Failed to fetch upload status' }, { status: 500 })
  }
}

// POST: Create a payment session
export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimit = checkApiRateLimit(request)
    if (rateLimit && !rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many payment requests. Please try again later.' }, { status: 429 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has a pending payment
    const existingPending = await db.payment.findFirst({
      where: {
        userId,
        status: 'pending',
        expiresAt: { gt: new Date() },
      }
    })

    if (existingPending) {
      // Return existing payment session
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=CampusNova&am=${PAYMENT_AMOUNT}&cu=INR&tn=CampusNova+Upload+Credit`
      const qrDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 256,
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      })

      return NextResponse.json({
        paymentId: existingPending.id,
        amount: existingPending.amount,
        upiId: UPI_ID,
        upiUrl,
        qrCode: qrDataUrl,
        expiresAt: existingPending.expiresAt,
        createdAt: existingPending.createdAt,
        status: existingPending.status,
      })
    }

    // Create new payment session
    const expiresAt = new Date(Date.now() + PAYMENT_EXPIRY_MINUTES * 60 * 1000)

    const payment = await db.payment.create({
      data: {
        userId,
        amount: PAYMENT_AMOUNT,
        paymentMethod: 'upi_qr',
        upiId: UPI_ID,
        status: 'pending',
        uploadCredit: 1,
        expiresAt,
      }
    })

    // Generate QR code
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=CampusNova&am=${PAYMENT_AMOUNT}&cu=INR&tn=CampusNova+Upload+Credit`
    const qrDataUrl = await QRCode.toDataURL(upiUrl, {
      width: 256,
      margin: 2,
      color: { dark: '#0F172A', light: '#FFFFFF' },
    })

    return NextResponse.json({
      paymentId: payment.id,
      amount: payment.amount,
      upiId: UPI_ID,
      upiUrl,
      qrCode: qrDataUrl,
      expiresAt: payment.expiresAt,
      createdAt: payment.createdAt,
      status: payment.status,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 })
  }
}
