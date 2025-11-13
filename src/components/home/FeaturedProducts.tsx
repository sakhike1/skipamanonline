import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Plus, Star, Crown, ChevronLeft, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { products } from '../../data/products';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedProductsProps {
  onProductClick: (productId: string) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onProductClick }) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Pagination settings
  const productsPerPage = 12; // 4 columns × 3 rows

  // Initialize image indices
  useEffect(() => {
    const initialImageState = products.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {} as { [key: string]: number });
    setCurrentImageIndex(initialImageState);
  }, []);

  // Auto-rotate images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(productId => {
          if (hoveredProduct !== productId) {
            newState[productId] = (newState[productId] + 1) % 3;
          }
        });
        return newState;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [hoveredProduct]);

  // Get all featured products and pagination logic
  const featuredProducts = products.filter(product => product.featured);
  const totalPages = Math.ceil(featuredProducts.length / productsPerPage);
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayProducts = featuredProducts.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleMouseEnter = (productId: string) => {
    setHoveredProduct(productId);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentImageIndex(prev => ({
        ...prev,
        [productId]: (prev[productId] + 1) % 3
      }));
      setIsTransitioning(false);
    }, 200);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  const handleViewMore = () => {
    window.location.href = '/shop';
  };

  const handleViewProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    onProductClick(productId);
  };

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0">
        {/* Subtle gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        
        {/* Minimal grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Epic Header Section */}
          <motion.div 
            className="text-center mb-20 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 -z-10">
              {/* Floating orbs */}
              <motion.div 
                className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
                animate={{ 
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute top-20 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
                animate={{ 
                  y: [0, 15, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            </div>

            {/* Glowing Badge */}
            <motion.div 
              className="inline-flex items-center gap-4 px-8 py-4 bg-black/10 backdrop-blur-md border border-black/20 rounded-2xl mb-10 shadow-lg"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-6 h-6 text-yellow-500" />
              </motion.div>
              <span className="text-base font-bold text-black tracking-wider uppercase">
                Curated Selection
              </span>
            </motion.div>
            
            {/* Epic Typography with Glitch Effect */}
            <motion.h2 
              className="text-[clamp(3.5rem,10vw,6rem)] md:text-[clamp(5rem,12vw,8rem)] font-black leading-[0.8] tracking-tight mb-8 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Glitch overlay effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="absolute inset-0 text-red-500 blur-sm animate-pulse">FEATURED</span>
                <span className="absolute inset-0 text-blue-500 blur-sm animate-pulse" style={{ animationDelay: '0.1s' }}>FEATURED</span>
              </div>
              
              <motion.span 
                className="block text-black relative z-10"
                whileHover={{ 
                  textShadow: "0 0 30px rgba(0,0,0,0.3)",
                  scale: 1.02
                }}
              >
                FEATURED
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-yellow-400 via-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent relative z-10"
                whileHover={{ 
                  textShadow: "0 0 30px rgba(251, 191, 36, 0.8)",
                  scale: 1.02
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                PRODUCTS
              </motion.span>
            </motion.h2>
            
            {/* Animated Description */}
            <motion.div 
              className="max-w-4xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-xl md:text-2xl leading-relaxed text-gray-700 font-medium relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.span
                  className="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  Discover our handpicked collection of premium t-shirts, each crafted with exceptional quality and unique designs that define your style.
                </motion.span>
              </motion.p>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-orange-400/50 rounded-br-lg"></div>
            </motion.div>
          </motion.div>

          {/* Epic Browse Button - Mind-Blowing Hover Animation */}
          <motion.div 
            className="flex justify-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={handleViewMore}
              className="group relative overflow-visible flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-white via-gray-50 to-white text-black border-2 border-gray-300 rounded-2xl text-lg font-black tracking-wide shadow-2xl uppercase"
              whileHover={{ 
                scale: 1.1,
                y: -5,
                rotate: [0, -1, 1, -1, 0],
                boxShadow: "0 30px 60px rgba(139, 92, 246, 0.4), 0 0 100px rgba(236, 72, 153, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated gradient background on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ["-100%", "400%"]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                  style={{
                    transform: "skewX(-20deg)"
                  }}
                />
              </motion.div>
              
              {/* Pulsing glow rings */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-purple-400 opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-pink-400 opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.3,
                  ease: "easeOut"
                }}
              />
              
              {/* Sparkle icons */}
              <motion.div
                className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100"
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles size={20} className="text-yellow-400" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                animate={{
                  rotate: [360, 180, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "linear"
                }}
              >
                <Zap size={20} className="text-purple-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-4 opacity-0 group-hover:opacity-100"
                animate={{
                  rotate: [0, -180, -360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.25,
                  ease: "linear"
                }}
              >
                <Star size={18} className="text-pink-400 fill-pink-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-4 opacity-0 group-hover:opacity-100"
                animate={{
                  rotate: [360, 0, -360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.75,
                  ease: "linear"
                }}
              >
                <Sparkles size={18} className="text-orange-400" />
              </motion.div>
              
              {/* Text content */}
              <motion.span 
                className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-3"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(139, 92, 246, 0)",
                      "0 0 20px rgba(139, 92, 246, 0.8)",
                      "0 0 0px rgba(139, 92, 246, 0)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Browse Collection
                </motion.span>
              </motion.span>
              
              {/* Arrow with bounce animation */}
              <motion.div
                className="relative z-10 group-hover:text-white transition-colors duration-300"
                animate={{
                  x: [0, 5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  x: 10,
                  rotate: [0, 15, -15, 15, 0],
                  scale: 1.2
                }}
              >
                <ArrowRight size={24} />
              </motion.div>
              
              {/* Outer glow effect - subtle pulse to grab attention */}
              <motion.div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 blur-2xl opacity-20 -z-10 group-hover:opacity-60 transition-opacity duration-500"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.25, 0.15]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-orange-500/50 blur-3xl opacity-0 group-hover:opacity-40 -z-20 transition-opacity duration-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut"
                }}
              />
              
              {/* Ripple effect on click */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/30"
                initial={{ scale: 0, opacity: 0.8 }}
                whileTap={{
                  scale: 2,
                  opacity: 0
                }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Floating particles background */}
              {[
                { left: "10%", top: "20%", delay: 0 },
                { left: "90%", top: "15%", delay: 0.3 },
                { left: "5%", top: "80%", delay: 0.6 },
                { left: "95%", top: "85%", delay: 0.9 },
                { left: "50%", top: "5%", delay: 1.2 },
                { left: "48%", top: "95%", delay: 1.5 }
              ].map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{ left: particle.left, top: particle.top }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0],
                    y: [-10, 10, -10]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full blur-sm shadow-lg" />
                </motion.div>
              ))}
            </motion.button>
          </motion.div>
          
          {/* Modern Products Grid - 3 Rows */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Product Cards */}
            {displayProducts.map((product, index) => (
              <motion.article 
                key={product.id} 
                className="group"
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl relative border border-white/10 backdrop-blur-sm">
                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl"></div>
                  
                  {/* Preload all images */}
                  {product.images.map((imageSrc, imgIndex) => {
                    const currentIndex = currentImageIndex[product.id] || 0;
                    return (
                      <motion.img
                        key={imgIndex}
                        src={imageSrc}
                        alt={`${product.name} - Image ${imgIndex + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-700 ease-in-out
                          ${imgIndex === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                        `}
                        animate={{
                          scale: hoveredProduct === product.id ? 1.05 : 1,
                          filter: isTransitioning ? 'blur(2px)' : 'blur(0px)',
                        }}
                        transition={{ duration: 0.7 }}
                      />
                    );
                  })}
                  
                  {/* Featured Badge */}
                  {product.featured && (
                    <motion.div 
                      className="absolute top-4 left-4 z-30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="bg-black text-white px-3 py-1 text-xs font-bold tracking-widest rounded-full flex items-center gap-1">
                        <Star size={12} />
                        NEW
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
                    {product.images.map((_, imgIndex) => {
                      const currentIndex = currentImageIndex[product.id] || 0;
                      return (
                        <motion.div
                          key={imgIndex}
                          className={`w-2 h-2 rounded-full transition-all duration-300
                            ${imgIndex === currentIndex 
                              ? 'bg-white' 
                              : 'bg-white/40'
                            }`}
                          whileHover={{ scale: 1.2 }}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Quick add button */}
                  <AnimatePresence>
                    {hoveredProduct === product.id && (
                      <motion.div 
                        className="absolute bottom-4 right-4 z-40"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button 
                          onClick={(e) => handleViewProduct(e, product.id)}
                          className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full text-black hover:bg-white shadow-lg hover:scale-110 transition-all duration-300"
                          aria-label="Quick view"
                        >
                          <Plus size={20} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Product Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-black text-lg font-semibold tracking-wider">{product.name}</h3>
                    <motion.p 
                      className="text-black font-bold text-lg"
                      animate={{ color: hoveredProduct === product.id ? '#f59e0b' : 'rgba(0, 0, 0, 1)' }}
                    >
                      R500
                    </motion.p>
                  </div>
                  <p className="text-gray-600 text-sm uppercase tracking-wider">{product.category}</p>
                  
                  <motion.button
                    onClick={(e) => handleViewProduct(e, product.id)}
                    className="mt-4 w-full bg-white text-black border border-gray-400 py-4 text-sm tracking-widest hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 rounded-xl group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag size={16} />
                    <span>View Product</span>
                  </motion.button>
                </div>
              </motion.article>
            ))}
            
          </motion.div>

          {/* Professional Pagination */}
          {totalPages > 1 && (
            <motion.div 
              className="flex justify-center items-center gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Previous Button */}
              <button
                onClick={() => {
                  handlePreviousPage();
                  // Scroll to top of section
                  setTimeout(() => {
                    const section = document.querySelector('section');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                disabled={currentPage === 0}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-black/10 backdrop-blur-sm border border-black/20 text-black hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handlePageClick(i);
                      // Scroll to top of section
                      setTimeout(() => {
                        const section = document.querySelector('section');
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className={`w-12 h-12 rounded-full transition-all duration-300 ${
                      currentPage === i
                        ? 'bg-white text-black font-semibold'
                        : 'bg-black/10 backdrop-blur-sm border border-black/20 text-black hover:bg-black/20'
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => {
                  handleNextPage();
                  // Scroll to top of section
                  setTimeout(() => {
                    const section = document.querySelector('section');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                disabled={currentPage === totalPages - 1}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-black/10 backdrop-blur-sm border border-black/20 text-black hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;