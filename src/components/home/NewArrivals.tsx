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
            ${isDarkTheme ? 'group-hover:shadow-2xl group-hover:shadow-purple-500/20' : 'group-hover:shadow-2xl group-hover:shadow-gray-500/20'}
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
            ${isDarkTheme ? 'text-white group-hover:text-gray-200' : 'text-gray-900 group-hover:text-gray-800'}`}>
            {product.name}
          </h3>
          <p className={`text-base font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            R{(product.price / 100).toFixed(2)}
          </p>
          
          {/* "View Product" Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleViewProduct(e, product.id)}
            aria-label={`View product details for ${product.name}`}
            className="mt-3 w-full py-2.5 text-sm tracking-wide transition-all duration-300 active:scale-98 
              flex items-center justify-center space-x-2 overflow-hidden relative rounded-md
              text-black bg-white border border-gray-400 hover:bg-gray-100 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="z-10 transition-all duration-300 font-medium">VIEW PRODUCT</span>
            <ArrowRight size={14} className="z-10 relative opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* New Arrivals Section - Professional Modern Design */}
      <div className="py-20 md:py-32 text-black relative overflow-hidden">
        {/* Clean Professional Background */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Subtle Modern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 via-transparent to-gray-100/10"></div>
        
        {/* Minimal Geometric Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M50 0L100 50L50 100L0 50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                  className="inline-flex items-center gap-3 px-6 py-3 bg-black/10 backdrop-blur-sm border border-black/20 rounded-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  <span className="text-sm font-medium text-black tracking-wider uppercase">New Collection</span>
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
                      className="block text-black relative"
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
                      className="block text-black relative"
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
                      className="text-xl md:text-2xl text-gray-800 leading-relaxed max-w-3xl font-light relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    >
                      The brand was originally aimed at men's fashion. Starting in 1995 women's fashion was launched in all its dimensions: from the most urban lines to the more casual.
                    </motion.p>
                    
                    {/* Decorative Quote Marks */}
                    <motion.div
                      className="absolute -top-4 -left-4 text-6xl text-gray-300 font-serif"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      "
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-6 -right-4 text-6xl text-gray-300 font-serif"
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
                      <p className="text-lg font-bold text-black">Premium</p>
                      <p className="text-sm text-gray-800 uppercase tracking-wider">Quality</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <div>
                      <p className="text-lg font-bold text-black">Urban</p>
                      <p className="text-sm text-gray-800 uppercase tracking-wider">Style</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-lg font-bold text-black">Casual</p>
                      <p className="text-sm text-gray-800 uppercase tracking-wider">Comfort</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"></div>
                    <div>
                      <p className="text-lg font-bold text-black">200</p>
                      <p className="text-sm text-gray-800 uppercase tracking-wider">Products</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            <motion.div 
              className="mt-12 lg:mt-0 lg:ml-8 flex flex-col gap-4 relative z-20"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Shop Collection Button */}
              <motion.button 
                onClick={() => navigate('/new-arrivals')}
                className="group relative overflow-hidden flex items-center gap-4 px-10 py-5 bg-white text-black border border-gray-400 rounded-2xl hover:bg-gray-100 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="Shop collection"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 font-bold">Shop Collection</span> 
                <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              {/* View Lookbook Button */}
              <motion.button 
                onClick={() => navigate('/lookbook')}
                className="group relative overflow-hidden flex items-center gap-4 px-10 py-5 bg-white text-black border border-gray-400 rounded-2xl hover:bg-gray-100 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="View lookbook"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 font-bold">View Lookbook</span> 
                <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
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
                <ProductCard product={product} theme="light" />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Trending Section - Professional Modern Design */}
      <div className="bg-black py-20 md:py-32 relative overflow-hidden">
        {/* Professional Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 0L80 40L40 80L0 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white tracking-wider uppercase">Trending Now</span>
                </motion.div>

                {/* Modern Typography */}
                <div className="space-y-4">
                  <motion.h2 
                    className="font-sans text-[clamp(3rem,8vw,5rem)] md:text-[clamp(4rem,10vw,7rem)] font-black leading-[0.85] tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <span className="block text-white">TRENDING</span>
                    <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                      NOW
                    </span>
                  </motion.h2>
                  
                  <motion.p 
                    className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl font-light"
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
                      <p className="text-2xl font-bold text-white">Latest</p>
                      <p className="text-sm text-gray-400 uppercase tracking-wider">Trends</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                    <div>
                      <p className="text-2xl font-bold text-white">Fashion</p>
                      <p className="text-sm text-gray-400 uppercase tracking-wider">Forward</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-2xl font-bold text-white">Style</p>
                      <p className="text-sm text-gray-400 uppercase tracking-wider">Innovation</p>
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
                className="group relative overflow-hidden flex items-center gap-4 px-10 py-5 bg-white text-black border border-gray-400 rounded-2xl hover:bg-gray-100 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="View all trending products"
              >
                <span className="relative z-10 font-bold">Explore Trends</span>
                <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
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
                <ProductCard product={product} theme="dark" />
              </motion.div>
            ))}
          </motion.div>

          {/* Summer Video Closing Section */}
          <motion.div 
            className="relative mt-20 overflow-hidden rounded-3xl"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {/* Video Background */}
            <div className="relative w-full h-[70vh] min-h-[500px] rounded-3xl overflow-hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                poster="/images/background1.jpg"
              >
                <source src="/images/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 rounded-3xl"></div>
              
              {/* Animated Summer Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10 px-6 max-w-4xl">
                  {/* Summer Icon */}
                  <motion.div
                    className="mb-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 1, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </motion.div>

                  {/* Main Heading */}
                  <motion.h2
                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    Summer
                    <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                      Collection
                    </span>
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    Embrace the warmth of summer with our latest collection. 
                    Fresh designs, vibrant colors, and endless style possibilities await.
                  </motion.p>

                  {/* Floating Elements */}
                  <motion.div
                    className="flex justify-center items-center gap-8 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                  >
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-semibold">New Arrivals</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                      <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-semibold">Summer Vibes</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                      <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-semibold">Trending Now</span>
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  
                </div>
              </div>

              {/* Floating Summer Icons */}
              <motion.div
                className="absolute top-10 left-10 text-yellow-400/30"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-20 right-16 text-orange-400/30"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-16 text-pink-400/30"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 15, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-10 right-10 text-yellow-400/20"
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -15, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NewArrivals;