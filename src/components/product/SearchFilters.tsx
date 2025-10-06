import React, { useState } from 'react';
import { Filter, X, Search, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFiltersType {
  category?: string;
  size?: string;
  color?: string;
  priceRange?: string;
  sortBy?: string;
}

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  categories: string[];
  sizes: string[];
  colors: string[];
  totalProducts: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  sizes,
  colors,
  totalProducts
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'size']);

  const updateFilters = (updates: Partial<SearchFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: string; 
    children: React.ReactNode; 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-yellow-500" />
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: expandedSections.includes(section) ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-gray-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {expandedSections.includes(section) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center space-x-3 w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
        >
          <Filter size={20} />
          <span>Filters & Search</span>
          {hasActiveFilters && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto bg-white text-yellow-600 text-xs px-3 py-1 rounded-full font-bold"
            >
              {Object.keys(filters).length}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Desktop Filters */}
      <AnimatePresence>
        {(!isMobileFiltersOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:block"
          >
            <div className="p-6 space-y-6">
              {/* Modern Search Bar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Results Count and Clear Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-800">
                    {totalProducts}
                  </span>
                  <span className="text-gray-600">
                    {totalProducts === 1 ? 'product' : 'products'} found
                  </span>
                </div>
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
                  >
                    <X size={16} />
                    <span>Clear all</span>
                  </motion.button>
                )}
              </div>

              {/* Filter Sections */}
              <div className="space-y-2">
                {/* Categories */}
                <FilterSection title="Categories" section="category">
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateFilters({ category: filters.category === category ? undefined : category })}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          filters.category === category
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-400/30'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </FilterSection>

                {/* Sizes */}
                <FilterSection title="Sizes" section="size">
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateFilters({ size: filters.size === size ? undefined : size })}
                        className={`p-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                          filters.size === size
                            ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg shadow-blue-400/30'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </FilterSection>

                {/* Colors */}
                <FilterSection title="Colors" section="color">
                  <div className="grid grid-cols-6 gap-3">
                    {colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateFilters({ color: filters.color === color ? undefined : color })}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          filters.color === color
                            ? 'border-gray-800 shadow-lg scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Range" section="price">
                  <div className="space-y-4">
                    {['Under $50', '$50 - $100', '$100 - $200', 'Over $200'].map((range) => (
                      <motion.button
                        key={range}
                        whileHover={{ x: 5 }}
                        onClick={() => updateFilters({ priceRange: filters.priceRange === range ? undefined : range })}
                        className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
                          filters.priceRange === range
                            ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg shadow-green-400/30'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="font-medium">{range}</span>
                      </motion.button>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters; 