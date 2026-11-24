import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProductData } from '../../context/ProductDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CartPreviewProps {
  onClose: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ onClose }) => {
  const { getProductById } = useProductData();
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

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const closeBtn = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#10282c]/15 bg-white text-[#10282c] transition hover:bg-[#10282c] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10282c]"
      aria-label="Close cart"
    >
      <X size={18} aria-hidden />
    </button>
  );
  const primaryBtn =
    'inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#10282c] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1b3b40] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10282c]';
  const secondaryBtn =
    'inline-flex w-full items-center justify-center rounded-full border border-[#10282c]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#10282c] transition hover:bg-[#10282c] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10282c]';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <style>{`
          .cart-art {
            background-image: linear-gradient(135deg, #c9f0e4, #cfe8ff, #fbe9c8, #c9f0e4);
            background-size: 300% 300%;
            animation: cart-art-shift 14s ease-in-out infinite;
          }
          @keyframes cart-art-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          @keyframes cart-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          .cart-bob { animation: cart-bob 4s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .cart-art, .cart-bob { animation: none; } }
        `}</style>

        <motion.div
          className="fixed inset-0 bg-[#10282c]/40"
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
          className="cart-preview-dialog relative flex h-[100dvh] max-h-screen w-full max-w-md flex-col overflow-hidden bg-gradient-to-b from-[#eef6f4] to-white text-[#10282c] shadow-2xl max-md:m-0 max-md:max-h-none max-md:max-w-none max-md:w-screen md:rounded-r-[2rem]"
          onClick={handlePanelClick}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-6 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))]">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#10282c] text-white">
                <ShoppingBag size={18} aria-hidden />
              </span>
              <h2 id="cart-preview-title" className="text-xl font-semibold tracking-tight">
                Your cart
                {itemCount > 0 && (
                  <span className="ml-2 rounded-full bg-[#c9f0e4] px-2.5 py-0.5 align-middle text-xs font-semibold">
                    {itemCount}
                  </span>
                )}
              </h2>
            </div>
            {closeBtn}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-4">
            {cart.items.length === 0 ? (
              <div className="flex min-h-0 flex-1 flex-col justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <div className="cart-art relative overflow-hidden rounded-[1.75rem] px-6 py-10 text-center">
                  <div className="cart-bob mx-auto grid h-20 w-20 place-items-center rounded-full bg-white shadow-[0_14px_30px_-14px_rgba(16,40,44,0.5)]" aria-hidden>
                    <ShoppingBag className="h-9 w-9" strokeWidth={1.5} />
                  </div>
                  <p className="mt-6 text-3xl font-black leading-[1] tracking-[-0.04em]">Your cart is empty</p>
                  <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-[#10282c]/70">
                    Shipping and taxes are calculated at checkout.
                  </p>
                </div>
                <div className="mt-5 space-y-3">
                  <Link to="/shop" onClick={onClose} className={primaryBtn}>
                    Browse the shop
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                  <button type="button" onClick={onClose} className={secondaryBtn}>
                    Continue shopping
                  </button>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {cart.items.map((item, index) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;

                  return (
                    <li
                      key={`${item.productId}-${item.size}-${item.color.name}-${index}`}
                      className="flex gap-4 rounded-[1.5rem] border border-[#10282c]/10 bg-white p-3"
                    >
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#eef6f4]">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                          <p className="shrink-0 text-sm font-semibold">
                            {formatPrice((product.price / 100) * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs text-[#4b6468]">
                          {item.color.name} / Size {item.size}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-[#10282c]/15 bg-[#eef6f4]">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              className="grid h-8 w-8 place-items-center rounded-full text-base font-semibold transition hover:bg-[#c9f0e4]"
                              onClick={(e) =>
                                handleQuantityClick(e, updateQuantity, index, Math.max(1, item.quantity - 1))
                              }
                            >
                              -
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              className="grid h-8 w-8 place-items-center rounded-full text-base font-semibold transition hover:bg-[#c9f0e4]"
                              onClick={(e) => handleQuantityClick(e, updateQuantity, index, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            className="text-xs font-semibold text-[#4b6468] underline underline-offset-4 transition hover:text-[#10282c]"
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
            <div className="space-y-3 border-t border-[#10282c]/10 bg-white px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-[#4b6468]">Subtotal</p>
                <p className="text-2xl font-black tracking-tight">{formatPrice(cart.total)}</p>
              </div>
              <p className="text-xs text-[#4b6468]">Shipping and taxes calculated at checkout.</p>
              <button
                type="button"
                className={primaryBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = '/checkout';
                }}
              >
                Checkout
                <ArrowRight size={16} aria-hidden />
              </button>
              <button type="button" className={secondaryBtn} onClick={onClose}>
                Continue shopping
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartPreview;
