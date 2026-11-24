import { motion } from 'framer-motion';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import { ArrowRight, ArrowUpRight, MapPin, Printer } from 'lucide-react';
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

      {/* HERO: continues the black header */}
      <section
        aria-labelledby="printing-hero-heading"
        className="relative z-10 flex flex-col bg-[#0b0b0c] text-white md:min-h-[min(100svh,54rem)]"
      >
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-10 pt-28 sm:px-8 md:pb-14 md:pt-32">
          {/* product photo, sits behind the headline on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 mt-8 h-72 overflow-hidden rounded-3xl bg-neutral-900 sm:h-96 md:absolute md:bottom-10 md:right-8 md:top-28 md:order-none md:mt-0 md:h-auto md:w-[42%] lg:right-14"
          >
            <LazyImage
              src="/images/image6.jpg"
              alt="Custom printed apparel and branding samples"
              className="h-full w-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0b0b0c]/70 via-transparent to-transparent" />
            <span className="absolute bottom-4 right-4 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black">
              Gauteng + nationwide
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-1 flex-col md:max-w-[64%] md:justify-center"
          >
            <p className="flex items-center gap-3 text-sm font-medium text-white/70">
              <span aria-hidden className="h-px w-8 bg-white/50" />
              Custom printing
            </p>
            <AnimatedHeading
              id="printing-hero-heading"
              variant="slide"
              className="mt-4 text-[clamp(3.6rem,12.5vw,10.5rem)] font-bold leading-[0.88] tracking-[-0.05em]"
              lines={[{ text: 'Printing' }, { text: '& branding', className: 'text-white/95 md:-mr-40' }]}
            />
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/80 md:text-xl">
              Bulk screen print, DTF, embroidery, school uniforms and corporate wear. Serving{' '}
              <strong className="font-semibold text-white">Centurion, Pretoria, Johannesburg</strong>, and courier nationwide.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/virtual-stylist"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-semibold text-black transition hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Request a quote
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="#print-guides"
                className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-7 py-3 text-base font-semibold transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Browse guides
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              {['DTF', 'Screen print', 'Embroidery', 'Uniforms'].map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* bottom strip: stats + quick links */}
        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
          <div
            className="flex flex-wrap items-center gap-x-10 gap-y-4 px-5 py-7 text-white sm:px-8 md:px-14"
            style={{ backgroundImage: 'linear-gradient(120deg, #4a2bf0 0%, #8b4dff 55%, #c07bff 100%)' }}
          >
            <div>
              <p className="text-5xl font-bold leading-none tracking-[-0.04em]">
                {printingHubLinks.services.length}
                <span className="ml-1.5 text-sm font-medium tracking-normal">guides</span>
              </p>
              <p className="mt-2 max-w-[13rem] text-xs leading-snug text-white/80">Print methods and programmes, each with minimums and lead times.</p>
            </div>
            <div>
              <p className="text-5xl font-bold leading-none tracking-[-0.04em]">
                {printingHubLinks.locations.length}
                <span className="ml-1.5 text-sm font-medium tracking-normal">areas</span>
              </p>
              <p className="mt-2 max-w-[13rem] text-xs leading-snug text-white/80">Local pages for Gauteng, with delivery South Africa-wide.</p>
            </div>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-4">
            {printingHubLinks.services.slice(0, 4).map((svc, i) => (
              <li key={svc.slug}>
                <Link
                  to={`/services/${svc.slug}`}
                  style={{ backgroundColor: ['#ffd21f', '#2b5cff', '#7c4dff', '#ffe45c'][i % 4], color: i % 4 === 1 || i % 4 === 2 ? '#fff' : '#14101f' }}
                  className="group flex h-full min-h-28 flex-col justify-between p-4 text-base transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                >
                  <ArrowUpRight className="h-5 w-5 self-end transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  <span className="text-base font-bold leading-tight">{svc.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div id="print-guides" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6 lg:px-8">
        <div className="pt-14 md:pt-20">
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
                    Local landing pages with city-specific copy, Gauteng base, delivery South
                    Africa-wide.
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
                    Deep dives per technique, ideal when you already know screen vs DTF vs
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
            className="print-cta relative mt-14 overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white sm:px-10 md:mt-16 md:py-16"
          >
            <style>{`
              .print-cta {
                background-image: linear-gradient(120deg, #4a2bf0, #8b4dff, #2b5cff, #c07bff, #4a2bf0);
                background-size: 300% 300%;
                animation: print-cta-shift 14s ease-in-out infinite;
                box-shadow: 0 40px 80px -40px rgba(74, 43, 240, 0.8);
              }
              @keyframes print-cta-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
              @media (prefers-reduced-motion: reduce) { .print-cta { animation: none; } }
            `}</style>
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ffd21f]/40 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-white/25 blur-3xl" />

            <p className="relative text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">Next step</p>
            <p className="relative mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1] tracking-[-0.04em]">
              Have dates &amp; quantities?
            </p>
            <p className="relative mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/90">
              Use the branding quote form, we&apos;ll confirm method, timeline, and a clear written
              estimate.
            </p>
            <Link
              to="/virtual-stylist"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-[#ffd21f] px-8 py-4 text-sm font-bold text-[#14101f] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] transition hover:bg-[#ffe45c] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
