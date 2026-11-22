import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Shield } from 'lucide-react';
import { useNewsletter } from '../../hooks/useNewsletter';

interface NewsletterSectionProps {
  onSubscribeSuccess?: () => void;
  onSubscribeError?: (error: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  onSubscribeSuccess,
  onSubscribeError,
}) => {
  const { email, setEmail, isSubscribing, handleSubscribe, status, message, resetStatus } = useNewsletter(
    onSubscribeSuccess,
    onSubscribeError,
    'home_newsletter',
  );

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black py-20 md:py-28"
      aria-labelledby="newsletter-heading"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[20rem] w-[20rem] translate-x-1/3 rounded-full bg-purple-500/[0.07] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            <Mail className="h-4 w-4 text-white/80" aria-hidden />
            Stay updated
          </div>

          <h2
            id="newsletter-heading"
            className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            New arrivals,{' '}
            <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
              every week
            </span>
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-neutral-400 md:text-xl">
            Get drops, restocks, and subscriber-only offers—one short email. No spam.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <form
            onSubmit={handleSubscribe}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
              <div className="relative min-w-0 flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-neutral-500"
                  aria-hidden
                />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    if (message) resetStatus();
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/15 bg-black/40 py-4 pl-12 pr-4 text-base text-white placeholder:text-neutral-500 focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
                  disabled={isSubscribing}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubscribing}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-neutral-900 shadow-lg transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[11rem]"
              >
                {isSubscribing ? (
                  <>
                    <span
                      className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent"
                      aria-hidden
                    />
                    Subscribing…
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </>
                )}
              </button>
            </div>

            {message && (
              <div className="mt-4" aria-live="polite">
                <p
                  className={`text-sm font-medium ${
                    status === 'success' ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-start justify-center gap-2.5 border-t border-white/10 pt-6 text-center sm:text-left">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
              <p className="text-sm leading-snug text-neutral-500">
                We respect your privacy. Unsubscribe anytime from every email.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
