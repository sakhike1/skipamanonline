import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { CreditCard, SignalLow as PaypalLogo, AlertCircle, Shield, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import EmptyCart from './EmptyCart';
import { motion } from 'framer-motion';

interface CheckoutFormProps {
  onComplete: (orderId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onComplete }) => {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'payflex' | 'payfast'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  if (cart.items.length === 0) {
    return <EmptyCart />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`;
      clearCart();
      onComplete(orderId);
      setIsLoading(false);
    }, 1500);
  };

  const formatPrice = (price: number) => {
    return `R${price.toFixed(0)}`;
  };
  const subtotal = cart.total;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const paymentOptions = [
    { id: 'card', label: 'Credit Card', icon: <CreditCard size={20} className="text-gray-600" /> },
    { id: 'paypal', label: 'PayPal', icon: <PaypalLogo size={20} className="text-blue-600" /> },
    { id: 'payfast', label: 'PayFast', icon: null },
    { id: 'payflex', label: 'PayFlex', icon: null },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden -mt-6 py-10">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-900 to-black"></div>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 opacity-30"></div>
        
        {/* Floating Purple Glassmorphism Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-600/5 to-purple-700/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content Container with proper spacing */}
      <div className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Page Header */}
            <div className="text-center mb-12">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                variants={itemVariants}
              >
                Complete Your Order
              </motion.h1>
              <motion.p 
                className="text-xl text-white/80 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Secure checkout with premium glassmorphism design
              </motion.p>
            </div>

            {/* Main Checkout Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form - Takes 2/3 of the space */}
              <div className="lg:col-span-2">
                <motion.div
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Glassmorphism Card */}
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* Purple Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-900/20 backdrop-blur-md"></div>
                    
                    {/* Glassmorphism Overlay with Purple Accent */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-purple-400/30 rounded-2xl"></div>
                    
                    {/* Purple Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-600/10 rounded-2xl"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white tracking-tight">
                        Checkout
                      </h2>

                      <div className="space-y-6">
                        {/* Shipping Information */}
                        <div>
                          <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                            <Shield size={20} className="text-white/80" />
                            Shipping Information
                          </h3>
                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {['firstName', 'lastName'].map((field) => (
                                <div key={field} className="space-y-1">
                                  <label
                                    htmlFor={field}
                                    className="block text-sm font-medium text-white/90"
                                  >
                                    {field === 'firstName' ? 'First Name' : 'Last Name'}
                                  </label>
                                  <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={(formData as any)[field]}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:border-purple-400"
                                    placeholder={field === 'firstName' ? 'John' : 'Doe'}
                                  />
                                </div>
                              ))}
                            </div>

                            {['email', 'address'].map((field) => (
                              <div key={field} className="space-y-1">
                                <label
                                  htmlFor={field}
                                  className="block text-sm font-medium text-white/90"
                                >
                                  {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                  type={field === 'email' ? 'email' : 'text'}
                                  id={field}
                                  name={field}
                                  value={(formData as any)[field]}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:border-purple-400"
                                  placeholder={
                                    field === 'email' ? 'example@email.com' : '123 Main St'
                                  }
                                />
                              </div>
                            ))}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {['city', 'postalCode', 'country'].map((field) => (
                                <div key={field} className="space-y-1">
                                  <label
                                    htmlFor={field}
                                    className="block text-sm font-medium text-white/90"
                                  >
                                    {field === 'postalCode'
                                      ? 'Postal Code'
                                      : field.charAt(0).toUpperCase() + field.slice(1)}
                                  </label>
                                  {field === 'country' ? (
                                    <select
                                      id="country"
                                      name="country"
                                      required
                                      value={formData.country}
                                      onChange={handleInputChange}
                                      className="w-full border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white hover:border-purple-400"
                                    >
                                      <option value="" disabled className="bg-gray-800">
                                        Select Country
                                      </option>
                                      <option value="US" className="bg-gray-800">United States</option>
                                      <option value="CA" className="bg-gray-800">Canada</option>
                                      <option value="UK" className="bg-gray-800">United Kingdom</option>
                                      <option value="AU" className="bg-gray-800">Australia</option>
                                    </select>
                                  ) : (
                                    <input
                                      type="text"
                                      id={field}
                                      name={field}
                                      value={(formData as any)[field]}
                                      onChange={handleInputChange}
                                      required
                                      className="w-full border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:border-purple-400"
                                      placeholder={field === 'city' ? 'New York' : '10001'}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Payment Method */}
                            <div className="border-t border-white/20 pt-6 mt-6">
                              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                                <CreditCard size={20} className="text-white/80" />
                                Payment Method
                              </h3>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {paymentOptions.map(({ id, label, icon }) => (
                                  <motion.label
                                    key={id}
                                    htmlFor={id}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                      paymentMethod === id
                                        ? 'border-purple-500 bg-purple-500/20 text-white shadow-lg'
                                        : 'border-white/20 hover:border-purple-400 hover:bg-white/10 hover:shadow-sm bg-white/5 backdrop-blur-sm'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <input
                                      type="radio"
                                      id={id}
                                      name="paymentMethod"
                                      checked={paymentMethod === id}
                                      onChange={() => setPaymentMethod(id as any)}
                                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                    />
                                    <div className="ml-2 flex items-center font-medium text-sm sm:text-base text-white">
                                      {icon && <span className="mr-2">{icon}</span>}
                                      <span>{label}</span>
                                    </div>
                                  </motion.label>
                                ))}
                              </div>
                            </div>

                            {paymentMethod === 'card' && (
                              <motion.div
                                className="mt-6 space-y-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="space-y-1">
                                  <label
                                    htmlFor="cardNumber"
                                    className="block text-sm font-medium text-white/90"
                                  >
                                    Card Number
                                  </label>
                                  <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                    className="w-full border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:border-purple-400"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label
                                      htmlFor="cardExpiry"
                                      className="block text-sm font-medium text-white/90"
                                    >
                                      Expiry Date
                                    </label>
                                    <input
                                      type="text"
                                      id="cardExpiry"
                                      name="cardExpiry"
                                      value={formData.cardExpiry}
                                      onChange={handleInputChange}
                                      placeholder="MM/YY"
                                      required
                                      className="w-full border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:border-purple-400"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label
                                      htmlFor="cardCvc"
                                      className="block text-sm font-medium text-white/90"
                                    >
                                      CVC
                                    </label>
                                    <input
                                      type="text"
                                      id="cardCvc"
                                      name="cardCvc"
                                      value={formData.cardCvc}
                                      onChange={handleInputChange}
                                      placeholder="123"
                                      required
                                      className="w-full border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:border-purple-400"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            <motion.div
                              className="flex items-center mt-6 bg-purple-500/20 p-3 rounded-lg border border-purple-400/30"
                              variants={itemVariants}
                            >
                              <AlertCircle size={18} className="text-purple-400 flex-shrink-0" />
                              <p className="ml-2 text-sm text-purple-300">
                                This is a demo checkout. No actual payment will be processed.
                              </p>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                              <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                isLoading={isLoading}
                                className="mt-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 relative overflow-hidden border-none group shadow-lg hover:shadow-purple-500/30"
                                aria-label="Complete your order"
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  initial={false}
                                />
                                <span className="relative z-10">Complete Order</span>
                                <motion.div
                                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                                  animate={{ x: ['-100%', '200%'] }}
                                  transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    repeatDelay: 1.5,
                                  }}
                                />
                              </Button>
                            </motion.div>
                          </form>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-500"></div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Order Summary with Red-Black Gradient */}
              <div className="lg:col-span-1">
                <motion.div
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Glassmorphism Order Summary Card */}
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* Purple Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-md"></div>
                    
                    {/* Glassmorphism Overlay with Purple Accent */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-purple-400/30 rounded-2xl"></div>
                    
                    {/* Purple Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-transparent to-purple-600/15 rounded-2xl"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-6">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-purple-400" />
                        Order Summary
                      </h2>
                      
                      {/* Order Items */}
                      <div className="max-h-64 overflow-y-auto mb-6 space-y-4 pr-1 custom-scrollbar">
                        {cart.items.map((item, index) => {
                          const product = getProductById(item.productId);
                          if (!product) return null;
                          return (
                            <motion.div
                              key={index}
                              className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                              <img
                                src={product.images[0]}
                                alt={product.name || 'Product image'}
                                className="h-12 w-12 rounded-lg object-cover border border-white/20 shadow-sm"
                              />
                              <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-white">
                                  {product.name}
                                </h3>
                                <div className="text-xs text-white/70">
                                  {item.color?.name} / Size {item.size} / Qty {item.quantity}
                                </div>
                              </div>
                              <p className="text-sm font-medium text-white">
                                {formatPrice(product.price * item.quantity)}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      {/* Price Breakdown */}
                      <div className="space-y-3 mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <div className="flex justify-between text-white/80">
                          <span>Subtotal</span>
                          <span className="font-medium text-white">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Shipping</span>
                          <span className="font-medium text-green-400">
                            {shipping === 0 ? 'Free' : formatPrice(shipping)}
                          </span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Taxes</span>
                          <span className="font-medium text-white">{formatPrice(tax)}</span>
                        </div>
                        <div className="border-t border-white/20 pt-3">
                          <div className="flex justify-between text-white font-bold text-lg">
                            <span>Total</span>
                            <span className="text-purple-400">{formatPrice(total)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Security Badge */}
                      <div className="flex items-center justify-center gap-2 p-3 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-400/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">Secure Checkout</span>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const getProductById = (id: string) => ({
  id,
  name: 'Product ' + id,
  price: 29.99,
  images: ['https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg'],
});

export default CheckoutForm;