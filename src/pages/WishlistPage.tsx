import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';
import ProductCard from '../components/product/ProductCard';
import { Heart, ShoppingBag, ArrowLeft, Sparkles, Star, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addAllSuccess, setAddAllSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const wishlistProducts = wishlist.items
    .map(item => getProductById(item.productId))
    .filter((product): product is NonNullable<typeof product> => product !== undefined);

  const handleAddToCart = (productId: string) => {
    const product = getProductById(productId);
    if (product) {
      // Add with default size and color
      addToCart(productId, product.sizes[0], product.colors[0], 1);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-20 relative overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 text-purple-500/30"
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Heart size={80} fill="currentColor" />
          </motion.div>
          <motion.div
            className="absolute top-40 right-20 text-purple-400/25"
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, -20, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Heart size={60} fill="currentColor" />
          </motion.div>
          <motion.div
            className="absolute bottom-40 left-20 text-purple-300/20"
            animate={{ 
              y: [0, -35, 0],
              rotate: [0, 25, -25, 0],
              scale: [1, 1.4, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          >
            <Heart size={100} fill="currentColor" />
          </motion.div>
          
          {/* Floating sparkles */}
          <motion.div
            className="absolute top-1/4 right-1/4 text-purple-400/40"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Sparkles size={30} />
          </motion.div>
          <motion.div
            className="absolute bottom-1/3 right-1/3 text-purple-300/30"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1.5
            }}
          >
            <Star size={25} />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.div 
              className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/40 relative overflow-hidden"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 30px rgba(168, 85, 247, 0.4)",
                  "0 0 60px rgba(168, 85, 247, 0.8)",
                  "0 0 30px rgba(168, 85, 247, 0.4)"
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
              
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Heart className="text-white" size={50} fill="currentColor" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Your Wishlist is Empty
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Start building your wishlist by browsing our collection and adding items you love.
              Create your perfect collection with our premium designs.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white px-8 py-4 rounded-full hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 transition-all duration-300 shadow-2xl hover:shadow-purple-500/40 font-semibold text-lg group"
              >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Start Shopping</span>
                <Zap size={20} className="group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-20 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 text-purple-500/15"
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Heart size={120} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-10 text-purple-400/12"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, -25, 25, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
        >
          <Heart size={140} fill="currentColor" />
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 text-purple-400/20"
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Sparkles size={40} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-purple-300/25"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, -360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Star size={35} />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-black text-white mb-3 flex items-center gap-4"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.4)",
                  "0 0 40px rgba(168, 85, 247, 0.8)",
                  "0 0 20px rgba(168, 85, 247, 0.4)"
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              My Wishlist
              </span>
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-full shadow-lg shadow-purple-500/30"
              >
                <Heart className="text-white" size={28} fill="currentColor" />
              </motion.div>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TrendingUp className="text-purple-400" size={20} />
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your collection
            </motion.p>
          </div>
          
            <motion.button
              onClick={clearWishlist}
            className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 transition-all duration-300 shadow-2xl hover:shadow-purple-500/40 font-semibold group"
            whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Heart size={20} />
            </motion.div>
            <span>Clear Wishlist</span>
          </motion.button>
        </motion.div>

        {/* Enhanced Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {wishlistProducts.map((product, index) => (
            <motion.div 
              key={product.id} 
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <ProductCard 
                product={product} 
                onClick={(productId) => window.location.href = `/product/${productId}`}
              />
              
              {/* Enhanced Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <motion.button
                  onClick={() => handleAddToCart(product.id)}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 text-white"
                  title="Add to Cart"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ShoppingBag size={20} />
                </motion.button>
                <motion.button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-red-500/40 transition-all duration-300 text-white"
                  title="Remove from Wishlist"
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Heart size={20} className="fill-current" />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div 
          className="mt-16 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-black/40 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Enhanced animated background sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-6 right-6 text-purple-500/30"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <Sparkles size={30} />
            </motion.div>
            <motion.div
              className="absolute bottom-6 left-6 text-purple-400/25"
              animate={{ 
                rotate: [0, -360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity, 
                ease: "linear",
                delay: 2
              }}
            >
              <Sparkles size={25} />
            </motion.div>
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-300/20"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear",
                delay: 1
              }}
            >
              <Star size={20} />
            </motion.div>
          </div>

          <div className="relative z-10">
            <motion.h2 
              className="text-2xl font-black text-white mb-6 flex items-center gap-3"
              animate={{ 
                textShadow: [
                  "0 0 15px rgba(168, 85, 247, 0.4)",
                  "0 0 30px rgba(168, 85, 247, 0.8)",
                  "0 0 15px rgba(168, 85, 247, 0.4)"
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quick Actions
              </span>
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-full shadow-lg shadow-purple-500/30"
              >
                <Heart className="text-white" size={24} fill="currentColor" />
              </motion.div>
            </motion.h2>
            
            <div className="flex flex-wrap gap-6">
              {/* Add All to Cart Button */}
              <motion.button
                onClick={() => {
                  if (wishlistProducts.length > 0) {
                    wishlistProducts.forEach(product => {
                      handleAddToCart(product.id);
                    });
                    setAddAllSuccess(true);
                    setTimeout(() => setAddAllSuccess(false), 3000);
                  }
                }}
                className="relative flex items-center space-x-4 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white px-8 py-5 rounded-2xl hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 transition-all duration-300 shadow-2xl hover:shadow-purple-500/40 font-bold group overflow-hidden"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                disabled={wishlistProducts.length === 0}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
                
                {/* Button Content */}
                <div className="relative z-10 flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <AnimatePresence mode="wait">
                      {addAllSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle size={22} className="text-green-300" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="bag"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-300" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span className="text-lg">
                    {addAllSuccess ? "Added to Cart!" : "Add All to Cart"}
                  </span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Zap size={20} className="text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                </div>
                
                {/* Product Count Badge */}
                {wishlistProducts.length > 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {wishlistProducts.length}
                  </motion.div>
                )}
              </motion.button>

              {/* Clear Wishlist Button */}
              <motion.button
                onClick={() => {
                  if (wishlistProducts.length > 0) {
                    clearWishlist();
                    setClearSuccess(true);
                    setTimeout(() => setClearSuccess(false), 3000);
                  }
                }}
                className="relative flex items-center space-x-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-8 py-5 rounded-2xl hover:from-red-600 hover:via-red-700 hover:to-red-800 transition-all duration-300 shadow-2xl hover:shadow-red-500/40 font-bold group overflow-hidden"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                disabled={wishlistProducts.length === 0}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
                
                {/* Button Content */}
                <div className="relative z-10 flex items-center space-x-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    whileHover={{ scale: 1.3, rotate: 15 }}
                  >
                    <AnimatePresence mode="wait">
                      {clearSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle size={22} className="text-green-300" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="heart"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Heart size={22} className="fill-current group-hover:scale-110 transition-transform duration-300" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span className="text-lg">
                    {clearSuccess ? "Wishlist Cleared!" : "Clear Wishlist"}
                  </span>
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatePresence mode="wait">
                      {clearSuccess ? (
                        <motion.div
                          key="success-trash"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle size={20} className="text-green-300" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="trash"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
                
                {/* Empty State Indicator */}
                {wishlistProducts.length === 0 && (
                  <motion.div
                    className="absolute inset-0 bg-gray-400/50 rounded-2xl cursor-not-allowed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-600 font-medium">Wishlist Empty</span>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage; 