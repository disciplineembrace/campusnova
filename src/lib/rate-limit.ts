// In-memory rate limiter for API routes
// Uses a sliding window approach with automatic cleanup

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Store: Map<key, RateLimitEntry>
const rateLimitStore = new Map<string, RateLimitEntry>()

// Rate limit configuration per route prefix
export const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  '/api/auth': { maxRequests: 10, windowMs: 60000 },        // 10 req/min
  '/api/listings': { maxRequests: 30, windowMs: 60000 },    // 30 req/min
  '/api/payment': { maxRequests: 5, windowMs: 60000 },      // 5 req/min for payment creation
  '/api/upload': { maxRequests: 20, windowMs: 60000 },      // 20 req/min
  default: { maxRequests: 60, windowMs: 60000 },            // 60 req/min default
}

// Get the rate limit config for a given path
export function getRateLimitConfig(pathname: string): { maxRequests: number; windowMs: number } {
  // Sort keys by length (longest first) to match most specific route
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

// Check if a request should be rate limited
// Returns { allowed: boolean, remaining: number, resetAt: number }
export function checkRateLimit(
  key: string,
  pathname: string
): { allowed: boolean; remaining: number; resetAt: number; limit: number } {
  const config = getRateLimitConfig(pathname)
  const now = Date.now()

  // Cleanup expired entries (lazy cleanup - runs on every check)
  for (const [k, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(k)
    }
  }

  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    // No entry or expired - create new window
    const resetAt = now + config.windowMs
    rateLimitStore.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
      limit: config.maxRequests,
    }
  }

  if (entry.count >= config.maxRequests) {
    // Rate limited
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      limit: config.maxRequests,
    }
  }

  // Increment counter
  entry.count += 1
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
    limit: config.maxRequests,
  }
}

// Get client identifier from request
// Uses IP address (via x-forwarded-for) as the primary key
export function getClientIdentifier(request: Request, pathname: string): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return `${ip}:${pathname}`
}
