import { LoginCredentials, RegisterCredentials, AuthResponse, User, JWTPayload } from '../types';

// Real API base URL - update this to match your backend
const API_BASE_URL = 'http://localhost:3001/api';

// Fallback to mock data if API is not available
const USE_MOCK_FALLBACK = false; // Set to false when backend is working

class AuthService {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'user_data';
  private usersKey = 'registered_users';

  // Token Management
  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  removeTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  // User Management
  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  // Mock data management (fallback)
  private getRegisteredUsers(): User[] {
    const usersData = localStorage.getItem(this.usersKey);
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@demo.com',
        firstName: 'Admin',
        lastName: 'User',
        password: 'admin123', // In real app, this would be hashed
        role: 'admin',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      }
    ];
    
    const users = usersData ? JSON.parse(usersData) : defaultUsers;
    console.log('authService: Current registered users:', users.map((u: User) => u.email));
    return users;
  }

  private setRegisteredUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private findUserByEmail(email: string): User | null {
    const users = this.getRegisteredUsers();
    const foundUser = users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    console.log('authService: findUserByEmail for', email, 'result:', foundUser ? 'Found' : 'Not found');
    return foundUser;
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateToken(): string {
    // For mock mode, we'll use a simple token that the backend can recognize
    // This is not secure for production, but works for development
    const payload = {
      userId: '1', // Use a valid user ID that exists in the backend
      email: 'admin@demo.com',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };
    
    // Create a simple token that the backend can decode
    const tokenData = btoa(JSON.stringify(payload));
    console.log('Generated mock token payload:', payload);
    console.log('Generated mock token:', `mock.${tokenData}.token`);
    return `mock.${tokenData}.token`;
  }

  // JWT Token Validation
  isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  decodeToken(token: string): JWTPayload {
    try {
      // In a real app, you'd use jwt-decode library
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // API Headers
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Check if API is available
  private async isApiAvailable(): Promise<boolean> {
    if (USE_MOCK_FALLBACK) return false;
    
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Real API calls with fallback
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Check if API is available
    if (await this.isApiAvailable()) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Store tokens and user data
        this.setTokens(data.token, data.refreshToken);
        this.setUser(data.user);

        return {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
        };
      } catch (error) {
        throw error;
      }
    } else {
      // Fallback to mock implementation
      console.log('Using mock registration (API not available)');
      
      // Check if user already exists
      const existingUser = this.findUserByEmail(credentials.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Validate password strength
      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create new user
      const newUser: User = {
        id: this.generateUserId(),
        email: credentials.email.toLowerCase(),
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store user in registered users list
      const users = this.getRegisteredUsers();
      users.push({
        ...newUser,
        password: credentials.password, // In real app, this would be hashed
      });
      this.setRegisteredUsers(users);

      // Generate tokens
      const token = this.generateToken();
      const refreshToken = 'mock_refresh_token_' + Date.now();

      const response: AuthResponse = {
        user: newUser,
        token,
        refreshToken,
      };

      // Store tokens and user data
      this.setTokens(response.token, response.refreshToken);
      this.setUser(response.user);

      return response;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check if API is available
    if (await this.isApiAvailable()) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store tokens and user data
        this.setTokens(data.token, data.refreshToken);
        this.setUser(data.user);

        return {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
        };
      } catch (error) {
        throw error;
      }
    } else {
      // Fallback to mock implementation
      console.log('Using mock login (API not available)');
      
      // Find user by email
      const user = this.findUserByEmail(credentials.email);
      console.log('authService: Looking for user with email:', credentials.email);
      console.log('authService: Found user:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('authService: User not found, throwing error'); // Debug log
        const error = new Error('User not found. Please sign up first.');
        console.log('authService: Throwing error:', error.message);
        throw error;
      }

      // Check password (in real app, this would be hashed comparison)
      console.log('authService: Checking password for user:', user.email);
      console.log('authService: Provided password:', credentials.password);
      console.log('authService: Stored password:', user.password);
      
      if (user.password !== credentials.password) {
        console.log('authService: Password mismatch, throwing error');
        throw new Error('Invalid email or password');
      }
      
      console.log('authService: Password match successful');

      // Generate tokens
      const token = this.generateToken();
      const refreshToken = 'mock_refresh_token_' + Date.now();

      // Remove password from user object before returning
      const { password, ...userWithoutPassword } = user;

      const response: AuthResponse = {
        user: userWithoutPassword,
        token,
        refreshToken,
      };

      // Store tokens and user data
      this.setTokens(response.token, response.refreshToken);
      this.setUser(response.user);

      return response;
    }
  }

  async logout(): Promise<void> {
    // Check if API is available
    if (await this.isApiAvailable()) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
          console.warn('Logout API call failed, but continuing with local logout');
        }
      } catch (error) {
        console.warn('Logout API call failed, but continuing with local logout:', error);
      }
    }
    
    // Clear local storage regardless of API response
    this.removeTokens();
    this.removeUser();
  }

  async refreshToken(): Promise<string | null> {
    // Check if API is available
    if (await this.isApiAvailable()) {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Token refresh failed');
        }

        // Update tokens
        this.setTokens(data.token, data.refreshToken);
        this.setUser(data.user);

        return data.token;
      } catch (error) {
        // If refresh fails, clear tokens and require re-login
        this.removeTokens();
        this.removeUser();
        throw error;
      }
    } else {
      // Fallback to mock implementation
      const newToken = this.generateToken();
      const newRefreshToken = 'mock_refresh_token_' + Date.now();
      
      this.setTokens(newToken, newRefreshToken);
      
      return newToken;
    }
  }

  // Get current user from API
  async getCurrentUserFromAPI(): Promise<User | null> {
    if (await this.isApiAvailable()) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return data.user;
      } catch (error) {
        console.error('Failed to get current user from API:', error);
        return null;
      }
    }
    return this.getCurrentUser();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? this.isTokenValid(token) : false;
  }

  // Get current user
  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    return this.getUser();
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    if (await this.isApiAvailable()) {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        return data.users;
      } catch (error) {
        throw error;
      }
    } else {
      // Fallback to mock implementation
      const users = this.getRegisteredUsers();
      return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
    }
  }

  // Get user statistics (admin only)
  async getUserStats(): Promise<any> {
    if (await this.isApiAvailable()) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/stats/overview`, {
          headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user statistics');
        }

        const data = await response.json();
        return data.stats;
      } catch (error) {
        throw error;
      }
    } else {
      // Fallback to mock implementation
      const users = this.getRegisteredUsers();
      return {
        total: users.length,
        admins: users.filter(user => user.role === 'admin').length,
        regularUsers: users.filter(user => user.role === 'user').length,
        recentUsers: users.filter(user => {
          const userDate = new Date(user.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return userDate > weekAgo;
        }).length
      };
    }
  }
}

export const authService = new AuthService();
export default authService; 