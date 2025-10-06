import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, Order, OrderStatus } from '../services/api';
import socketService from '../services/socket';
import EmailTestPanel from '../components/admin/EmailTestPanel';
import AdminDebugPanel from '../components/admin/AdminDebugPanel';
import DesignRequestManager from '../components/admin/DesignRequestManager';
import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertCircle,
  Eye,
  Edit,
  Search,
  Bell,
  MessageSquare,
  Send,
  Palette,
  Mail,
  X
} from 'lucide-react';

interface DashboardStats {
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

interface OrderWithUser extends Omit<Order, 'userId'> {
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}


interface Notification {
  type: string;
  title: string;
  message: string;
  timestamp: string;
}

interface OrderDetailModalProps {
  order: OrderWithUser;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus, notes?: string) => Promise<void>;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [notes, setNotes] = useState(order?.adminNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safety check
  if (!order) {
    console.log('OrderDetailModal: No order provided');
    return null;
  }

  console.log('OrderDetailModal: Rendering with order:', order);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    
    try {
      await onStatusUpdate(order._id, newStatus, notes);
      onClose();
    } catch (error: unknown) {
      console.error('Failed to update order status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      packed: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-cyan-100 text-cyan-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
      refunded: 'bg-pink-100 text-pink-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-gray-900 flex items-center gap-3"
            >
              <Package className="h-8 w-8 text-purple-600" />
              Order Details
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300"
            >
              <X size={24} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100"
            >
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"
              >
                <Package className="h-5 w-5 text-purple-600" />
                Order Information
              </motion.h3>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300"
                >
                  <span className="font-semibold text-gray-700">Order Number:</span> 
                  <span className="font-mono text-purple-600 font-bold">{order.orderNumber}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300"
                >
                  <span className="font-semibold text-gray-700">Status:</span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status.replace('_', ' ')}
                  </motion.span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300"
                >
                  <span className="font-semibold text-gray-700">Total:</span> 
                  <span className="font-bold text-green-600 text-lg">R{(order.total / 100).toFixed(2)}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300"
                >
                  <span className="font-semibold text-gray-700">Date:</span> 
                  <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span>
                </motion.div>
                {order.trackingNumber && (
                  <motion.div 
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                  >
                    <span className="font-semibold text-gray-700">Tracking:</span> 
                    <span className="font-mono text-blue-600">{order.trackingNumber}</span>
                  </motion.div>
                )}
              </div>

              {/* Status Update */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-white rounded-xl p-6 border border-gray-100"
              >
                <motion.h4 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <Edit className="h-5 w-5 text-purple-600" />
                  Update Status
                </motion.h4>
                <div className="space-y-4">
                  <motion.select
                    whileHover={{ scale: 1.02 }}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 bg-white/50 hover:bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </motion.select>
                  
                  <motion.textarea
                    whileHover={{ scale: 1.02 }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes (optional)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 bg-white/50 hover:bg-white resize-none"
                  />
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-red-800 text-sm">{error}</p>
                    </motion.div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || newStatus === order.status}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Customer & Items */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-gray-100"
            >
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"
              >
                <Users className="h-5 w-5 text-blue-600" />
                Customer Information
              </motion.h3>
              <div className="space-y-4 mb-8">
                <motion.div 
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <span className="font-semibold text-gray-700">Name:</span> 
                  <span className="ml-2 text-gray-900 font-medium">{order.user?.firstName || 'N/A'} {order.user?.lastName || 'N/A'}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <span className="font-semibold text-gray-700">Email:</span> 
                  <span className="ml-2 text-blue-600 font-medium">{order.user?.email || 'N/A'}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <span className="font-semibold text-gray-700">Shipping Address:</span>
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                    {order.shippingAddress.address1}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </div>
                </motion.div>
              </div>

              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"
              >
                <Package className="h-5 w-5 text-green-600" />
                Order Items
              </motion.h3>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, x: 8 }}
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300"
                  >
                    <motion.img
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      src={item.productImage || '/images/placeholder.jpg'}
                      alt={item.productName || 'Product'}
                      className="h-16 w-16 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">{item.productName || 'Unknown Product'}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Size: <span className="font-medium">{item.size || 'N/A'}</span> | Color: <span className="font-medium">{item.color?.name || 'N/A'}</span> | Qty: <span className="font-medium">{item.quantity || 0}</span>
                      </div>
                      <div className="text-lg font-bold text-green-600 mt-1">R{((item.total || 0) / 100).toFixed(2)}</div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    No items found in this order.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Design Request state
  const [activeTab, setActiveTab] = useState<'orders' | 'design-requests' | 'email'>('orders');


  const loadDashboardData = useCallback(async () => {
    try {
      console.log('AdminDashboard: Loading dashboard data...');
      setLoading(true);
      
      const [dashboardResponse, ordersResponse] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getOrders({ limit: 20 })
      ]);

      console.log('AdminDashboard: Dashboard response:', dashboardResponse);
      console.log('AdminDashboard: Orders response:', ordersResponse);

      if (dashboardResponse.success && dashboardResponse.data) {
        setStats(dashboardResponse.data.orderStats);
        console.log('AdminDashboard: Stats set:', dashboardResponse.data.orderStats);
      }

      if (ordersResponse.success && ordersResponse.data) {
        // Transform orders to include user data (mock for now)
        const ordersWithUsers = ordersResponse.data.orders.map(order => ({
          ...order,
          user: {
            id: order.userId,
            firstName: 'User',
            lastName: 'Name',
            email: 'user@example.com'
          }
        }));
        setOrders(ordersWithUsers as OrderWithUser[]);
        console.log('AdminDashboard: Orders set:', ordersWithUsers.length, 'orders');
      }
    } catch (error) {
      console.error('AdminDashboard: Failed to load dashboard data:', error);
      // Set loading to false even on error to prevent infinite loading
      setLoading(false);
    } finally {
      setLoading(false);
      console.log('AdminDashboard: Loading complete');
    }
  }, []);

  const setupRealtimeUpdates = useCallback(() => {
    // Listen for order updates
    socketService.onOrderUpdate((data) => {
      const notification: Notification = {
        type: 'order',
        title: 'Order Update',
        message: data.message,
        timestamp: data.timestamp
      };
      setRealtimeUpdates(prev => [notification, ...prev]);
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 5000);
      
      // Refresh dashboard data
      loadDashboardData();
    });

    // Listen for general notifications
    socketService.onNewNotification((notification) => {
      const formattedNotification: Notification = {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: notification.createdAt
      };
      setRealtimeUpdates(prev => [formattedNotification, ...prev]);
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 5000);
    });

    // Listen for new design requests
    socketService.onNewDesignRequest((data) => {
      const notification: Notification = {
        type: 'design_request',
        title: 'New Design Request',
        message: `${data.title} - ${data.category}`,
        timestamp: new Date().toISOString()
      };
      setRealtimeUpdates(prev => [notification, ...prev]);
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 5000);
    });
  }, [loadDashboardData]);

  const handleSendAdminMessage = async () => {
    if (!adminMessage.trim()) return;

    setIsSendingMessage(true);
    try {
      // Send admin broadcast message
      socketService.sendAdminNotification({
        title: 'Admin Message',
        message: adminMessage
      });

      setAdminMessage('');
      
      // Show success feedback
      setRealtimeUpdates(prev => [{
        type: 'admin_broadcast',
        title: 'Message Sent',
        message: 'Admin message broadcasted to all users',
        timestamp: new Date().toISOString()
      }, ...prev]);
    } catch (error) {
      console.error('Failed to send admin message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  useEffect(() => {
    console.log('AdminDashboard: useEffect triggered, user:', user);
    console.log('AdminDashboard: User role:', user?.role);
    
    if (user?.role === 'admin') {
      console.log('AdminDashboard: User is admin, loading data...');
      loadDashboardData();
      setupRealtimeUpdates();
    } else {
      console.log('AdminDashboard: User is not admin or not loaded yet');
    }

    return () => {
      // Cleanup socket listeners
      socketService.offOrderUpdate();
      socketService.offNewNotification();
      socketService.offNewDesignRequest();
    };
  }, [user, loadDashboardData, setupRealtimeUpdates]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, notes?: string) => {
    try {
      console.log('Updating order status:', { orderId, newStatus, notes });
      
      const response = await adminAPI.updateOrderStatus(orderId, {
        status: newStatus,
        notes,
        estimatedDelivery: newStatus === 'shipped' ? new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() : undefined
      });

      console.log('Order status update response:', response);

      if (response.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus, adminNotes: notes }
            : order
        ));
        
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus, adminNotes: notes } : null);
        }
        
        // Show success feedback
        setRealtimeUpdates(prev => [{
          type: 'success',
          title: 'Order Updated',
          message: `Order status updated to ${newStatus}`,
          timestamp: new Date().toISOString()
        }, ...prev]);
        
        // Reload stats
        loadDashboardData();
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (error: unknown) {
      console.error('Failed to update order status:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      
      // Show error feedback
      setRealtimeUpdates(prev => [{
        type: 'error',
        title: 'Update Failed',
        message: errorMessage,
        timestamp: new Date().toISOString()
      }, ...prev]);
      
      throw error; // Re-throw to let the modal handle it
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      packed: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-cyan-100 text-cyan-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
      refunded: 'bg-pink-100 text-pink-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      packed: Package,
      shipped: Truck,
      out_for_delivery: Truck,
      delivered: CheckCircle,
      cancelled: AlertCircle,
      returned: AlertCircle,
      refunded: AlertCircle
    };
    return icons[status] || Package;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  console.log('AdminDashboard: Rendering, user:', user, 'loading:', loading);

  if (!user) {
    console.log('AdminDashboard: No user, showing loading...');
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    console.log('AdminDashboard: User is not admin, showing access denied');
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          <p className="text-sm text-gray-500 mt-2">Current role: {user?.role || 'undefined'}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('AdminDashboard: Loading data, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  console.log('AdminDashboard: Rendering main dashboard, stats:', stats, 'orders:', orders.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 pt-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-100/10 to-blue-100/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent mb-3"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-600 text-lg"
          >
            Manage orders, users, and monitor store performance
          </motion.p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('design-requests')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'design-requests'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Palette className="w-4 h-4 inline mr-2" />
              Design Requests
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'email'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email Service
            </button>
          </div>
        </motion.div>

        {/* Real-time Updates */}
        {realtimeUpdates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-2">
              {realtimeUpdates.slice(0, 3).map((update, index) => (
                <div key={index} className="text-sm text-blue-800">
                  <span className="font-medium">{update.title}:</span> {update.message}
                  <span className="text-blue-600 ml-2">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <>
            {/* Admin Message Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
              Admin Broadcast
            </h2>
            {showNotifications && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <Bell className="h-5 w-5 text-green-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </motion.div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                placeholder="Send a message to all users..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              onClick={handleSendAdminMessage}
              disabled={!adminMessage.trim() || isSendingMessage}
              className="flex items-center px-6 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {isSendingMessage ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
              <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{stats.totalOrders}</p>
                </div>
                </div>
                {/* Floating particles effect */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 relative overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
              <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <DollarSign className="h-6 w-6 text-green-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">R{stats.totalRevenue.toFixed(2)}</p>
                </div>
                </div>
                {/* Floating particles effect */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-200 relative overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
              <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">R{stats.averageOrderValue.toFixed(2)}</p>
                </div>
                </div>
                {/* Floating particles effect */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-orange-200 relative overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
              <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-6 w-6 text-orange-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Today's Orders</p>
                    <p className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{stats.todayOrders}</p>
                </div>
                </div>
                {/* Floating particles effect */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Orders Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-bold text-gray-900 flex items-center gap-2"
              >
                <Package className="h-5 w-5 text-purple-600" />
                Recent Orders
              </motion.h2>
              
              {/* Filters */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4"
              >
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 bg-white/50 hover:bg-white"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 bg-white/50 hover:bg-white cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </motion.div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <motion.tr 
                      key={order._id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                      className="group hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-purple-400"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                          </div>
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                            {order.user?.firstName || 'N/A'} {order.user?.lastName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                            {order.user?.email || 'N/A'}
                          </div>
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:shadow-md ${getStatusColor(order.status)}`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1 group-hover:rotate-12 transition-transform duration-300" />
                          {order.status.replace('_', ' ')}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300"
                        >
                        R{(order.total / 100).toFixed(2)}
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300"
                        >
                        {new Date(order.createdAt).toLocaleDateString()}
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
          </>
        )}

        {/* Design Requests Tab Content */}
        {activeTab === 'design-requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <DesignRequestManager />
          </motion.div>
        )}

        {/* Email Tab Content */}
        {activeTab === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <EmailTestPanel />
          </motion.div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={updateOrderStatus}
        />
      )}
      
      {/* Debug Panel - Remove in production */}
      <AdminDebugPanel />
    </div>
  );
};

export default AdminDashboard;

