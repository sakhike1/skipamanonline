import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/CartContext';
import { ApiError } from '../lib/skipApi';
import { displayStatus, getOrder, mapItem, orderRef } from '../services/shopApi';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Calendar,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Bell,
} from 'lucide-react';

type TrackingOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  notes?: string | null;
  items: {
    productName: string;
    productImage: string;
    quantity: number;
    size: string;
    colour: string;
    lineTotalRand: number;
  }[];
  shipment: {
    tracking_number: string | null;
    carrier: string | null;
    status: string | null;
    estimated_delivery: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
  } | null;
};

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState<{ title: string; message: string; timestamp: string }[]>(
    [],
  );
  const [showNotifications, setShowNotifications] = useState(false);

  const lastStatus = React.useRef<string | null>(null);
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();

  // PayFast sends the customer back here with ?paid=1 once they finish paying
  useEffect(() => {
    if (searchParams.get('paid') === '1') {
      clearCart();
      try { sessionStorage.removeItem('skipaman:pendingOrder'); } catch { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadOrderDetails = useCallback(async (silent = false) => {
    if (!orderId || !user?.id) return;
    try {
      if (!silent) { setLoading(true); setError(null); }
      const o = await getOrder(orderId);
      const status = displayStatus(o.status);
      const hasShipment = Boolean(o.trackingNumber || o.courier || o.estimatedDeliveryTo);
      const mapped: TrackingOrder = {
        id: o.id,
        orderNumber: orderRef(o),
        status,
        total: o.totalCents / 100,
        createdAt: o.createdAt,
        notes: null,
        items: o.items.map(mapItem),
        shipment: hasShipment
          ? {
              tracking_number: o.trackingNumber ?? null,
              carrier: o.courier ?? null,
              status: status === 'delivered' ? 'delivered' : status === 'shipped' || status === 'out_for_delivery' ? 'in_transit' : null,
              estimated_delivery: o.estimatedDeliveryTo ?? null,
              shipped_at: o.history?.find((h) => h.status === 'SHIPPED')?.createdAt ?? null,
              delivered_at: o.history?.find((h) => h.status === 'DELIVERED')?.createdAt ?? null,
            }
          : null,
      };
      if (lastStatus.current && lastStatus.current !== status) {
        setRealtimeUpdates((prev) => [{ title: 'Order', message: 'This order is now: ' + status.replace(/_/g, ' '), timestamp: new Date().toISOString() }, ...prev].slice(0, 5));
        setShowNotifications(true);
        setTimeout(() => setShowNotifications(false), 4000);
      }
      lastStatus.current = status;
      setOrder(mapped);
    } catch (e) {
      if (!silent) {
        setError(e instanceof ApiError && e.status === 404 ? 'Order not found' : e instanceof Error ? e.message : 'Failed to load order details');
        setOrder(null);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [orderId, user?.id]);

  useEffect(() => {
    void loadOrderDetails();
    if (!orderId || !user?.id) return () => {};
    const timer = window.setInterval(() => void loadOrderDetails(true), 15000);
    return () => window.clearInterval(timer);
  }, [loadOrderDetails, orderId, user?.id]);

  const getStatusIcon = (status: string) => {
    const icons: Record<string, typeof Clock> = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: AlertCircle,
      returned: AlertCircle,
    };
    return icons[status] || Package;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      processing: 'text-purple-600 bg-purple-100',
      shipped: 'text-cyan-600 bg-cyan-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      returned: 'text-gray-600 bg-gray-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusMessage = (status: string) => {
    const messages: Record<string, string> = {
      pending: 'Your order is being reviewed and will be confirmed shortly.',
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being processed and will be shipped soon.',
      shipped: 'Your order has been shipped and is on its way to you.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.',
      returned: 'Your order has been returned.',
    };
    return messages[status] || 'Order status unknown.';
  };

  const getProgressPercentage = (status: string) => {
    const progress: Record<string, number> = {
      pending: 15,
      confirmed: 30,
      processing: 50,
      shipped: 80,
      delivered: 100,
      cancelled: 0,
      returned: 0,
    };
    return progress[status] ?? 10;
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
            type="button"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            type="button"
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
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
              >
                <StatusIcon className="h-4 w-4 mr-2" />
                {order.status.replace('_', ' ').toUpperCase()}
              </span>

              {showNotifications && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                  <Bell className="h-5 w-5 text-green-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                </motion.div>
              )}
            </div>
          </div>
        </div>

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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{getStatusMessage(order.status)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Summary
            </h3>
            <p className="text-sm text-gray-600">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">R{order.total.toFixed(2)}</p>
            {order.notes && (
              <p className="text-sm text-gray-500 mt-3 border-t pt-3">{order.notes}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" />
              Shipment
            </h3>
            {order.shipment ? (
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Status:</span> {order.shipment.status ?? '—'}
                </p>
                <p>
                  <span className="font-medium">Carrier:</span> {order.shipment.carrier ?? '—'}
                </p>
                <p>
                  <span className="font-medium">Tracking:</span>{' '}
                  {order.shipment.tracking_number ?? 'Not assigned yet'}
                </p>
                {order.shipment.estimated_delivery && (
                  <p>
                    <span className="font-medium">Est. delivery:</span>{' '}
                    {new Date(order.shipment.estimated_delivery).toLocaleDateString()}
                  </p>
                )}
                {order.shipment.shipped_at && (
                  <p>
                    <span className="font-medium">Shipped:</span>{' '}
                    {new Date(order.shipment.shipped_at).toLocaleString()}
                  </p>
                )}
                {order.shipment.delivered_at && (
                  <p>
                    <span className="font-medium">Delivered:</span>{' '}
                    {new Date(order.shipment.delivered_at).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Shipment details will appear when your order ships.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            Items
          </h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-600">
                    Size {item.size || '—'} · {item.colour || '—'} · Qty {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    R{item.lineTotalRand.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-purple-200 bg-purple-50/60 p-5">
          <p className="text-sm text-gray-800">
            <strong>Need help with this order?</strong> Contact{' '}
            <Link to="/support" className="font-semibold text-purple-700 underline underline-offset-2 hover:text-purple-900">
              Support
            </Link>{' '}
            and include your order number{' '}
            <span className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-xs text-gray-900">{order.orderNumber}</span>
            . We reply on tickets so nothing gets lost in social DMs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
