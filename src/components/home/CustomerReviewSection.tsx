import { motion } from 'framer-motion';
import { Star, CheckCircle, TrendingUp, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { testimonials } from '../../data/testimonials';
import { TRUST_INDICATORS } from '../../utils/constants';

const summaryStats = [
  {
    value: TRUST_INDICATORS.AVERAGE_RATING,
    label: 'Average rating',
    hint: 'Across verified buyers',
    icon: Star,
    iconWrap: 'from-amber-400 to-orange-500 shadow-amber-500/25',
  },
  {
    value: TRUST_INDICATORS.HAPPY_CUSTOMERS,
    label: 'Happy customers',
    hint: 'Growing Skipaman community',
    icon: Users,
    iconWrap: 'from-violet-500 to-fuchsia-600 shadow-fuchsia-500/25',
  },
  {
    value: TRUST_INDICATORS.SATISFACTION_RATE,
    label: 'Would recommend',
    hint: 'Post-purchase surveys',
    icon: TrendingUp,
    iconWrap: 'from-sky-500 to-cyan-600 shadow-sky-500/25',
  },
] as const;

const CustomerReviewSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute bottom-24 right-[8%] h-80 w-80 rounded-full bg-blue-200/35 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="mx-auto mb-14 max-w-3xl text-center md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-purple-100 bg-gradient-to-r from-purple-50/90 to-pink-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-800">
            <Award className="h-4 w-4 text-purple-600" aria-hidden />
            Customer reviews
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
            What our{' '}
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 bg-clip-text text-transparent">
              customers say
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-600 md:text-xl leading-relaxed">
            Real stories from people who live in our tees—quality you can feel, service you can count on.
          </p>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          className="mx-auto mb-14 max-w-4xl md:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {summaryStats.map(({ value, label, hint, icon: Icon, iconWrap }) => (
              <div
                key={label}
                className="flex items-center gap-4 px-6 py-5 sm:px-5 sm:py-6"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconWrap} text-white shadow-lg`}
                >
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-2xl font-black tabular-nums tracking-tight text-slate-900 sm:text-3xl">
                    {value}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 leading-snug">{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.slice(0, 3).map((t, index) => (
            <motion.article
              key={t.id}
              className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.18)] transition-shadow duration-300 hover:border-slate-300 hover:shadow-[0_28px_70px_-36px_rgba(99,102,241,0.22)]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.12 }}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < t.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-500 tabular-nums">
                      {t.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-2 inline-flex max-w-full truncate rounded-md border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    {t.purchase}
                  </p>
                </div>
                <time className="shrink-0 rounded-md border border-slate-200/80 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {t.date}
                </time>
              </div>

              <blockquote className="relative flex-1 border-l-2 border-purple-200/80 pl-4">
                <p className="text-[15px] leading-relaxed text-slate-700 line-clamp-6 md:line-clamp-5">
                  {t.text}
                </p>
              </blockquote>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-md">
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-semibold text-slate-900">{t.name}</span>
                        {t.verified && (
                          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" aria-label="Verified buyer" />
                        )}
                      </div>
                      <p className="truncate text-sm text-slate-500">{t.location}</p>
                    </div>
                  </div>
                  {t.helpful != null && (
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {t.helpful}+ helpful
                    </span>
                  )}
                </div>

                {t.tags && t.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-purple-100 bg-purple-50/90 px-2.5 py-1 text-xs font-medium text-purple-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mb-10 text-center text-sm text-slate-500">
          Longer reviews are shortened here.{' '}
          <Link to="/reviews" className="font-semibold text-purple-600 hover:text-purple-800">
            Read all reviews
          </Link>
        </p>

        {/* Closing CTA — no duplicate stat grid; one clear message + actions */}
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-violet-50/50 to-sky-50/40 p-10 md:p-14 text-center shadow-[0_30px_80px_-50px_rgba(99,102,241,0.35)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.85),_transparent_60%)]" />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6">
            <span className="rounded-md border border-purple-200/80 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-700">
              Your turn
            </span>

            <h3 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-[2.75rem]">
              Wear tees built for{' '}
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 bg-clip-text text-transparent">
                real life
              </span>
            </h3>

            <p className="text-lg text-slate-600 leading-relaxed">
              Join{' '}
              <span className="font-semibold text-slate-900">{TRUST_INDICATORS.HAPPY_CUSTOMERS}</span>{' '}
              shoppers who chose Skipaman for fabric that lasts, fits that feel right, and support when you need it.
            </p>

            <div className="flex w-full flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:shadow-xl hover:shadow-purple-500/35"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to="/reviews"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white/90 px-8 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-white"
              >
                More reviews
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerReviewSection;
