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
  stock: number; // Add stock tracking
  sku: string; // Add SKU for inventory
  weight: number; // For shipping calculations
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[]; // For better search
  isActive: boolean; // For soft delete
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
  size?: string;
  color?: string;
  fit?: 'Perfect' | 'Too Small' | 'Too Big' | 'Just Right';
  quality?: 'Excellent' | 'Good' | 'Average' | 'Poor';
  wouldRecommend?: boolean;
  pointsEarned?: number;
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
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: Size;
  color: Color;
  price: number;
  total: number;
}

export type OrderStatus = 
  | 'pending'
  | 'awaiting_payment'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

// Strapi Order Sync Types
export interface StrapiOrderItemInput {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productId?: string;
  sku?: string;
  size?: string;
  color?: string;
}

export interface StrapiOrderCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userId?: string;
}

export interface StrapiOrderAddressInput {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface StrapiOrderCreateInput {
  orderNumber: string;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingTotal: number;
  total: number;
  currency: string;
  customer: StrapiOrderCustomerInput;
  shippingAddress: StrapiOrderAddressInput;
  orderItems: StrapiOrderItemInput[];
  orderStatus?: OrderStatus;
  order_status?: OrderStatus;
  notes?: string;
  metadata?: Record<string, unknown>;
}

// New interface matching Strapi Order API format
export interface StrapiOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    productId?: string;
  }>;
  subtotal: number;
  shippingCost?: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  userId?: string;
  source?: string;
}

export interface StrapiOrderAttributes extends StrapiOrderCreateInput {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiOrderEntity {
  id: number;
  attributes: StrapiOrderAttributes;
}

export interface StrapiOrderListMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface PaymentMethod {
  type: 'stripe' | 'paypal' | 'bank_transfer';
  details: {
    last4?: string;
    brand?: string;
    email?: string;
  };
}

// Address Types
export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

// User Profile Types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  emailNotifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    productRecommendations: boolean;
  };
  marketingConsent: boolean;
  language: string;
  currency: string;
}

// Shipping Types
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isAvailable: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  methods: ShippingMethod[];
}

// Discount Types
export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minimumOrder: number;
  maximumDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export type NotificationType = 
  | 'order_confirmation'
  | 'order_shipped'
  | 'order_delivered'
  | 'low_stock'
  | 'price_drop'
  | 'back_in_stock'
  | 'promotion'
  | 'system';

// Analytics Types
export interface Analytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: TopProduct[];
  salesByCategory: CategorySales[];
  salesByDate: DateSales[];
  customerMetrics: CustomerMetrics;
}

export interface TopProduct {
  productId: string;
  name: string;
  sales: number;
  revenue: number;
  unitsSold: number;
}

export interface CategorySales {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
}

export interface DateSales {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  averageCustomerValue: number;
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
  sortBy?: 'price' | 'rating' | 'newest' | 'popularity' | 'name';
  sortOrder?: 'asc' | 'desc';
  inStock?: boolean;
  tags?: string[];
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
  role: 'buyer' | 'admin';
  createdAt: string;
  updatedAt: string;
  phone?: string;
  avatarUrl?: string;
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

// Return & Refund Types
export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  items: ReturnItem[];
  reason: ReturnReason;
  description: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  refundAmount?: number;
  refundMethod?: PaymentMethod;
}

export interface ReturnItem {
  orderItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: string;
}

export type ReturnReason = 
  | 'wrong_size'
  | 'defective'
  | 'not_as_described'
  | 'changed_mind'
  | 'wrong_item'
  | 'other';

export type ReturnStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'refunded'
  | 'completed';

// SEO Types
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  structuredData?: any;
}