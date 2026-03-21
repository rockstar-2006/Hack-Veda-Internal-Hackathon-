/**
 * Admin Session Validator
 * Checks if admin session is still valid and not expired
 */

export function isAdminSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  
  const sessionStatus = localStorage.getItem('adminSession');
  const sessionTime = localStorage.getItem('adminSessionTime');
  
  if (sessionStatus !== 'active' || !sessionTime) return false;
  
  const sessionAgeMs = Date.now() - parseInt(sessionTime);
  const ADMIN_SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
  
  if (sessionAgeMs > ADMIN_SESSION_TIMEOUT) {
    // Session expired, clear it
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminSessionTime');
    return false;
  }
  
  return true;
}

/**
 * Get admin session time remaining in milliseconds
 */
export function getAdminSessionTimeRemaining(): number {
  if (typeof window === 'undefined') return 0;
  
  const sessionTime = localStorage.getItem('adminSessionTime');
  if (!sessionTime) return 0;
  
  const sessionAgeMs = Date.now() - parseInt(sessionTime);
  const ADMIN_SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
  
  return Math.max(0, ADMIN_SESSION_TIMEOUT - sessionAgeMs);
}

/**
 * Refresh admin session expiry time (extend by 8 hours)
 */
export function refreshAdminSession(): void {
  if (typeof window === 'undefined') return;
  
  if (localStorage.getItem('adminSession') === 'active') {
    localStorage.setItem('adminSessionTime', Date.now().toString());
  }
}
