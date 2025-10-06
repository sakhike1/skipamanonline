import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, feedbackAPI, Order, OrderStatus, CreateFeedbackData } from '../services/api';
import socketService from '../services/socket';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Star,
  Send,
  Bell
} from 'lucide-react';

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
    category: 'general'
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
      setupRealtimeUpdates();
    }

    return () => {
      // Cleanup socket listeners
      if (orderId) {
        socketService.unsubscribeFromOrder(orderId);
        socketService.offOrderUpdate();
        socketService.offNewNotification();
      }
    };
  }, [orderId]);

  const setupRealtimeUpdates = () => {
    if (!orderId) return;

    // Subscribe to order updates
    socketService.subscribeToOrder(orderId);

    // Listen for order updates
    socketService.onOrderUpdate((data) => {
      if (data.orderId === orderId) {
        setRealtimeUpdates(prev => [data, ...prev]);
        // Refresh order details
        loadOrderDetails();
        
        // Show notification
        setShowNotifications(true);
        setTimeout(() => setShowNotifications(false), 5000);
      }
    });

    // Listen for general notifications
    socketService.onNewNotification((notification) => {
      setRealtimeUpdates(prev => [notification, ...prev]);
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 5000);
    });
  };

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersAPI.getOrder(orderId!);
      if (response.success && response.data) {
        setOrder(response.data.order);
      } else {
        setError('Order not found');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load order details');
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
      cancelled: AlertCircle,
      returned: AlertCircle,
      refunded: AlertCircle
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

  const getEstimatedDelivery = (status: OrderStatus, estimatedDelivery?: string) => {
    if (status === 'shipped' || status === 'out_for_delivery') {
      if (estimatedDelivery) {
        return new Date(estimatedDelivery).toLocaleString();
      }
      // Default 8-hour estimate for out_for_delivery
      if (status === 'out_for_delivery') {
        return new Date(Date.now() + 8 * 60 * 60 * 1000).toLocaleString();
      }
    }
    return null;
  };

  const getProgressPercentage = (status: OrderStatus) => {
    const progress = {
      pending: 10,
      confirmed: 20,
      processing: 40,
      packed: 60,
      shipped: 80,
      out_for_delivery: 90,
      delivered: 100,
      cancelled: 0,
      returned: 0,
      refunded: 0
    };
    return progress[status] || 0;
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || feedback.rating === 0) return;

    setIsSubmittingFeedback(true);
    try {
      const feedbackData: CreateFeedbackData = {
        orderId: order._id,
        rating: feedback.rating,
        category: feedback.category as 'general' | 'shipping' | 'product' | 'customer_service',
        comment: feedback.comment || undefined
      };

      const response = await feedbackAPI.createFeedback(feedbackData);
      
      if (response.success) {
        // Reset feedback form
        setFeedback({
          rating: 0,
          comment: '',
          category: 'general'
        });
        setShowFeedback(false);
        
        // Show success message
        setRealtimeUpdates(prev => [{
          type: 'feedback',
          title: 'Feedback Submitted',
          message: 'Thank you for your feedback!',
          timestamp: new Date().toISOString()
        }, ...prev]);
      } else {
        throw new Error(response.message || 'Failed to submit feedback');
      }
    } catch (error: any) {
      console.error('Failed to submit feedback:', error);
      setRealtimeUpdates(prev => [{
        type: 'error',
        title: 'Feedback Error',
        message: error.message || 'Failed to submit feedback. Please try again.',
        timestamp: new Date().toISOString()
      }, ...prev]);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The order you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);
  const progressPercentage = getProgressPercentage(order.status);
  const estimatedDelivery = getEstimatedDelivery(order.status, order.estimatedDelivery);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-gray-600 mt-2">Order #{order.orderNumber}</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
              
              {/* Real-time notification indicator */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Progress */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h2>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Order Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-purple-600 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Status Message */}
              <div className="mb-6">
                <p className="text-gray-700">{getStatusMessage(order.status)}</p>
                {estimatedDelivery && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Estimated delivery: {estimatedDelivery}
                  </div>
                )}
              </div>

              {/* Status History */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Status History</h3>
                {order.statusHistory.map((statusUpdate, index) => {
                  const UpdateIcon = getStatusIcon(statusUpdate.status);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`p-2 rounded-full ${getStatusColor(statusUpdate.status)}`}>
                        <UpdateIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">
                            {statusUpdate.status.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(statusUpdate.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {statusUpdate.notes && (
                          <p className="text-sm text-gray-600 mt-1">{statusUpdate.notes}</p>
                        )}
                        {statusUpdate.estimatedDelivery && (
                          <p className="text-sm text-gray-600 mt-1">
                            Estimated delivery: {new Date(statusUpdate.estimatedDelivery).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Color: {item.color.name} | Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        R{item.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0 ? 'Free' : `R${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-R{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>R{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Tracking Number</h3>
                    <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Order Date</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Order Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Feedback</h2>
                {!showFeedback && (
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Leave Feedback
                  </button>
                )}
              </div>

              {showFeedback ? (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How would you rate your experience?
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingClick(rating)}
                          className={`p-1 rounded ${
                            rating <= feedback.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={feedback.category}
                      onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="general">General Feedback</option>
                      <option value="shipping">Shipping Experience</option>
                      <option value="product">Product Quality</option>
                      <option value="customer_service">Customer Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={feedback.comment}
                      onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={feedback.rating === 0 || isSubmittingFeedback}
                      className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
                    >
                      {isSubmittingFeedback ? (
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Submit Feedback
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFeedback(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Help us improve by sharing your experience with this order.
                  </p>
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Rate Your Experience
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;


