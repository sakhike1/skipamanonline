import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type Variant = 'light' | 'dark';

type Props = {
  children: ReactNode;
  /** Stagger order on the home page (seconds). */
  delay?: number;
  /** Accent line under “wow” sections: light bg vs dark bg. */
  variant?: Variant;
  className?: string;
};

const accent: Record<Variant, string> = {
  light: 'from-transparent via-black/25 to-transparent',
  dark: 'from-transparent via-white/30 to-transparent',
};

/**
 * Scroll-triggered entrance for home sections below the hero.
 * Keeps implementation simple: one motion wrapper + a thin gradient accent.
 */
export function HomeSectionReveal({ children, delay = 0, variant = 'light', className = '' }: Props) {
  // On some small-screen browsers, IntersectionObserver + whileInView can fail to trigger,
  // leaving sections stuck at opacity:0. We disable reveal animation on mobile to guarantee visibility.
  const [enableMotion, setEnableMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setEnableMotion(!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (!enableMotion) {
    return (
      <div className={`relative w-full ${className}`}>
        <div
          className={`pointer-events-none absolute left-1/2 top-0 z-10 h-px w-28 -translate-x-1/2 bg-gradient-to-r md:w-40 ${accent[variant]}`}
        />
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`relative w-full ${className}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className={`pointer-events-none absolute left-1/2 top-0 z-10 h-px w-28 -translate-x-1/2 bg-gradient-to-r md:w-40 ${accent[variant]}`}
        initial={{ opacity: 0, scaleX: 0.3 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, delay: delay + 0.08, ease: [0.22, 1, 0.36, 1] }}
      />
      {children}
    </motion.div>
  );
}
