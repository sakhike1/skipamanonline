import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePayment } from '../context/PaymentContext';
import { getProductById } from '../data/products';
import { ArrowLeft, CreditCard, Lock, MapPin, User, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import PayFastPaymentForm from '../components/payment/PayFastPaymentForm';
import { motion } from 'framer-motion';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isProcessing, paymentSuccess, paymentError } = usePayment();
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      postal_code: '',
      country: 'South Africa',
    },
  });

  // Format price
  const formatPrice = (price: number) => {
    return `R${price.toFixed(2)}`;
  };

  // Calculate shipping (free over R500)
  const shippingCost = cart.subtotal >= 500 ? 0 : 15; // R15 shipping
  const totalAmount = cart.subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateShippingForm = () => {
    const { customerName, customerEmail, shippingAddress } = formData;
    return customerName && customerEmail && shippingAddress.line1 && shippingAddress.city && shippingAddress.postal_code;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setCurrentStep('payment');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products before proceeding to checkout.</p>
          <Button onClick={() => navigate('/shop')} variant="primary">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You will receive an order confirmation email shortly.
          </p>
          <Button onClick={() => navigate('/')} variant="primary" fullWidth>
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <div className="text-right">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">Complete your purchase securely</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Modern Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" 
                       style={{ 
                         width: currentStep === 'shipping' ? '0%' : 
                                currentStep === 'payment' ? '50%' : '100%' 
                       }}></div>
                </div>
                
                <div className={`flex flex-col items-center ${currentStep === 'shipping' ? 'text-purple-600' : currentStep === 'payment' || currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === 'shipping' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 
                    currentStep === 'payment' || currentStep === 'review' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 
                    'bg-gray-200 text-gray-400'
                  }`}>
                    <User size={16} />
                  </div>
                  <span className="mt-2 text-xs font-medium">Shipping</span>
                </div>
                
                <div className={`flex flex-col items-center ${currentStep === 'payment' ? 'text-purple-600' : currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === 'payment' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 
                    currentStep === 'review' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 
                    'bg-gray-200 text-gray-400'
                  }`}>
                    <CreditCard size={16} />
                  </div>
                  <span className="mt-2 text-xs font-medium">Payment</span>
                </div>
                
                <div className={`flex flex-col items-center ${currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === 'review' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 
                    'bg-gray-200 text-gray-400'
                  }`}>
                    <Lock size={16} />
                  </div>
                  <span className="mt-2 text-xs font-medium">Review</span>
                </div>
              </div>
            </div>

            {/* Shipping Form */}
            {currentStep === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold mb-8 flex items-center text-gray-900">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <MapPin size={20} className="text-purple-600" />
                  </div>
                  Shipping Information
                </h2>
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.line1"
                      value={formData.shippingAddress.line1}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.line2"
                      value={formData.shippingAddress.line2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.city"
                        value={formData.shippingAddress.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.postal_code"
                        value={formData.shippingAddress.postal_code}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.country"
                        value={formData.shippingAddress.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="primary" fullWidth className="mt-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Continue to Payment
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Payment Form */}
            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold mb-8 flex items-center text-gray-900">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <CreditCard size={20} className="text-green-600" />
                  </div>
                  Payment Information
                </h2>
                <PayFastPaymentForm 
                  formData={formData}
                  onSuccess={() => setCurrentStep('review')}
                  onBack={() => setCurrentStep('shipping')}
                />
              </motion.div>
            )}

            {/* Error Display */}
            {paymentError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-md p-4 mt-4"
              >
                <p className="text-red-800">{paymentError}</p>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-6 mb-8">
                {cart.items.map((item, index) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gray-200">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.color.name} / Size {item.size}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(product.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-4">
                  <span className="text-gray-900">Total</span>
                  <span className="text-purple-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center text-sm text-green-700">
                  <Lock size={16} className="mr-2" />
                  <span className="font-medium">Secure checkout powered by PayFast</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
