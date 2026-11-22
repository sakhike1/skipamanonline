import React from 'react';
import { motion } from 'framer-motion';
import { TRUST_INDICATORS, APP_CONFIG } from '../../utils/constants';
import { Zap, RotateCcw, Shield, Users, Star, Headphones, type LucideIcon } from 'lucide-react';

const featureBlocks: {
  title: string;
  body: string;
  Icon: LucideIcon;
  accent: 'emerald' | 'sky' | 'violet';
}[] = [
  {
    title: 'Fast delivery',
    body: `Most orders arrive within ${APP_CONFIG.DELIVERY_TIMEFRAME}. Free delivery on orders over R${APP_CONFIG.FREE_SHIPPING_MIN_ZAR}, with tracking on every shipment.`,
    Icon: Zap,
    accent: 'emerald',
  },
  {
    title: 'Easy returns',
    body: `${APP_CONFIG.RETURN_WINDOW_DAYS}-day hassle-free returns. If something is not right, send it back for a full refund or an exchange—no runaround.`,
    Icon: RotateCcw,
    accent: 'sky',
  },
  {
    title: 'Secure refunds',
    body: `Encrypted checkout and protected payments. Approved refunds are processed within ${APP_CONFIG.REFUND_PROCESSING}—your money is always in good hands.`,
    Icon: Shield,
    accent: 'violet',
  },
];

const accentMap = {
  emerald: {
    ring: 'hover:border-emerald-400/35 focus-visible:border-emerald-400/50',
    iconWrap:
      'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/40',
    glow: 'from-emerald-500/20 via-transparent to-transparent',
  },
  sky: {
    ring: 'hover:border-sky-400/35 focus-visible:border-sky-400/50',
    iconWrap: 'bg-gradient-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-900/40',
    glow: 'from-sky-500/20 via-transparent to-transparent',
  },
  violet: {
    ring: 'hover:border-violet-400/35 focus-visible:border-violet-400/50',
    iconWrap:
      'bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-900/40',
    glow: 'from-violet-500/20 via-transparent to-transparent',
  },
} as const;

const statBlocks: {
  value: string;
  label: string;
  hint: string;
  Icon: LucideIcon;
  iconClass: string;
}[] = [
  {
    value: TRUST_INDICATORS.HAPPY_CUSTOMERS,
    label: 'Happy customers',
    hint: 'Growing community of Skipaman fans',
    Icon: Users,
    iconClass: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-900/30',
  },
  {
    value: TRUST_INDICATORS.SATISFACTION_RATE,
    label: 'Satisfaction rate',
    hint: 'Based on post-purchase feedback',
    Icon: Star,
    iconClass: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-900/30',
  },
  {
    value: TRUST_INDICATORS.SUPPORT_AVAILABILITY,
    label: 'Customer support',
    hint: 'Help when you need it',
    Icon: Headphones,
    iconClass: 'bg-gradient-to-br from-sky-500 to-cyan-600 shadow-sky-900/30',
  },
];

export const CustomerAssuranceSection: React.FC = () => {
  return (
    <div className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-pink-600/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-gradient-to-r from-emerald-600/12 via-cyan-600/12 to-blue-600/12 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-14 md:mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-md mb-6">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" aria-hidden />
            <span className="text-xs font-semibold text-white/90 uppercase tracking-[0.2em]">
              Trusted by thousands
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08] mb-5">
            Join our{' '}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              happy customers
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-normal">
            Real quality, fair policies, and support that shows up—see why shoppers keep coming back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto mb-14 md:mb-16">
          {featureBlocks.map(({ title, body, Icon, accent }, index) => {
            const a = accentMap[accent];
            return (
              <motion.article
                key={title}
                className="group relative h-full"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div
                  className={`relative h-full flex flex-col p-7 md:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-colors duration-300 ${a.ring}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${a.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`relative shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${a.iconWrap}`}
                    >
                      <Icon className="w-7 h-7 text-white relative z-10" strokeWidth={2} aria-hidden />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-snug pt-1">{title}</h3>
                  </div>
                  <p className="text-[15px] md:text-base text-gray-400 leading-relaxed flex-1">{body}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.07] via-purple-600/[0.06] to-pink-600/[0.07]" />
            <div className="relative grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {statBlocks.map(({ value, label, hint, Icon, iconClass }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center px-8 py-10 md:py-12"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 ${iconClass} shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} aria-hidden />
                  </div>
                  <p className="text-4xl md:text-[2.75rem] font-black text-white tabular-nums tracking-tight mb-1">
                    {value}
                  </p>
                  <p className="text-sm font-semibold text-white/90 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-xs text-gray-500 max-w-[14rem] leading-snug">{hint}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
