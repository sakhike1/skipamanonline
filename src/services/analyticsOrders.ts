import type { SupabaseClient } from '@supabase/supabase-js';

export type MonthlyStat = {
  key: string;
  label: string;
  orders: number;
  revenueRand: number;
};

/** Last `months` calendar months including current, aggregated from orders.created_at + total_amount */
export async function fetchMonthlyOrderAnalytics(
  supabase: SupabaseClient,
  months = 12,
): Promise<MonthlyStat[]> {
  const { data, error } = await supabase.from('orders').select('created_at, total_amount');
  if (error) throw error;

  const now = new Date();
  const buckets: MonthlyStat[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    buckets.push({ key, label, orders: 0, revenueRand: 0 });
  }

  const bucketIndex = new Map(buckets.map((b, idx) => [b.key, idx]));

  for (const row of data ?? []) {
    const cr = row as { created_at?: string; total_amount?: number };
    const t = new Date(cr.created_at ?? '');
    if (Number.isNaN(t.getTime())) continue;
    const key = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}`;
    const idx = bucketIndex.get(key);
    if (idx === undefined) continue;
    buckets[idx].orders += 1;
    buckets[idx].revenueRand += Number(cr.total_amount ?? 0);
  }

  return buckets;
}
