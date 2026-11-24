import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Star } from 'lucide-react';
import { useHeader } from '../context/HeaderContext';
import { testimonials } from '../data/testimonials';
import AnimatedHeading from '../components/ui/AnimatedHeading';

const cardTones = ['bg-[#ffd4c4]', 'bg-[#fad0e1]', 'bg-[#f2ceff]', 'bg-[#cfdcff]'];

const Stars: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'h-4 w-4' }) => (
  <span className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${className} ${i < Math.round(rating) ? 'fill-[#211527] text-[#211527]' : 'text-[#211527]/25'}`}
        aria-hidden
      />
    ))}
  </span>
);

const ReviewsPage: React.FC = () => {
  const { setIsHeaderDark } = useHeader();
  const [filter, setFilter] = useState<number | 'all'>('all');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    setIsHeaderDark(true);
    return () => setIsHeaderDark(false);
  }, [setIsHeaderDark]);

  // Everything below is calculated from the reviews themselves
  const stats = useMemo(() => {
    const total = testimonials.length;
    const average = total ? testimonials.reduce((sum, t) => sum + t.rating, 0) / total : 0;
    const verified = testimonials.filter((t) => t.verified).length;
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    testimonials.forEach((t) => {
      distribution[t.rating] = (distribution[t.rating] || 0) + 1;
    });
    return { total, average, verified, distribution };
  }, []);

  const featured = testimonials.find((t) => t.rating === 5 && t.verified && t.text.length > 90) ?? null;
  const listSource = filter === 'all' && featured ? testimonials.filter((t) => t.id !== featured.id) : testimonials;
  const shown = filter === 'all' ? listSource : testimonials.filter((t) => t.rating === filter);

  return (
    <div className="min-h-screen bg-white pb-16 pt-24 md:pt-28">
      <style>{`
        .rev-hero {
          background-image: linear-gradient(115deg, #ffd4c4, #fad0e1, #f2ceff, #cfdcff, #ffd4c4);
          background-size: 300% 300%;
          animation: rev-shift 16s ease-in-out infinite;
        }
        @keyframes rev-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @media (prefers-reduced-motion: reduce) { .rev-hero { animation: none; } }
      `}</style>

      {/* Hero */}
      <section aria-labelledby="reviews-heading" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="rev-hero grid gap-10 rounded-[2rem] p-7 text-[#211527] sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
              <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
              Customer reviews
            </p>
            <AnimatedHeading
              id="reviews-heading"
              variant="slide"
              className="mt-4 text-[clamp(2.6rem,7vw,5.5rem)] font-black leading-[0.95] tracking-[-0.05em]"
              lines={[{ text: 'What our' }, { text: 'customers say' }]}
            />
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#513a5c] md:text-lg">
              Honest feedback from people who bought and wore Skipaman. Read the good and the not-quite-five-star too.
            </p>
          </div>

          {/* Rating summary */}
          <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_30px_80px_-50px_rgba(33,21,39,0.5)] sm:p-8">
            <div className="flex items-end gap-4">
              <p className="text-6xl font-black leading-none tracking-tighter tabular-nums">{stats.average.toFixed(1)}</p>
              <div className="pb-1">
                <Stars rating={stats.average} className="h-5 w-5" />
                <p className="mt-1 text-sm text-[#6b5a73]">
                  {stats.total} reviews, {stats.verified} from verified buyers
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-2.5" aria-label="Rating breakdown">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.distribution[rating] || 0;
                const pct = stats.total ? (count / stats.total) * 100 : 0;
                return (
                  <li key={rating} className="flex items-center gap-3 text-sm">
                    <span className="w-8 shrink-0 font-medium tabular-nums">{rating} ★</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#f3eff5]">
                      <span className="block h-full rounded-full bg-[#2f4fe0]" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-6 shrink-0 text-right tabular-nums text-[#6b5a73]">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8" aria-label="All reviews">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-black tracking-tight text-[#211527]" aria-live="polite">
            {shown.length} {shown.length === 1 ? 'review' : 'reviews'}
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by rating">
            {(['all', 5, 4, 3] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === value
                    ? 'bg-[#2f4fe0] text-white shadow-[0_10px_24px_-12px_rgba(47,79,224,0.8)]'
                    : 'border border-[#211527]/20 bg-white text-[#211527] hover:border-[#2f4fe0] hover:text-[#2f4fe0]'
                }`}
              >
                {value === 'all' ? 'All' : `${value} stars`}
              </button>
            ))}
          </div>
        </div>

        {filter === 'all' && featured && (
          <figure className="mt-8 grid gap-6 rounded-[2rem] bg-[#211527] p-8 text-white md:grid-cols-[auto_1fr] md:gap-10 md:p-12">
            <span aria-hidden className="select-none text-8xl font-black leading-[0.7] text-[#cfdcff]">&ldquo;</span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#cfdcff]">Featured review</p>
              <blockquote className="mt-3 text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium leading-snug tracking-tight">
                {featured.text}
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-bold text-[#211527]">
                  {featured.avatar}
                </span>
                <span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    {featured.name}
                    <BadgeCheck className="h-4 w-4" aria-label="Verified buyer" />
                  </span>
                  <span className="text-sm text-white/65">
                    {featured.location} &middot; {featured.purchase}
                  </span>
                </span>
                <span className="sm:ml-auto">
                  <Stars rating={featured.rating} className="h-5 w-5 [&_svg]:fill-white [&_svg]:text-white" />
                </span>
              </figcaption>
            </div>
          </figure>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((t, index) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
              className={`flex h-full flex-col rounded-[1.75rem] p-7 text-[#211527] ${cardTones[index % cardTones.length]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <Stars rating={t.rating} />
                <time className="text-xs font-medium text-[#211527]/60">{t.date}</time>
              </div>

              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#211527]/60">{t.purchase}</p>

              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-[#211527]/85">{t.text}</blockquote>

              {t.tags && t.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium">
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
                  <span className="shrink-0 text-xs font-medium text-[#211527]/60">{t.helpful} found helpful</span>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="mt-10 rounded-[1.75rem] bg-[#f3eff5] p-8 text-center text-[#513a5c]">
            No reviews with that rating yet.
          </p>
        )}

        {/* Closing banner */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#2f4fe0] p-8 text-white md:flex-row md:items-center md:p-12">
          <div className="max-w-xl">
            <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-black leading-[1.02] tracking-[-0.03em]">
              Bought from us? <span className="text-[#cfdcff]">Tell us how it went.</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              You can leave a review on the page of any product you have bought.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#2f4fe0] transition hover:bg-[#ffd4c4] hover:text-[#211527]"
          >
            Shop the collection
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
