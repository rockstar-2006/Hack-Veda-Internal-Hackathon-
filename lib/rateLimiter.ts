/**
 * Simple in-memory rate limiter for admin login attempts
 * Prevents brute force attacks
 */

interface RateLimitEntry {
  attempts: number;
  firstAttemptTime: number;
}

// Track login attempts: key = IP address
const loginAttempts = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const WINDOW = 15 * 60 * 1000; // 15 minute window
  
  loginAttempts.forEach((entry, ip) => {
    if (now - entry.firstAttemptTime > WINDOW) {
      loginAttempts.delete(ip);
    }
  });
}, 10 * 60 * 1000);

/**
 * Check if IP has exceeded rate limit
 * Max 5 attempts per 15 minutes
 */
export function checkRateLimit(ipAddress: string): boolean {
  const MAX_ATTEMPTS = 5;
  const WINDOW = 15 * 60 * 1000; // 15 minutes
  const now = Date.now();

  const entry = loginAttempts.get(ipAddress);

  if (!entry) {
    // First attempt from this IP
    loginAttempts.set(ipAddress, {
      attempts: 1,
      firstAttemptTime: now,
    });
    return true;
  }

  // Check if we're still within the window
  if (now - entry.firstAttemptTime > WINDOW) {
    // Window expired, reset
    loginAttempts.set(ipAddress, {
      attempts: 1,
      firstAttemptTime: now,
    });
    return true;
  }

  // We're within the window
  if (entry.attempts >= MAX_ATTEMPTS) {
    // Rate limit exceeded
    return false;
  }

  // Increment attempt
  entry.attempts++;
  return true;
}

/**
 * Get remaining attempts for IP
 */
export function getRemainingAttempts(ipAddress: string): number {
  const MAX_ATTEMPTS = 5;
  const entry = loginAttempts.get(ipAddress);

  if (!entry) {
    return MAX_ATTEMPTS;
  }

  return Math.max(0, MAX_ATTEMPTS - entry.attempts);
}

/**
 * Extract IP from request
 */
export function getClientIP(request: Request): string {
  // Check various headers for IP (works with proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback - use a generic identifier for development
  return 'unknown-client';
}
