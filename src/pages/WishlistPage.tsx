import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ArrowLeft, 
  ShoppingBag, 
  Trash2, 
  Eye, 
  Search,
  Grid,
  List,
  X,
  Star,
  Clock,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import AuthPrompt from '../components/auth/AuthPrompt';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist, getWishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Get unique categories from wishlist items
  const categories = ['all', ...new Set(wishlist.map(item => item.product.category))];

  // Filter and sort wishlist items
  const filteredWishlist = wishlist
    .filter(item => {
      const matchesSearch = item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.product.name.localeCompare(b.product.name);
        case 'price':
          return a.product.price - b.product.price;
        case 'date':
        default:
          return b.addedAt.getTime() - a.addedAt.getTime();
      }
    });

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    setAddingToCart(product.id);
    try {
      // Use default size and color from product
      const defaultSize = product.sizes[0] || 'M';
      const defaultColor = product.colors[0] || { name: 'Default', value: '#000000' };
      addToCart(product.id, defaultSize, defaultColor, 1);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/background1.jpg)',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="bg-black/20 backdrop-blur-sm border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                  </Link>
                  <div className="h-6 w-px bg-white/30"></div>
                  <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-32 h-32 mx-auto mb-8 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20"
              >
                <Heart size={48} className="text-white" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-6">
                Your Wishlist is Empty
              </h2>
              
              <p className="text-xl text-white/80 mb-10 max-w-lg mx-auto leading-relaxed">
                Start building your wishlist by browsing our amazing collection and saving items you love. 
                Your perfect style awaits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <ShoppingBag size={20} />
                  Browse Products
                </Link>
                
                <Link
                  to="/lookbook"
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-2xl font-bold border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <Heart size={20} />
                  View Lookbook
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/background1.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Home</span>
                </Link>
                <div className="h-6 w-px bg-white/30"></div>
                <h1 className="text-2xl font-bold text-white">
                  My Wishlist ({getWishlistCount()})
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleClearWishlist}
                  className="text-white/80 hover:text-red-400 transition-colors duration-300 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20"
                >
                  <Trash2 size={16} />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 transition-all duration-300"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white transition-all duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-black text-white">
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'price')}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white transition-all duration-300"
                >
                  <option value="date" className="bg-black text-white">Date Added</option>
                  <option value="name" className="bg-black text-white">Name</option>
                  <option value="price" className="bg-black text-white">Price</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-white/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-black' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-white text-black' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredWishlist.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 overflow-hidden group border border-white/20 hover:border-white/30"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-black/20">
                    <img
                      src={item.product.images[0] || '/images/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.product.id)}
                      className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
                    >
                      <X size={16} className="text-white" />
                    </button>
                    {item.product.featured && (
                      <div className="absolute top-3 left-3 bg-white text-black text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-white mb-3 line-clamp-2 text-lg">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-white/70 mb-3 line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-white">
                        R{(item.product.price / 100).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-white/80">4.5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/60 mb-5">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Added {formatDate(item.addedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        {item.product.category}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-white/30 hover:border-white/50 font-medium"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button
                        onClick={() => handleAddToCart(item.product)}
                        disabled={addingToCart === item.product.id}
                        className="flex-1 bg-white text-black py-3 px-4 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 font-bold shadow-lg hover:shadow-xl"
                      >
                        {addingToCart === item.product.id ? (
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredWishlist.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 p-6 border border-white/20 hover:border-white/30"
                >
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-black/20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0] || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white mb-2 text-lg">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-white/70 mb-3 line-clamp-2">
                        {item.product.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Added {formatDate(item.addedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag size={12} />
                          {item.product.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span>4.5</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <span className="text-2xl font-bold text-white">
                        R{(item.product.price / 100).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/product/${item.product.id}`)}
                          className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.product.id)}
                          className="p-3 text-white/80 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 border border-white/20 hover:border-red-400/50"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(item.product)}
                          disabled={addingToCart === item.product.id}
                          className="bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 font-bold shadow-lg hover:shadow-xl"
                        >
                          {addingToCart === item.product.id ? (
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

          {filteredWishlist.length === 0 && wishlist.length > 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20">
                <Search size={32} className="text-white/60" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No items found</h3>
              <p className="text-white/70 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                }}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/30 hover:border-white/50"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Auth Prompt */}
        <AuthPrompt
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          action="add_to_cart"
          title="Add to Cart"
          description="Log in to add items to your cart and start shopping"
        />
      </div>
    </div>
  );
};

export default WishlistPage;