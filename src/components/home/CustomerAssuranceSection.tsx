import React from 'react';
import { motion } from 'framer-motion';
import { TRUST_INDICATORS, APP_CONFIG } from '../../utils/constants';
import { Zap, RotateCcw, Shield, Users, Star, Headphones, type LucideIcon } from 'lucide-react';

const featureBlocks: {
  title: string;
  body: string;
  Icon: LucideIcon;
  tone: string;
}[] = [
  {
    title: 'Fast delivery',
    body: `Most orders arrive within ${APP_CONFIG.DELIVERY_TIMEFRAME}. Free delivery on orders over R${APP_CONFIG.FREE_SHIPPING_MIN_ZAR}, with tracking on every shipment.`,
    Icon: Zap,
    tone: 'bg-[#ffd4c4]',
  },
  {
    title: 'Easy returns',
    body: `${APP_CONFIG.RETURN_WINDOW_DAYS}-day hassle-free returns. If something is not right, send it back for a full refund or an exchange, no runaround.`,
    Icon: RotateCcw,
    tone: 'bg-[#fad0e1]',
  },
  {
    title: 'Secure refunds',
    body: `Encrypted checkout and protected payments. Approved refunds are processed within ${APP_CONFIG.REFUND_PROCESSING}, your money is always in good hands.`,
    Icon: Shield,
    tone: 'bg-[#cfdcff]',
  },
];

const statBlocks: {
  value: string;
  label: string;
  hint: string;
  Icon: LucideIcon;
}[] = [
  {
    value: TRUST_INDICATORS.HAPPY_CUSTOMERS,
    label: 'Happy customers',
    hint: 'Growing community of Skipaman fans',
    Icon: Users,
  },
  {
    value: TRUST_INDICATORS.SATISFACTION_RATE,
    label: 'Satisfaction rate',
    hint: 'Based on post-purchase feedback',
    Icon: Star,
  },
  {
    value: TRUST_INDICATORS.SUPPORT_AVAILABILITY,
    label: 'Customer support',
    hint: 'Help when you need it',
    Icon: Headphones,
  },
];

export const CustomerAssuranceSection: React.FC = () => {
  return (
    <div className="relative bg-[#211527] py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:px-8">
        {/* Left: heading + numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f2ceff]">
            <span aria-hidden className="h-px w-8 bg-[#f2ceff]" />
            Trusted by thousands
          </p>
          <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.25rem)] font-black leading-[0.98] tracking-[-0.045em]">
            Join our <span className="text-[#f2ceff]">happy customers</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
            Real quality, fair policies, and support that shows up, see why shoppers keep coming back.
          </p>

          <ul
            aria-label="Customer statistics"
            className="mt-10 grid list-none grid-cols-1 gap-6 border-t border-white/10 p-0 pt-8 sm:grid-cols-3"
          >
            {statBlocks.map(({ value, label, hint }) => (
              <li key={label} className="min-w-0">
                <p className="text-4xl font-black leading-none tracking-tighter tabular-nums text-white lg:text-5xl">
                  {value}
                </p>
                <p className="mt-3 text-sm font-semibold text-[#f2ceff]">{label}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">{hint}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: three promises as a clean list */}
        <ul className="list-none self-center divide-y divide-white/10 p-0">
          {featureBlocks.map(({ title, body, Icon, tone }, index) => (
            <motion.li
              key={title}
              className="flex gap-5 py-6 first:pt-0 last:pb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#211527] ${tone}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-xl font-bold leading-snug">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65 md:text-base">{body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};
