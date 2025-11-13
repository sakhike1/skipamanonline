import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import { authAPI } from '../services/api';
import strapiAuth from '../services/strapiAuth';
import socketService from '../services/socket';

// Determine which auth service to use based on environment variable
// Note: Vite uses import.meta.env, not process.env
const USE_STRAPI_AUTH = import.meta.env.VITE_USE_STRAPI_AUTH === 'true';

// Auth State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Action Types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'AUTH_INIT_COMPLETE' };

// Initial State - Check localStorage first for faster initial load
const getInitialState = (): AuthState => {
  const userData = localStorage.getItem('user_data');
  const authToken = localStorage.getItem('auth_token');
  
  if (userData && authToken) {
    try {
      const user = JSON.parse(userData);
      return {
        user,
        isAuthenticated: true,
        isLoading: false, // Start with false since we have cached data
        error: null,
      };
    } catch (error) {
      // If parsing fails, clear localStorage and start fresh
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }
  
  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_INIT_COMPLETE':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User | undefined>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create Context with HMR stability
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add display name for debugging
AuthContext.displayName = 'AuthContext';

// Global context reference for HMR stability
let globalAuthContext: React.Context<AuthContextType | undefined> | null = null;

// Get or create context instance
const getAuthContext = (): React.Context<AuthContextType | undefined> => {
  if (!globalAuthContext) {
    globalAuthContext = createContext<AuthContextType | undefined>(undefined);
    globalAuthContext.displayName = 'AuthContext';
  }
  return globalAuthContext;
};

// Reset context (useful for testing or HMR issues)
export const resetAuthContext = (): void => {
  globalAuthContext = null;
};

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          try {
            let freshUser: User;

            if (USE_STRAPI_AUTH) {
              // Verify token with Strapi
              strapiAuth.setAuthToken(token);
              freshUser = await strapiAuth.getCurrentUser();
            } else {
              // Verify token with custom backend
              const response = await authAPI.getCurrentUser();
              if (response.success && response.data) {
                freshUser = response.data.user;
              } else {
                throw new Error('Invalid token');
              }
            }

            localStorage.setItem('user_data', JSON.stringify(freshUser));
            
            // Connect to Socket.IO (only if not using Strapi)
            if (!USE_STRAPI_AUTH) {
              socketService.connect(token);
            }
            
            dispatch({ type: 'AUTH_SUCCESS', payload: freshUser });
          } catch (error) {
            // Token is invalid, clear auth
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          dispatch({ type: 'AUTH_INIT_COMPLETE' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_INIT_COMPLETE' });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      let user: User;
      let token: string;

      if (USE_STRAPI_AUTH) {
        // Use Strapi authentication
        console.log('Attempting Strapi login for:', credentials.email);
        const result = await strapiAuth.login(credentials);
        user = result.user;
        token = result.token;
        console.log('Strapi login successful:', user.role);
      } else {
        // Use custom backend authentication
        console.log('Attempting backend login for:', credentials.email);
        const response = await authAPI.login(credentials);
        
        if (response.success && response.data) {
          user = response.data.user;
          token = response.data.token;
          console.log('Backend login successful:', user.role);
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      // Connect to Socket.IO (only if not using Strapi or if you have Socket.IO in Strapi)
      if (!USE_STRAPI_AUTH) {
        socketService.connect(token);
      }
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return user; // Return user data for redirect logic
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.log('AuthContext: Login failed:', errorMessage);
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: errorMessage
      });
      // Re-throw the error so the LoginForm can catch it and prevent navigation
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      let user: User;
      let token: string;

      if (USE_STRAPI_AUTH) {
        // Use Strapi registration
        console.log('Attempting Strapi registration for:', credentials.email);
        const result = await strapiAuth.register(credentials);
        user = result.user;
        token = result.token;
        console.log('Strapi registration successful:', user.role);
      } else {
        // Use custom backend registration
        console.log('Attempting backend registration for:', credentials.email);
        const response = await authAPI.register(credentials);
        
        if (response.success && response.data) {
          user = response.data.user;
          token = response.data.token;
          console.log('Backend registration successful:', user.role);
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      }
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      // Connect to Socket.IO (only if not using Strapi)
      if (!USE_STRAPI_AUTH) {
        socketService.connect(token);
      }
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return;
    } catch (error: any) {
      // The error message is already enhanced in strapiAuth.register()
      const errorMessage = error.message || 'Registration failed';
      console.error('AuthContext: Registration failed:', errorMessage);
      console.error('Full error details:', error);
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: errorMessage
      });
      throw error; // Re-throw the original error with enhanced message
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (USE_STRAPI_AUTH) {
        // Strapi logout (just clears token locally)
        await strapiAuth.logout();
      } else {
        // Custom backend logout
        await authAPI.logout();
      }
    } catch (error) {
      console.log('Logout API call failed:', error);
    } finally {
      // Always clear local state and disconnect socket
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('refresh_token');
      if (!USE_STRAPI_AUTH) {
        socketService.disconnect();
      }
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value: AuthContextType = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    clearError,
  }), [state, login, register, logout, clearError]);

  // Use the stable context
  const StableAuthContext = getAuthContext();

  return (
    <StableAuthContext.Provider value={value}>
      {children}
    </StableAuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const StableAuthContext = getAuthContext();
  const context = useContext(StableAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 