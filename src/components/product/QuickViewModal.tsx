import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, ArrowRight, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../ui/ToastProvider';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullDetails?: () => void;
}

const DEFAULT_COLOR = { name: 'Standard', value: '#111111' };

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onViewFullDetails,
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const modalPanelRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useFocusTrap(isOpen && !!product, modalPanelRef, onClose);

  const resolvedColor = useMemo(() => {
    if (!product) return DEFAULT_COLOR;
    return product.colors[0] ?? DEFAULT_COLOR;
  }, [product]);

  useEffect(() => {
    if (!isOpen || !product) return;
    setCurrentImageIndex(0);
    setSelectedSize(null);
    setQuantity(1);
  }, [isOpen, product?.id]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const imageCount = product.images.length;
  const hasMultipleImages = imageCount > 1;

  const goPrevImage = () => {
    setCurrentImageIndex((i) => (i - 1 + imageCount) % imageCount);
  };

  const goNextImage = () => {
    setCurrentImageIndex((i) => (i + 1) % imageCount);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      showToast('Please select a size', 'warning');
      return;
    }

    setIsAddingToCart(true);
    try {
      addToCart(product.id, selectedSize, resolvedColor, quantity);
      showToast(`${product.name} added to cart!`, 'success');
      setTimeout(() => {
        setIsAddingToCart(false);
        onClose();
      }, 500);
    } catch {
      showToast('Failed to add to cart', 'error');
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist!', 'success');
    }
  };

  const handleViewFullDetails = () => {
    onClose();
    onViewFullDetails?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 pointer-events-none"
          >
            <div
              ref={modalPanelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-view-product-title"
              className="pointer-events-auto flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile drag handle */}
              <div className="flex shrink-0 justify-center border-b border-gray-100 py-2 md:hidden" aria-hidden>
                <span className="h-1 w-10 rounded-full bg-gray-300" />
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:grid md:grid-cols-2">
                {/* Image — first on mobile */}
                <div className="relative shrink-0 bg-gray-100 md:aspect-auto md:min-h-0">
                  <div className="relative mx-auto aspect-[4/5] max-h-[42vh] w-full sm:max-h-[48vh] md:aspect-square md:max-h-none">
                    <img
                      src={product.images[currentImageIndex]}
                      alt={`${product.name}, photo ${currentImageIndex + 1} of ${imageCount}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                      aria-label="Close quick view"
                    >
                      <X size={20} className="text-black" aria-hidden />
                    </button>

                    {hasMultipleImages && (
                      <>
                        <button
                          type="button"
                          onClick={goPrevImage}
                          className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm md:left-3"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft size={22} className="text-black" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={goNextImage}
                          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm md:right-3"
                          aria-label="Next photo"
                        >
                          <ChevronRight size={22} className="text-black" aria-hidden />
                        </button>
                      </>
                    )}
                  </div>

                  {hasMultipleImages && (
                    <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-white px-3 py-2.5">
                      <span className="sr-only">
                        Photo {currentImageIndex + 1} of {imageCount}
                      </span>
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Show photo ${index + 1} of ${imageCount}`}
                          aria-current={index === currentImageIndex ? 'true' : undefined}
                          className="qv-image-dot flex h-11 w-11 items-center justify-center rounded-full"
                        >
                          <span
                            className={`block h-1.5 rounded-full transition-all ${
                              index === currentImageIndex
                                ? 'w-5 bg-black'
                                : 'w-1.5 bg-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                      <p className="ml-1 text-xs font-medium text-gray-500 tabular-nums" aria-hidden>
                        {currentImageIndex + 1}/{imageCount}
                      </p>
                    </div>
                  )}
                </div>

                {/* Details — scrollable */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8">
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <h2
                        id="quick-view-product-title"
                        className="text-xl font-black text-black sm:text-2xl md:text-3xl"
                      >
                        {product.name}
                      </h2>
                      <p className="mt-1 text-lg font-bold text-black sm:text-2xl">
                        R{(product.price / 100).toFixed(2)}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base line-clamp-4 sm:line-clamp-none">
                      {product.description}
                    </p>

                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-black sm:mb-3 sm:text-sm">
                        Size <span className="font-normal text-gray-500">(required)</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`min-h-[44px] min-w-[44px] rounded-full px-5 py-2.5 text-sm font-bold transition-all sm:text-base ${
                              selectedSize === size
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-black hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-black sm:mb-3 sm:text-sm">
                        Quantity
                      </p>
                      <div
                        className="inline-flex min-h-[48px] items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1 py-1 shadow-md"
                        role="group"
                        aria-label="Quantity"
                      >
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="qv-stepper-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black transition-colors hover:bg-gray-100 disabled:opacity-35"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={18} strokeWidth={2.5} className="text-black" aria-hidden />
                        </button>
                        <span
                          className="min-w-[2.75rem] border-x border-gray-100 px-2 text-center text-lg font-bold tabular-nums text-black sm:min-w-[3rem] sm:text-xl"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="qv-stepper-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black transition-colors hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={18} strokeWidth={2.5} className="text-black" aria-hidden />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
                      <motion.button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || !selectedSize}
                        className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-3.5 text-sm font-bold !text-white shadow-sm transition-all hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-black disabled:!text-white/80 sm:text-base [&_svg]:text-white"
                        whileTap={{ scale: 0.98 }}
                      >
                        {isAddingToCart ? (
                          <span className="text-white">Adding…</span>
                        ) : (
                          <>
                            <ShoppingBag size={18} className="text-white" aria-hidden />
                            <span className="text-white">Add to Cart</span>
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={handleWishlistToggle}
                        className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 px-4 py-3 font-bold transition-all sm:w-14 sm:gap-0 ${
                          isWishlisted
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-black bg-white text-black hover:bg-red-50'
                        }`}
                        whileTap={{ scale: 0.98 }}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart
                          size={20}
                          className={isWishlisted ? 'fill-current' : ''}
                          aria-hidden
                        />
                        <span className="sm:hidden">
                          {isWishlisted ? 'Saved' : 'Wishlist'}
                        </span>
                      </motion.button>
                    </div>

                    <button
                      type="button"
                      onClick={handleViewFullDetails}
                      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-gray-50 hover:shadow-lg sm:text-base"
                    >
                      View full details
                      <ArrowRight size={18} aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
