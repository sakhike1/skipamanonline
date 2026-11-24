import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, Flame, ArrowUpRight } from 'lucide-react';
import { products } from '../../data/products';
import QuickViewModal from '../product/QuickViewModal';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../ui/ToastProvider';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  theme: 'dark' | 'light';
  onQuickView: (product: Product) => void;
  trending?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, theme, onQuickView, trending = false }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageCount = product.images?.length ?? 0;
  const isDarkTheme = theme === 'dark';
  const isWishlisted = isInWishlist(product.id);

  useEffect(() => {
    if (imageCount <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % imageCount);
    }, isHovered ? 2000 : 7000);

    return () => window.clearInterval(interval);
  }, [imageCount, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (imageCount > 1) setCurrentIndex((index) => (index + 1) % imageCount);
  };

  const handleMouseLeave = () => setIsHovered(false);

  const handleQuickView = (event: React.MouseEvent) => {
    event.stopPropagation();
    onQuickView(product);
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



  return (
    <div 
      className={`group flex h-full min-w-0 cursor-pointer flex-col rounded-[1.75rem] border bg-white p-3 text-[#211527] transition duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${
        isDarkTheme
          ? 'border-white/40 shadow-[0_24px_50px_-28px_rgba(20,10,80,0.75)] hover:border-[color:var(--home-lime)]'
          : 'border-[#211527]/10 hover:border-[#211527]/30'
      }`}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`skipaman-drop-image relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-[#f3eff5]`}>
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

        {trending && (
          <span className="skipaman-hot-badge">
            <Flame size={13} aria-hidden />
            Hot
          </span>
        )}

        <div
          className="absolute right-1.5 top-1.5 z-10 flex gap-1 opacity-100 sm:right-2 sm:top-2 sm:gap-1.5 transition-opacity md:opacity-0 md:group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
          role="group"
          aria-label="Product quick actions"
        >
          <button
            type="button"
            onClick={handleQuickView}
            className="na-card-action inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition-colors hover:bg-gray-100"
            aria-label="Quick view"
          >
            <Eye size={16} className="shrink-0" aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`na-card-action inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-100 ${isWishlisted ? 'text-red-500' : 'text-gray-900'}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} className={isWishlisted ? 'fill-current' : ''} aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="na-card-action inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition-colors hover:bg-gray-100 disabled:opacity-50"
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
          {product.images?.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentIndex ? 'bg-[#211527]' : 'bg-[#211527]/30'}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-2 pb-1">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug md:line-clamp-none">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-semibold tabular-nums text-[#6b5a73]">
          R{(product.price / 100).toFixed(2)}
        </p>
        
        {/* Action Buttons */}
        <div className="mt-auto flex pt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="group/btn inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[#211527] px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#33203f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]"
          >
            View Details
            <ArrowUpRight size={16} className="transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
};

const newArrivals = products.slice(0, 4);
const trendingProducts = [products[4], products[30], products[31], products[32]];

const NewArrivals: React.FC = () => {
  const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);


  return (
    <>
      <div className="skipaman-discovery">
        <section aria-labelledby="new-arrivals-heading" className="skipaman-arrivals skipaman-product-shell">
          <header className="skipaman-product-header">
            <h2 id="new-arrivals-heading">New Arrivals</h2>
            <p>The latest pieces to land at Skipaman.</p>
          </header>
          <div className="skipaman-product-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} theme="light" onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>

        <section aria-labelledby="trending-heading" className="skipaman-trending skipaman-product-shell">
          <header className="skipaman-product-header">
            <div>
              <span className="skipaman-trending-pill">
                <Flame size={14} aria-hidden />
                Hot right now
              </span>
              <h2 id="trending-heading">Trending Now</h2>
            </div>
            <button type="button" className="skipaman-trending-link" onClick={() => navigate('/shop')}>
              Explore All
              <ArrowUpRight size={18} aria-hidden />
            </button>
          </header>
          <div className="skipaman-product-grid">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} theme="dark" trending onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
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