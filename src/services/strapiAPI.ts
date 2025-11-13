import axios from 'axios';

// Strapi API configuration
const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.REACT_APP_STRAPI_TOKEN;

const strapiAPI = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Order Management API
export const orderAPI = {
  // Get all orders for a customer
  getCustomerOrders: async (customerId: string) => {
    try {
      const response = await strapiAPI.get('/orders', {
        params: {
          'filters[customer][id][$eq]': customerId,
          'populate': 'items,customer',
          'sort': 'orderDate:desc'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  // Get single order
  getOrder: async (orderId: string) => {
    try {
      const response = await strapiAPI.get(`/orders/${orderId}`, {
        params: {
          'populate': 'items,customer'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const response = await strapiAPI.put(`/orders/${orderId}`, {
        data: { status }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId: string, paymentStatus: string) => {
    try {
      const response = await strapiAPI.put(`/orders/${orderId}`, {
        data: { paymentStatus }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Add tracking number
  addTrackingNumber: async (orderId: string, trackingNumber: string) => {
    try {
      const response = await strapiAPI.put(`/orders/${orderId}`, {
        data: { trackingNumber }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error adding tracking number:', error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData: any) => {
    try {
      const response = await strapiAPI.post('/orders', {
        data: orderData
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};

// Product Management API
export const productAPI = {
  // Get all products
  getProducts: async () => {
    try {
      const response = await strapiAPI.get('/products', {
        params: {
          'populate': 'images',
          'sort': 'createdAt:desc'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (productId: string) => {
    try {
      const response = await strapiAPI.get(`/products/${productId}`, {
        params: {
          'populate': 'images'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Update product stock
  updateStock: async (productId: string, stockQuantity: number) => {
    try {
      const response = await strapiAPI.put(`/products/${productId}`, {
        data: { stockQuantity }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
};

// Support Request API
export const supportAPI = {
  // Get customer support requests
  getCustomerRequests: async (customerId: string) => {
    try {
      const response = await strapiAPI.get('/support-requests', {
        params: {
          'filters[customer][id][$eq]': customerId,
          'populate': 'order',
          'sort': 'createdAt:desc'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching support requests:', error);
      throw error;
    }
  },

  // Create support request
  createRequest: async (requestData: any) => {
    try {
      const response = await strapiAPI.post('/support-requests', {
        data: requestData
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating support request:', error);
      throw error;
    }
  },

  // Update support request status
  updateRequestStatus: async (requestId: string, status: string) => {
    try {
      const response = await strapiAPI.put(`/support-requests/${requestId}`, {
        data: { status }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating support request:', error);
      throw error;
    }
  }
};

// User Management API
export const userAPI = {
  // Update user profile
  updateProfile: async (userId: string, profileData: any) => {
    try {
      const response = await strapiAPI.put(`/users/${userId}`, {
        data: profileData
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get user addresses
  getUserAddresses: async (userId: string) => {
    try {
      const response = await strapiAPI.get(`/users/${userId}`, {
        params: {
          'populate': 'addresses'
        }
      });
      return response.data.data.addresses || [];
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      throw error;
    }
  },

  // Update user addresses
  updateAddresses: async (userId: string, addresses: any[]) => {
    try {
      const response = await strapiAPI.put(`/users/${userId}`, {
        data: { addresses }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating addresses:', error);
      throw error;
    }
  }
};

// Analytics API
export const analyticsAPI = {
  // Get order statistics
  getOrderStats: async (dateRange?: { start: string; end: string }) => {
    try {
      const params: any = {
        'populate': 'customer'
      };
      
      if (dateRange) {
        params['filters[orderDate][$gte]'] = dateRange.start;
        params['filters[orderDate][$lte]'] = dateRange.end;
      }
      
      const response = await strapiAPI.get('/orders', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (dateRange?: { start: string; end: string }) => {
    try {
      const params: any = {
        'filters[paymentStatus][$eq]': 'paid'
      };
      
      if (dateRange) {
        params['filters[orderDate][$gte]'] = dateRange.start;
        params['filters[orderDate][$lte]'] = dateRange.end;
      }
      
      const response = await strapiAPI.get('/orders', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }
};

export default strapiAPI;
