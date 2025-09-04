import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { orderId: string; updates: Partial<Order> } }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'CLEAR_ERROR' };

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { 
        ...state, 
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload 
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, ...action.payload.updates }
            : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.orderId
          ? { ...state.currentOrder, ...action.payload.updates }
          : state.currentOrder,
      };
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface OrderContextType extends OrderState {
  // Order Management
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  getOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  
  // Order Tracking
  trackOrder: (orderId: string) => Promise<Order>;
  getOrderHistory: (userId: string) => Promise<Order[]>;
  
  // Utility Functions
  getOrderStatusColor: (status: OrderStatus) => string;
  getOrderStatusText: (status: OrderStatus) => string;
  getPaymentStatusColor: (status: PaymentStatus) => string;
  getPaymentStatusText: (status: PaymentStatus) => string;
  calculateOrderProgress: (order: Order) => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: React.ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // API Base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Create a new order
  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order: Order = await response.json();
      dispatch({ type: 'ADD_ORDER', payload: order });
      return order;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get all orders for the current user
  const getOrders = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const orders: Order[] = await response.json();
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Get a specific order by ID
  const getOrderById = async (orderId: string): Promise<Order | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch order');
      }

      const order: Order = await response.json();
      dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
      return order;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      dispatch({ 
        type: 'UPDATE_ORDER', 
        payload: { orderId, updates: { status } } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId: string, status: PaymentStatus): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      dispatch({ 
        type: 'UPDATE_ORDER', 
        payload: { orderId, updates: { paymentStatus: status } } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update payment status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      dispatch({ 
        type: 'UPDATE_ORDER', 
        payload: { 
          orderId, 
          updates: { 
            status: 'cancelled',
            notes: reason ? `Cancelled: ${reason}` : 'Order cancelled by customer'
          } 
        } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Track order (get latest status)
  const trackOrder = async (orderId: string): Promise<Order> => {
    const order = await getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  };

  // Get order history for a user
  const getOrderHistory = async (userId: string): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE}/orders/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }

      const orders: Order[] = await response.json();
      return orders;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order history';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return [];
    }
  };

  // Utility functions for UI
  const getOrderStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-purple-600 bg-purple-100';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'returned':
        return 'text-orange-600 bg-orange-100';
      case 'refunded':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOrderStatusText = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      case 'refunded':
        return 'Refunded';
      default:
        return 'Unknown';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      case 'partially_refunded':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status: PaymentStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'paid':
        return 'Paid';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      case 'partially_refunded':
        return 'Partially Refunded';
      default:
        return 'Unknown';
    }
  };

  // Calculate order progress percentage
  const calculateOrderProgress = (order: Order): number => {
    const statusOrder: OrderStatus[] = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered'
    ];

    const currentIndex = statusOrder.indexOf(order.status);
    if (currentIndex === -1) return 0;

    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  // Load orders on mount
  useEffect(() => {
    getOrders();
  }, []);

  const value: OrderContextType = {
    ...state,
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    trackOrder,
    getOrderHistory,
    getOrderStatusColor,
    getOrderStatusText,
    getPaymentStatusColor,
    getPaymentStatusText,
    calculateOrderProgress,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}; 