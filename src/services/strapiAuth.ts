// Strapi Authentication Service
// This service handles authentication using Strapi's built-in auth system

import axios, { AxiosInstance } from 'axios';
import { User, LoginCredentials, RegisterCredentials } from '../types';

// Strapi Auth Response Types
interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  role?: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
}

interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

interface StrapiError {
  error: {
    status: number;
    message: string;
    name: string;
    details?: any;
  };
}

class StrapiAuthService {
  private baseURL: string;
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Note: Vite uses import.meta.env, not process.env
    this.baseURL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    
    // Initialize axios instance for auth endpoints (no token required for login/register)
    this.api = axios.create({
      baseURL: `${this.baseURL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token') || null;
    if (this.token) {
      this.setAuthToken(this.token);
    }
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string | null): void {
    this.token = token;
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('auth_token', token);
    } else {
      delete this.api.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Transform Strapi user to application User type
   */
  private transformUser(strapiUser: StrapiUser): User {
    // Handle firstName/lastName - they may not exist in Strapi User model
    // Try to get from Strapi user object (if added to User model), otherwise derive from username
    let firstName = '';
    let lastName = '';
    
    if ((strapiUser as any).firstName) {
      firstName = (strapiUser as any).firstName;
    }
    if ((strapiUser as any).lastName) {
      lastName = (strapiUser as any).lastName;
    }
    
    // If firstName/lastName not in Strapi, try to derive from username (email in our case)
    if (!firstName && !lastName) {
      // Since we use email as username, we'll use the email prefix as firstName
      const emailPrefix = strapiUser.email.split('@')[0];
      firstName = emailPrefix;
      lastName = '';
    }

    return {
      id: strapiUser.id.toString(),
      email: strapiUser.email,
      firstName: firstName,
      lastName: lastName,
      role: this.mapStrapiRole(strapiUser.role?.name || 'Authenticated'),
      createdAt: strapiUser.createdAt,
      updatedAt: strapiUser.updatedAt,
    };
  }

  /**
   * Map Strapi role to application role
   */
  private mapStrapiRole(strapiRole: string): 'buyer' | 'admin' {
    // Map Strapi roles to your app roles
    const roleMap: Record<string, 'buyer' | 'admin'> = {
      'Authenticated': 'buyer',
      'Public': 'buyer',
      'Admin': 'admin',
      'Editor': 'admin',
    };
    return roleMap[strapiRole] || 'buyer';
  }

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    try {
      // Strapi requires username, email, and password
      // firstName and lastName are optional - only send if Strapi User model has these fields
      // By default, Strapi User model only has: username, email, password
      const registrationData: any = {
        username: credentials.email, // Strapi requires username
        email: credentials.email,
        password: credentials.password,
      };

      // Note: firstName and lastName are NOT included by default in Strapi User model
      // If you want to use these fields, you must add them to Strapi User content type first
      // See STRAPI_USER_FIELDS_SETUP.md for instructions
      // For now, registration will work with just username, email, and password
      // The firstName/lastName can be added to the user profile after registration if needed

      const response = await this.api.post<StrapiAuthResponse>('/auth/local/register', registrationData);

      const { jwt, user } = response.data;
      this.setAuthToken(jwt);

      return {
        user: this.transformUser(user),
        token: jwt,
      };
    } catch (error: any) {
      // Enhanced error handling for network issues
      if (!error.response) {
        // Network error - no response from server
        const errorMessage = `Network Error: Cannot connect to Strapi at ${this.baseURL}. Please check:
1. Strapi server is running (visit ${this.baseURL} in browser)
2. CORS is configured in Strapi to allow your React app origin
3. REACT_APP_STRAPI_URL is correct in your .env file`;
        console.error('Strapi Registration Network Error:', errorMessage);
        console.error('Full error:', error);
        throw new Error(errorMessage);
      }

      const strapiError = error.response?.data as StrapiError;
      let errorMessage = strapiError?.error?.message || error.message || 'Registration failed';
      
      // Handle HTTP status codes
      if (error.response?.status === 400) {
        errorMessage = strapiError?.error?.message || 'Invalid registration data';
      } else if (error.response?.status === 403) {
        errorMessage = 'User registration is disabled. Please contact administrator.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      // Handle specific Strapi errors
      if (strapiError?.error?.details?.errors) {
        const details = strapiError.error.details.errors;
        const firstError = details[0];
        errorMessage = firstError?.message || errorMessage;
      }
      
      console.error('Strapi Registration Error:', {
        status: error.response?.status,
        message: errorMessage,
        details: strapiError,
      });
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // Strapi local auth endpoint accepts identifier (email/username) and password
      const response = await this.api.post<StrapiAuthResponse>('/auth/local', {
        identifier: credentials.email,
        password: credentials.password,
      });

      const { jwt, user } = response.data;
      this.setAuthToken(jwt);

      return {
        user: this.transformUser(user),
        token: jwt,
      };
    } catch (error: any) {
      // Enhanced error handling for network issues
      if (!error.response) {
        // Network error - no response from server
        const errorMessage = `Network Error: Cannot connect to Strapi at ${this.baseURL}. Please check:
1. Strapi server is running (visit ${this.baseURL} in browser)
2. CORS is configured in Strapi to allow your React app origin
3. REACT_APP_STRAPI_URL is correct in your .env file`;
        console.error('Strapi Login Network Error:', errorMessage);
        console.error('Full error:', error);
        throw new Error(errorMessage);
      }

      const strapiError = error.response?.data as StrapiError;
      let errorMessage = strapiError?.error?.message || error.message || 'Login failed';
      
      // Map common Strapi errors to user-friendly messages
      if (errorMessage.includes('Invalid identifier') || error.response?.status === 400) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 403) {
        errorMessage = 'Account is blocked or not activated';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      console.error('Strapi Login Error:', {
        status: error.response?.status,
        message: errorMessage,
        details: strapiError,
      });
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await this.api.get<StrapiUser>('/users/me');
      return this.transformUser(response.data);
    } catch (error: any) {
      // Token might be invalid, clear it
      this.setAuthToken(null);
      throw new Error('Authentication failed. Please login again.');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token found');
    }

    try {
      const updateData: any = {};
      
      if (data.firstName) updateData.firstName = data.firstName;
      if (data.lastName) updateData.lastName = data.lastName;
      if (data.email) updateData.email = data.email;

      const response = await this.api.put<StrapiUser>(`/users/${userId}`, updateData);
      return this.transformUser(response.data);
    } catch (error: any) {
      const strapiError = error.response?.data as StrapiError;
      const errorMessage = strapiError?.error?.message || error.message || 'Profile update failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.token) {
      throw new Error('No authentication token found');
    }

    try {
      // Get current user first
      const user = await this.getCurrentUser();
      
      // Verify current password by attempting to login
      try {
        const loginApi = axios.create({
          baseURL: `${this.baseURL}/api`,
          headers: { 'Content-Type': 'application/json' },
        });
        
        await loginApi.post('/auth/local', {
          identifier: user.email,
          password: currentPassword,
        });
      } catch (error) {
        throw new Error('Current password is incorrect');
      }

      // Update password (Strapi requires the full user object for password updates)
      // Note: Strapi v4 password updates typically require admin permissions or a custom endpoint
      // You may need to create a custom Strapi endpoint for password changes
      await this.api.put(`/users/${user.id}`, {
        password: newPassword,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Password change failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await this.api.post('/auth/forgot-password', {
        email,
      });
    } catch (error: any) {
      // Don't reveal if email exists or not for security
      // Still return success to prevent email enumeration
      console.log('Password reset requested for:', email);
    }
  }

  /**
   * Reset password with code
   */
  async resetPassword(code: string, password: string, passwordConfirmation: string): Promise<void> {
    try {
      if (password !== passwordConfirmation) {
        throw new Error('Passwords do not match');
      }

      await this.api.post('/auth/reset-password', {
        code,
        password,
        passwordConfirmation,
      });
    } catch (error: any) {
      const strapiError = error.response?.data as StrapiError;
      const errorMessage = strapiError?.error?.message || error.message || 'Password reset failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Logout (just clears local token)
   */
  async logout(): Promise<void> {
    this.setAuthToken(null);
    // Strapi doesn't require a logout endpoint, JWT tokens are stateless
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create and export a singleton instance
export const strapiAuth = new StrapiAuthService();
export default strapiAuth;

