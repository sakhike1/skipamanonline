import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MapPin, Printer, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../components/ui/LazyImage';
import { printingHubLinks } from '../data/printingLandingContent';

export default function PrintingHubPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden pb-24 md:pb-32">
      {/* Background atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-neutral-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-red-500/[0.06] blur-3xl md:-left-20 md:top-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-[28rem] h-80 w-80 rounded-full bg-amber-500/[0.07] blur-3xl md:right-0"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Extra offset below fixed header */}
        <div className="pt-28 md:pt-36 lg:pt-40">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-12 xl:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-600 shadow-sm backdrop-blur-sm md:text-xs">
                <Sparkles className="h-3.5 w-3.5 text-red-600" aria-hidden />
                Custom printing
              </div>
              <div className="mb-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                {['DTF', 'Screen print', 'Embroidery', 'Uniforms'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-200/80 bg-neutral-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl md:text-6xl lg:text-[3.25rem] lg:leading-[1.08]">
                Printing &amp;{' '}
                <span className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 bg-clip-text text-transparent">
                  branding
                </span>
                <br className="hidden sm:block" />
                <span className="text-neutral-900">services</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 lg:mx-0 lg:max-w-xl lg:text-lg">
                Bulk screen print, DTF, embroidery, school uniforms, and corporate wear—serving{' '}
                <strong className="font-semibold text-neutral-800">
                  Centurion, Pretoria, Johannesburg
                </strong>
                , and courier nationwide. Open a guide for minimums, lead times, artwork, and
                delivery—then request a quote when you&apos;re ready.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
            >
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-neutral-200/90 bg-neutral-900 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.35)] sm:aspect-[5/4] sm:max-w-lg lg:aspect-[3/4] lg:max-h-[min(520px,70vh)] lg:max-w-none">
                <LazyImage
                  src="/images/image6.jpg"
                  alt="Custom printed apparel and branding samples"
                  className="h-full w-full object-cover opacity-95 transition duration-500 hover:scale-[1.02] hover:opacity-100"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-600/25 via-transparent to-amber-500/15" />
                <p className="pointer-events-none absolute bottom-5 left-5 right-5 text-left text-xs font-bold uppercase tracking-[0.18em] text-white/90 drop-shadow-sm">
                  Street-ready finishes · bulk-friendly
                </p>
                <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-neutral-950 shadow-md backdrop-blur-sm">
                  Gauteng + nationwide
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-10"
          >
            <section
              aria-labelledby="loc-heading"
              className="rounded-[1.75rem] border border-neutral-200/90 bg-white/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_50px_-24px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-600/25">
                  <MapPin className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h2
                    id="loc-heading"
                    className="text-xl font-bold tracking-tight text-neutral-900"
                  >
                    Cities &amp; areas
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Local landing pages with city-specific copy—Gauteng base, delivery South
                    Africa–wide.
                  </p>
                </div>
              </div>
              <ul className="mt-8 space-y-2">
                {printingHubLinks.locations.map((l) => (
                  <li key={l.slug}>
                    <Link
                      to={`/locations/${l.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-transparent bg-neutral-50/90 px-4 py-3.5 transition hover:border-neutral-200 hover:bg-white hover:shadow-md"
                    >
                      <span className="font-semibold text-neutral-900">{l.label}</span>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-neutral-400 transition group-hover:text-red-600"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="svc-heading"
              className="rounded-[1.75rem] border border-neutral-200/90 bg-white/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_50px_-24px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-950 text-white shadow-lg shadow-neutral-900/30">
                  <Printer className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h2
                    id="svc-heading"
                    className="text-xl font-bold tracking-tight text-neutral-900"
                  >
                    Print methods &amp; programmes
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Deep dives per technique—ideal when you already know screen vs DTF vs
                    embroidery.
                  </p>
                </div>
              </div>
              <ul className="mt-8 space-y-2">
                {printingHubLinks.services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services/${s.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-transparent bg-neutral-50/90 px-4 py-3.5 transition hover:border-neutral-200 hover:bg-white hover:shadow-md"
                    >
                      <span className="font-semibold text-neutral-900">{s.label}</span>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-neutral-400 transition group-hover:text-red-600"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-neutral-950 px-6 py-12 text-center shadow-2xl shadow-neutral-900/30 sm:px-10 md:mt-16"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl"
              aria-hidden
            />
            <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              Next step
            </p>
            <p className="relative mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Have dates &amp; quantities?
            </p>
            <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/75">
              Use the branding quote form—we&apos;ll confirm method, timeline, and a clear written
              estimate.
            </p>
            <Link
              to="/virtual-stylist"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-neutral-950 shadow-lg transition hover:bg-neutral-100 active:scale-[0.98]"
            >
              Request a quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
