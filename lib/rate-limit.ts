import { kv } from '@vercel/kv'

export type RateLimitConfig = {
  /**
   * Maximum number of requests allowed in the time window
   */
  limit: number
  /**
   * Time window in seconds
   */
  window: number
}

/**
 * Rate limiting configurations for different endpoint types
 */
export const RATE_LIMITS = {
  // AI endpoints - most expensive, strictest limits
  AI_GENERATION: { limit: 10, window: 60 }, // 10 requests per minute
  AI_ANALYSIS: { limit: 5, window: 60 }, // 5 requests per minute

  // Email endpoints - prevent spam
  SEND_EMAIL: { limit: 20, window: 60 }, // 20 emails per minute
  SEND_INVITATION: { limit: 50, window: 3600 }, // 50 invitations per hour

  // Standard API endpoints
  API_STANDARD: { limit: 100, window: 60 }, // 100 requests per minute

  // Auth endpoints - prevent brute force
  AUTH_LOGIN: { limit: 5, window: 300 }, // 5 attempts per 5 minutes
  AUTH_SIGNUP: { limit: 3, window: 3600 }, // 3 signups per hour per IP
} as const

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the rate limit (e.g., user ID, IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and metadata
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // If KV is not available (development), allow all requests
  if (!process.env.KV_REST_API_URL) {
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: Date.now() + config.window * 1000,
    }
  }

  const key = `rate_limit:${identifier}`
  const now = Date.now()
  const windowStart = now - config.window * 1000

  try {
    // Get current count for this window
    const requests = await kv.zrangebyscore(key, windowStart, now)
    const currentCount = requests.length

    if (currentCount >= config.limit) {
      // Rate limit exceeded
      const oldestRequest = requests[0] as number
      const resetTime = oldestRequest + config.window * 1000

      return {
        success: false,
        limit: config.limit,
        remaining: 0,
        reset: resetTime,
      }
    }

    // Add current request to the sorted set
    await kv.zadd(key, { score: now, member: `${now}-${Math.random()}` })

    // Clean up old entries and set expiration
    await kv.zremrangebyscore(key, 0, windowStart)
    await kv.expire(key, config.window)

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - currentCount - 1,
      reset: now + config.window * 1000,
    }
  } catch (error) {
    // If rate limiting fails, allow the request (fail open)
    console.error('Rate limiting error:', error)
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: now + config.window * 1000,
    }
  }
}

/**
 * Get rate limit identifier from request
 * Prefers user ID, falls back to IP address
 */
export function getRateLimitIdentifier(
  userId: string | null | undefined,
  ip: string | null | undefined,
  endpoint: string
): string {
  if (userId) {
    return `user:${userId}:${endpoint}`
  }
  if (ip) {
    return `ip:${ip}:${endpoint}`
  }
  // Fallback to a generic identifier (not ideal, but prevents crashes)
  return `anonymous:${endpoint}`
}

/**
 * Helper to get client IP from Next.js request
 */
export function getClientIp(request: Request): string | null {
  // Try various headers that might contain the real IP
  const headers = request.headers

  return (
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('cf-connecting-ip') || // Cloudflare
    null
  )
}
