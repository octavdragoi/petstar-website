/**
 * Rate limiting middleware for contact form
 * Prevents spam by limiting requests per IP address
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// For production with multiple instances, consider using Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export default (config) => {
  return async (ctx, next) => {
    // Configuration
    const maxRequests = config.max || 5; // Max requests per window
    const windowMs = config.windowMs || 15 * 60 * 1000; // 15 minutes

    // Get client IP
    const ip = ctx.request.ip ||
               ctx.request.headers['x-forwarded-for'] ||
               ctx.request.headers['x-real-ip'] ||
               'unknown';

    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry || now > entry.resetTime) {
      // First request or window expired - create new entry
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });

      // Set rate limit headers
      ctx.set('X-RateLimit-Limit', maxRequests.toString());
      ctx.set('X-RateLimit-Remaining', (maxRequests - 1).toString());
      ctx.set('X-RateLimit-Reset', new Date(now + windowMs).toISOString());

      return await next();
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      ctx.set('X-RateLimit-Limit', maxRequests.toString());
      ctx.set('X-RateLimit-Remaining', '0');
      ctx.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
      ctx.set('Retry-After', retryAfter.toString());

      strapi.log.warn(`Rate limit exceeded for IP: ${ip}`);

      return ctx.tooManyRequests('Too many requests. Please try again later.', {
        error: 'Rate limit exceeded',
        retryAfter: retryAfter,
      });
    }

    // Increment counter
    entry.count += 1;
    rateLimitStore.set(ip, entry);

    // Set rate limit headers
    ctx.set('X-RateLimit-Limit', maxRequests.toString());
    ctx.set('X-RateLimit-Remaining', (maxRequests - entry.count).toString());
    ctx.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    return await next();
  };
};
