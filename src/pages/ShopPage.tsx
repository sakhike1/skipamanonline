import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, getFeaturedProducts } from '../data/products'; // Assuming this path is correct
import { Filter, X, ArrowRight, Sparkles, TrendingUp, Users, ShoppingBag, Star, Zap, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 p-1 backdrop-blur-xl shadow-[0_24px_45px_-35px_rgba(15,23,42,0.35)] transition-all duration-500 hover:border-slate-200 hover:shadow-[0_32px_55px_-30px_rgba(37,99,235,0.35)]"
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-purple-200/40 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 rounded-[26px] bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_65%)]" />
      </div>

      <div
        className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/40 bg-white/40"
        onClick={() => onClick(product.id)}
        onMouseEnter={handleImageHover}
      >
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-slate-900/70" />

        <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-white/30 bg-white/30 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600 backdrop-blur-xl">
          {product.category}
        </div>

        {product.images.length > 1 && (
          <div className="absolute top-5 right-5 rounded-full border border-white/40 bg-white/30 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur-xl">
            {currentImageIndex + 1}/{product.images.length}
          </div>
        )}
      </div>

      <div className="relative z-10 -mt-10 px-5 pb-5">
        <div className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-2xl shadow-[0_20px_50px_-40px_rgba(37,99,235,0.65)] transition-all duration-500 group-hover:border-white group-hover:bg-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">{product.name}</h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Future-forward essentials crafted for everyday elevation.
              </p>
            </div>
            <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-sm font-semibold shadow-sm">
              R{(product.price / 100).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onClick(product.id)}
            className="group/button mt-6 flex w-full items-center justify-between gap-3 overflow-hidden rounded-full border border-slate-900/20 bg-slate-900/90 py-3 px-5 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-all duration-500 hover:border-slate-900 hover:bg-slate-900"
          >
            <span className="relative z-10">View Product</span>
            <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:bg-white/30">
              <ArrowRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const ProductGrid: React.FC<{ products: typeof products; onProductClick: (id: string) => void }> = ({
  products,
  onProductClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={onProductClick} />
      ))}
    </div>
  );
};

// New Arrivals Banner component - UPDATED
const NewArrivalsSection: React.FC<{ onProductClick: (id: string) => void }> = ({ onProductClick }) => {
  const featuredProducts = getFeaturedProducts().slice(0, 3);
  const accentConfigs = [
    {
      gradient: 'from-violet-500/30 via-fuchsia-500/20 to-cyan-500/20',
      halo: 'bg-violet-400/25',
      border: 'border-violet-200/40',
      shadow: 'shadow-[0_40px_90px_-45px_rgba(139,92,246,0.65)]',
      tag: 'text-violet-200',
    },
    {
      gradient: 'from-blue-500/25 via-sky-400/20 to-emerald-400/25',
      halo: 'bg-sky-300/25',
      border: 'border-sky-200/35',
      shadow: 'shadow-[0_40px_90px_-45px_rgba(59,130,246,0.65)]',
      tag: 'text-sky-200',
    },
    {
      gradient: 'from-amber-500/25 via-orange-500/20 to-rose-500/25',
      halo: 'bg-amber-400/25',
      border: 'border-amber-200/35',
      shadow: 'shadow-[0_40px_90px_-45px_rgba(251,191,36,0.6)]',
      tag: 'text-amber-200',
    },
  ];

  return (
    <div className="w-full mb-12">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] bg-black overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-[1000px] opacity-20"
          style={{
            backgroundImage: 'url(../assets/image4.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Animated Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(255,255,255,0.03)_25%,_rgba(255,255,255,0.03)_50%,_transparent_50%,_transparent_75%,_rgba(255,255,255,0.03)_75%)] bg-[length:50px_50px] animate-pulse"></div>
          </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Elevate Your
                  <span className="block text-white">
                    Style Game
                  </span>
                </h1>
                <p className="text-xl text-white/60 max-w-lg">
                  Premium t-shirts crafted with precision and passion. Experience luxury in every thread.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-wrap gap-6"
              >
                <motion.button
                  onClick={() => onProductClick(featuredProducts[0].id)}
                  className="group relative px-12 py-4 font-semibold overflow-hidden border-2 border-white/20 rounded-full transition-all duration-500 bg-gradient-to-r from-white/10 via-white/20 to-white/10 backdrop-blur-sm hover:border-white/40 hover:shadow-2xl hover:shadow-white/20"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                    <span>Shop Collection</span>
                    <motion.div
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ x: 3 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1.5,
                    }}
                  />
                </motion.button>
                
                <motion.button
                  onClick={() => onProductClick(featuredProducts[1].id)}
                  className="group relative px-12 py-4 font-semibold overflow-hidden border-2 border-yellow-400/50 rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-400/20 via-yellow-500/30 to-yellow-400/20 backdrop-blur-sm hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-400/30"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 20px 40px rgba(255, 193, 7, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <span className="relative z-10 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 flex items-center gap-2">
                    <span>View New Arrivals</span>
                    <motion.div
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ x: 3 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-500/30 to-yellow-400/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1.5,
                    }}
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Right Content - Floating Products */}
            <div className="relative h-[600px] hidden lg:block">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="absolute"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, -2, 2, 0],
                    scale: [1, 1.02, 1],
                    x: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    delay: index * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  style={{
                    top: `${15 + (index * 30)}%`,
                    left: `${20 + (index * 15)}%`,
                    zIndex: 3 - index
                  }}
                >
                  <div className="relative group cursor-pointer" onClick={() => onProductClick(product.id)}>
                    <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500"></div>
                    <div className="relative bg-black/50 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                      <div className="relative w-64 h-64 overflow-hidden rounded-xl">
                        <motion.img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transform transition-all duration-700"
                          whileHover={{ scale: 1.1 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white text-xl font-medium mb-2">{product.name}</h3>
                            <p className="text-white/80 mb-4">R500</p>
                            <button
                              onClick={() => onProductClick(product.id)}
                              className="group relative px-6 py-2 text-sm font-medium rounded-full bg-white text-black overflow-hidden transition-all duration-300"
                            >
                              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Shop Now</span>
                              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                            </button>
                          </div>
                        </div>
                      </div>
              </div>
              </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent"></div>
      </div>

      {/* Featured Products Grid */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.article
              key={product.id}
              className="group relative"
              whileHover={{ y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className={`relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-1 backdrop-blur-2xl ${accentConfigs[index % accentConfigs.length].shadow}`}>
                <div className="pointer-events-none absolute inset-0">
                  <div className={`absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90 ${accentConfigs[index % accentConfigs.length].halo}`} />
                  <div className={`absolute -bottom-12 -left-10 h-52 w-52 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90 ${accentConfigs[index % accentConfigs.length].halo}`} />
                  <div className={`absolute inset-0 rounded-[26px] border border-white/10 bg-gradient-to-br ${accentConfigs[index % accentConfigs.length].gradient}`} />
                </div>

                <div className="relative flex-1 overflow-hidden rounded-[22px] border border-white/20 bg-white/10">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onClick={() => onProductClick(product.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/70" />

                  <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 backdrop-blur-xl">
                    Drop {index + 1}
                    <Sparkles size={14} className="text-white/70" />
                  </div>
                </div>

                <div className="relative z-10 -mt-10 px-5 pb-5">
                  <div className={`rounded-2xl border border-white/40 bg-white/80 p-5 backdrop-blur-2xl text-slate-900`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${accentConfigs[index % accentConfigs.length].tag}`}>
                          {product.category}
                        </p>
                        <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">{product.name}</h3>
                      </div>
                      <span className="rounded-full bg-slate-900/90 px-3 py-1 text-sm font-semibold text-white shadow-lg">
                        R{(product.price / 100).toFixed(2)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Tailored silhouettes, premium fabrication, and a finish engineered for the future.
                    </p>

                    <button
                      onClick={() => onProductClick(product.id)}
                      className={`group/button mt-6 flex w-full items-center justify-between gap-3 overflow-hidden rounded-full border ${accentConfigs[index % accentConfigs.length].border} bg-black/90 py-3 px-6 text-sm font-semibold uppercase tracking-[0.4em] text-white transition-all duration-500 hover:bg-black`}
                    >
                      <span className="relative z-10">Shop Now</span>
                      <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:bg-white/25">
                        <ArrowRight size={16} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
      </div>
      </div>
    </div>
  );
};

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const categories = [...new Set(products.map(product => product.category))];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (!mobile) {
        setShowFilters(true);
      }
    };

    if (window.innerWidth >= 768) {
        setShowFilters(true);
    } else {
        setShowFilters(false); // Default to hidden on mobile
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 50000]);
    setCurrentPage(1); // Reset to first page when clearing filters
    // Scroll to Shop Collection section when clearing filters
    setTimeout(() => {
      const shopCollectionSection = document.getElementById('shop-collection');
      if (shopCollectionSection) {
        shopCollectionSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to the Shop Collection section instead of top of page
    const shopCollectionSection = document.getElementById('shop-collection');
    if (shopCollectionSection) {
      shopCollectionSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // Fallback to top if section not found
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    // Full width white background
    <div className="w-full px-4 py-8 pt-24 min-h-screen bg-white text-black">
      <NewArrivalsSection onProductClick={handleProductClick} />

      {/* Header section with max-width for content */}
      <div className="max-w-7xl mx-auto">
      <div id="shop-collection" className="flex justify-between items-center mb-8 border-b border-neutral-300 pb-4">
        <h1 className="text-3xl font-bold text-black">Shop Collection</h1>
        <p className="text-neutral-600">{filteredProducts.length} products</p>
      </div>

        {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <button
          onClick={toggleFilters}
          className="flex items-center justify-center w-full gap-2 py-3 bg-black text-white rounded-none text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          {showFilters ? (
            <> <X size={16} /> <span>Close Filters</span> </>
          ) : (
            <> <Filter size={16} /> <span>Show Filters</span> </>
          )}
        </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-full md:w-72 flex-shrink-0">
            {/* Filter panel white with neutral border */}
            <div className="bg-white rounded-lg border border-neutral-300 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-black">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-700 hover:text-black underline"
                >
                  Clear all
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wider">Category</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`category-${category}`}
                        name="category"
                        type="checkbox"
                        checked={selectedCategory === category}
                        onChange={() => {
                          setSelectedCategory(selectedCategory === category ? null : category);
                          setCurrentPage(1);
                          // Scroll to Shop Collection section when filter changes
                          setTimeout(() => {
                            const shopCollectionSection = document.getElementById('shop-collection');
                            if (shopCollectionSection) {
                              shopCollectionSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                              });
                            }
                          }, 100);
                        }}
                        className="h-4 w-4 text-black focus:ring-black border-neutral-400 rounded accent-black"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="ml-3 text-sm text-neutral-700 capitalize hover:text-black cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wider">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-neutral-700">
                                    <span>R{(priceRange[0] / 100).toFixed(2)}</span>
                <span>R{(priceRange[1] / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        setPriceRange([priceRange[0], Number(e.target.value)]);
                        setCurrentPage(1);
                        // Scroll to Shop Collection section when price filter changes
                        setTimeout(() => {
                          const shopCollectionSection = document.getElementById('shop-collection');
                          if (shopCollectionSection) {
                            shopCollectionSection.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }
                        }, 100);
                      }}
                      className="w-full h-1 bg-neutral-300 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    />
                  </div>
                </div>
                
                {/* Promotional Text - Contained within card */}
                <motion.div 
                  className="mt-8 p-8 bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl min-h-[300px] flex items-center justify-center relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(59, 130, 246, 0.3)',
                      '0 0 30px rgba(147, 51, 234, 0.4)',
                      '0 0 15px rgba(59, 130, 246, 0.3)',
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
                      <Sparkles size={20} className="text-white opacity-40" />
                    </div>
                    <div className="absolute bottom-1/3 right-1/3 animate-float">
                      <Sparkles size={16} className="text-white opacity-40" />
                    </div>
                    <div className="absolute top-1/2 right-1/4 animate-float-delayed">
                      <Sparkles size={24} className="text-white opacity-40" />
                    </div>
                  </div>

                  <motion.div 
                    className="text-center space-y-6 relative z-10 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <p className="text-3xl font-bold tracking-wider text-white">SPECIAL OFFER</p>
                    <p className="text-xl font-medium text-white">Free shipping on orders over R500</p>
                    <div className="w-20 h-0.5 bg-white mx-auto rounded-full opacity-50"></div>
                    <p className="text-lg font-medium text-white">Shop now and save up to 40%</p>
                    <p className="text-base opacity-80 text-white">Limited time offer</p>
                    <motion.button
                      onClick={() => navigate('/shop')}
                      className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight size={24} className="text-white transform transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Mind-Blowing Additional Content Section */}
                <div className="mt-8 space-y-6">
                  {/* Animated Stats Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="relative z-10">
                        <TrendingUp size={20} className="mb-2" />
                        <p className="text-2xl font-black">2.5K+</p>
                        <p className="text-xs opacity-90">Trending Now</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="relative z-10">
                        <Users size={20} className="mb-2" />
                        <p className="text-2xl font-black">10K+</p>
                        <p className="text-xs opacity-90">Happy Customers</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Trending Products Mini Showcase */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Zap size={16} className="text-yellow-500" />
                        Trending Now
                      </h4>
                      <span className="text-xs text-gray-500">Hot</span>
                    </div>
                    <div className="space-y-3">
                      {getFeaturedProducts().slice(0, 3).map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center gap-3 p-2 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200 group-hover:border-black transition-colors">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-black">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={10} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-600">4.8</span>
                              <span className="text-xs text-gray-400 ml-1">•</span>
                              <span className="text-xs font-bold text-gray-900">R{(product.price / 100).toFixed(0)}</span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Animated Countdown/Feature Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="relative rounded-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"></div>
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                      }}
                    ></div>
                    <div className="relative p-5 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={18} className="animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-wider">Flash Sale</span>
                      </div>
                      <p className="text-2xl font-black mb-2">Ends Soon!</p>
                      <p className="text-xs opacity-90 mb-3">Don't miss out on amazing deals</p>
                      <motion.button
                        onClick={() => navigate('/shop')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-white text-purple-600 py-2 px-4 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} />
                        Shop Now
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Quality Badge Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Award size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Premium Quality</p>
                        <p className="text-xs text-gray-600">Guaranteed</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-black text-gray-900">100%</p>
                        <p className="text-xs text-gray-600">Authentic</p>
                      </div>
                      <div className="border-l border-r border-gray-200">
                        <p className="text-lg font-black text-gray-900">24/7</p>
                        <p className="text-xs text-gray-600">Support</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900">Free</p>
                        <p className="text-xs text-gray-600">Shipping</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Video Section - Hero Video */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-xl group"
                  >
                    <div className="relative w-full h-[400px] bg-black">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-500"></div>
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white z-10">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1 }}
                          className="text-center space-y-2 w-full"
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-wider">New Collection</span>
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                          <h4 className="text-lg font-black uppercase tracking-tight">Featured Video</h4>
                          <p className="text-xs opacity-90 max-w-xs mx-auto">Discover our latest styles and trends</p>
                        </motion.div>
                      </div>

                      {/* Play Button Overlay (visible on hover) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                          <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-xs font-semibold text-white">LIVE</span>
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                        <span className="text-xs text-white">▶</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Additional Visual Element */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="relative h-24 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="w-20 h-20 border-4 border-white/30 rounded-full"
                      />
                      <motion.div
                        animate={{
                          scale: [1.2, 1, 1.2],
                          rotate: [360, 180, 0],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute w-12 h-12 border-4 border-white/50 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag size={24} className="text-white/80" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <p className="text-xs font-bold text-white drop-shadow-lg">Style Collection</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          {currentProducts.length > 0 ? (
            <>
              <ProductGrid products={currentProducts} onProductClick={handleProductClick} />
              
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
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-neutral-300 rounded-lg">
              <p className="text-neutral-700 mb-4">No products match your filters</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;