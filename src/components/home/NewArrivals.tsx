import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { products } from '../../data/products';
import { motion } from 'framer-motion';

const NewArrivals: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize image indices
  useEffect(() => {
    const initialImageState = products.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {} as { [key: string]: number });
    setCurrentImageIndex(initialImageState);
  }, []);

  // Auto-rotate images every 6 seconds
  useEffect(() => {
    const startAutoRotation = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(productId => {
            // Only rotate if not currently hovered
            if (hoveredProductId !== productId) {
              newState[productId] = (newState[productId] + 1) % 3;
            }
          });
          return newState;
        });
      }, 6000);
    };

    startAutoRotation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hoveredProductId]);

  // Get the first 4 products for new arrivals
  const newArrivals = products.slice(0, 4);
  
  // Get the next 4 products for trending, replacing one with the new hoody, black tee, and purple tee
  const trendingProducts = [
    products[4], // Eco-Friendly Organic Tee
    products[30], // Premium Black Hoody (new hoody product)
    products[31], // Classic Black T-Shirt (new black tee product)
    products[32], // Purple Statement T-Shirt (new purple tee product)
  ];

  const handleViewProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    navigate(`/product/${productId}`);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Component for a single product card
  const ProductCard: React.FC<{ product: typeof products[0]; theme: 'dark' | 'light' }> = ({ product, theme }) => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isDarkTheme = theme === 'dark';

    const handleMouseEnter = () => {
      setHoveredProductId(product.id);
      setIsTransitioning(true);
      
      // Smoothly transition to next image
      setTimeout(() => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [product.id]: (prev[product.id] + 1) % 3
        }));
        setIsTransitioning(false);
      }, 150);
    };

    const handleMouseLeave = () => {
      setHoveredProductId(null);
    };

    const currentIndex = currentImageIndex[product.id] || 0;

    return (
      <div 
        key={product.id} 
        className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-500 ease-out" 
        onClick={() => navigate(`/product/${product.id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image and Overlay */}
        <div 
          className={`aspect-[3/4] overflow-hidden relative shadow-xl rounded-lg product-glow luxury-shimmer
            ${isDarkTheme ? 'bg-neutral-900 border-white/10 group-hover:border-purple-400/50' : 'bg-neutral-100 border-gray-200 group-hover:border-gray-400'}
            border transition-all duration-500 ease-out
            ${isDarkTheme ? 'group-hover:shadow-2xl group-hover:shadow-purple-500/20' : ''}
          `}
        >
          {/* Preload all images */}
          {product.images.map((imageSrc, index) => (
            <img
              key={index}
              src={imageSrc}
              alt={`${product.name} - Image ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out
                ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                ${hoveredProductId === product.id ? 'scale-105' : 'scale-100'}
                ${isTransitioning ? 'blur-[1px]' : 'blur-0'}
              `}
              style={{ 
                transform: `scale(${hoveredProductId === product.id ? '1.05' : '1'})`,
                filter: `blur(${isTransitioning ? '1px' : '0px'})`,
              }}
            />
          ))}

          {/* Overlay */}
          <div className={`absolute inset-0 transition-all duration-500 z-30
            ${isDarkTheme ? 'bg-black/0 group-hover:bg-black/20' : 'bg-black/0 group-hover:bg-black/5'}`}></div>
          
          {/* Shop Bag Button */}
          <button 
            onClick={(e) => e.stopPropagation()}
            aria-label="Add to cart"
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-40
              opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 
              hover:bg-opacity-90 active:scale-95 shadow-lg
              ${isDarkTheme ? 'bg-white/90 text-black backdrop-blur-sm' : 'bg-black/90 text-white backdrop-blur-sm'}`}
          >
            <ShoppingBag size={14} />
          </button>

          {/* Image indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-40">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${index === currentIndex 
                    ? (isDarkTheme ? 'bg-white' : 'bg-black') 
                    : (isDarkTheme ? 'bg-white/40' : 'bg-black/40')
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-4 space-y-2">
          <h3 className={`text-lg tracking-wide font-medium transition-colors duration-200 
            ${isDarkTheme ? 'text-white group-hover:text-gray-200' : 'text-gray-900 group-hover:text-black'}`}>
            {product.name}
          </h3>
          <p className={`text-base font-semibold ${isDarkTheme ? 'text-purple-400' : 'text-gray-800'}`}>
            R{(product.price / 100).toFixed(2)}
          </p>
          
          {/* "View Product" Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleViewProduct(e, product.id)}
            aria-label={`View product details for ${product.name}`}
            className={`mt-3 w-full py-2.5 text-sm tracking-wide transition-all duration-300 active:scale-98 
              flex items-center justify-center space-x-2 overflow-hidden relative rounded-md
              ${isDarkTheme 
                ? 'text-white border border-purple-400/30 group-hover:text-white hover:border-purple-400/80 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/30' 
                : 'text-white bg-black border border-black hover:bg-white hover:text-black group-hover:text-black'
              }`}
          >
            <span className={`z-10 transition-all duration-300 font-medium group-hover:-translate-x-0.5 ${isDarkTheme ? 'group-hover:text-black' : ''}`}>VIEW PRODUCT</span>
            <ArrowRight size={14} className={`z-10 relative opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkTheme ? 'group-hover:text-black' : ''}`} />
            <div className={`absolute inset-0 w-0 group-hover:w-full transition-all duration-300 ease-out
              ${isDarkTheme ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-white'}`}></div>
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* New Arrivals Section - Professional Modern Design */}
      <div className="py-20 md:py-32 text-white relative overflow-hidden">
        {/* Clean Professional Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
        
        {/* Subtle Modern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-800/20 via-transparent to-slate-800/10"></div>
        
        {/* Minimal Geometric Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 0L100 50L50 100L0 50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 sm:px-8 relative z-10">
          {/* Professional Section Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-16 md:mb-20">
            <div className="space-y-8 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Professional Badge */}
                <motion.div 
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  <span className="text-sm font-medium text-white/90 tracking-wider uppercase">New Collection</span>
                </motion.div>

                {/* Epic Typography */}
                <div className="space-y-6">
                  <motion.h2 
                    className="font-sans text-[clamp(3.5rem,9vw,6rem)] md:text-[clamp(5rem,12vw,8rem)] font-black leading-[0.8] tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <motion.span 
                      className="block text-white relative"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      NEW
                      <motion.div 
                        className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.span>
                    
                    <motion.span 
                      className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      whileHover={{ 
                        textShadow: "0 0 30px rgba(147, 51, 234, 0.6)",
                      }}
                    >
                      SPORT
                      <motion.div 
                        className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      />
                    </motion.span>
                    
                    <motion.span 
                      className="block text-white relative"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      COLLECTION
                      <motion.div 
                        className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                      />
                    </motion.span>
                  </motion.h2>
                  
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <motion.p 
                      className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl font-light relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    >
                      The brand was originally aimed at men's fashion. Starting in 1995 women's fashion was launched in all its dimensions: from the most urban lines to the more casual.
                    </motion.p>
                    
                    {/* Decorative Quote Marks */}
                    <motion.div
                      className="absolute -top-4 -left-4 text-6xl text-white/20 font-serif"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      "
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-6 -right-4 text-6xl text-white/20 font-serif"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      "
                    </motion.div>
                  </motion.div>
                </div>

                {/* Enhanced Stats */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    <div>
                      <p className="text-lg font-bold text-white">Premium</p>
                      <p className="text-sm text-white/60 uppercase tracking-wider">Quality</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <div>
                      <p className="text-lg font-bold text-white">Urban</p>
                      <p className="text-sm text-white/60 uppercase tracking-wider">Style</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-lg font-bold text-white">Casual</p>
                      <p className="text-sm text-white/60 uppercase tracking-wider">Comfort</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"></div>
                    <div>
                      <p className="text-lg font-bold text-white">200</p>
                      <p className="text-sm text-white/60 uppercase tracking-wider">Products</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            <motion.div 
              className="mt-12 lg:mt-0 lg:ml-8 flex flex-col gap-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Shop Collection Button */}
              <motion.button 
                onClick={() => navigate('/new-arrivals')}
                className="group relative overflow-hidden flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl hover:bg-gray-100 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="Shop collection"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Shop Collection</span> 
                <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              </motion.button>

              {/* View Lookbook Button */}
              <motion.button 
                onClick={() => navigate('/lookbook')}
                className="group relative overflow-hidden flex items-center gap-4 px-10 py-5 bg-transparent text-white border-2 border-white/30 rounded-2xl hover:bg-white hover:text-black transition-all duration-300 text-lg font-semibold hover:scale-105"
                aria-label="View lookbook"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">View Lookbook</span> 
                <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
              </motion.button>
            </motion.div>
          </div>

          {/* Modern Product Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {newArrivals.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + (index * 0.1) }}
              >
                <ProductCard product={product} theme="dark" />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Trending Section - Professional Modern Design */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 md:py-32 relative overflow-hidden">
        {/* Professional Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M40 0L80 40L40 80L0 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 sm:px-8">
          {/* Professional Section Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-16 md:mb-20">
            <div className="space-y-8 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Professional Badge */}
                <motion.div 
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50 rounded-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-orange-700 tracking-wider uppercase">Trending Now</span>
                </motion.div>

                {/* Modern Typography */}
                <div className="space-y-4">
                  <motion.h2 
                    className="font-sans text-[clamp(3rem,8vw,5rem)] md:text-[clamp(4rem,10vw,7rem)] font-black leading-[0.85] tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <span className="block text-gray-900">TRENDING</span>
                    <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                      NOW
                    </span>
                  </motion.h2>
                  
                  <motion.p 
                    className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Discover the latest trends that are making waves in fashion and setting new standards for style.
                  </motion.p>
                </div>

                {/* Professional Stats */}
                <motion.div 
                  className="flex flex-wrap gap-8 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">Latest</p>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Trends</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">Fashion</p>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Forward</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">Style</p>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Innovation</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-12 lg:mt-0 lg:ml-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <button 
                onClick={() => navigate('/shop')}
                className="group relative overflow-hidden flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="View all trending products"
              >
                <span className="relative z-10">Explore Trends</span>
                <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              </button>
            </motion.div>
          </div>

          {/* Modern Product Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {trendingProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + (index * 0.1) }}
              >
                <ProductCard product={product} theme="light" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NewArrivals;