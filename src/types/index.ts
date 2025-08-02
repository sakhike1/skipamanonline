// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: Size[];
  colors: Color[];
  category: string;
  featured: boolean;
  rating?: number;
  reviewCount?: number;
}

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Color {
  name: string;
  value: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userInitials: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  size: Size;
  color: Color;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// UI Types
export type ViewMode = 'grid' | 'list' | 'carousel';

// Search & Filter Types
export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  sizes?: Size[];
  colors?: string[];
  rating?: number;
  sortBy?: 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Wishlist Types
export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Wishlist {
  items: WishlistItem[];
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  password?: string; // Optional for internal use, never exposed externally
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}