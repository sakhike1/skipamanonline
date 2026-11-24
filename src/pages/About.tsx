import { ArrowRight, ArrowUpRight, MapPin, Palette, Printer, Shirt, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedHeading from '../components/ui/AnimatedHeading';
import { printingHubLinks } from '../data/printingLandingContent';
import { APP_CONFIG } from '../utils/constants';

const offers = [
  {
    icon: Shirt,
    title: 'Our own tees & hoodies',
    body: 'Graphic tees, hoodies and everyday layers, designed by us and sold online.',
    href: '/shop',
    cta: 'Shop the collection',
    tone: 'bg-[#ffd4c4]',
  },
  {
    icon: Printer,
    title: 'Printing for groups',
    body: 'Screen print, DTF and embroidery for schools, teams, events and businesses.',
    href: '/printing',
    cta: 'See printing',
    tone: 'bg-[#fad0e1]',
  },
  {
    icon: Palette,
    title: 'Custom branding',
    body: 'Send us your idea and dates. We confirm the method, timeline and a clear written quote.',
    href: '/virtual-stylist',
    cta: 'Request a quote',
    tone: 'bg-[#f2ceff]',
  },
  {
    icon: Truck,
    title: 'Delivery nationwide',
    body: `We courier across South Africa, with free delivery on orders over R${APP_CONFIG.FREE_SHIPPING_MIN_ZAR}.`,
    href: '/orders',
    cta: 'Track an order',
    tone: 'bg-[#cfdcff]',
  },
] as const;

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white pb-20 pt-24 md:pt-28">
      <style>{`
        .about-cta {
          background-image: linear-gradient(115deg, #ffd4c4, #fad0e1, #f2ceff, #cfdcff, #ffd4c4);
          background-size: 300% 300%;
          animation: about-shift 16s ease-in-out infinite;
        }
        @keyframes about-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @media (prefers-reduced-motion: reduce) { .about-cta { animation: none; } }
      `}</style>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Hero image card */}
        <section
          aria-labelledby="about-heading"
          className="group relative h-[min(34rem,78svh)] overflow-hidden rounded-[2rem] bg-[#211527] md:h-[min(42rem,80svh)]"
        >
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            src="/images/6.jpg"
            alt="Skipaman printing and design work"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#211527]/90 via-[#211527]/35 to-transparent" />

          <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-10 md:p-14">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f2ceff]">
              <span aria-hidden className="h-px w-8 bg-[#f2ceff]" />
              About Skipaman
            </p>
            <AnimatedHeading
              id="about-heading"
              variant="drop"
              className="mt-4 max-w-4xl text-[clamp(2.4rem,6.6vw,5.5rem)] font-black leading-[0.96] tracking-[-0.045em]"
              lines={[
                { text: 'Streetwear and' },
                { text: 'printing, made in Gauteng.', wordClassName: 'text-[#f2ceff]' },
              ]}
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Skipaman is a clothing brand and print shop. We sell our own tees and hoodies, and we print for schools,
              teams and businesses.
            </p>
          </div>
        </section>

        {/* What we do */}
        <section className="pt-16 md:pt-24" aria-labelledby="about-do-heading">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-14">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
                <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
                What we do
              </p>
              <h2
                id="about-do-heading"
                className="mt-4 text-[clamp(2.1rem,4.6vw,4rem)] font-black leading-[0.98] tracking-[-0.045em] text-[#211527]"
              >
                One team for what you wear and what you brand
              </h2>
            </div>
            <p className="text-base leading-relaxed text-[#513a5c] md:text-lg">
              Buy a piece from the shop, or bring us a design and a deadline. Either way you deal with the same people,
              from the first message to delivery.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map(({ icon: Icon, title, body, href, cta, tone }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={`group flex flex-col rounded-[1.75rem] p-6 text-[#211527] transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${tone}`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-10 text-xl font-black tracking-tight">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#211527]/75">{body}</p>
                <Link
                  to={href}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#211527] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#33203f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]"
                >
                  {cta}
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Images */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="grid gap-4 pt-16 md:grid-cols-12 md:pt-24"
          aria-label="Our work"
        >
          <div className="h-80 overflow-hidden rounded-[2rem] bg-[#f3eff5] md:col-span-8 md:h-[34rem]">
            <img
              src="/images/7.jpg"
              alt="Skipaman team at work"
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105 motion-reduce:hover:scale-100"
            />
          </div>
          <div className="h-80 overflow-hidden rounded-[2rem] bg-[#f3eff5] md:col-span-4 md:h-[34rem]">
            <img
              src="/images/8.jpg"
              alt="T-shirt printing in progress"
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105 motion-reduce:hover:scale-100"
            />
          </div>
        </motion.section>

        {/* Where we work */}
        <section className="pt-16 md:pt-24" aria-labelledby="about-areas-heading">
          <div className="rounded-[2rem] border border-[#211527]/10 bg-[#f3eff5] p-7 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
                  <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
                  Where we work
                </p>
                <h2
                  id="about-areas-heading"
                  className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)] font-black leading-[1] tracking-[-0.04em] text-[#211527]"
                >
                  Based in Gauteng, delivering across South Africa
                </h2>
              </div>
              <ul className="flex flex-wrap gap-3">
                {printingHubLinks.locations.map((l) => (
                  <li key={l.slug}>
                    <Link
                      to={`/locations/${l.slug}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-[#211527]/20 bg-white px-5 py-3 text-sm font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white"
                    >
                      <MapPin size={16} aria-hidden />
                      {l.label}
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Closing card */}
        <section className="about-cta mt-6 rounded-[2rem] px-6 py-14 text-center text-[#211527] sm:px-10 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">Let&apos;s talk</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-[clamp(2.1rem,4.8vw,4rem)] font-black leading-[0.98] tracking-[-0.045em]">
            Ready to wear it, or to brand it?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#211527] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#33203f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#211527]"
            >
              Shop the collection
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              to="/virtual-stylist"
              className="inline-flex items-center gap-2 rounded-full border border-[#211527]/30 bg-white/70 px-8 py-4 text-sm font-semibold text-[#211527] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#211527]"
            >
              Request a quote
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
