import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../components/ui/SearchBar';
import ProductGrid from '../components/product/ProductGrid';
import { products } from '../data/products';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState(products);
  const [isSearching, setIsSearching] = useState(false);
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  // Handle search
  const handleSearch = (searchQuery: string) => {
    setIsSearching(true);
    
    // Update URL
    setSearchParams({ q: searchQuery });
    
    // Simulate search delay
    setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults(products);
      }
      setIsSearching(false);
    }, 300);
  };

  // Handle product click
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Initial search on component mount
  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, []);

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
                  {['Sport Collection', 'Urban Style', 'Premium Quality', 'New Arrivals'].map((term) => (
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-4">Start exploring</h3>
              <p className="text-gray-400">
                Use the search bar above to find products, or browse our featured collections.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 