import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

interface ShopHeroSectionProps {
  primaryProduct: Product;
  secondaryProduct: Product;
  featuredProducts: Product[];
  onProductClick: (id: string) => void;
}

const ShopHeroSection: React.FC<ShopHeroSectionProps> = ({
  primaryProduct,
  secondaryProduct,
  featuredProducts,
  onProductClick
}) => {
  return (
    <div className="relative z-10 w-full min-h-screen bg-black overflow-hidden">
      {/* Very subtle left edge only — no bottom/right wash (that read as a grey band under the product cards) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-white/[0.03] to-transparent" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-6 md:px-12 pt-28 pb-20 sm:pt-32 md:pt-40 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          {/* Left Content */}
          <div className="text-white space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Premium badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">Premium Collection</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                <motion.span 
                  className="block text-white"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Elevate Your
                </motion.span>
                <motion.span 
                  className="block text-white mt-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Style Game
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-base md:text-lg text-gray-400 max-w-md font-light leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Premium t-shirts crafted with precision and passion. Experience luxury in every thread.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={() => onProductClick(primaryProduct.id)}
                className="group relative px-10 py-4 font-bold text-base overflow-hidden bg-white text-black rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl border border-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <ShoppingBag size={20} />
                  <span>Shop Collection</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button
                onClick={() => onProductClick(secondaryProduct.id)}
                className="group relative px-10 py-4 font-bold text-base overflow-hidden border border-white text-white rounded-full transition-all duration-300 hover:bg-white hover:text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>View New Arrivals</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Content - Modern Product Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4 lg:gap-6 h-full">
              {featuredProducts.map((product, index) => {
                const isPrimaryTile = index === 0;
                return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3 + (index * 0.15),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  className={`relative group cursor-pointer ${
                    index === 0 ? 'col-span-2 row-span-2' : 
                    index === 1 ? 'col-span-1 row-span-1 h-auto self-start w-full' : 
                    'col-span-1 row-span-1 h-auto self-start w-full'
                  }`}
                  onClick={() => onProductClick(product.id)}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Opaque dark shell — no translucent gradient as the card “background” */}
                  <div
                    className={`relative w-full overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 shadow-none ring-1 ring-white/10 transition-all duration-500 group-hover:border-white/25 ${
                      isPrimaryTile ? 'h-full min-h-[280px] lg:min-h-[320px]' : 'h-auto'
                    }`}
                  >
                    <div
                      className={
                        isPrimaryTile
                          ? 'relative h-full min-h-[260px] w-full overflow-hidden lg:min-h-[300px]'
                          : 'relative aspect-[4/5] w-full overflow-hidden'
                      }
                    >
                      <motion.img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />

                      {/* No black gradient over the photo — text uses shadow + optional solid chip for contrast */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="space-y-3 rounded-xl border border-white/10 bg-zinc-950/92 px-4 py-3 shadow-none"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                              {product.category}
                            </span>
                          </div>
                          <h3
                            className={`font-black leading-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.85)] ${
                              isPrimaryTile ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'
                            }`}
                          >
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between pt-1">
                            <p className="text-base font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.9)] lg:text-lg">
                              R{(product.price / 100).toFixed(2)}
                            </p>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white transition hover:bg-white hover:text-black"
                              aria-label={`View ${product.name}`}
                            >
                              <ArrowRight size={18} />
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>

                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-white/5" />
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ShopHeroSection;
































































