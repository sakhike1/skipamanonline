import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { UserProfile, Address, UserPreferences } from '../types';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

type ProfileAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: { id: string; address: Address } }
  | { type: 'REMOVE_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'CLEAR_ERROR' };

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_PROFILE':
      return { 
        ...state, 
        profile: state.profile ? { ...state.profile, ...action.payload } : null 
      };
    case 'ADD_ADDRESS':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          addresses: [...state.profile.addresses, action.payload]
        } : null
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          addresses: state.profile.addresses.map(addr =>
            addr.id === action.payload.id ? action.payload.address : addr
          )
        } : null
      };
    case 'REMOVE_ADDRESS':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          addresses: state.profile.addresses.filter(addr => addr.id !== action.payload)
        } : null
      };
    case 'SET_DEFAULT_ADDRESS':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          addresses: state.profile.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === action.payload
          }))
        } : null
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          preferences: { ...state.profile.preferences, ...action.payload }
        } : null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface ProfileContextType extends ProfileState {
  // Profile Management
  getProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  // Address Management
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Address) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  
  // Preferences Management
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  
  // Utility Functions
  getDefaultAddress: () => Address | null;
  validateAddress: (address: Address) => { isValid: boolean; errors: string[] };
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // API Base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Get user profile
  const getProfile = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profile: UserProfile = await response.json();
      dispatch({ type: 'SET_PROFILE', payload: profile });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile: UserProfile = await response.json();
      dispatch({ type: 'SET_PROFILE', payload: updatedProfile });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Add new address
  const addAddress = async (address: Omit<Address, 'id'>): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/profile/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error('Failed to add address');
      }

      const newAddress: Address = await response.json();
      // Refresh profile to get updated addresses
      await getProfile();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add address';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Update address
  const updateAddress = async (id: string, address: Address): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/profile/addresses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      const updatedAddress: Address = await response.json();
      // Refresh profile to get updated addresses
      await getProfile();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update address';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Remove address
  const removeAddress = async (id: string): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/profile/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove address');
      }

      // Refresh profile to get updated addresses
      await getProfile();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove address';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Set default address
  const setDefaultAddress = async (id: string): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/profile/addresses/${id}/default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      // Refresh profile to get updated addresses
      await getProfile();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set default address';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Update preferences
  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/profile/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedPreferences: UserPreferences = await response.json();
      dispatch({ type: 'UPDATE_PREFERENCES', payload: updatedPreferences });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Utility functions
  const getDefaultAddress = (): Address | null => {
    if (!state.profile) return null;
    return state.profile.addresses.find(addr => addr.isDefault) || null;
  };

  const validateAddress = (address: Address): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!address.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!address.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!address.address1?.trim()) {
      errors.push('Address line 1 is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.state?.trim()) {
      errors.push('State/Province is required');
    }

    if (!address.postalCode?.trim()) {
      errors.push('Postal code is required');
    }

    if (!address.country?.trim()) {
      errors.push('Country is required');
    }

    if (!address.phone?.trim()) {
      errors.push('Phone number is required');
    } else {
      // Basic phone validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(address.phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.push('Please enter a valid phone number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Load profile on mount
  useEffect(() => {
    getProfile();
  }, []); // Empty dependency array - only run once on mount

  const value: ProfileContextType = {
    ...state,
    getProfile,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    updatePreferences,
    getDefaultAddress,
    validateAddress,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}; 