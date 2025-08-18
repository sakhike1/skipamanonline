import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { products } from '../../data/products';
import { motion } from 'framer-motion';
import './NewArrivals.css';

const NewArrivals: React.FC = () => {
  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);
  const [trendingColorIndex, setTrendingColorIndex] = useState(0);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Color palette for the animation
  const colors = [
    '#8B5CF6', // Purple
    '#A855F7', // Violet
    '#C084FC', // Light Purple
    '#E879F9', // Pink Purple
    '#9333EA', // Dark Purple
    '#7C3AED', // Purple
    '#A855F7', // Violet
    '#8B5CF6', // Purple
  ];

  // Different color palette for trending section
  const trendingColors = [
    '#1a1a1a', // Dark Gray
    '#2c3e50', // Dark Blue Gray
    '#34495e', // Darker Blue Gray
    '#2c3e50', // Dark Blue Gray
    '#1a1a1a', // Dark Gray
    '#2c3e50', // Dark Blue Gray
    '#34495e', // Darker Blue Gray
    '#1a1a1a', // Dark Gray
  ];

  // Color animation effects
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 5000);

    const trendingInterval = setInterval(() => {
      setTrendingColorIndex((prev) => (prev + 1) % trendingColors.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(trendingInterval);
    };
  }, []);

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
  
  // Get the next 4 products for trending
  const trendingProducts = products.slice(4, 8);

  const handleViewProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    navigate(`/product/${productId}`);
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
      {/* New Arrivals Section - Dark Theme */}
      <div className="py-16 md:py-24 text-white relative overflow-hidden">
        {/* Sophisticated Black Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Glitzy Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-pink-900/10"></div>
        
        {/* Animated Shimmer Effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)`,
            animation: 'shimmer 3s ease-in-out infinite',
            backgroundSize: '200% 200%',
          }}
        ></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(1px)',
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
        
        {/* Glittery Sparkles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <motion.div
                className="w-0.5 h-0.5 bg-white rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
                style={{
                  boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
                }}
              />
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-6 sm:px-8 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-16">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-2"
              >
                <motion.h2 
                  className="font-sans text-[clamp(2.5rem,6vw,4rem)] md:text-[clamp(4rem,8vw,6rem)] font-bold leading-none tracking-tight relative"
                  animate={{
                    color: colors[colorIndex],
                    textShadow: [
                      '0 0 30px rgba(139, 92, 246, 0.8)',
                      '0 0 60px rgba(139, 92, 246, 0.6)',
                      '0 0 90px rgba(168, 85, 247, 0.4)',
                      '0 0 120px rgba(168, 85, 247, 0.2)',
                    ],
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <span className="relative z-10">
                    NEW
                  </span>
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent font-black tracking-wider glitz-text">
                      SPORT COLLECTION
                    </span>
                    {/* Glowing outline effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-black tracking-wider blur-sm opacity-70" aria-hidden="true">
                      SPORT COLLECTION
                    </span>
                  </span>
                </motion.h2>
                <motion.p 
                  className="font-light text-white/90 tracking-[0.2em] text-sm uppercase max-w-md relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="relative z-10 inline-block">
                    Redefining modern aesthetics with premium craftsmanship
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    animate={{
                      width: ["0%", "100%", "0%"],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.p>
              </motion.div>
            </div>
            <motion.div 
              className="mt-8 md:mt-0 pt-4 md:pt-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <button 
                onClick={() => navigate('/new-arrivals')}
                className="group relative overflow-hidden flex items-center gap-3 hover:gap-4 transition-all duration-300 text-sm tracking-widest uppercase text-white border border-white/20 px-8 py-4 rounded-full hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-400/30 backdrop-blur-sm bg-white/5"
                aria-label="View all new arrivals"
              >
                <span className="relative z-10 transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text font-medium">View all</span> 
                <ArrowRight size={18} className="relative z-10 transition-all duration-300 group-hover:translate-x-1 group-hover:text-purple-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                
                {/* Glowing border effect on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full border border-purple-400/50 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border border-pink-400/50 animate-pulse animation-delay-150"></div>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {newArrivals.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} theme="dark" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Section - Light Theme */}
      <div className="bg-white py-20 md:py-32 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-20">
            <div className="space-y-6">
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-purple-700 tracking-wider uppercase">Hot Right Now</span>
              </motion.div>
              
              <div className="space-y-4">
                <motion.h2 
                  className="font-sans text-[clamp(2.5rem,6vw,4rem)] md:text-[clamp(3.5rem,8vw,6rem)] font-black leading-[0.9] tracking-tight"
                  animate={{
                    color: trendingColors[trendingColorIndex],
                    textShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.1)',
                      '0 0 40px rgba(139, 92, 246, 0.2)',
                      '0 0 20px rgba(139, 92, 246, 0.1)',
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  TRENDING<br />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                    NOW
                  </span>
                </motion.h2>
                <motion.p 
                  className="font-medium text-gray-700 tracking-[0.15em] text-sm uppercase max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Discover the latest trends that are making waves in fashion
                </motion.p>
              </div>
            </div>
            
            <motion.div 
              className="mt-8 md:mt-0 pt-4 md:pt-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button 
                onClick={() => navigate('/shop')}
                className="group relative overflow-hidden flex items-center gap-3 hover:gap-4 px-8 py-4 transition-all duration-300 text-sm tracking-widest uppercase text-white bg-gradient-to-r from-purple-600 to-pink-600 border border-purple-600 rounded-full hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105"
                aria-label="View all trending products"
              >
                <span className="relative z-10 transition-colors duration-300">Explore Trends</span>
                <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              </button>
            </motion.div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {trendingProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} theme="light" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewArrivals;