import { motion } from 'framer-motion';
import { ArrowRight, Palette, Printer, Shirt, Truck } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Pick',
    body: 'Choose a retail piece from the shop, or brief us on event printing like cups, caps, pamphlets, and any branded merch.',
    icon: Shirt,
    href: '/shop',
    cta: 'Browse shop',
    tone: 'bg-[#ffd4c4]',
  },
  {
    title: 'Customize',
    body: 'Use the Virtual Stylist (or submit a design brief). We refine artwork, colours, and placements for your event.',
    icon: Palette,
    href: '/virtual-stylist',
    cta: 'Customize / quote',
    tone: 'bg-[#fad0e1]',
  },
  {
    title: 'Print & fulfil',
    body: 'Printed locally at our hub when it makes sense. We handle your event run and deliver nationwide (cups, caps, pamphlets, and more).',
    icon: Printer,
    href: '/printing',
    cta: 'Printing hub',
    tone: 'bg-[#f2ceff]',
  },
  {
    title: 'Ship or collect',
    body: 'Track your order from confirmation to delivery, or collect when you’re local. Same care for one-off retail and event branding jobs.',
    icon: Truck,
    href: '/orders',
    cta: 'Your orders',
    tone: 'bg-[#cfdcff]',
  },
] as const;

export const HomeWorkflowSection: React.FC = () => {
  return (
    <section className="relative bg-white py-16 md:py-24" aria-labelledby="workflow-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-14">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
              <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
              How Skipaman works
            </p>
            <h2
              id="workflow-heading"
              className="mt-4 text-[clamp(2.1rem,4.6vw,4rem)] font-black leading-[0.98] tracking-[-0.045em] text-[#211527]"
            >
              Pick → customize → print locally → ship
            </h2>
          </div>
          <p className="text-base leading-relaxed text-[#513a5c] md:text-lg">
            Retail, custom branding, and printing in one place, so you know what happens after you
            click buy or request a quote.
          </p>
        </div>

        <ol className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] p-6 text-[#211527] transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${step.tone}`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span
                    aria-hidden
                    className="text-5xl font-black leading-none tracking-[-0.05em] text-[#211527]/20"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-10 text-2xl font-black tracking-tight">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#211527]/75">{step.body}</p>
                <Link
                  to={step.href}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#211527] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#33203f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]"
                >
                  {step.cta}
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </motion.li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-[1.75rem] border border-[#211527]/10 bg-[#f3eff5] px-6 py-5 sm:flex-row sm:items-center">
          <p className="text-sm text-[#513a5c] md:text-base">
            Need something fully bespoke? We’ll match you to the right path.
          </p>
          <Link
            to="/design-brief"
            className="inline-flex items-center gap-2 rounded-full border border-[#211527] px-5 py-2.5 text-sm font-semibold text-[#211527] transition-colors hover:bg-[#211527] hover:text-white"
          >
            Start a design brief
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};
