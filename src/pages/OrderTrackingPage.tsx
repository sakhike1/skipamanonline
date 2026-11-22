import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabase';
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

  const loadOrderDetails = useCallback(async () => {
    if (!orderId || !supabase || !user?.id) return;
    try {
      setLoading(true);
      setError(null);

      const { data: row, error: qErr } = await supabase
        .from('orders')
        .select(
          `
          id,
          status,
          total_amount,
          created_at,
          notes,
          order_number,
          order_items (
            quantity,
            size,
            colour,
            unit_price,
            products ( name, image_urls )
          ),
          shipments (
            tracking_number,
            carrier,
            status,
            estimated_delivery,
            shipped_at,
            delivered_at
          )
        `,
        )
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (qErr) throw qErr;
      if (!row) {
        setError('Order not found');
        setOrder(null);
        return;
      }

      const r = row as Record<string, unknown>;
      const itemsRaw = r.order_items as
        | Array<{
            quantity: number;
            size: string | null;
            colour: string | null;
            unit_price: number | string;
            products: { name?: string; image_urls?: string[] | null } | null;
          }>
        | null;

      const shipmentsRaw = r.shipments as
        | Array<{
            tracking_number: string | null;
            carrier: string | null;
            status: string | null;
            estimated_delivery: string | null;
            shipped_at: string | null;
            delivered_at: string | null;
          }>
        | null;

      const id = String(r.id);
      const ref = r.order_number as string | null | undefined;
      const mapped: TrackingOrder = {
        id,
        orderNumber:
          (ref && String(ref).trim()) || id.replace(/-/g, '').slice(0, 12).toUpperCase(),
        status: String(r.status ?? 'pending'),
        total: Number(r.total_amount ?? 0),
        createdAt: String(r.created_at ?? ''),
        notes: r.notes as string | null | undefined,
        items: (itemsRaw ?? []).map((oi) => {
          const unit = Number(oi.unit_price ?? 0);
          return {
            productName: oi.products?.name ?? 'Product',
            productImage: oi.products?.image_urls?.[0] ?? '/images/grey1.png',
            quantity: oi.quantity,
            size: oi.size ?? '',
            colour: oi.colour ?? '',
            lineTotalRand: unit * oi.quantity,
          };
        }),
        shipment: shipmentsRaw?.[0]
          ? {
              tracking_number: shipmentsRaw[0].tracking_number,
              carrier: shipmentsRaw[0].carrier,
              status: shipmentsRaw[0].status,
              estimated_delivery: shipmentsRaw[0].estimated_delivery,
              shipped_at: shipmentsRaw[0].shipped_at ?? null,
              delivered_at: shipmentsRaw[0].delivered_at ?? null,
            }
          : null,
      };

      setOrder(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load order details');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId, user?.id]);

  useEffect(() => {
    void loadOrderDetails();
  }, [loadOrderDetails]);

  useEffect(() => {
    if (!supabase || !orderId || !user?.id) return () => {};

    const sb = supabase;
    const channel = sb
      .channel(`order-detail:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        () => {
          setRealtimeUpdates((prev) =>
            [
              {
                title: 'Order',
                message: 'This order was updated.',
                timestamp: new Date().toISOString(),
              },
              ...prev,
            ].slice(0, 5),
          );
          setShowNotifications(true);
          setTimeout(() => setShowNotifications(false), 4000);
          void loadOrderDetails();
        },
      )
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, [orderId, user?.id, loadOrderDetails]);

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
            — we reply on tickets so nothing gets lost in social DMs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
