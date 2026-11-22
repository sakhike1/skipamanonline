import React, { useEffect, useState } from 'react';
import { TrendingUp, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { fetchMonthlyOrderAnalytics, type MonthlyStat } from '../../services/analyticsOrders';
import MonthlyBarsChart from '../../components/admin/MonthlyBarsChart';

const AdminAnalyticsPage: React.FC = () => {
  const [series, setSeries] = useState<MonthlyStat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Database not configured.');
      return;
    }
    void (async () => {
      try {
        setError(null);
        const s = await fetchMonthlyOrderAnalytics(supabase, 12);
        setSeries(s);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load analytics');
      }
    })();
  }, []);

  const totals = series.reduce(
    (acc, m) => {
      acc.orders += m.orders;
      acc.revenue += m.revenueRand;
      return acc;
    },
    { orders: 0, revenue: 0 },
  );

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
          Rolling 12 months from your Supabase orders: revenue and order volume per calendar month.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-violet-500/15">
            <TrendingUp className="h-6 w-6 text-violet-400" aria-hidden />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">12-month revenue</p>
            <p className="mt-1 text-2xl font-semibold text-white">R{totals.revenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-cyan-500/15">
            <Package className="h-6 w-6 text-cyan-400" aria-hidden />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">12-month orders</p>
            <p className="mt-1 text-2xl font-semibold text-white">{totals.orders}</p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Revenue by month</h2>
        <MonthlyBarsChart data={series} mode="revenue" />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Orders by month</h2>
        <MonthlyBarsChart data={series} mode="orders" />
      </section>
    </div>
  );
};

export default AdminAnalyticsPage;
