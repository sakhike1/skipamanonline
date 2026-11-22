import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, Eye, Clock, CheckCircle, Truck, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { fetchAdminOrders, type MappedAdminOrder } from '../../services/adminOrders';
import type { OrderStatus } from '../../types/legacyApi';

const STATUS_FILTERS: Array<OrderStatus | 'all'> = [
  'all',
  'pending',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const PAYMENT_FILTERS = ['all', 'needs_attention', 'paid'] as const;

function statusBadge(status: OrderStatus) {
  const map: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    confirmed: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    processing: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
    packed: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    shipped: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
    out_for_delivery: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
    delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    cancelled: 'bg-red-500/15 text-red-300 border-red-500/25',
    returned: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25',
    refunded: 'bg-pink-500/15 text-pink-300 border-pink-500/25',
  };
  return map[status] ?? 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25';
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<MappedAdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<(typeof PAYMENT_FILTERS)[number]>('all');

  const load = useCallback(async () => {
    if (!supabase) {
      setError('Database is not configured.');
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const list = await fetchAdminOrders(supabase);
      setOrders(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!supabase) return () => {};
    const ch = supabase
      .channel('admin-orders-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        void load();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [load]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const ps = String(o.paymentStatus || '').toLowerCase();
      const matchesPayment =
        paymentFilter === 'all'
          ? true
          : paymentFilter === 'paid'
            ? ps === 'paid'
            : ps !== 'paid';
      const hay = [
        o.orderNumber,
        o.user.firstName,
        o.user.lastName,
        o.user.email,
        o.shippingAddress.phone,
        o.id,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !q || hay.includes(q);
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-zinc-500 text-sm">
        Loading orders…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Orders</h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
            Search by order number, customer, or phone. Open an order to confirm payment, set fulfillment status, and
            notify the customer.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="self-start text-xs font-medium text-violet-400 hover:text-violet-300 px-3 py-2 rounded-lg border border-violet-500/30"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="lg:w-56 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as (typeof PAYMENT_FILTERS)[number])}
          className="lg:w-56 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
        >
          <option value="all">All payments</option>
          <option value="needs_attention">Needs payment confirm</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/20">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.map((o, index) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  className="hover:bg-zinc-800/30"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-violet-300">{o.orderNumber}</span>
                    <div className="text-xs text-zinc-500">{o.items.length} item(s)</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">
                      {o.user.firstName} {o.user.lastName}
                    </div>
                    <div className="text-xs text-zinc-500">{o.shippingAddress.phone || '—'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={[
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium',
                        o.paymentStatus === 'paid'
                          ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                          : 'border-amber-500/30 text-amber-300 bg-amber-500/10',
                      ].join(' ')}
                    >
                      {o.paymentStatus === 'paid' ? (
                        <CheckCircle className="h-3 w-3" aria-hidden />
                      ) : (
                        <DollarSign className="h-3 w-3" aria-hidden />
                      )}
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={[
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium',
                        statusBadge(o.status),
                      ].join(' ')}
                    >
                      {o.status === 'pending' ? (
                        <Clock className="h-3 w-3" aria-hidden />
                      ) : o.status === 'shipped' || o.status === 'out_for_delivery' ? (
                        <Truck className="h-3 w-3" aria-hidden />
                      ) : (
                        <Package className="h-3 w-3" aria-hidden />
                      )}
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-white font-semibold">
                    R{o.totalRand.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-400">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs font-semibold"
                    >
                      <Eye className="h-4 w-4" aria-hidden />
                      View
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-zinc-500 text-sm">No orders match your filters.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
