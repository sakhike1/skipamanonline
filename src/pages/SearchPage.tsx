import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../components/ui/SearchBar';
import ProductGrid from '../components/product/ProductGrid';
import { useProductData } from '../context/ProductDataContext';
import { Product } from '../types';

const SearchPage: React.FC = () => {
  const { products, searchProducts, loading: catalogLoading } = useProductData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  // Initialize search results
  const [searchResults, setSearchResults] = useState<Product[]>(
    query ? searchProducts(query) : products.filter(p => p.isActive)
  );

  // Re-run the current search once the catalogue has loaded or changed
  useEffect(() => {
    if (catalogLoading) return;
    setSearchResults(query.trim() ? searchProducts(query.trim()) : products.filter((p) => p.isActive));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, catalogLoading]);

  // Perform search with improved algorithm
  const performSearch = useCallback((searchQuery: string) => {
    setIsSearching(true);
    
    // Use requestAnimationFrame for smoother UI updates
    requestAnimationFrame(() => {
      const results = searchQuery.trim() 
        ? searchProducts(searchQuery.trim())
        : products.filter(p => p.isActive);
      
      setSearchResults(results);
      setIsSearching(false);
    });
  }, []);

  // Handle search - updates URL and performs search
  const handleSearch = useCallback((searchQuery: string) => {
    // Update URL
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  // Perform search when query changes (from URL)
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  // Handle product click with scroll to top
  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }, [navigate]);

  // Get popular searches from actual products
  const popularSearches = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    const tags = products.flatMap(p => p.tags);
    const popularTags = [...new Set(tags)].slice(0, 4);
    return [...categories.slice(0, 2), ...popularTags.slice(0, 2)];
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Search Results
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Find exactly what you're looking for in our premium collection
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <SearchBar 
                onSearch={handleSearch}
                initialValue={query}
                placeholder="Search for products, categories, or styles..."
                className="mx-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-12">
        {query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">
              Search Results for "{query}"
            </h2>
            <p className="text-gray-400">
              {isSearching ? 'Searching...' : `${searchResults.length} products found`}
            </p>
          </motion.div>
        )}

        {/* Results Grid */}
        {isSearching ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProductGrid products={searchResults} onProductClick={handleProductClick} />
          </motion.div>
        ) : query ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-4">No results found</h3>
              <p className="text-gray-400 mb-8">
                We couldn't find any products matching "{query}". Try different keywords or browse our categories.
              </p>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Popular searches:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">All Products</h2>
              <p className="text-gray-400">
                {searchResults.length} products available
              </p>
            </div>
            <ProductGrid products={searchResults} onProductClick={handleProductClick} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 