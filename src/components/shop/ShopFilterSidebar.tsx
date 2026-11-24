import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, Star, Clock, ShoppingBag, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useProductData } from '../../context/ProductDataContext';

interface ShopFilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  priceRange: [number, number];
  onCategoryChange: (category: string | null) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  onProductClick: (id: string) => void;
  /** When true (no results), hides promotional content so the sidebar stays compact */
  compact?: boolean;
}

const ShopFilterSidebar: React.FC<ShopFilterSidebarProps> = ({
  categories,
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
  onProductClick,
  compact = false,
}) => {
  const navigate = useNavigate();
  const { featuredProducts } = useProductData();

  const handleCategoryToggle = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    onCategoryChange(newCategory);
    setTimeout(() => {
      const shopCollectionSection = document.getElementById('shop-collection');
      if (shopCollectionSection) {
        shopCollectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePriceChange = (value: number) => {
    onPriceRangeChange([priceRange[0], value]);
    setTimeout(() => {
      const shopCollectionSection = document.getElementById('shop-collection');
      if (shopCollectionSection) {
        shopCollectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className={compact ? 'w-full' : 'w-full md:w-72 flex-shrink-0'}>
      <div className="bg-white rounded-lg border border-neutral-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Filters</h2>
          <button
            onClick={onClearFilters}
            className="text-sm text-neutral-700 hover:text-black underline"
          >
            Clear all
          </button>
        </div>

        {/* Category — in compact mode render horizontally as pill buttons to stay short */}
        <div className={compact ? 'mb-6' : 'mb-8'}>
          <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wider">Category</h3>
          {compact ? (
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold capitalize transition ${
                    selectedCategory === category
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map(category => (
                <div key={category} className="flex items-center">
                  <input
                    id={`category-${category}`}
                    name="category"
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryToggle(category)}
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
          )}
        </div>

        {/* Price range — in compact mode cap the slider width so it doesn't sprawl */}
        <div className={compact ? 'max-w-sm' : ''}>
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
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full h-1 bg-neutral-300 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
              />
            </div>
          </div>
        </div>

        {/* Everything below is hidden in compact (no-results) mode */}
        {!compact && (
          <>
            {/* Promotional Text */}
            <motion.div
              className="mt-8 p-8 bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl min-h-[300px] flex items-center justify-center relative overflow-hidden"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(59, 130, 246, 0.3)',
                  '0 0 30px rgba(147, 51, 234, 0.4)',
                  '0 0 15px rgba(59, 130, 246, 0.3)',
                ],
              }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
            >
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

            {/* Stats Cards */}
            <div className="mt-8 space-y-6">
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

              {/* Trending Products */}
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
                  {featuredProducts.slice(0, 3).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => onProductClick(product.id)}
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

              {/* Flash Sale Banner */}
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
                    backgroundSize: '60px 60px',
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

              {/* Quality Badge */}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopFilterSidebar;