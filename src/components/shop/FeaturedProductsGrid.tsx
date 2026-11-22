import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface FeaturedProductsGridProps {
  products: Product[];
  onProductClick: (id: string) => void;
}

const FeaturedProductsGrid: React.FC<FeaturedProductsGridProps> = ({
  products,
  onProductClick,
}) => {
  return (
    <section
      className="relative w-full border-t border-neutral-200/80 bg-neutral-100 text-neutral-900"
      aria-labelledby="featured-drops-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 md:pb-12 md:pt-16 lg:px-8 lg:pt-20">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-700">
            Featured drops
          </p>
          <h2
            id="featured-drops-heading"
            className="mt-2 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl md:text-[2.5rem] md:leading-tight"
          >
            In the spotlight
          </h2>
          <p className="mt-3 text-base leading-relaxed text-neutral-600 md:text-lg">
            Hand-picked pieces from this week&apos;s rotation—tap a card for sizes, colours, and checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex h-full flex-col"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow duration-300 hover:border-neutral-300 hover:shadow-md">
                <button
                  type="button"
                  onClick={() => onProductClick(product.id)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-red-600"
                  aria-label={`Open ${product.name}`}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-neutral-950/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>

                <div className="flex flex-1 flex-col border-t border-neutral-100 p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    {product.category}
                  </p>
                  <div className="mt-2 flex flex-wrap items-start justify-between gap-2 gap-y-1">
                    <h3 className="min-w-0 flex-1 text-lg font-bold leading-snug tracking-tight text-neutral-950 sm:text-xl">
                      {product.name}
                    </h3>
                    <span className="shrink-0 rounded-md bg-neutral-100 px-2.5 py-1 text-sm font-bold tabular-nums text-neutral-900 ring-1 ring-neutral-200/80">
                      R{(product.price / 100).toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                    {product.description || 'Premium cotton, built for everyday wear.'}
                  </p>

                  <button
                    type="button"
                    onClick={() => onProductClick(product.id)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 py-3.5 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                  >
                    View product
                    <ArrowRight size={18} className="opacity-90" aria-hidden />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsGrid;
