import { motion } from 'framer-motion';
import { Palette, Printer, Shirt, Truck } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Pick',
    body: 'Choose a retail piece from the shop—or brief us on event printing like cups, caps, pamphlets, and any branded merch.',
    icon: Shirt,
    href: '/shop',
    cta: 'Browse shop',
  },
  {
    title: 'Customize',
    body: 'Use the Virtual Stylist (or submit a design brief). We refine artwork, colours, and placements for your event.',
    icon: Palette,
    href: '/virtual-stylist',
    cta: 'Customize / quote',
  },
  {
    title: 'Print & fulfil',
    body: 'Printed locally at our hub when it makes sense. We handle your event run and deliver nationwide (cups, caps, pamphlets, and more).',
    icon: Printer,
    href: '/printing',
    cta: 'Printing hub',
  },
  {
    title: 'Ship or collect',
    body: 'Track your order from confirmation to delivery—or collect when you’re local. Same care for one-off retail and event branding jobs.',
    icon: Truck,
    href: '/orders',
    cta: 'Your orders',
  },
] as const;

export const HomeWorkflowSection: React.FC = () => {
  return (
    <section
      className="relative border-y border-neutral-200 bg-white py-16 md:py-20"
      aria-labelledby="workflow-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            How Skipaman works
          </p>
          <h2
            id="workflow-heading"
            className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl"
          >
            Pick → customize → print locally → ship
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            Retail, custom branding, and printing in one place—so you know what happens after you
            click buy or request a quote.
          </p>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative flex flex-col rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 shadow-sm"
              >
                <span
                  className="absolute -left-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/80">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                <Link
                  to={step.href}
                  className="mt-5 inline-flex text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline"
                >
                  {step.cta}
                </Link>
              </motion.li>
            );
          })}
        </ol>

        <p className="mt-10 text-center text-sm text-neutral-500">
          Need something fully bespoke?{' '}
          <Link
            to="/design-brief"
            className="font-semibold text-neutral-800 underline-offset-4 hover:underline"
          >
            Start a design brief
          </Link>{' '}
          — we’ll match you to the right path.
        </p>
      </div>
    </section>
  );
};
