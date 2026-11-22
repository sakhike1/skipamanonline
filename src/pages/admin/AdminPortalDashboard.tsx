import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, DollarSign, TrendingUp, Calendar, AlertCircle, Truck, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { computeDashboardStats, type DashboardStats } from '../../services/adminOrders';
import { countNewsletterSubscribers } from '../../services/adminNewsletter';

const AdminPortalDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Database is not configured.');
      return;
    }
    void (async () => {
      try {
        setError(null);
        const [s, subs] = await Promise.all([
          computeDashboardStats(supabase),
          countNewsletterSubscribers(supabase).catch(() => null),
        ]);
        setStats(s);
        setSubscriberCount(subs);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load stats');
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-zinc-500 text-sm">
        Loading overview…
      </div>
    );
  }

  const cards = [
    {
      label: 'Total orders',
      value: stats.totalOrders,
      icon: Package,
      hint: 'All time',
    },
    {
      label: 'Revenue',
      value: `R${stats.totalRevenueRand.toFixed(2)}`,
      icon: DollarSign,
      hint: 'Sum of order totals',
    },
    {
      label: 'Avg order',
      value: `R${stats.averageOrderValueRand.toFixed(2)}`,
      icon: TrendingUp,
      hint: 'Mean basket',
    },
    {
      label: 'Today',
      value: stats.todayOrders,
      sub: `R${stats.todayRevenueRand.toFixed(2)}`,
      icon: Calendar,
      hint: 'Orders placed today',
    },
    {
      label: 'Pending payment',
      value: stats.pendingPayment,
      icon: AlertCircle,
      hint: 'Confirm in Orders',
      tone: 'amber' as const,
    },
    {
      label: 'Prep / pack queue',
      value: stats.toShip,
      icon: Truck,
      hint: 'Confirmed → packed',
      tone: 'violet' as const,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-white tracking-tight"
        >
          Operations overview
        </motion.h1>
        <p className="mt-2 text-zinc-400 text-sm max-w-2xl">
          Fulfillment queue, revenue snapshot, and shortcuts to orders. Customer alerts fire when you update status and
          choose “Notify customer”.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={[
              'rounded-2xl border p-5 bg-zinc-900/40',
              c.tone === 'amber'
                ? 'border-amber-500/20'
                : c.tone === 'violet'
                  ? 'border-violet-500/20'
                  : 'border-zinc-800',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{c.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{c.value}</p>
                {'sub' in c && c.sub ? <p className="text-sm text-zinc-400 mt-1">{c.sub}</p> : null}
                <p className="text-xs text-zinc-500 mt-2">{c.hint}</p>
              </div>
              <div className="p-2 rounded-xl bg-zinc-800/80">
                <c.icon className="h-5 w-5 text-violet-400" aria-hidden />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <Link
          to="/admin/orders"
          className="inline-flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-3 transition-colors"
        >
          Open orders
        </Link>
        <Link
          to="/admin/tickets"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-sm font-medium px-5 py-3 transition-colors"
        >
          Tickets
        </Link>
        <Link
          to="/admin/analytics"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-sm font-medium px-5 py-3 transition-colors"
        >
          Analytics
        </Link>
        <Link
          to="/admin/subscribers"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-sm font-medium px-5 py-3 transition-colors"
        >
          Newsletter
          {subscriberCount != null ? ` (${subscriberCount})` : ''}
        </Link>
        <Link
          to="/admin/announcements"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-sm font-medium px-5 py-3 transition-colors"
        >
          Announcements
        </Link>
      </motion.div>

      {subscriberCount != null ? (
        <p className="text-xs text-zinc-500 flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-violet-400" aria-hidden />
          {subscriberCount} active newsletter signup{subscriberCount === 1 ? '' : 's'}
        </p>
      ) : null}
    </div>
  );
};

export default AdminPortalDashboard;
