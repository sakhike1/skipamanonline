import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { Product } from '../types';

interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          // Convert date strings back to Date objects and validate items
          const wishlistWithDates = parsedWishlist
            .filter((item: any) => item && item.product && item.product.id) // Filter out invalid items
            .map((item: any) => ({
              ...item,
              addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
            }));
          setWishlist(wishlistWithDates);
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
          // Clear corrupted data
          localStorage.removeItem(`wishlist_${user.id}`);
          setWishlist([]);
        }
      }
    } else {
      // For non-authenticated users, use a temporary wishlist
      const tempWishlist = localStorage.getItem('temp_wishlist');
      if (tempWishlist) {
        try {
          const parsedWishlist = JSON.parse(tempWishlist);
          const wishlistWithDates = parsedWishlist
            .filter((item: any) => item && item.product && item.product.id) // Filter out invalid items
            .map((item: any) => ({
              ...item,
              addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
            }));
          setWishlist(wishlistWithDates);
        } catch (error) {
          console.error('Error parsing temp wishlist from localStorage:', error);
          // Clear corrupted data
          localStorage.removeItem('temp_wishlist');
          setWishlist([]);
        }
      }
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    } else {
      localStorage.setItem('temp_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = (product: Product) => {
    if (!product || !product.id) {
      console.error('Cannot add invalid product to wishlist:', product);
      return;
    }

    setWishlist(prev => {
      // Check if product is already in wishlist
      const existingItem = prev.find(item => item.product?.id === product.id);
      if (existingItem) {
        return prev; // Don't add duplicates
      }

      const newItem: WishlistItem = {
        id: `${product.id}_${Date.now()}`,
        product,
        addedAt: new Date()
      };

      return [...prev, newItem];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
