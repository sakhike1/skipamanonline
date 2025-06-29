import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, getFeaturedProducts } from '../data/products';
import { Filter, X, ArrowRight, ShoppingBag, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
  };
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageHover = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300"
      onClick={() => onClick(product.id)}
      onMouseEnter={handleImageHover}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/15 to-red-500/10 backdrop-blur-sm"></div>
        
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl"></div>
        
        {/* Image Container */}
        <div className="relative z-10 h-full">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0 filter grayscale hover:grayscale-0 rounded-2xl"
          />
          
          {/* Always Visible Overlay with Glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-2xl">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Glassmorphism Content Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
                <h3 className="text-white text-lg font-medium mb-1 drop-shadow-lg line-clamp-1 uppercase tracking-wide">{product.name}</h3>
                <p className="text-white/90 mb-2 font-semibold">R500</p>
                <p className="text-white/80 text-sm capitalize mb-3">{product.category}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(product.id); }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-300"
        >
          View Product
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Counter */}
        {product.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20">
            {currentImageIndex + 1}/{product.images.length}
          </div>
        )}
        
        {/* Floating Sparkle Effect */}
        <div className="absolute top-3 left-3 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

const PromoCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer">
        {/* Gradient Background - Different colors for promo card */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/15 to-red-500/10 backdrop-blur-sm"></div>
        
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl"></div>
        
        {/* Image Container */}
        <div className="relative z-10 h-full">
        <img
          src="https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg"
          alt="Special Promotion"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0 filter grayscale hover:grayscale-0 rounded-2xl"
          />
          
          {/* Always Visible Overlay with Glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-2xl">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Glassmorphism Content Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
        <div className="flex justify-between items-start mb-1">
                  <h3 className="text-white text-lg font-medium mb-1 drop-shadow-lg line-clamp-1 uppercase tracking-wide">Summer Sale Collection</h3>
          <div>
                    <span className="text-white/60 font-medium line-through mr-2">R500</span>
                    <span className="text-white/90 font-semibold">R500</span>
          </div>
        </div>
                <p className="text-white/80 text-sm mb-3">Up to 40% Off Selected Items</p>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-300"
        >
          View Offer
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Limited Time Badge */}
        <div className="absolute top-3 left-3 bg-red-600/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20 flex items-center gap-1">
          <Tag size={12} />
          <span>LIMITED TIME</span>
        </div>
        
        {/* Floating Sparkle Effect */}
        <div className="absolute top-3 right-3 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

const NewArrivalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const productsPerPage = 12;
  
  // Gold glitz color palette
  const colors = [
    '#FFD700', // Gold
    '#FFA500', // Orange
    '#FFC0CB', // Pink
    '#FF69B4', // Hot Pink
    '#DAA520', // Goldenrod
    '#B8860B', // Dark Goldenrod
    '#FFB6C1', // Light Pink
    '#FFDAB9', // Peach
  ];

  // Hero images array
  const heroImages = [
    '/images/4.jpg',
    '/images/5.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Image rotation effect
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(imageInterval);
  }, []);

  const newArrivals = getFeaturedProducts();
  const categories = [...new Set(newArrivals.map(product => product.category))];
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowFilters(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const filteredProducts = newArrivals.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  const toggleFilters = () => setShowFilters(!showFilters);
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 500]);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section: full black bg with padding-top */}
      <div className="bg-black text-white pt-28 md:pt-32 px-6 md:px-20 pb-20">
        <div className="md:flex md:items-center md:justify-between gap-12">
          <div className="md:w-1/2 flex justify-center md:justify-start">
            <div className="w-full max-w-[900px] h-[500px] overflow-hidden rounded relative">
              {/* Red-Black Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-black opacity-60 z-10"></div>
              
              {/* Rotating Images */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  src={heroImages[currentImageIndex]}
                alt="Sport Collection" 
                  className="w-full h-[1000px] object-cover rounded absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                loading="lazy"
              />
              </AnimatePresence>
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center items-start relative z-20">
            <motion.h1 
              className="text-7xl font-extrabold uppercase tracking-widest leading-none"
              animate={{
                color: colors[colorIndex],
                textShadow: [
                  '0 0 10px rgba(255, 215, 0, 0.5)',
                  '0 0 20px rgba(255, 215, 0, 0.7)',
                  '0 0 10px rgba(255, 215, 0, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <span>NEW</span><br />
              <span>SPORT COLLECTION</span>
            </motion.h1>
            <p className="mt-6 max-w-lg text-gray-400 leading-relaxed">
              The brand was originally aimed at men's fashion. Starting in 1995 women's fashion was launched in all its dimensions: from the most urban lines to the more casual.
            </p>
            <button 
              aria-label="Scroll Down"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="mt-16 border border-gray-600 rounded-full p-3 flex items-center justify-center hover:border-white transition"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-bounce"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Below section: white background with black text */}
      <div className="bg-white text-black min-h-screen px-6 md:px-20 py-12">
        {/* Filter & Product Count Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-300 pb-3">
          <h2 className="text-3xl font-bold uppercase tracking-wider">Latest Collection</h2>
          <p className="text-gray-600">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Filter Toggle Button for Mobile */}
        <div className="md:hidden mb-6">
          <button
            onClick={toggleFilters}
            className="flex items-center justify-center w-full gap-2 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            {showFilters ? (
              <>
                <X size={16} />
                <span>Close Filters</span>
              </>
            ) : (
              <>
                <Filter size={16} />
                <span>Show Filters</span>
              </>
            )}
          </button>
        </div>

        {/* Main Content: Filters + Products */}
        <div className="md:flex md:gap-10">
          {/* Filters Sidebar */}
          {(!isMobile || showFilters) && (
            <aside className="md:w-72 bg-white border border-gray-300 rounded-lg p-6 text-black">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold uppercase tracking-wider">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-black underline"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">Category</h4>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer select-none text-gray-700 hover:text-black">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category}
                        onChange={() => {
                          setSelectedCategory(selectedCategory === category ? null : category);
                          setCurrentPage(1);
                        }}
                        className="accent-black w-4 h-4 cursor-pointer"
                        name="category"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex flex-col">
                <div>
                  <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">Price Range</h4>
                  <div className="flex justify-between text-gray-600 text-sm mb-4">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], Number(e.target.value)]);
                      setCurrentPage(1);
                    }}
                    className="w-full cursor-pointer accent-black"
                  />
                </div>
                
                {/* Promotional Text - Contained within card */}
                <motion.div 
                  className="mt-8 p-8 bg-black rounded-lg border border-[#FFD700]/20 min-h-[300px] flex items-center justify-center relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(255, 215, 0, 0.2)',
                      '0 0 30px rgba(255, 215, 0, 0.3)',
                      '0 0 15px rgba(255, 215, 0, 0.2)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  {/* Background sparkles */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 animate-float-slow">
                      <Sparkles size={20} className="text-[#FFD700] opacity-40" />
                    </div>
                    <div className="absolute bottom-1/3 right-1/3 animate-float">
                      <Sparkles size={16} className="text-[#FFD700] opacity-40" />
                    </div>
                    <div className="absolute top-1/2 right-1/4 animate-float-delayed">
                      <Sparkles size={24} className="text-[#FFD700] opacity-40" />
                    </div>
                  </div>

                  <motion.div 
                    className="text-center space-y-6 relative z-10"
                    animate={{
                      color: colors[colorIndex],
                      textShadow: [
                        '0 0 10px rgba(255, 215, 0, 0.5)',
                        '0 0 20px rgba(255, 215, 0, 0.7)',
                        '0 0 10px rgba(255, 215, 0, 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <p className="text-3xl font-bold tracking-wider">✨ SPECIAL OFFER ✨</p>
                    <p className="text-xl font-medium">Free shipping on orders over $50</p>
                    <div className="w-20 h-0.5 bg-[#FFD700] mx-auto rounded-full opacity-50"></div>
                    <p className="text-lg font-medium">Shop now and save up to 40%</p>
                    <p className="text-base opacity-80">Limited time offer</p>
                    <motion.button
                      onClick={() => navigate('/shop')}
                      className="w-16 h-16 mx-auto rounded-full border-2 border-[#FFD700] flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#FFD700]/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight size={24} className="text-[#FFD700] transform transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <section className="flex-1">
            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <PromoCard onClick={() => navigate('/summer-sale')} />
                  {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={handleProductClick} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === index + 1
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-transparent border border-gray-300 rounded-lg">
                <p className="text-gray-600 mb-6">No products match your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-900 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;