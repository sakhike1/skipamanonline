import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Heart, Eye } from 'lucide-react';
import { products } from '../../data/products';
import QuickViewModal from '../product/QuickViewModal';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../ui/ToastProvider';
import { Product } from '../../types';

const NewArrivals: React.FC = () => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const initialImageState = products.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {} as { [key: string]: number });
    setCurrentImageIndex(initialImageState);
  }, []);

  const newArrivals = products.slice(0, 4);
  
  const trendingProducts = [
    products[4],
    products[30],
    products[31],
    products[32],
  ];

  const ProductCard: React.FC<{ product: typeof products[0]; theme: 'dark' | 'light' }> = ({ product, theme }) => {
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const isDarkTheme = theme === 'dark';
    const isWishlisted = isInWishlist(product.id);
    const isHovered = hoveredProductId === product.id;

    useEffect(() => {
      if (isHovered || !product.images || product.images.length <= 1) return;
      
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [product.id]: ((prev[product.id] || 0) + 1) % product.images.length
        }));
      }, 7000);

      return () => clearInterval(interval);
    }, [isHovered, product.id, product.images]);

    useEffect(() => {
      if (!isHovered || !product.images || product.images.length <= 1) return;
      
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [product.id]: ((prev[product.id] || 0) + 1) % product.images.length
        }));
      }, 2000);

      return () => clearInterval(interval);
    }, [isHovered, product.id, product.images]);

    const handleMouseEnter = useCallback(() => {
      setHoveredProductId(product.id);
      if (product.images && product.images.length > 1) {
        setCurrentImageIndex(prev => ({
          ...prev,
          [product.id]: ((prev[product.id] || 0) + 1) % product.images.length
        }));
      }
    }, [product.id, product.images]);

    const handleMouseLeave = useCallback(() => {
      setHoveredProductId(null);
    }, []);

    const handleQuickView = (e: React.MouseEvent) => {
      e.stopPropagation();
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsAddingToCart(true);
      try {
        const defaultSize = product.sizes[0];
        const defaultColor = product.colors[0] || { name: 'Default', value: '#000000' };
        addToCart(product.id, defaultSize, defaultColor, 1);
        showToast(`${product.name} added to cart!`, 'success');
      } catch {
        showToast('Failed to add to cart', 'error');
      } finally {
        setTimeout(() => setIsAddingToCart(false), 500);
      }
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isWishlisted) {
        removeFromWishlist(product.id);
        showToast('Removed from wishlist', 'info');
      } else {
        addToWishlist(product);
        showToast('Added to wishlist!', 'success');
      }
    };

    const currentIndex = currentImageIndex[product.id] || 0;

    return (
      <div 
        className="group cursor-pointer" 
        onClick={() => navigate(`/product/${product.id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`aspect-[3/4] overflow-hidden relative rounded-xl ${isDarkTheme ? 'bg-neutral-900' : 'bg-gray-100'}`}>
          {product.images && product.images.length > 0 ? (
            product.images.map((imageSrc, index) => (
              <img
                key={`${product.id}-${index}`}
                src={imageSrc}
                alt={`${product.name} - Image ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}

          <div
            className="absolute right-2 top-2 z-10 flex gap-1.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
            role="group"
            aria-label="Product quick actions"
          >
            <button
              type="button"
              onClick={handleQuickView}
              className="na-card-action inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-gray-900 shadow-md transition-colors hover:bg-gray-100"
              aria-label="Quick view"
            >
              <Eye size={16} className="shrink-0" aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleWishlistToggle}
              className={`na-card-action inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white shadow-md transition-colors hover:bg-gray-100 ${isWishlisted ? 'text-red-500' : 'text-gray-900'}`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} className={isWishlisted ? 'fill-current' : ''} aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="na-card-action inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-gray-900 shadow-md transition-colors hover:bg-gray-100 disabled:opacity-50"
              aria-label="Add to cart"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag size={16} />
              )}
            </button>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentIndex ? (isDarkTheme ? 'bg-white' : 'bg-black') : (isDarkTheme ? 'bg-white/40' : 'bg-black/30')}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3
            className={`line-clamp-2 text-base font-semibold leading-snug md:line-clamp-none ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}
          >
            {product.name}
          </h3>
          <p className={`text-base font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            R{(product.price / 100).toFixed(2)}
          </p>
          
          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                isDarkTheme 
                  ? 'bg-white text-black hover:bg-gray-100' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              View Details
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                isDarkTheme 
                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {isAddingToCart ? (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* New Arrivals Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <p className="text-sm font-medium text-gray-500 tracking-widest uppercase mb-4">
              New Collection
            </p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                  New Arrivals
                </h2>
                <p className="mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
                  Discover our latest collection of premium streetwear, designed for those who appreciate quality and style.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('/new-arrivals')}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 sm:w-auto"
                >
                  <ShoppingBag size={18} />
                  Shop Collection
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/lookbook')}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 sm:w-auto"
                >
                  View Lookbook
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-6 lg:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} theme="light" />
            ))}
          </div>

        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              What's <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-300 animate-pulse font-bold" style={{ textShadow: '0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.5), 0 0 60px rgba(234, 88, 12, 0.3)' }}>🔥 HOT 🔥</span>
            </p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  Trending Now
                </h2>
                <p className="mt-4 max-w-xl text-base text-gray-400 sm:text-lg">
                  Discover the styles everyone's talking about. These pieces are flying off the shelves.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-100 sm:w-auto sm:justify-start"
              >
                Explore All
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-6 lg:gap-8">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} theme="dark" />
            ))}
          </div>

        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProduct(null);
        }}
        onViewFullDetails={() => {
          if (quickViewProduct) {
            navigate(`/product/${quickViewProduct.id}`);
          }
        }}
      />
    </>
  );
};

export default NewArrivals;