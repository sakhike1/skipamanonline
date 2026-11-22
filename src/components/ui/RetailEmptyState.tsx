import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export type RetailEmptyPrimary =
  | { label: string; to: string }
  | { label: string; onClick: () => void };

export type RetailEmptySecondary =
  | { label: string; to: string }
  | { label: string; onClick: () => void };

export type RetailEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction: RetailEmptyPrimary;
  secondaryAction?: RetailEmptySecondary;
  /** `light` = shop/orders card; `hero` = wishlist-style dark translucent panel */
  surface?: 'light' | 'hero';
  className?: string;
};

function isRouterAction(
  a: RetailEmptyPrimary | RetailEmptySecondary,
): a is { label: string; to: string } {
  return 'to' in a && typeof (a as { to?: string }).to === 'string';
}

/**
 * Shared empty / no-results pattern: icon in circle, title, body copy, primary CTA (+ optional secondary).
 */
export function RetailEmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  surface = 'light',
  className = '',
}: RetailEmptyStateProps) {
  const isHero = surface === 'hero';

  const shell = isHero
    ? 'rounded-2xl border border-white/15 bg-white/5 px-6 py-12 backdrop-blur-sm sm:px-10'
    : 'rounded-2xl border border-neutral-200 bg-white px-6 py-14 shadow-sm sm:px-10';

  const iconWrap = isHero
    ? 'flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white'
    : 'flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500';

  const titleCls = isHero ? 'text-xl font-bold text-white sm:text-2xl' : 'text-lg font-bold text-neutral-900 sm:text-xl';
  const descCls = isHero ? 'text-sm leading-relaxed text-white/80 sm:text-base' : 'text-sm leading-relaxed text-neutral-600';

  const primaryBtn = isHero
    ? 'inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
    : 'inline-flex min-h-[44px] items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black';

  const secondaryBtn = isHero
    ? 'inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/35 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
    : 'inline-flex min-h-[44px] items-center justify-center rounded-full border border-neutral-300 bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black';

  const renderPrimary = () =>
    isRouterAction(primaryAction) ? (
      <Link to={primaryAction.to} className={primaryBtn}>
        {primaryAction.label}
      </Link>
    ) : (
      <button type="button" className={primaryBtn} onClick={primaryAction.onClick}>
        {primaryAction.label}
      </button>
    );

  const renderSecondary = () => {
    if (!secondaryAction) return null;
    return isRouterAction(secondaryAction) ? (
      <Link to={secondaryAction.to} className={secondaryBtn}>
        {secondaryAction.label}
      </Link>
    ) : (
      <button type="button" className={secondaryBtn} onClick={secondaryAction.onClick}>
        {secondaryAction.label}
      </button>
    );
  };

  return (
    <div className={`mx-auto w-full max-w-lg text-center ${shell} ${className}`}>
      <div className="flex flex-col items-center">
        <div className={iconWrap} aria-hidden>
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h3 className={`mt-5 ${titleCls}`}>{title}</h3>
        <p className={`mt-2 max-w-md ${descCls}`}>{description}</p>
        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          {renderPrimary()}
          {secondaryAction ? renderSecondary() : null}
        </div>
      </div>
    </div>
  );
}

export default RetailEmptyState;
