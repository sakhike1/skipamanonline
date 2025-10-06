import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, Order, OrderStatus } from '../services/api';
import socketService from '../services/socket';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye,
  ArrowRight,
  Filter,
  Search,
  Bell,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      loadOrders();
      setupRealtimeUpdates();
    }

    return () => {
      // Cleanup socket listeners
      socketService.offOrderUpdate();
      socketService.offNewNotification();
    };
  }, [user]);

  const setupRealtimeUpdates = () => {
    // Listen for order updates
    socketService.onOrderUpdate((data) => {
      setRealtimeUpdates(prev => [data, ...prev]);
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 5000);
      
      // Refresh orders list
      loadOrders();
    });

    // Listen for general notifications
    socketService.onNewNotification((notification) => {
      setRealtimeUpdates(prev => [notification, ...prev]);
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 5000);
    });
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders({ limit: 50 });
      if (response.success && response.data) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
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
      cancelled: Clock,
      returned: Package,
      refunded: CheckCircle
    };
    return icons[status] || Package;
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      processing: 'text-purple-600 bg-purple-100',
      packed: 'text-indigo-600 bg-indigo-100',
      shipped: 'text-cyan-600 bg-cyan-100',
      out_for_delivery: 'text-orange-600 bg-orange-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      returned: 'text-gray-600 bg-gray-100',
      refunded: 'text-pink-600 bg-pink-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusMessage = (status: OrderStatus) => {
    const messages = {
      pending: 'Your order is being reviewed and will be confirmed shortly.',
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being processed and will be shipped soon.',
      packed: 'Your order has been packed and is ready for shipment.',
      shipped: 'Your order has been shipped and is on its way to you.',
      out_for_delivery: 'Your order is out for delivery and should arrive within 8 hours.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.',
      returned: 'Your order has been returned.',
      refunded: 'Your order has been refunded.'
    };
    return messages[status] || 'Order status unknown.';
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track and manage your orders</p>
            </div>
            
            {/* Real-time notification indicator */}
            {showNotifications && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <Bell className="h-6 w-6 text-green-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Real-time Updates */}
        {realtimeUpdates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Recent Updates
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

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? "You haven't placed any orders yet." 
                : "No orders match your current filters."}
            </p>
            {orders.length === 0 && (
              <Link
                to="/shop"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">
                          {getStatusMessage(order.status)}
                        </p>

                        {/* Order Items Preview */}
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, itemIndex) => (
                              <img
                                key={itemIndex}
                                src={item.productImage}
                                alt={item.productName}
                                className="h-12 w-12 rounded-lg border-2 border-white object-cover"
                              />
                            ))}
                            {order.items.length > 3 && (
                              <div className="h-12 w-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  +{order.items.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              Total: R{order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                        
                        {order.status === 'shipped' || order.status === 'out_for_delivery' ? (
                          <Link
                            to={`/orders/${order._id}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Track Order
                          </Link>
                        ) : order.status === 'delivered' ? (
                          <Link
                            to={`/orders/${order._id}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            View Order
                          </Link>
                        ) : null}

                        {/* Feedback button for delivered orders */}
                        {order.status === 'delivered' && (
                          <Link
                            to={`/orders/${order._id}#feedback`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Leave Feedback
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

