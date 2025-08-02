import React, { useState } from 'react';
import { SearchFilters as SearchFiltersType, Size } from '../../types';
import { X, Filter, Search } from 'lucide-react';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  categories: string[];
  sizes: Size[];
  colors: { name: string; value: string }[];
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

  const updateFilters = (updates: Partial<SearchFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-200">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Filter size={20} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="ml-auto bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
              {Object.keys(filters).length}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className={`lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'}`}>
        <div className="p-4 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
          </div>

          {/* Results Count and Clear Filters */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X size={16} />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.category === category}
                    onChange={(e) => {
                      updateFilters({
                        category: e.target.checked ? category : undefined
                      });
                    }}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.[0] || ''}
                  onChange={(e) => {
                    const min = e.target.value ? Number(e.target.value) : undefined;
                    updateFilters({
                      priceRange: [min, filters.priceRange?.[1]].filter(Boolean) as [number, number] | undefined
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.[1] || ''}
                  onChange={(e) => {
                    const max = e.target.value ? Number(e.target.value) : undefined;
                    updateFilters({
                      priceRange: [filters.priceRange?.[0], max].filter(Boolean) as [number, number] | undefined
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Sizes</h3>
            <div className="grid grid-cols-2 gap-2">
              {sizes.map((size) => (
                <label key={size} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.sizes?.includes(size) || false}
                    onChange={(e) => {
                      const currentSizes = filters.sizes || [];
                      const newSizes = e.target.checked
                        ? [...currentSizes, size]
                        : currentSizes.filter(s => s !== size);
                      updateFilters({
                        sizes: newSizes.length > 0 ? newSizes : undefined
                      });
                    }}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                  />
                  <span className="text-sm text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Colors</h3>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color) => (
                <label key={color.name} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.colors?.includes(color.name) || false}
                    onChange={(e) => {
                      const currentColors = filters.colors || [];
                      const newColors = e.target.checked
                        ? [...currentColors, color.name]
                        : currentColors.filter(c => c !== color.name);
                      updateFilters({
                        colors: newColors.length > 0 ? newColors : undefined
                      });
                    }}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                  <span className="text-sm text-gray-700">{color.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => updateFilters({ rating })}
                    className="border-gray-300 text-gray-900 focus:ring-gray-800"
                  />
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">& up</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
            <select
              value={`${filters.sortBy || 'newest'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as ['price' | 'rating' | 'newest' | 'popularity', 'asc' | 'desc'];
                updateFilters({ sortBy, sortOrder });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              <option value="newest-desc">Newest First</option>
              <option value="newest-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="popularity-desc">Most Popular</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters; 