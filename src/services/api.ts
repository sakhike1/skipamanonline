import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'admin';
  phone?: string;
  addresses?: Address[];
  preferences?: UserPreferences;
  createdAt: string;
  lastLogin?: string;
}

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

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: Color[];
  category: string;
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  stock: number;
  sku: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Color {
  name: string;
  value: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
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
  actualDelivery?: string;
  notes?: string;
  adminNotes?: string;
  statusHistory: StatusUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: Color;
  price: number;
  total: number;
}

export interface PaymentMethod {
  type: 'stripe' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  details: {
    last4?: string;
    brand?: string;
    email?: string;
    transactionId?: string;
  };
}

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
  estimatedDelivery?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
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

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'order_confirmation'
  | 'order_status_update'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'low_stock'
  | 'price_drop'
  | 'back_in_stock'
  | 'promotion'
  | 'system'
  | 'admin_message';

// Order creation and update interfaces
export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    size: string;
    color: Color;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  notes?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// Dashboard and stats interfaces
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  todayOrders: number;
  todayRevenue: number;
  weekOrders: number;
  weekRevenue: number;
  monthOrders: number;
  monthRevenue: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface StatusDistribution {
  status: OrderStatus;
  count: number;
  percentage: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  adminUsers: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  featuredProducts: number;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  createAdmin: async (credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/create-admin', credentials);
    return response.data;
  }
};

// Orders API
export const ordersAPI = {
  createOrder: async (orderData: CreateOrderData): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrders: async (params?: { limit?: number; page?: number }): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (orderId: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, statusData: UpdateOrderStatusData): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  }
};

// Products API
export const productsAPI = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<{ products: Product[]; pagination: PaginationInfo }>> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async (limit?: number): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  getProductsByCategory: async (category: string, limit?: number): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await api.get(`/products/category/${category}`, { params: { limit } });
    return response.data;
  },

  searchProducts: async (query: string, limit?: number): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await api.get(`/products/search/${query}`, { params: { limit } });
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<{ categories: string[] }>> => {
    const response = await api.get('/products/categories');
    return response.data;
  }
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ notifications: Notification[]; unreadCount: number; pagination: PaginationInfo }>> => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<{ unreadCount: number }>> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<{ notification: Notification }>> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo; stats: DashboardStats }>> => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  getOrder: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, data: UpdateOrderStatusData): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.put(`/admin/orders/${id}/status`, data);
    return response.data;
  },

  getDashboard: async (): Promise<ApiResponse<{
    orderStats: DashboardStats;
    statusDistribution: StatusDistribution[];
    recentOrders: Order[];
    userStats: UserStats;
    productStats: ProductStats;
  }>> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<{ users: User[]; pagination: PaginationInfo }>> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  sendNotification: async (data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }): Promise<ApiResponse<{ notification: Notification }>> => {
    const response = await api.post('/admin/notifications', data);
    return response.data;
  },

  sendBroadcast: async (data: {
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    actionRequired?: boolean;
    actionUrl?: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/admin/broadcast', data);
    return response.data;
  },

  sendAnnouncement: async (data: {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'success' | 'error';
    persistent?: boolean;
  }): Promise<ApiResponse> => {
    const response = await api.post('/admin/announcement', data);
    return response.data;
  },

  testEmail: async (data: {
    to: string;
    subject?: string;
    message?: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/admin/test-email', data);
    return response.data;
  }
};

// Feedback API
export interface OrderFeedback {
  _id: string;
  orderId: string;
  userId: string;
  rating: number;
  category: 'general' | 'shipping' | 'product' | 'customer_service';
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackData {
  orderId: string;
  rating: number;
  category: 'general' | 'shipping' | 'product' | 'customer_service';
  comment?: string;
}

export const feedbackAPI = {
  createFeedback: async (data: CreateFeedbackData): Promise<ApiResponse<{ feedback: OrderFeedback }>> => {
    const response = await api.post('/feedback', data);
    return response.data;
  },

  getOrderFeedback: async (orderId: string): Promise<ApiResponse<{ feedback: OrderFeedback | null }>> => {
    const response = await api.get(`/feedback/order/${orderId}`);
    return response.data;
  },

  getUserFeedback: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ feedback: OrderFeedback[]; pagination: PaginationInfo }>> => {
    const response = await api.get('/feedback', { params });
    return response.data;
  },

  getFeedbackStats: async (): Promise<ApiResponse<{
    averageRating: number;
    totalFeedback: number;
    categoryStats: Array<{
      category: string;
      count: number;
      averageRating: number;
    }>;
  }>> => {
    const response = await api.get('/feedback/stats');
    return response.data;
  }
};

export default api;