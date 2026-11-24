import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const allowedPaths = new Set<string>(['/', '/shop', '/new-arrivals']);

type TeaserTemplate = {
  id: string;
  image: string;
  label: string;
  title: string;
  subtitle: string;
  route: string;
};

const TEASERS: TeaserTemplate[] = [
  {
    id: 'next-drop',
    image: '/images/4.jpg',
    label: 'Next Drop',
    title: 'New graphic tee dropping next week',
    subtitle: 'Tap to preview the New Arrivals lookbook.',
    route: '/new-arrivals'
  },
  {
    id: 'monochrome-edit',
    image: '/images/5.jpg',
    label: 'Monochrome Edit',
    title: 'Black & white essentials just landed',
    subtitle: 'Basics | Graphic | Minimalist. See the full edit.',
    route: '/shop?tag=monochrome'
  },
  {
    id: 'limited-restock',
    image: '/images/3.jpg',
    label: 'Limited Restock',
    title: 'Community favourite is almost back',
    subtitle: 'Restocking this week. Don’t miss the next drop.',
    route: '/new-arrivals'
  }
];

const DropTeaserPopup: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [teaser, setTeaser] = useState<TeaserTemplate | null>(null);

  useEffect(() => {
    if (!allowedPaths.has(location.pathname)) return;

    // Pick a random teaser for this session
    const randomTeaser = TEASERS[Math.floor(Math.random() * TEASERS.length)];
    setTeaser(randomTeaser);

    // Aggressive timing: show almost immediately on each allowed route
    const minDelay = 0;     // 0s
    const maxDelay = 3000;  // 3s
    const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

    let showTimer: number | undefined;
    let hideTimer: number | undefined;

    showTimer = window.setTimeout(() => {
      setIsVisible(true);
      hideTimer = window.setTimeout(() => {
        setIsVisible(false);
      }, 12000); // stay visible ~12s
    }, delay);

    return () => {
      if (showTimer) window.clearTimeout(showTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    if (teaser) {
      navigate(teaser.route);
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && teaser && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed z-[60] bottom-4 right-4 max-w-xs w-[min(320px,100%-2rem)] md:right-6 md:bottom-6 md:w-80"
        >
          <button
            type="button"
            onClick={handleClick}
            className="group relative flex w-full items-center gap-3 rounded-2xl border border-white/15 bg-black/90 px-4 py-3 text-left shadow-[0_22px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/15 bg-white/5 flex-shrink-0">
              <img
                src={teaser.image}
                alt={teaser.label}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-400"
                loading="lazy"
              />
            </div>

            <div className="relative flex-1 min-w-0 text-white">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                <Sparkles size={12} className="text-yellow-400" />
                <span>{teaser.label}</span>
              </div>
              <p className="mt-1 text-sm font-semibold truncate">{teaser.title}</p>
              <p className="text-xs text-white/60 mt-0.5">{teaser.subtitle}</p>
            </div>

            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all duration-300 flex-shrink-0">
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-black/70 border border-white/20 text-[10px] text-white/60 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Dismiss teaser"
            >
              ×
            </button>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropTeaserPopup;
