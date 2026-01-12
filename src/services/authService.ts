const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'github';
}

export interface AuthResponse {
  valid: boolean;
  user?: User;
  error?: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.verifyToken();
    }
  }

  async initiateGoogleLogin(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/google`);
      const data = await response.json();
      
      if (data.auth_url) {
        // Redirect to Google OAuth
        window.location.href = data.auth_url;
      } else {
        throw new Error('Failed to get Google auth URL');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async initiateGithubLogin(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/github`);
      const data = await response.json();
      
      if (data.auth_url) {
        // Redirect to GitHub OAuth
        window.location.href = data.auth_url;
      } else {
        throw new Error('Failed to get GitHub auth URL');
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      throw error;
    }
  }

  async handleAuthSuccess(token: string): Promise<User> {
    try {
      // Store token
      this.token = token;
      localStorage.setItem('auth_token', token);

      // Verify token and get user data
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const authResponse: AuthResponse = await response.json();

      if (authResponse.valid && authResponse.user) {
        this.user = authResponse.user;
        return authResponse.user;
      } else {
        throw new Error(authResponse.error || 'Invalid token');
      }
    } catch (error) {
      console.error('Auth success handling error:', error);
      this.logout();
      throw error;
    }
  }

  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: this.token }),
      });

      const authResponse: AuthResponse = await response.json();

      if (authResponse.valid && authResponse.user) {
        this.user = authResponse.user;
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }
}

// Create singleton instance
export const authService = new AuthService();