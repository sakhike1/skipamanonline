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
      className="relative w-full bg-white text-[#211527]"
      aria-labelledby="featured-drops-heading"
    >
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 md:pb-16 md:pt-8 lg:px-8">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b4a7a]">
            <span aria-hidden className="h-px w-8 bg-[#6b4a7a]" />
            Featured drops
          </p>
          <h2
            id="featured-drops-heading"
            className="mt-3 text-[clamp(2rem,4.4vw,3.5rem)] font-black leading-[0.98] tracking-[-0.05em]"
          >
            In the spotlight
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6b5a73] md:text-lg">
            Hand-picked pieces from this week&apos;s rotation, tap a card for sizes, colours, and checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3 lg:gap-x-8">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex h-full flex-col"
            >
              <button
                type="button"
                onClick={() => onProductClick(product.id)}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#f3eff5] text-left ring-1 ring-[#211527]/5 outline-none transition duration-500 focus-visible:ring-2 focus-visible:ring-[#211527] group-hover:shadow-[0_28px_50px_-30px_rgba(33,21,39,0.55)]"
                aria-label={`Open ${product.name}`}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3a2646] backdrop-blur">
                  {product.category}
                </span>
                <span
                  aria-hidden
                  className="absolute bottom-3 right-4 text-6xl font-black leading-none tracking-[-0.06em] text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>

              <div className="mt-5 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="min-w-0 text-lg font-semibold leading-snug tracking-tight">{product.name}</h3>
                  <span className="shrink-0 text-lg font-semibold tabular-nums">
                    R{(product.price / 100).toFixed(2)}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#6b5a73]">
                  {product.description || 'Premium cotton, built for everyday wear.'}
                </p>

                <button
                  type="button"
                  onClick={() => onProductClick(product.id)}
                  className="group/button mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#211527] px-5 py-2.5 text-sm font-semibold text-[#211527] transition-colors duration-300 hover:bg-[#211527] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]"
                >
                  View product
                  <ArrowRight size={16} className="transition group-hover/button:translate-x-1" aria-hidden />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsGrid;
