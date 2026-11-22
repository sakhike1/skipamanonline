import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Heart,
  ArrowRight,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../ui/ToastProvider';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; value: string } | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || !product) return;
    setCurrentImageIndex(0);
    setSelectedSize('');
    setSelectedColor(product.colors[0] ?? null);
    setQuantity(1);
  }, [isOpen, product?.id, product]);

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

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      showToast('Please select size and color', 'warning');
      return;
    }

    addToCart(product.id, selectedSize, selectedColor, quantity);
    showToast(`${product.name} added to cart!`, 'success');
    onClose();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-[9999] flex items-end justify-center p-0 sm:items-center sm:p-4 pointer-events-none"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-quick-view-title"
              className="pointer-events-auto flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6">
                <h2 id="product-quick-view-title" className="text-lg font-black text-black sm:text-xl">
                  Quick view
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  aria-label="Close"
                >
                  <X size={20} className="text-black" />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:grid md:grid-cols-2 md:gap-0">
                <div className="relative shrink-0 bg-gray-100">
                  <div className="relative mx-auto aspect-[4/5] max-h-[42vh] w-full sm:max-h-[48vh] md:aspect-square md:max-h-none md:rounded-none">
                    <img
                      src={product.images[currentImageIndex]}
                      alt={`${product.name} — photo ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover md:rounded-none"
                    />
                    {hasMultipleImages && (
                      <>
                        <button
                          type="button"
                          onClick={goPrevImage}
                          className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft size={22} className="text-black" />
                        </button>
                        <button
                          type="button"
                          onClick={goNextImage}
                          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md"
                          aria-label="Next photo"
                        >
                          <ChevronRight size={22} className="text-black" />
                        </button>
                      </>
                    )}
                  </div>
                  {hasMultipleImages && (
                    <div className="flex items-center justify-center gap-1 border-t border-gray-100 bg-white px-2 py-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Photo ${index + 1} of ${imageCount}`}
                          aria-current={index === currentImageIndex ? 'true' : undefined}
                          className="qv-image-dot flex h-11 w-11 items-center justify-center"
                        >
                          <span
                            className={`block h-1.5 rounded-full transition-all ${
                              index === currentImageIndex ? 'w-5 bg-black' : 'w-1.5 bg-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-1 text-xs text-gray-500 tabular-nums">
                        {currentImageIndex + 1}/{imageCount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <h3 className="text-xl font-black text-black sm:text-2xl">{product.name}</h3>
                      <p className="mt-1 text-lg font-bold sm:text-2xl">
                        R{(product.price / 100).toFixed(2)}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 sm:text-base">{product.description}</p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider sm:text-sm">
                        Size <span className="text-gray-500">(required)</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`min-h-[44px] rounded-full px-5 py-2.5 text-sm font-bold ${
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

                    {product.colors.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider sm:text-sm">
                          Color <span className="text-gray-500">(required)</span>
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {product.colors.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => setSelectedColor(color)}
                              className={`h-11 w-11 rounded-full border-2 transition-all ${
                                selectedColor?.name === color.name
                                  ? 'border-black ring-2 ring-black ring-offset-2'
                                  : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color.value }}
                              aria-label={`Color ${color.name}`}
                              aria-pressed={selectedColor?.name === color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider sm:text-sm">
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
                          className="qv-stepper-btn flex h-10 w-10 items-center justify-center rounded-full text-black transition-colors hover:bg-gray-100 disabled:opacity-35"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={18} strokeWidth={2.5} className="text-black" aria-hidden />
                        </button>
                        <span className="min-w-[2.75rem] border-x border-gray-100 px-2 text-center text-lg font-bold tabular-nums text-black">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="qv-stepper-btn flex h-10 w-10 items-center justify-center rounded-full text-black transition-colors hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={18} strokeWidth={2.5} className="text-black" aria-hidden />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-black py-3.5 font-bold !text-white shadow-sm transition-colors hover:bg-gray-900 disabled:bg-black disabled:!text-white/80 [&_svg]:text-white"
                      >
                        <ShoppingBag size={20} className="text-white" />
                        <span className="text-white">Add to Cart</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleWishlistToggle}
                        className={`flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 px-4 sm:w-14 sm:px-0 ${
                          isWishlisted
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-black bg-white text-black'
                        }`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                        <span className="sm:hidden">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                      </button>
                    </div>
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

export default ProductQuickView;
