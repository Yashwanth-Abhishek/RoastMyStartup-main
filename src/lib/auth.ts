/**
 * Authentication utilities
 * Centralized auth state detection and management
 */

/**
 * Check if user is authenticated
 * @returns true if user has a valid auth token
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    return false;
  }

  try {
    // Decode JWT to check expiration
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    
    // Check if token is expired
    if (exp && Date.now() >= exp * 1000) {
      // Token expired, clean up
      clearAuthData();
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format
    console.error("Invalid token format:", error);
    clearAuthData();
    return false;
  }
}

/**
 * Get current user info from stored token
 * @returns User info or null if not authenticated
 */
export function getCurrentUser(): { email: string; name: string } | null {
  if (!isAuthenticated()) {
    return null;
  }

  const email = localStorage.getItem("user_email");
  const name = localStorage.getItem("user_name");

  if (email && name) {
    return { email, name };
  }

  return null;
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_name");
}

/**
 * Get auth token
 * @returns JWT token or null
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}
