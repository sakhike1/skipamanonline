import React from 'react';
import { motion } from 'framer-motion';

/** Matches ShopHeroSection: soft left wash + floating “star” dots (no random layout per render). */
const PARTICLES: { left: number; top: number; base: number; duration: number; delay: number }[] = [
  { left: 6, top: 14, base: 0.38, duration: 4.1, delay: 0.1 },
  { left: 18, top: 8, base: 0.32, duration: 3.4, delay: 0.8 },
  { left: 28, top: 22, base: 0.42, duration: 4.8, delay: 0.3 },
  { left: 42, top: 11, base: 0.28, duration: 3.9, delay: 1.2 },
  { left: 55, top: 18, base: 0.36, duration: 4.4, delay: 0.5 },
  { left: 68, top: 9, base: 0.3, duration: 3.2, delay: 1.6 },
  { left: 78, top: 26, base: 0.4, duration: 4.6, delay: 0.2 },
  { left: 88, top: 16, base: 0.34, duration: 3.7, delay: 0.9 },
  { left: 12, top: 38, base: 0.26, duration: 4.2, delay: 1.1 },
  { left: 34, top: 44, base: 0.36, duration: 3.5, delay: 0.4 },
  { left: 52, top: 36, base: 0.3, duration: 4.9, delay: 1.4 },
  { left: 72, top: 42, base: 0.38, duration: 3.8, delay: 0.6 },
  { left: 91, top: 34, base: 0.32, duration: 4.0, delay: 1.0 },
  { left: 22, top: 58, base: 0.28, duration: 3.6, delay: 1.8 },
  { left: 64, top: 54, base: 0.35, duration: 4.3, delay: 0.7 },
];

const HeroAmbientEffects: React.FC = () => (
  <>
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-white/[0.03] to-transparent" />
    </div>
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.base,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.base * 0.55, Math.min(0.52, p.base * 1.35), p.base * 0.55],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  </>
);

export default HeroAmbientEffects;
