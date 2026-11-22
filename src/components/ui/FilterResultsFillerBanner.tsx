import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';

export interface FilterResultsFillerBannerProps {
  resultCount: number;
  onClearFilters: () => void;
  secondaryCta?: { label: string; onClick: () => void };
  /** Pass `mt-8 flex-1 basis-0 min-h-[12rem]` so slack below the grid is absorbed. */
  className?: string;
}

/**
 * When filters are active and the product grid is short, the parent column gives this block
 * `flex-1`; we keep the *card* modest and vertically centred so it never reads as a huge void.
 */
const FilterResultsFillerBanner: React.FC<FilterResultsFillerBannerProps> = ({
  resultCount,
  onClearFilters,
  secondaryCta,
  className = '',
}) => {
  const headline =
    resultCount === 1 ? 'One piece matches your filters' : `${resultCount} pieces match your filters`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col justify-center py-1 ${className}`}
    >
      <div className="mx-auto w-full max-w-[22rem] sm:max-w-[26rem] rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 text-left">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700"
              aria-hidden
            >
              <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">Your filters</p>
              <p className="text-base font-bold leading-snug tracking-tight text-neutral-950">{headline}</p>
              <p className="text-xs leading-relaxed text-neutral-600">
                Widen the price range or clear filters to see more products here.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Clear filters
            </button>
            {secondaryCta && (
              <button
                type="button"
                onClick={secondaryCta.onClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                {secondaryCta.label}
                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterResultsFillerBanner;
