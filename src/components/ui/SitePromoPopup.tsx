import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Truck, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../../utils/constants';

/**
 * Site promo card. Everything the visitor reads comes from this one object, so changing the
 * offer means editing it here. Only put a real discount code in `code` once it exists in checkout.
 *
 * It is a small floating card, not a modal: nothing is dimmed or blurred, the page and header
 * stay normal, and it closes itself after `visibleForMs` (paused while the mouse or keyboard is on it).
 */
const PROMO = {
  /** Bump this to show the card again to people who already saw an older one. */
  id: 'free-delivery-v2',
  eyebrow: 'Skipaman offer',
  headline: 'Free delivery',
  body: `On every order over R${APP_CONFIG.FREE_SHIPPING_MIN_ZAR}, with tracking on every shipment.`,
  cta: { label: 'Shop now', to: '/shop' },
  code: null as string | null,
  showAfterMs: 6000,
  visibleForMs: 10000,
  /** How long to leave people alone once they have seen it. */
  hideForHours: 24,
} as const;

const STORAGE_KEY = 'skipaman_promo_popup';
const HIDDEN_PREFIXES = ['/admin', '/checkout', '/login', '/register', '/cart'];

const wasRecentlySeen = (): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw) as { id?: string; at?: number };
    return saved.id === PROMO.id && Date.now() - (saved.at ?? 0) < PROMO.hideForHours * 3600 * 1000;
  } catch {
    return false;
  }
};

const rememberSeen = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: PROMO.id, at: Date.now() }));
  } catch {
    /* private mode: the card may show again, which is fine */
  }
};

const SitePromoPopup: React.FC = () => {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  const blocked = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Appear by itself after a short delay, on pages where it makes sense
  useEffect(() => {
    if (blocked || wasRecentlySeen()) return;
    const t = window.setTimeout(() => {
      rememberSeen();
      setOpen(true);
    }, PROMO.showAfterMs);
    return () => window.clearTimeout(t);
  }, [blocked]);

  const close = useCallback(() => setOpen(false), []);

  // Esc closes it early
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && !blocked && (
        <motion.aside
          role="complementary"
          aria-labelledby="promo-popup-heading"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="promo-pop group fixed bottom-4 left-4 right-4 z-[90] overflow-hidden rounded-[1.75rem] border border-[#211527]/10 bg-white text-[#211527] shadow-[0_30px_80px_-30px_rgba(33,21,39,0.55)] sm:right-auto sm:w-[22rem]"
        >
          <style>{`
            .promo-pop-bg {
              background-image: linear-gradient(115deg, #ffd4c4, #fad0e1, #f2ceff, #cfdcff, #ffd4c4);
              background-size: 300% 300%;
              animation: promo-pop-shift 12s ease-in-out infinite;
            }
            @keyframes promo-pop-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
            @keyframes promo-pop-timer { from { transform: scaleX(1); } to { transform: scaleX(0); } }
            .promo-pop-timer { transform-origin: left; animation: promo-pop-timer ${PROMO.visibleForMs}ms linear forwards; }
            .promo-pop:hover .promo-pop-timer, .promo-pop:focus-within .promo-pop-timer { animation-play-state: paused; }
            @media (prefers-reduced-motion: reduce) {
              .promo-pop-bg { animation: none; }
              .promo-pop-timer { opacity: 0; }
            }
          `}</style>

          <button
            type="button"
            onClick={close}
            aria-label="Close offer"
            className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-[#211527] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]"
          >
            <X size={16} aria-hidden />
          </button>

          <div className="promo-pop-bg px-6 pb-6 pt-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#211527] text-white">
                <Truck size={18} aria-hidden />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6b4a7a]">{PROMO.eyebrow}</p>
            </div>
            <h2
              id="promo-popup-heading"
              className="mt-4 text-[2.6rem] font-black leading-[0.92] tracking-[-0.05em]"
            >
              {PROMO.headline}
            </h2>
            <p className="mt-2 max-w-[17rem] text-sm leading-relaxed text-[#513a5c]">{PROMO.body}</p>
            {PROMO.code && (
              <p className="mt-3 inline-flex rounded-full border border-dashed border-[#211527]/40 bg-white/60 px-4 py-1 text-sm font-bold tracking-widest">
                {PROMO.code}
              </p>
            )}
          </div>

          <div className="px-6 pb-5 pt-4">
            <Link
              to={PROMO.cta.to}
              onClick={close}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#211527] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#33203f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]"
            >
              {PROMO.cta.label}
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>

          {/* Time left: when it runs out, the card closes itself */}
          <div className="h-1 w-full bg-[#211527]/10" aria-hidden>
            <div className="promo-pop-timer h-full bg-[#211527]" onAnimationEnd={close} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default SitePromoPopup;
