import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  User, 
  MapPin, 
  ShoppingBag,
  ArrowRight,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductById } from '../data/products';
import PaymentForm from '../components/payment/PaymentForm';
import { OrderData } from '../services/paypalService';

const EnhancedCheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [shippingData, setShippingData] = useState({
    customerName: user?.name?.split(' ')[0] || '',
    customerLastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      postal_code: '',
      country: 'South Africa',
    }
  });

  const REQUIRED_FIELDS = [
    'customerName',
    'customerLastName',
    'email',
    'phone',
    'address.line1',
    'address.city',
    'address.postal_code',
  ] as const;

  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [shippingTouched, setShippingTouched] = useState<Record<string, boolean>>({});

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (!digitsOnly) return '';

    if (digitsOnly.startsWith('27')) {
      const localDigits = digitsOnly.slice(2, 11);
      const padded = localDigits.padEnd(9, '');
      const segments = [
        padded.slice(0, 3),
        padded.slice(3, 6),
        padded.slice(6, 9),
      ].filter(Boolean);
      return `+27 ${segments.join(' ').trim()}`.trim();
    }

    const trimmed = digitsOnly.slice(0, 10);
    if (trimmed.length <= 3) return trimmed;
    if (trimmed.length <= 6) return `${trimmed.slice(0, 3)} ${trimmed.slice(3)}`;
    return `${trimmed.slice(0, 3)} ${trimmed.slice(3, 6)} ${trimmed.slice(6)}`.trim();
  };

  const formatPostalCode = (value: string) => value.replace(/\D/g, '').slice(0, 4);

  const getFieldValue = (field: string): string => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      return (shippingData as any)[parent]?.[child] ?? '';
    }
    return (shippingData as any)[field] ?? '';
  };

  const validateField = (field: string, value: string): string => {
    const trimmed = value.trim();
    switch (field) {
      case 'customerName':
        return trimmed ? '' : 'First name is required';
      case 'customerLastName':
        return trimmed ? '' : 'Last name is required';
      case 'email':
        if (!trimmed) return 'Email is required';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? '' : 'Enter a valid email address';
      case 'phone': {
        if (!trimmed) return 'Phone number is required';
        const digits = trimmed.replace(/\D/g, '');
        if (digits.startsWith('27')) {
          return digits.length === 11 ? '' : 'Enter +27 followed by 9 digits';
        }
        return digits.length === 10 ? '' : 'Enter a 10-digit South African number';
      }
      case 'address.line1':
        return trimmed ? '' : 'Street address is required';
      case 'address.city':
        return trimmed ? '' : 'City is required';
      case 'address.postal_code': {
        if (!trimmed) return 'Postal code is required';
        const digits = trimmed.replace(/\D/g, '');
        return digits.length === 4 ? '' : 'Postal code must be 4 digits';
      }
      default:
        return '';
    }
  };

  const getInputClasses = (field: string) => {
    const showError = shippingTouched[field] && shippingErrors[field];
    return [
      'w-full px-4 py-3 rounded-lg transition-all duration-200 border',
      showError
        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-400/60 bg-red-50/40'
        : 'border-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500',
    ].join(' ');
  };

  const renderFieldError = (field: string) => {
    if (!(shippingTouched[field] && shippingErrors[field])) return null;
    return <p className="mt-2 text-sm text-red-600">{shippingErrors[field]}</p>;
  };

  const validateAllFields = () => {
    const errors: Record<string, string> = {};
    let hasError = false;

    REQUIRED_FIELDS.forEach((field) => {
      const error = validateField(field, getFieldValue(field));
      if (error) {
        hasError = true;
        errors[field] = error;
      }
    });

    const touchedState = REQUIRED_FIELDS.reduce<Record<string, boolean>>((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});

    setShippingErrors(errors);
    setShippingTouched((prev) => ({ ...prev, ...touchedState }));

    return !hasError;
  };

  // Calculate totals
  const subtotal = cart.items.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + ((product?.price || 0) / 100) * item.quantity;
  }, 0);
  
  const shipping = subtotal >= 500 ? 0 : 15;
  const total = subtotal + shipping;

  // Generate order data for payment
  const generateOrderData = (): OrderData => {
    const orderId = `SKP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const items = cart.items.map(item => {
      const product = getProductById(item.productId);
      return {
        name: product?.name || 'Unknown Product',
        description: product?.description || '',
        quantity: item.quantity,
        price: (product?.price || 0) / 100,
      };
    });

    const itemsSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingAmount = Math.max(total - itemsSubtotal, 0);

    return {
      orderId,
      customerEmail: shippingData.email,
      customerName: shippingData.customerName,
      customerLastName: shippingData.customerLastName,
      customerPhone: shippingData.phone,
      amount: total,
      subtotal: itemsSubtotal,
      shippingAmount,
      currency: 'ZAR',
      items,
      shippingAddress: shippingData.address,
    };
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateAllFields();
    if (!isValid) {
      setPaymentError('Please correct the highlighted fields before continuing.');
      return;
    }

    setPaymentError(null);
    setCurrentStep('payment');
  };

  const handlePaymentStart = () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
  };

  const handlePaymentComplete = (success: boolean) => {
    setIsProcessingPayment(false);
    if (!success) {
      setPaymentError('Payment processing failed. Please try again.');
    }
  };

  const setFieldError = (field: string, message: string) => {
    setShippingErrors((prev) => {
      if (message) {
        return { ...prev, [field]: message };
      }
      if (prev[field]) {
        const { [field]: _removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'phone') {
      value = formatPhoneNumber(value);
    } else if (name === 'address.postal_code') {
      value = formatPostalCode(value);
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setShippingData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setShippingData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    if (shippingTouched[name]) {
      const error = validateField(name, value);
      setFieldError(name, error);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setShippingTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, getFieldValue(name));
    setFieldError(name, error);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-[0_40px_120px_-20px_rgba(15,23,42,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-1/2 bg-gradient-to-t from-slate-900/60 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div className="mx-auto mb-8 h-20 w-20 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>

            <div className="mb-10 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Your cart is feeling lonely
              </h2>
              <p className="text-lg md:text-xl text-slate-200 max-w-xl mx-auto leading-relaxed">
                The styles you love are waiting. Curate your look, elevate your fit, and come back to checkout when
                you’re ready to make it legendary.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-slate-900 bg-white shadow-lg shadow-white/20 hover:shadow-white/40 transition-transform duration-300 hover:-translate-y-1"
              >
                Discover the Collection
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-base font-semibold text-white/80 border border-white/30 hover:border-white/60 transition-all duration-300"
              >
                Back to Home
              </button>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-200/80">
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <p className="font-semibold text-white mb-1">Curated Drops</p>
                <p>New arrivals weekly with exclusive access for members.</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <p className="font-semibold text-white mb-1">Global Shipping</p>
                <p>Fast & secure delivery, tracked from our studio to your door.</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <p className="font-semibold text-white mb-1">Style Concierge</p>
                <p>Need advice? Our team is ready to help you build the perfect fit.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              <div className={`flex items-center ${currentStep === 'shipping' ? 'text-blue-600' : 'text-green-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'shipping' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                  {currentStep === 'shipping' ? '1' : <CheckCircle className="w-5 h-5" />}
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>

            {/* Shipping Form */}
            <AnimatePresence mode="wait">
              {currentStep === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <div className="flex items-center mb-6">
                    <Truck className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                  </div>

                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={shippingData.customerName}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={getInputClasses('customerName')}
                          autoComplete="given-name"
                          aria-invalid={Boolean(shippingTouched['customerName'] && shippingErrors['customerName'])}
                        />
                        {renderFieldError('customerName')}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="customerLastName"
                          value={shippingData.customerLastName}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={getInputClasses('customerLastName')}
                          autoComplete="family-name"
                          aria-invalid={Boolean(shippingTouched['customerLastName'] && shippingErrors['customerLastName'])}
                        />
                        {renderFieldError('customerLastName')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={shippingData.email}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={getInputClasses('email')}
                          autoComplete="email"
                          aria-invalid={Boolean(shippingTouched['email'] && shippingErrors['email'])}
                        />
                        {renderFieldError('email')}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingData.phone}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={getInputClasses('phone')}
                          placeholder="0XX XXX XXXX or +27 XXX XXX XXX"
                          autoComplete="tel"
                          aria-invalid={Boolean(shippingTouched['phone'] && shippingErrors['phone'])}
                        />
                        {renderFieldError('phone')}
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="border-t pt-6">
                      <div className="flex items-center mb-4">
                        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            name="address.line1"
                            value={shippingData.address.line1}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className={getInputClasses('address.line1')}
                            autoComplete="address-line1"
                            aria-invalid={Boolean(shippingTouched['address.line1'] && shippingErrors['address.line1'])}
                          />
                          {renderFieldError('address.line1')}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            name="address.line2"
                            value={shippingData.address.line2}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="address.city"
                              value={shippingData.address.city}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                              className={getInputClasses('address.city')}
                              autoComplete="address-level2"
                              aria-invalid={Boolean(shippingTouched['address.city'] && shippingErrors['address.city'])}
                            />
                            {renderFieldError('address.city')}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              name="address.postal_code"
                              value={shippingData.address.postal_code}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                              className={getInputClasses('address.postal_code')}
                              placeholder="0000"
                              autoComplete="postal-code"
                              aria-invalid={Boolean(shippingTouched['address.postal_code'] && shippingErrors['address.postal_code'])}
                            />
                            {renderFieldError('address.postal_code')}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              name="address.country"
                              value={shippingData.address.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                          <p className="text-red-800">{paymentError}</p>
                        </div>
                      </div>
                    )}

                    {/* Continue Button */}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Payment Form */}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <PaymentForm
                    orderData={generateOrderData()}
                    onPaymentStart={handlePaymentStart}
                    onPaymentComplete={handlePaymentComplete}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.color.name} / Size {item.size}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        R{((product.price / 100) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `R${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center text-sm text-green-700">
                  <Lock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Secure checkout powered by PayPal</span>
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

export default EnhancedCheckoutPage;
