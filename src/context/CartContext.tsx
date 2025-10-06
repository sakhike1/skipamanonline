import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, Size, Color } from '../types';
import { getProductById } from '../data/products';

// Initialize empty cart
const initialCart: Cart = {
  items: [],
  total: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
};

// Action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: { productId: string; size: Size; color: Color; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { index: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { index: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'RECALCULATE_TOTALS'; payload: { subtotal: number; tax: number; shipping: number; discount: number; total: number } };

// Context setup
type CartContextType = {
  cart: Cart;
  addToCart: (productId: string, size: Size, color: Color, quantity: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string, size: Size, color: Color) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer function
const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, size, color, quantity } = action.payload;
      const product = getProductById(productId);
      
      if (!product) return state;
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.productId === productId && item.size === size && item.color.name === color.name
      );
      
      if (existingItemIndex !== -1) {
        // Replace existing item quantity instead of adding to it
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity = quantity;
        
        const subtotal = calculateSubtotal(updatedItems);
        const { tax, shipping, discount, total } = calculateOrderTotals(subtotal);
        
        return {
          ...state,
          items: updatedItems,
          subtotal,
          tax,
          shipping,
          discount,
          total,
        };
      }
      
      // Add new item
      const newItem: CartItem = {
        productId,
        size,
        color,
        quantity,
      };
      
      const newItems = [...state.items, newItem];
      const subtotal = calculateSubtotal(newItems);
      const { tax, shipping, discount, total } = calculateOrderTotals(subtotal);
      
      return {
        ...state,
        items: newItems,
        subtotal,
        tax,
        shipping,
        discount,
        total,
      };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((_, index) => index !== action.payload.index);
      const subtotal = calculateSubtotal(updatedItems);
      const { tax, shipping, discount, total } = calculateOrderTotals(subtotal);
      
      return {
        ...state,
        items: updatedItems,
        subtotal,
        tax,
        shipping,
        discount,
        total,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { index, quantity } = action.payload;
      if (quantity <= 0) return state;
      
      const updatedItems = [...state.items];
      updatedItems[index].quantity = quantity;
      
      const subtotal = calculateSubtotal(updatedItems);
      const { tax, shipping, discount, total } = calculateOrderTotals(subtotal);
      
      return {
        ...state,
        items: updatedItems,
        subtotal,
        tax,
        shipping,
        discount,
        total,
      };
    }
    
    case 'CLEAR_CART':
      return initialCart;
      
    case 'RECALCULATE_TOTALS':
      return {
        ...state,
        subtotal: action.payload.subtotal,
        tax: action.payload.tax,
        shipping: action.payload.shipping,
        discount: action.payload.discount,
        total: action.payload.total,
      };
      
    default:
      return state;
  }
};

// Helper to calculate subtotal
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + ((product?.price || 0) / 100) * item.quantity;
  }, 0);
};

// Helper to calculate order totals
const calculateOrderTotals = (subtotal: number) => {
  const tax = 0; // No tax
  const shipping = subtotal >= 500 ? 0 : 15; // Free shipping over R500, otherwise R15
  const discount = 0; // No discount for now
  const total = subtotal + tax + shipping - discount;
  
  return { tax, shipping, discount, total };
};

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load cart from localStorage if available
  const savedCart = localStorage.getItem('cart');
  const cartVersion = localStorage.getItem('cartVersion');
  const currentVersion = '2.3'; // Force complete cart reset
  
  // Clear cart if version is outdated
  if (cartVersion !== currentVersion) {
    localStorage.removeItem('cart');
    localStorage.removeItem('cartVersion');
    localStorage.setItem('cartVersion', currentVersion);
  }
  
  const initialState = savedCart && cartVersion === currentVersion ? JSON.parse(savedCart) : initialCart;
  
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  
  // Recalculate cart totals on mount to ensure correct pricing
  useEffect(() => {
    if (cart.items.length > 0) {
      const subtotal = calculateSubtotal(cart.items);
      const { tax, shipping, discount, total } = calculateOrderTotals(subtotal);
      
      // Only update if totals are different (to avoid infinite loops)
      if (cart.subtotal !== subtotal || cart.total !== total) {
        dispatch({ type: 'RECALCULATE_TOTALS', payload: { subtotal, tax, shipping, discount, total } });
      }
    }
  }, []); // Only run on mount
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Cart actions
  const addToCart = (productId: string, size: Size, color: Color, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId, size, color, quantity } });
  };
  
  const removeFromCart = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { index } });
  };
  
  const updateQuantity = (index: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const isInCart = (productId: string, size: Size, color: Color): boolean => {
    return cart.items.some(
      item => 
        item.productId === productId && 
        item.size === size && 
        item.color.name === color.name
    );
  };
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};