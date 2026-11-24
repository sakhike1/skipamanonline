import { motion } from 'framer-motion';
import { Star, BadgeCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { testimonials } from '../../data/testimonials';
import { TRUST_INDICATORS } from '../../utils/constants';

const summaryStats = [
  { value: TRUST_INDICATORS.AVERAGE_RATING, label: 'Average rating', hint: 'Across verified buyers' },
  { value: TRUST_INDICATORS.HAPPY_CUSTOMERS, label: 'Happy customers', hint: 'Growing Skipaman community' },
  { value: TRUST_INDICATORS.SATISFACTION_RATE, label: 'Would recommend', hint: 'Post-purchase surveys' },
] as const;

const cardTones = ['bg-[#ffd4c4]', 'bg-[#fad0e1]', 'bg-[#f2ceff]'];

const CustomerReviewSection: React.FC = () => {
  return (
    <div className="relative bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + numbers */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
              <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
              Customer reviews
            </p>
            <h2 className="mt-4 text-[clamp(2.2rem,4.8vw,4.25rem)] font-black leading-[0.98] tracking-[-0.045em] text-[#211527]">
              What our customers say
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#513a5c] md:text-lg">
              Real stories from people who live in our tees, quality you can feel, service you can count on.
            </p>
          </motion.div>

          <ul
            aria-label="Review summary"
            className="grid list-none grid-cols-3 gap-4 border-t border-[#211527]/10 p-0 pt-6 lg:border-t-0 lg:pt-0"
          >
            {summaryStats.map(({ value, label, hint }) => (
              <li key={label} className="min-w-0">
                <p className="text-3xl font-black leading-none tracking-tighter tabular-nums text-[#211527] sm:text-4xl">
                  {value}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#211527]">{label}</p>
                <p className="mt-0.5 hidden text-xs leading-snug text-[#6b5a73] sm:block">{hint}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, index) => (
            <motion.article
              key={t.id}
              className={`group flex h-full flex-col rounded-[1.75rem] p-7 text-[#211527] transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${cardTones[index % cardTones.length]}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.12 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1" role="img" aria-label={`${t.rating.toFixed(1)} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? 'fill-[#211527] text-[#211527]' : 'text-[#211527]/25'}`}
                      aria-hidden
                    />
                  ))}
                </div>
                <time className="text-xs font-medium text-[#211527]/60">{t.date}</time>
              </div>

              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#211527]/60">{t.purchase}</p>

              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#211527]/85 line-clamp-6 md:line-clamp-5">
                {t.text}
              </p>

              {t.tags && t.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#211527]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center gap-3 border-t border-[#211527]/10 pt-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#211527] text-sm font-bold text-white">
                  {t.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-semibold">{t.name}</span>
                    {t.verified && <BadgeCheck className="h-4 w-4 shrink-0" aria-label="Verified buyer" />}
                  </div>
                  <p className="truncate text-sm text-[#211527]/65">{t.location}</p>
                </div>
                {t.helpful != null && (
                  <span className="shrink-0 text-xs font-medium text-[#211527]/60">{t.helpful}+ helpful</span>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-[#6b5a73]">
          Longer reviews are shortened here.{' '}
          <Link to="/reviews" className="font-semibold text-[#211527] underline underline-offset-4">
            Read all reviews
          </Link>
        </p>

        {/* Closing banner */}
        <motion.div
          className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#211527] p-8 text-white md:flex-row md:items-center md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-xl">
            <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-black leading-[1.02] tracking-[-0.03em]">
              Wear tees built for <span className="text-[#f2ceff]">real life</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
              Join <span className="font-semibold text-white">{TRUST_INDICATORS.HAPPY_CUSTOMERS}</span> shoppers who chose
              Skipaman for fabric that lasts, fits that feel right, and support when you need it.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#211527] transition hover:bg-[#f2ceff]"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/reviews"
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
            >
              More reviews
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerReviewSection;
