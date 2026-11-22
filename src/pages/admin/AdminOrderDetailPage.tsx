import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  User,
  MapPin,
  Bell,
  ClipboardList,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../components/ui/ToastProvider';
import { supabase } from '../../lib/supabase';
import type { OrderStatus, PaymentStatus } from '../../types/legacyApi';
import {
  addFollowUpNote,
  confirmOrderPayment,
  fetchAdminOrderById,
  fetchOrderEvents,
  type MappedAdminOrder,
  type OrderEventRow,
  updateAdminOrderFields,
  updateOrderLifecycle,
  updateOrderPaymentStatus,
  upsertShipment,
} from '../../services/adminOrders';

const PAYMENT_STATUSES: PaymentStatus[] = [
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
];

const STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
];

async function getAuthAdminId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

const AdminOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { showToast } = useToast();

  const [order, setOrder] = useState<MappedAdminOrder | null>(null);
  const [events, setEvents] = useState<OrderEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [notifyOnStatus, setNotifyOnStatus] = useState(true);
  const [notifyOnPayment, setNotifyOnPayment] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [savingStatus, setSavingStatus] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [savingShipment, setSavingShipment] = useState(false);

  const [followUp, setFollowUp] = useState('');
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  const reload = useCallback(async () => {
    if (!supabase || !orderId) return;
    setLoading(true);
    setError(null);
    try {
      const o = await fetchAdminOrderById(supabase, orderId);
      if (!o) {
        setOrder(null);
        setEvents([]);
        setError('Order not found.');
        return;
      }
      setOrder(o);
      setNewStatus(o.status);
      setPaymentStatus(o.paymentStatus);
      setAdminNotes(o.adminNotes ?? '');
      setCarrier(o.shipment?.carrier ?? '');
      setTracking(o.shipment?.tracking_number ?? '');
      const ev = await fetchOrderEvents(supabase, orderId);
      setEvents(ev);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!supabase || !orderId) return () => {};
    const ch = supabase
      .channel(`admin-order-${orderId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        () => {
          void reload();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [orderId, reload]);

  const handleConfirmPayment = async () => {
    if (!supabase || !order) return;
    setConfirmingPayment(true);
    try {
      const adminId = await getAuthAdminId();
      await confirmOrderPayment(supabase, order, adminId, notifyOnPayment);
      showToast('Payment marked as paid.', 'success');
      await reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not confirm payment', 'error');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleSavePaymentStatus = async () => {
    if (!supabase || !order) return;
    if (paymentStatus === order.paymentStatus) {
      showToast('Payment status unchanged.', 'info');
      return;
    }
    setSavingPayment(true);
    try {
      const adminId = await getAuthAdminId();
      await updateOrderPaymentStatus(supabase, order, paymentStatus, adminId, notifyOnPayment);
      showToast('Payment status updated.', 'success');
      await reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not update payment', 'error');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleSaveStatus = async () => {
    if (!supabase || !order) return;
    if (newStatus === order.status && (adminNotes ?? '') === (order.adminNotes ?? '')) {
      showToast('No changes to save.', 'info');
      return;
    }
    setSavingStatus(true);
    try {
      const adminId = await getAuthAdminId();
      await updateOrderLifecycle(supabase, {
        order,
        newStatus,
        adminNotes,
        notifyCustomer: notifyOnStatus,
        adminUserId: adminId,
      });
      showToast('Order updated.', 'success');
      await reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Update failed', 'error');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveShipment = async () => {
    if (!supabase || !order) return;
    setSavingShipment(true);
    try {
      await upsertShipment(supabase, order.id, order.shipment?.id ?? null, {
        tracking_number: tracking,
        carrier,
        status: 'in_transit',
      });
      showToast('Shipping details saved.', 'success');
      await reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not save shipment', 'error');
    } finally {
      setSavingShipment(false);
    }
  };

  const handleShippedQuick = async () => {
    if (!supabase || !order) return;
    setSavingStatus(true);
    try {
      const adminId = await getAuthAdminId();
      await upsertShipment(supabase, order.id, order.shipment?.id ?? null, {
        tracking_number: tracking,
        carrier,
        status: 'in_transit',
      });
      const fresh = await fetchAdminOrderById(supabase, order.id);
      if (!fresh) throw new Error('Order disappeared');
      await updateOrderLifecycle(supabase, {
        order: fresh,
        newStatus: 'shipped',
        adminNotes,
        notifyCustomer: notifyOnStatus,
        adminUserId: adminId,
      });
      showToast('Marked as shipped and customer notified (if enabled).', 'success');
      await reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not mark shipped', 'error');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveInternalNotesOnly = async () => {
    if (!supabase || !order) return;
    try {
      await updateAdminOrderFields(supabase, order.id, { admin_notes: adminNotes });
      showToast('Internal notes saved.', 'success');
      await reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Save failed', 'error');
    }
  };

  const handleFollowUp = async () => {
    if (!supabase || !order || !followUp.trim()) return;
    setSavingFollowUp(true);
    try {
      const adminId = await getAuthAdminId();
      await addFollowUpNote(supabase, order.id, followUp.trim(), adminId);
      setFollowUp('');
      showToast('Follow-up note recorded.', 'success');
      await reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not save note', 'error');
    } finally {
      setSavingFollowUp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-zinc-400 text-sm">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        Loading order…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <p className="text-red-300 text-sm">{error ?? 'Not found'}</p>
        <Link to="/admin/orders" className="text-violet-400 text-sm font-medium hover:text-violet-300">
          ← Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-3"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Orders
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tight">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Placed {new Date(order.createdAt).toLocaleString()} · Order ID{' '}
            <span className="text-zinc-400 select-all">{order.id}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
            Fulfillment: <span className="ml-1 font-semibold text-white">{order.status.replace(/_/g, ' ')}</span>
          </span>
          <span className="inline-flex items-center rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
            Payment:{' '}
            <span className="ml-1 font-semibold text-white">{order.paymentStatus}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-violet-400" aria-hidden />
            Customer
          </h2>
          <dl className="text-sm space-y-2 text-zinc-300">
            <div>
              <dt className="text-zinc-500 text-xs uppercase tracking-wider">Name</dt>
              <dd>
                {order.user.firstName} {order.user.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 text-xs uppercase tracking-wider">User ID</dt>
              <dd className="font-mono text-xs break-all text-zinc-400">{order.userId}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 text-xs uppercase tracking-wider">Phone</dt>
              <dd>{order.shippingAddress.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 text-xs uppercase tracking-wider">Email</dt>
              <dd className="break-all">
                {order.user.email && order.user.email !== '—' ? (
                  <a href={`mailto:${order.user.email}`} className="text-violet-300 hover:text-violet-200">
                    {order.user.email}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="lg:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden />
            Payment
          </h2>
          <p className="text-sm text-zinc-400">
            Set payment status for bank transfers, refunds, or corrections. Customers can be notified in-app when
            enabled.
          </p>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Payment status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white"
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={notifyOnPayment}
              onChange={(e) => setNotifyOnPayment(e.target.checked)}
              className="rounded border-zinc-600"
            />
            Notify customer on payment update
          </label>
          <button
            type="button"
            disabled={savingPayment || paymentStatus === order.paymentStatus}
            onClick={() => void handleSavePaymentStatus()}
            className="w-full rounded-xl border border-zinc-700 hover:border-zinc-500 text-sm font-medium py-2.5 text-zinc-200 disabled:opacity-40"
          >
            {savingPayment ? 'Saving…' : 'Save payment status'}
          </button>
          <button
            type="button"
            disabled={order.paymentStatus === 'paid' || confirmingPayment}
            onClick={() => void handleConfirmPayment()}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 transition-colors"
          >
            {confirmingPayment ? 'Saving…' : order.paymentStatus === 'paid' ? 'Already paid' : 'Quick: mark paid'}
          </button>
        </section>

        <section className="lg:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Truck className="h-4 w-4 text-cyan-400" aria-hidden />
            Shipping
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Carrier</label>
              <input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white"
                placeholder="e.g. The Courier Guy"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Tracking number</label>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white font-mono"
                placeholder="Tracking / waybill"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSaveShipment()}
              disabled={savingShipment}
              className="w-full rounded-xl border border-zinc-700 hover:border-zinc-500 text-sm font-medium py-2.5 text-zinc-200"
            >
              {savingShipment ? 'Saving…' : 'Save tracking'}
            </button>
            <button
              type="button"
              onClick={() => void handleShippedQuick()}
              disabled={savingStatus}
              className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2.5"
            >
              Save tracking & mark shipped
            </button>
            {(order.shipment?.shipped_at || order.shipment?.delivered_at) && (
              <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
                {order.shipment?.shipped_at ? (
                  <p>
                    <span className="text-zinc-500">Shipped at:</span>{' '}
                    {new Date(order.shipment.shipped_at).toLocaleString()}
                  </p>
                ) : null}
                {order.shipment?.delivered_at ? (
                  <p>
                    <span className="text-zinc-500">Delivered at:</span>{' '}
                    {new Date(order.shipment.delivered_at).toLocaleString()}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <MapPin className="h-4 w-4 text-amber-400" aria-hidden />
          Shipping address
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          <br />
          {order.shippingAddress.address1}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          <br />
          {order.shippingAddress.country}
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Package className="h-4 w-4 text-violet-400" aria-hidden />
          Line items
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-zinc-500 text-xs uppercase text-left border-b border-zinc-800">
              <tr>
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Qty</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 text-right">Line total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {order.items.map((line) => (
                <tr key={`${line.productId}-${line.size}-${line.color.name}`}>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-white">{line.productName}</div>
                    <div className="text-xs text-zinc-500">{line.color.name}</div>
                  </td>
                  <td className="py-3 pr-4 text-zinc-300">{line.quantity}</td>
                  <td className="py-3 pr-4 text-zinc-300">{line.size}</td>
                  <td className="py-3 text-right text-white font-medium">
                    R{(line.total / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end border-t border-zinc-800 pt-4">
          <div className="text-right">
            <div className="text-xs text-zinc-500">Order total</div>
            <div className="text-xl font-bold text-white">R{order.totalRand.toFixed(2)}</div>
          </div>
        </div>
        {order.notes ? (
          <div className="text-sm text-zinc-400">
            <span className="text-zinc-500">Checkout notes: </span>
            {order.notes}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-violet-400" aria-hidden />
          Fulfillment status & customer alert
        </h2>
        <p className="text-sm text-zinc-400">
          Updates the order for the shopper&apos;s account and order tracking. Check “Notify customer” to insert an
          in-app notification (bell icon in the store).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">New status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 md:mt-6">
            <input
              type="checkbox"
              checked={notifyOnStatus}
              onChange={(e) => setNotifyOnStatus(e.target.checked)}
              className="rounded border-zinc-600"
            />
            Notify customer about this status change
          </label>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Internal notes (team only)</label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
            placeholder="Packing details, calls made, refund discussions…"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleSaveInternalNotesOnly()}
              className="text-xs font-medium px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500"
            >
              Save notes only
            </button>
            <button
              type="button"
              disabled={savingStatus}
              onClick={() => void handleSaveStatus()}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40"
            >
              {savingStatus ? 'Saving…' : 'Apply status & notes'}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-zinc-400" aria-hidden />
          Follow-up & timeline
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="Log a follow-up (visible to admins in timeline)"
            className="flex-1 rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white"
          />
          <button
            type="button"
            disabled={savingFollowUp || !followUp.trim()}
            onClick={() => void handleFollowUp()}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium px-4 py-2 text-white disabled:opacity-40"
          >
            {savingFollowUp ? 'Saving…' : 'Add note'}
          </button>
        </div>
        <div className="border-t border-zinc-800 pt-4 space-y-3 max-h-72 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-sm text-zinc-500">No timeline events yet. Apply the SQL migration for full audit history.</p>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="text-sm border-l-2 border-violet-500/40 pl-3 py-1">
                <div className="text-zinc-500 text-xs">
                  {new Date(ev.created_at).toLocaleString()} · {ev.event_type.replace(/_/g, ' ')}
                </div>
                {ev.from_status && ev.to_status ? (
                  <div className="text-zinc-300 mt-1">
                    {ev.from_status} → {ev.to_status}
                  </div>
                ) : null}
                {ev.message ? <div className="text-zinc-400 mt-1">{ev.message}</div> : null}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminOrderDetailPage;
