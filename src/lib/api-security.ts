// In-memory rate limiter for API routes
// Uses a sliding window approach with automatic cleanup

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Rate limit configuration per route prefix
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  '/api/auth': { maxRequests: 10, windowMs: 60000 },
  '/api/listings': { maxRequests: 30, windowMs: 60000 },
  '/api/payment': { maxRequests: 5, windowMs: 60000 },
  '/api/upload': { maxRequests: 20, windowMs: 60000 },
  '/api/reports': { maxRequests: 10, windowMs: 60000 },
  '/api/wishlist': { maxRequests: 30, windowMs: 60000 },
  default: { maxRequests: 60, windowMs: 60000 },
}

function getRateLimitConfig(pathname: string): { maxRequests: number; windowMs: number } {
  const sortedKeys = Object.keys(RATE_LIMITS)
    .filter(k => k !== 'default')
    .sort((a, b) => b.length - a.length)

  for (const key of sortedKeys) {
    if (pathname.startsWith(key)) {
      return RATE_LIMITS[key]
    }
  }

  return RATE_LIMITS.default
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

// Check rate limit for a request - call this at the start of API route handlers
export function checkApiRateLimit(request: Request): { allowed: boolean; remaining: number; limit: number } | null {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname
    const clientIP = getClientIP(request)
    const key = `${clientIP}:${pathname}`

    const config = getRateLimitConfig(pathname)
    const now = Date.now()

    // Lazy cleanup of expired entries
    for (const [k, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(k)
      }
    }

    const entry = rateLimitStore.get(key)

    if (!entry || now > entry.resetAt) {
      const resetAt = now + config.windowMs
      rateLimitStore.set(key, { count: 1, resetAt })
      return { allowed: true, remaining: config.maxRequests - 1, limit: config.maxRequests }
    }

    if (entry.count >= config.maxRequests) {
      return { allowed: false, remaining: 0, limit: config.maxRequests }
    }

    entry.count += 1
    return { allowed: true, remaining: config.maxRequests - entry.count, limit: config.maxRequests }
  } catch {
    // If rate limiting fails, allow the request through
    return null
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validate Indian mobile number
export function isValidIndianMobile(number: string): boolean {
  return /^[6-9]\d{9}$/.test(number.replace(/\s/g, ''))
}

// Sanitize string input - prevent XSS
export function sanitizeString(input: string, maxLength: number = 2000): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, maxLength)
    .trim()
}

// Validate UTR number format (6-12 digits)
export function isValidUTR(utr: string): boolean {
  return /^\d{6,12}$/.test(utr)
}

// Validate price
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price > 0 && price <= 100000 && isFinite(price)
}
