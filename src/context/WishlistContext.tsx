import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { Product } from '../types';
import { useProductData } from './ProductDataContext';
import { addFavourite, favouriteIds, removeFavourite } from '../services/shopApi';

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
  const { products, getProductById } = useProductData();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  // Ids saved on the server for the signed-in customer (null until loaded)
  const [serverIds, setServerIds] = useState<string[] | null>(null);

  // Load wishlist from localStorage
  // Signed in: favourites live on the server. Items a guest saved before signing in are moved over.
  useEffect(() => {
    if (!user) { setServerIds(null); return; }
    let cancelled = false;
    (async () => {
      try {
        let ids = await favouriteIds();
        let guest: Array<{ product?: { id?: string } }> = [];
        try { guest = JSON.parse(localStorage.getItem('temp_wishlist') || '[]'); } catch { /* ignore */ }
        const toPush = guest.map((g) => g?.product?.id).filter((id): id is string => !!id && !ids.includes(id) && !!getProductById(id));
        for (const id of toPush) { try { await addFavourite(id); ids = [...ids, id]; } catch { /* product may not exist on the server */ } }
        if (guest.length) localStorage.removeItem('temp_wishlist');
        if (!cancelled) setServerIds(ids);
      } catch (e) {
        console.warn('Could not load favourites', e);
        if (!cancelled) setServerIds([]);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Build the visible wishlist from the saved ids once the product list is available
  useEffect(() => {
    if (!user || serverIds === null) return;
    setWishlist(
      serverIds
        .map((id) => getProductById(id))
        .filter((pr): pr is Product => !!pr)
        .map((pr) => ({ id: pr.id + '_srv', product: pr, addedAt: new Date() })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, serverIds, products]);

  // Guests: keep the list in this browser only
  useEffect(() => {
    if (user) return;
    try {
      const saved = JSON.parse(localStorage.getItem('temp_wishlist') || '[]');
      setWishlist(
        saved
          .filter((item: any) => item && item.product && item.product.id)
          .map((item: any) => ({ ...item, addedAt: item.addedAt ? new Date(item.addedAt) : new Date() })),
      );
    } catch {
      localStorage.removeItem('temp_wishlist');
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) localStorage.setItem('temp_wishlist', JSON.stringify(wishlist));
  }, [wishlist, user]);

  const addToWishlist = (product: Product) => {
    if (!product || !product.id) {
      console.error('Cannot add invalid product to wishlist:', product);
      return;
    }

    if (user) {
      setServerIds((ids) => (ids && !ids.includes(product.id) ? [...ids, product.id] : ids));
      addFavourite(product.id).catch(() => setServerIds((ids) => (ids ? ids.filter((x) => x !== product.id) : ids)));
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
    if (user) {
      setServerIds((ids) => (ids ? ids.filter((x) => x !== productId) : ids));
      removeFavourite(productId).catch(() => setServerIds((ids) => (ids && !ids.includes(productId) ? [...ids, productId] : ids)));
      return;
    }
    setWishlist(prev => prev.filter(item => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const clearWishlist = () => {
    if (user) {
      const ids = serverIds ?? [];
      setServerIds([]);
      ids.forEach((id) => { removeFavourite(id).catch(() => undefined); });
      return;
    }
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
