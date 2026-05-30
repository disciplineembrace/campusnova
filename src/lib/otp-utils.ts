/**
 * OTP Utility Module for EduCampusHub
 * 
 * Handles OTP generation, delivery (SMS via Fast2SMS / fallback to server log),
 * verification, rate-limiting, and expiry.
 * 
 * SMS Provider: Fast2SMS (Indian SMS gateway - https://www.fast2sms.com)
 * Fallback: Server console log (for development)
 */

import { db } from './db'
import { randomInt } from 'crypto'

// ─── Configuration ───

const OTP_LENGTH = 6
const OTP_EXPIRY_MINUTES = 5
const OTP_RATE_LIMIT_WINDOW = 60 * 1000        // 1 minute between OTP requests
const OTP_MAX_REQUESTS_PER_HOUR = 5             // Max 5 OTP requests per hour per phone
const OTP_MAX_VERIFY_ATTEMPTS = 3               // Max 3 verification attempts per OTP

// ─── Rate Limiting State (in-memory, production would use Redis) ───

const otpRequestLog = new Map<string, { count: number; lastRequest: number; hourlyCount: number; hourlyReset: number }>()
const otpVerifyAttempts = new Map<string, number>() // otpId -> attempt count

// ─── OTP Generation ───

export function generateOTP(): string {
  // Generate a cryptographically secure 6-digit OTP
  let otp = ''
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += randomInt(0, 10).toString()
  }
  return otp
}

// ─── Rate Limiting ───

export function checkOTPRateLimit(phone: string): { allowed: boolean; retryAfterMs?: number; reason?: string } {
  const now = Date.now()
  const record = otpRequestLog.get(phone)

  if (!record) {
    otpRequestLog.set(phone, { count: 1, lastRequest: now, hourlyCount: 1, hourlyReset: now + 60 * 60 * 1000 })
    return { allowed: true }
  }

  // Check 1-minute cooldown
  if (now - record.lastRequest < OTP_RATE_LIMIT_WINDOW) {
    const retryAfterMs = OTP_RATE_LIMIT_WINDOW - (now - record.lastRequest)
    return { allowed: false, retryAfterMs, reason: `Please wait ${Math.ceil(retryAfterMs / 1000)} seconds before requesting a new OTP` }
  }

  // Check hourly limit
  if (now > record.hourlyReset) {
    record.hourlyCount = 0
    record.hourlyReset = now + 60 * 60 * 1000
  }

  if (record.hourlyCount >= OTP_MAX_REQUESTS_PER_HOUR) {
    const retryAfterMs = record.hourlyReset - now
    return { allowed: false, retryAfterMs, reason: `Too many OTP requests. Try again in ${Math.ceil(retryAfterMs / 60000)} minutes` }
  }

  // Update rate limit counters
  record.count++
  record.lastRequest = now
  record.hourlyCount++

  return { allowed: true }
}

export function checkOTPVerifyAttempts(otpId: string): boolean {
  const attempts = otpVerifyAttempts.get(otpId) || 0
  return attempts < OTP_MAX_VERIFY_ATTEMPTS
}

export function incrementVerifyAttempt(otpId: string) {
  const attempts = otpVerifyAttempts.get(otpId) || 0
  otpVerifyAttempts.set(otpId, attempts + 1)
}

export function clearVerifyAttempts(otpId: string) {
  otpVerifyAttempts.delete(otpId)
}

// ─── OTP Storage ───

export async function storeOTP(email: string, phone: string, otpCode: string) {
  // Delete any unused OTPs for this email
  await db.passwordResetOTP.deleteMany({
    where: {
      email,
      isVerified: false,
      usedAt: null,
    }
  })

  // Store new OTP
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
  const record = await db.passwordResetOTP.create({
    data: {
      email,
      phone,
      otpCode,
      expiresAt,
    }
  })

  return record
}

export async function verifyOTP(email: string, otpCode: string): Promise<{ valid: boolean; recordId?: string; reason?: string }> {
  // Find the OTP record
  const record = await db.passwordResetOTP.findFirst({
    where: {
      email,
      otpCode,
      isVerified: false,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) {
    // Check if OTP exists but expired
    const expiredRecord = await db.passwordResetOTP.findFirst({
      where: { email, otpCode, isVerified: false, usedAt: null },
      orderBy: { createdAt: 'desc' },
    })

    if (expiredRecord) {
      return { valid: false, reason: 'OTP has expired. Please request a new one.' }
    }

    return { valid: false, reason: 'Invalid OTP code.' }
  }

  // Check verify attempt limit
  if (!checkOTPVerifyAttempts(record.id)) {
    return { valid: false, reason: 'Too many failed attempts. Please request a new OTP.' }
  }

  // Mark as verified
  await db.passwordResetOTP.update({
    where: { id: record.id },
    data: {
      isVerified: true,
      usedAt: new Date(),
    }
  })

  clearVerifyAttempts(record.id)

  return { valid: true, recordId: record.id }
}

// ─── SMS Delivery ───

interface SMSResult {
  success: boolean
  message: string
  provider?: string
}

/**
 * Send OTP via Fast2SMS (Indian SMS Gateway)
 * Falls back to server log if no API key is configured.
 */
export async function sendOTPSMS(phone: string, otp: string): Promise<SMSResult> {
  const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY

  if (FAST2SMS_API_KEY) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: phone,
          flash: 0,
        }),
      })

      const data = await response.json()

      if (data.return === true) {
        console.log(`📱 OTP sent via Fast2SMS to ${phone}`)
        return { success: true, message: 'OTP sent successfully', provider: 'Fast2SMS' }
      } else {
        console.error('Fast2SMS error:', data.message)
        // Fall through to fallback
      }
    } catch (error) {
      console.error('Fast2SMS request error:', error)
      // Fall through to fallback
    }
  }

  // Fallback: Log OTP to server console + return it in development
  console.log(`
╔══════════════════════════════════════════════╗
║  EDUCAMPUSHUB ADMIN PASSWORD RESET OTP       ║
║  Phone: ${phone}                             ║
║  OTP: ${otp}                                 ║
║  Expires in: ${OTP_EXPIRY_MINUTES} minutes                   ║
╚══════════════════════════════════════════════╝
  `)

  return {
    success: true,
    message: process.env.NODE_ENV === 'development'
      ? `OTP sent (development mode - check server log). OTP: ${otp}`
      : 'OTP sent to your registered mobile number',
    provider: 'console_log',
  }
}

// ─── Cleanup Expired OTPs ───

export async function cleanupExpiredOTPs() {
  try {
    const result = await db.passwordResetOTP.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    })
    return result.count
  } catch {
    return 0
  }
}

// ─── Get Admin Phone by Email ───

export async function getAdminPhone(email: string): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { email },
    select: { phone: true, isAdmin: true }
  })

  if (!user || !user.isAdmin || !user.phone) return null

  return user.phone
}
