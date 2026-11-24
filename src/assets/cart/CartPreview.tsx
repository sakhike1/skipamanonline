import React, { useRef, useEffect } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProductData } from '../../context/ProductDataContext';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface CartPreviewProps {
  onClose: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ onClose }) => {
  const { getProductById } = useProductData();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const cartPanelRef = useRef<HTMLDivElement>(null);
  
  // Format price
  const formatPrice = (price: number) => {
    return `R${price.toFixed(2)}`;
  };
  
  // Click outside handler & Scroll handler
  useEffect(() => {
    const initialScrollY = window.scrollY;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (cartPanelRef.current && !cartPanelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleScroll = () => {
      if (Math.abs(window.scrollY - initialScrollY) > 20) { // Close if scrolled more than 20px from open position
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
  
  // Stop propagation on panel click to prevent closing
  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Prevent closing on quantity button clicks
  const handleQuantityClick = (e: React.MouseEvent, indexFn: (index: number, quantity: number) => void, index: number, quantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    indexFn(index, quantity);
  };

  // Auto close when cart becomes empty (after removing last item)
  const prevItemsLength = useRef(cart.items.length);
  useEffect(() => {
    if (prevItemsLength.current > 0 && cart.items.length === 0) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // Wait for 2.5 seconds to show the empty message
      return () => clearTimeout(timer);
    }
    prevItemsLength.current = cart.items.length;
  }, [cart.items.length, onClose]);
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />
        
        {/* Cart panel */}
        <motion.div 
          ref={cartPanelRef}
          className="relative w-full max-w-md bg-white h-screen shadow-xl flex flex-col overflow-hidden"
          onClick={handlePanelClick}
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold flex items-center">
              <ShoppingBag size={20} className="mr-2" />
              Your Cart ({cart.items.reduce((total, item) => total + item.quantity, 0)})
            </h2>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 rounded-full bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg"
              aria-label="Close cart"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Cart items */}
          <div className="flex-1 overflow-y-auto py-4 px-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            {cart.items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-full px-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-28 h-28 bg-black rounded-2xl flex items-center justify-center mb-8 shadow-2xl"
                >
                  <ShoppingBag size={56} className="text-white" strokeWidth={1.5} />
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-black text-black mb-4 tracking-tight"
                >
                  Your Collection Awaits
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-700 leading-relaxed mb-8 max-w-sm font-medium"
                >
                  Curate your signature style. Discover pieces crafted for those who demand excellence and refuse to blend in.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-3 w-full max-w-xs"
                >
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/shop';
                    }}
                    className="bg-black text-white hover:bg-gray-900 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Explore Collection
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/';
                    }}
                    className="border-2 border-black text-black hover:bg-black hover:text-white py-4 rounded-xl font-bold transition-all duration-300"
                  >
                    Return Home
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item, index) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  
                  return (
                    <li key={`${item.productId}-${item.size}-${item.color.name}-${index}`} className="py-4 flex">
                      {/* Product image */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      
                      {/* Product details */}
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
                        
                        {/* Quantity and remove */}
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border-2 border-gray-300 rounded-lg bg-white">
                            <button 
                              className="px-3 py-1 border-r-2 border-gray-300 text-black hover:bg-gray-100 transition-colors font-semibold"
                              onClick={(e) => handleQuantityClick(e, updateQuantity, index, Math.max(1, item.quantity - 1))}
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-black font-medium">{item.quantity}</span>
                            <button 
                              className="px-3 py-1 border-l-2 border-gray-300 text-black hover:bg-gray-100 transition-colors font-semibold"
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
          
          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4 bg-white sticky bottom-0 z-10">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>{formatPrice(cart.total)}</p>
              </div>
              <p className="text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = '/checkout';
                  }}
                  className="bg-black text-white hover:bg-gray-900 py-3 rounded-full"
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
                  className="border border-black text-black hover:bg-gray-100 hover:text-black py-3 rounded-full transition-colors"
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
