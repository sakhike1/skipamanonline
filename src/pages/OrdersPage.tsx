import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye,
  Filter,
  Search,
  Bell,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Calendar,
  DollarSign,
  MapPin,
  Download,
  Share2,
  Star,
  Zap,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RetailEmptyState } from '../components/ui/RetailEmptyState';

type SchemaOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

type DisplayOrder = {
  id: string;
  orderNumber: string;
  status: SchemaOrderStatus | string;
  total: number;
  createdAt: string;
  items: { productName: string; productImage: string; quantity: number }[];
};

type RealtimeToast = { title: string; message: string; timestamp: string };

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SchemaOrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [realtimeUpdates, setRealtimeUpdates] = useState<RealtimeToast[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      if (!supabase || !user?.id) {
        setOrders([]);
        return;
      }
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          id,
          status,
          total_amount,
          created_at,
          order_number,
          order_items (
            quantity,
            products ( name, image_urls )
          )
        `,
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;

      const mapped: DisplayOrder[] = (data ?? []).map((row: Record<string, unknown>) => {
        const id = String(row.id);
        const itemsRaw = row.order_items as
          | Array<{
              quantity: number;
              products: { name?: string; image_urls?: string[] | null } | null;
            }>
          | null;
        const items = (itemsRaw ?? []).map((oi) => ({
          productName: oi.products?.name ?? 'Product',
          productImage: oi.products?.image_urls?.[0] ?? '/images/grey1.png',
          quantity: oi.quantity,
        }));

        const ref = row.order_number as string | null | undefined;
        return {
          id,
          orderNumber: (ref && String(ref).trim()) || id.replace(/-/g, '').slice(0, 12).toUpperCase(),
          status: String(row.status ?? 'pending'),
          total: Number(row.total_amount ?? 0),
          createdAt: String(row.created_at ?? new Date().toISOString()),
          items,
        };
      });

      setOrders(mapped);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      void loadOrders();
    }

    if (!supabase || !user?.id) return () => {};
    const sb = supabase;
    const channel = sb
      .channel(`orders:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const row = payload.new as { status?: string; id?: string } | null;
          const msg = row?.status
            ? `Status: ${row.status}`
            : payload.eventType === 'INSERT'
              ? 'New order recorded'
              : 'Order updated';
          setRealtimeUpdates((prev) =>
            [{ title: 'Orders', message: msg, timestamp: new Date().toISOString() }, ...prev].slice(0, 10),
          );
          setShowNotifications(true);
          setTimeout(() => setShowNotifications(false), 5000);
          void loadOrders();
        },
      )
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, [user]);

  const getStatusIcon = (status: string) => {
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
    return icons[status as keyof typeof icons] || Package;
  };

  const getStatusGradient = (status: string) => {
    const gradients = {
      pending: 'from-amber-500 via-yellow-500 to-orange-500',
      confirmed: 'from-blue-500 via-cyan-500 to-teal-500',
      processing: 'from-purple-500 via-pink-500 to-rose-500',
      packed: 'from-indigo-500 via-purple-500 to-pink-500',
      shipped: 'from-cyan-500 via-blue-500 to-indigo-500',
      out_for_delivery: 'from-orange-500 via-red-500 to-pink-500',
      delivered: 'from-green-500 via-emerald-500 to-teal-500',
      cancelled: 'from-gray-500 via-slate-500 to-zinc-500',
      returned: 'from-gray-400 via-gray-500 to-gray-600',
      refunded: 'from-pink-500 via-rose-500 to-red-500'
    };
    return gradients[status as keyof typeof gradients] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-black bg-gray-100 border-gray-300',
      confirmed: 'text-black bg-gray-100 border-gray-300',
      processing: 'text-black bg-gray-100 border-gray-300',
      packed: 'text-black bg-gray-100 border-gray-300',
      shipped: 'text-black bg-gray-100 border-gray-300',
      out_for_delivery: 'text-black bg-gray-100 border-gray-300',
      delivered: 'text-black bg-black text-white border-black',
      cancelled: 'text-black bg-gray-100 border-gray-300',
      returned: 'text-black bg-gray-100 border-gray-300',
      refunded: 'text-black bg-gray-100 border-gray-300'
    };
    return colors[status as keyof typeof colors] || 'text-black bg-gray-100 border-gray-300';
  };

  const getStatusMessage = (status: string) => {
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
    return messages[status as keyof typeof messages] || 'Order status unknown.';
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const clearOrderFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-3xl shadow-xl p-8 border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-black mb-2">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your orders.</p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-20 relative overflow-hidden">
      {/* Clean minimal background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-black text-black mb-3"
              >
                My Orders
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 text-lg"
              >
                Track and manage all your orders in one place
              </motion.p>
            </div>
            
            {showNotifications && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="relative"
              >
                <div className="relative">
                  <Bell className="h-8 w-8 text-black animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full"></div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-black">{orders.length}</p>
                </div>
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Delivered</p>
                  <p className="text-3xl font-bold text-black">{deliveredCount}</p>
                </div>
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-black">R{totalSpent.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Real-time Updates */}
        <AnimatePresence>
          {realtimeUpdates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-lg"
            >
              <h3 className="text-sm font-medium text-black mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-black animate-pulse" />
                Recent Updates
              </h3>
              <div className="space-y-2">
                {realtimeUpdates.slice(0, 3).map((update, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-gray-700 flex items-center justify-between"
                  >
                    <span>
                      <span className="font-medium text-black">{update.title}:</span> {update.message}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {update.timestamp ? new Date(update.timestamp).toLocaleTimeString() : ''}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors z-10" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all hover:border-gray-300"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SchemaOrderStatus | 'all')}
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all hover:border-gray-300 appearance-none cursor-pointer"
          >
            <option value="all" className="bg-white">All Statuses</option>
            <option value="pending" className="bg-white">Pending</option>
            <option value="confirmed" className="bg-white">Confirmed</option>
            <option value="processing" className="bg-white">Processing</option>
            <option value="shipped" className="bg-white">Shipped</option>
            <option value="delivered" className="bg-white">Delivered</option>
            <option value="returned" className="bg-white">Returned</option>
            <option value="cancelled" className="bg-white">Cancelled</option>
          </select>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <RetailEmptyState
            icon={Package}
            title={orders.length === 0 ? 'No orders yet' : 'No orders match'}
            description={
              orders.length === 0
                ? 'When you buy something, your orders and tracking will show up here.'
                : 'Try clearing search or changing the status filter.'
            }
            primaryAction={
              orders.length === 0
                ? { label: 'Start shopping', to: '/shop' }
                : { label: 'Clear search & filters', onClick: clearOrderFilters }
            }
            secondaryAction={orders.length === 0 ? { label: 'Need help?', to: '/support' } : undefined}
            surface="light"
            className="mx-auto max-w-lg"
          />
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status);
                const isHovered = hoveredOrder === order.id;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                    onHoverStart={() => setHoveredOrder(order.id)}
                    onHoverEnd={() => setHoveredOrder(null)}
                    className="group relative"
                  >
                    <div className="relative bg-white rounded-3xl border-2 border-gray-200 overflow-hidden group-hover:border-black transition-all duration-300 shadow-lg hover:shadow-xl">
                      {/* Status indicator bar */}
                      <div className={`h-1 ${order.status === 'delivered' ? 'bg-black' : 'bg-gray-300'}`}></div>
                      
                      <div className="p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          {/* Order Info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-bold text-black">
                                    Order #{order.orderNumber}
                                  </h3>
                                  <motion.div
                                    animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <Sparkles className="h-5 w-5 text-black" />
                                  </motion.div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    R{order.total.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                              
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(order.status)}`}
                              >
                                <StatusIcon className="h-4 w-4 mr-2" />
                                {order.status.replace('_', ' ').toUpperCase()}
                              </motion.span>
                            </div>

                            <p className="text-gray-700 leading-relaxed">
                              {getStatusMessage(order.status)}
                            </p>

                            {/* Order Items Preview */}
                            <div className="flex items-center gap-6">
                              <div className="flex -space-x-3">
                                {order.items.slice(0, 4).map((item, itemIndex) => (
                                  <motion.img
                                    key={itemIndex}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: itemIndex * 0.1 }}
                                    whileHover={{ scale: 1.1, zIndex: 10 }}
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="h-16 w-16 rounded-xl border-2 border-gray-200 object-cover shadow-lg hover:border-black transition-all"
                                  />
                                ))}
                                {order.items.length > 4 && (
                                  <div className="h-16 w-16 rounded-xl border-2 border-gray-200 bg-black flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">
                                      +{order.items.length - 4}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-gray-600 text-sm mb-1">
                                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </p>
                                <p className="text-xl font-bold text-black">
                                  R{order.total.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Link
                                to={`/orders/${order.id}`}
                                className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-black hover:border-black transition-all"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </motion.div>
                            
                            {order.status === 'shipped' ? (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                  to={`/orders/${order.id}`}
                                  className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg"
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track Order
                                </Link>
                              </motion.div>
                            ) : order.status === 'delivered' ? (
                              <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Link
                                    to={`/orders/${order.id}`}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    View Order
                                  </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Link
                                    to={`/orders/${order.id}#feedback`}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-black hover:border-black transition-all"
                                  >
                                    <Star className="h-4 w-4 mr-2" />
                                    Review
                                  </Link>
                                </motion.div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
