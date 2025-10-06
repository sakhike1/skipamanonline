import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Plus, Star, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0">
        {/* Subtle gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        
        {/* Minimal grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
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
              className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 backdrop-blur-md border border-purple-400/30 rounded-2xl mb-10 shadow-2xl shadow-purple-500/10"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)"
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <span className="text-base font-bold text-white tracking-wider uppercase bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
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
                className="block text-white relative z-10"
                whileHover={{ 
                  textShadow: "0 0 30px rgba(255,255,255,0.8)",
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
                className="text-xl md:text-2xl leading-relaxed text-white/90 font-medium relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.span
                  className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
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

          {/* Epic Browse Button */}
          <motion.div 
            className="flex justify-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={handleViewMore}
              className="group relative overflow-hidden flex items-center gap-6 px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-3xl transition-all duration-500 text-xl font-bold shadow-2xl hover:shadow-purple-500/25"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(168, 85, 247, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
              />
              
              <motion.span 
                className="relative z-10"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Browse Collection
              </motion.span>
              
              <motion.div
                whileHover={{ x: 5, rotate: 15 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ArrowRight size={24} className="relative z-10" />
              </motion.div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
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
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold tracking-widest rounded-full flex items-center gap-1">
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
                    <h3 className="text-white text-lg font-semibold tracking-wider">{product.name}</h3>
                    <motion.p 
                      className="text-white/90 font-bold text-lg"
                      animate={{ color: hoveredProduct === product.id ? '#fbbf24' : 'rgba(255, 255, 255, 0.9)' }}
                    >
                      R500
                    </motion.p>
                  </div>
                  <p className="text-white/50 text-sm uppercase tracking-wider">{product.category}</p>
                  
                  <motion.button
                    onClick={(e) => handleViewProduct(e, product.id)}
                    className="mt-4 w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 text-white py-4 text-sm tracking-widest hover:from-purple-600 hover:to-pink-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm group"
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
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
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
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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