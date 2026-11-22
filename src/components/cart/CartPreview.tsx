import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../data/products';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CartPreviewProps {
  onClose: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const cartPanelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(true, cartPanelRef, onClose);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const formatPrice = (price: number) => {
    return `R${price.toFixed(2)}`;
  };

  useEffect(() => {
    const initialScrollY = window.scrollY;

    const handleClickOutside = (event: MouseEvent) => {
      if (cartPanelRef.current && !cartPanelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      if (Math.abs(window.scrollY - initialScrollY) > 20) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onClose]);

  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleQuantityClick = (
    e: React.MouseEvent,
    indexFn: (index: number, quantity: number) => void,
    index: number,
    quantity: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    indexFn(index, quantity);
  };

  const prevItemsLength = useRef(cart.items.length);
  useEffect(() => {
    if (prevItemsLength.current > 0 && cart.items.length === 0) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
    prevItemsLength.current = cart.items.length;
  }, [cart.items.length, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] max-md:bg-black/70 max-md:backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          aria-hidden
        />

        <motion.div
          ref={cartPanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-preview-title"
          className="cart-preview-dialog relative flex h-[100dvh] max-h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl max-md:m-0 max-md:max-h-none max-md:max-w-none max-md:w-screen max-md:rounded-none"
          onClick={handlePanelClick}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
        >
          {cart.items.length === 0 ? (
            <div className="sticky top-0 z-10 flex items-center justify-end border-b border-neutral-200 bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-950 text-white shadow-lg transition-all duration-300 hover:bg-neutral-800"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={2.5} className="shrink-0" aria-hidden />
              </button>
            </div>
          ) : (
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
              <h2 id="cart-preview-title" className="flex items-center text-lg font-semibold">
                <ShoppingBag size={20} className="mr-2" aria-hidden />
                Your Cart ({cart.items.reduce((total, item) => total + item.quantity, 0)})
              </h2>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-950 text-white shadow-lg transition-all duration-300 hover:bg-neutral-800"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={2.5} className="shrink-0" aria-hidden />
              </button>
            </div>
          )}

          <div
            className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 ${
              cart.items.length === 0
                ? 'max-md:bg-gradient-to-b max-md:from-neutral-100/90 max-md:to-white'
                : ''
            }`}
          >
            {cart.items.length === 0 ? (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center">
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/15 via-white to-fuchsia-500/15 text-neutral-600 shadow-inner ring-1 ring-neutral-900/10"
                  aria-hidden
                >
                  <ShoppingBag className="h-12 w-12" strokeWidth={1.25} />
                </div>
                <p
                  id="cart-preview-title"
                  className="mt-8 max-w-xs text-2xl font-black leading-tight tracking-tight text-neutral-950 sm:max-w-sm sm:text-3xl"
                >
                  Your cart is{' '}
                  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    empty
                  </span>
                </p>
                <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-neutral-600">
                  Shipping and taxes are calculated at checkout.
                </p>
                <Link
                  to="/shop"
                  className="mt-10 inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-2xl bg-gradient-to-r from-neutral-950 to-neutral-900 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_16px_44px_-10px_rgba(91,33,182,0.35)] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                  onClick={onClose}
                >
                  Browse the shop
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-2xl border-2 border-neutral-900/90 bg-white px-8 py-3.5 text-sm font-bold text-neutral-900 shadow-sm transition-all duration-200 hover:border-neutral-950 hover:bg-neutral-50 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item, index) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;

                  return (
                    <li key={`${item.productId}-${item.size}-${item.color.name}-${index}`} className="flex py-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{product.name}</h3>
                            <p className="ml-4">{formatPrice((product.price / 100) * item.quantity)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.color.name} / Size {item.size}
                          </p>
                        </div>

                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center rounded-lg border-2 border-gray-300 bg-white">
                            <button
                              type="button"
                              className="border-r-2 border-gray-300 px-3 py-1 font-semibold text-black transition-colors hover:bg-gray-100"
                              onClick={(e) =>
                                handleQuantityClick(e, updateQuantity, index, Math.max(1, item.quantity - 1))
                              }
                            >
                              -
                            </button>
                            <span className="px-4 py-1 font-medium text-black">{item.quantity}</span>
                            <button
                              type="button"
                              className="border-l-2 border-gray-300 px-3 py-1 font-semibold text-black transition-colors hover:bg-gray-100"
                              onClick={(e) => handleQuantityClick(e, updateQuantity, index, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            className="font-medium text-black hover:text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(index);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="sticky bottom-0 z-10 space-y-4 border-t border-gray-200 bg-white p-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>{formatPrice(cart.total)}</p>
              </div>
              <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = '/checkout';
                  }}
                  className="rounded-full bg-black py-3 text-white hover:bg-gray-900"
                >
                  Checkout <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="rounded-full border border-black py-3 text-black transition-colors hover:bg-gray-100 hover:text-black"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartPreview;
