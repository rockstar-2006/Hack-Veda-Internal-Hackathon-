/**
 * Admin Request Authentication Validator
 * Validates that requests to admin endpoints come from authenticated admin sessions
 */

export interface AdminAuthRequest extends Request {
  headers: Headers;
}

/**
 * Validate admin session from request headers
 * Returns admin email if valid, throws error if not
 */
export function validateAdminSession(request: AdminAuthRequest): string {
  const authHeader = request.headers.get('x-admin-session');
  const emailHeader = request.headers.get('x-admin-email');
  const timeHeader = request.headers.get('x-admin-session-time');

  if (!authHeader || !emailHeader || !timeHeader) {
    throw new Error('Missing authentication headers. Admin session required.');
  }

  if (authHeader !== 'active') {
    throw new Error('Invalid admin session.');
  }

  // Validate session hasn't expired (8 hours)
  const sessionTime = parseInt(timeHeader);
  const now = Date.now();
  const ADMIN_SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

  if (now - sessionTime > ADMIN_SESSION_TIMEOUT) {
    throw new Error('Admin session expired. Please login again.');
  }

  return emailHeader;
}

/**
 * Create admin auth headers for client-side requests
 * Call this from admin pages to include auth headers
 */
export function getAdminAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};

  const session = localStorage.getItem('adminSession');
  const email = localStorage.getItem('adminEmail');
  const time = localStorage.getItem('adminSessionTime');

  if (!session || !email || !time) {
    return {};
  }

  return {
    'x-admin-session': session,
    'x-admin-email': email,
    'x-admin-session-time': time,
  };
}
