import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Wishlist, WishlistItem } from '../types';

// Initialize empty wishlist
const initialWishlist: Wishlist = {
  items: [],
};

// Action types
type WishlistAction =
  | { type: 'ADD_ITEM'; payload: { productId: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_WISHLIST' };

// Context setup
type WishlistContextType = {
  wishlist: Wishlist;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Reducer function
const wishlistReducer = (state: Wishlist, action: WishlistAction): Wishlist => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId } = action.payload;
      
      // Check if item already exists in wishlist
      const existingItem = state.items.find(item => item.productId === productId);
      
      if (existingItem) {
        return state; // Item already exists
      }
      
      // Add new item
      const newItem: WishlistItem = {
        productId,
        addedAt: new Date().toISOString(),
      };
      
      return {
        ...state,
        items: [...state.items, newItem],
      };
    }
    
    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.productId !== productId),
      };
    }
    
    case 'CLEAR_WISHLIST':
      return initialWishlist;
      
    default:
      return state;
  }
};

// Provider component
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load wishlist from localStorage if available
  const savedWishlist = localStorage.getItem('wishlist');
  const initialState = savedWishlist ? JSON.parse(savedWishlist) : initialWishlist;
  
  const [wishlist, dispatch] = useReducer(wishlistReducer, initialState);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  // Wishlist actions
  const addToWishlist = (productId: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId } });
  };
  
  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };
  
  const isInWishlist = (productId: string): boolean => {
    return wishlist.items.some(item => item.productId === productId);
  };
  
  const wishlistCount = wishlist.items.length;
  
  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      addToWishlist, 
      removeFromWishlist, 
      clearWishlist, 
      isInWishlist,
      wishlistCount 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 