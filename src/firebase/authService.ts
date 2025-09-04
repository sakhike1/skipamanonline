import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './config';
import { User } from '../types';

class FirebaseAuthService {
  // Register new user
  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with display name
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      });

      // Get ID token for JWT
      const token = await firebaseUser.getIdToken();

      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', firebaseUser.refreshToken);

      // Create user object
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store user data
      localStorage.setItem('user_data', JSON.stringify(user));

      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get ID token for JWT
      const token = await firebaseUser.getIdToken();

      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', firebaseUser.refreshToken);

      // Create user object
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName: firebaseUser.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store user data
      localStorage.setItem('user_data', JSON.stringify(user));

      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear localStorage anyway
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const token = await currentUser.getIdToken(true);
      localStorage.setItem('auth_token', token);
      return token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get fresh token
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', firebaseUser.refreshToken);

        // Create user object
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem('user_data', JSON.stringify(user));
        callback(user);
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        callback(null);
      }
    });
  }

  // Get error message from Firebase error code
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService; 