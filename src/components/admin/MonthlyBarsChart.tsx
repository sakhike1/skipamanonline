import React, { useMemo } from 'react';
import type { MonthlyStat } from '../../services/analyticsOrders';

type Props = {
  data: MonthlyStat[];
  mode: 'revenue' | 'orders';
};

const MonthlyBarsChart: React.FC<Props> = ({ data, mode }) => {
  const maxVal = useMemo(() => {
    if (!data.length) return 1;
    return Math.max(
      1,
      ...data.map((d) => (mode === 'revenue' ? d.revenueRand : d.orders)),
    );
  }, [data, mode]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-1 sm:gap-2 h-48 border-b border-zinc-700 pb-2">
        {data.map((d) => {
          const v = mode === 'revenue' ? d.revenueRand : d.orders;
          const pct = Math.round((v / maxVal) * 100);
          return (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div className="w-full flex flex-col justify-end h-40 bg-zinc-900/50 rounded-t overflow-hidden">
                <div
                  className={
                    mode === 'revenue'
                      ? 'w-full bg-gradient-to-t from-violet-900 to-violet-500 transition-all'
                      : 'w-full bg-gradient-to-t from-cyan-900 to-cyan-500 transition-all'
                  }
                  style={{ height: `${pct}%`, minHeight: v > 0 ? '8%' : '0' }}
                  title={`${d.label}: ${mode === 'revenue' ? `R${v.toFixed(2)}` : `${v} orders`}`}
                />
              </div>
              <span className="text-[10px] sm:text-xs text-zinc-500 truncate max-w-full text-center">{d.label}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500">
        {mode === 'revenue'
          ? 'Monthly revenue (sum of order totals in ZAR).'
          : 'Orders counted by month placed (created_at).'}
      </p>
    </div>
  );
};

export default MonthlyBarsChart;
