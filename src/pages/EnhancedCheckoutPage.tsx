import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  User, 
  MapPin, 
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/useAuth';
import { useProductData } from '../context/ProductDataContext';
import { SA_PROVINCES, placeOrder, priceCart, quoteShipping, submitToPayFast, type ShippingQuote } from '../services/shopApi';

const EnhancedCheckoutPage: React.FC = () => {
  const { cart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { getProductById } = useProductData();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [shippingData, setShippingData] = useState({
    customerName: user?.firstName || '',
    customerLastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      suburb: '',
      province: '',
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
    'address.suburb',
    'address.city',
    'address.province',
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
          return digits.length === 11
            ? ''
            : 'Use +27 and 9 digits after the country code (e.g. +27 82 123 4567)';
        }
        if (digits.startsWith('0')) {
          return digits.length === 10
            ? ''
            : 'Enter 10 digits starting with 0 (e.g. 082 123 4567)';
        }
        return 'Enter a South African number: 10 digits starting with 0, or +27 with 9 digits after.';
      }
      case 'address.line1':
        return trimmed ? '' : 'Street address is required';
      case 'address.suburb':
        return trimmed ? '' : 'Suburb is required';
      case 'address.city':
        return trimmed ? '' : 'City is required';
      case 'address.province':
        return trimmed ? '' : 'Please choose your province';
      case 'address.postal_code': {
        if (!trimmed) return 'Postal code is required';
        const digits = trimmed.replace(/\D/g, '');
        if (digits.length !== 4) return 'Use a 4-digit South African postal code (e.g. 0157)';
        return '';
      }
      default:
        return '';
    }
  };

  const getInputClasses = (field: string) => {
    const showError = shippingTouched[field] && shippingErrors[field];
    return [
      'w-full px-4 py-3 rounded-xl transition-all duration-200 border-2 bg-white text-black',
      showError
        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-400/60 bg-red-50/40'
        : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/20',
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

  // Prices: bulk tiers are applied here for display; the server recalculates everything when the order is placed
  const priced = priceCart(cart.items, getProductById);
  const subtotal = priced.subtotalCents / 100;
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const province = shippingData.address.province;
    if (!province) { setQuote(null); return; }
    let cancelled = false;
    quoteShipping(province, priced.subtotalCents).then((q) => { if (!cancelled) setQuote(q); }).catch(() => { if (!cancelled) setQuote(null); });
    return () => { cancelled = true; };
  }, [shippingData.address.province, priced.subtotalCents]);

  const shipping = (quote?.shippingCents ?? 0) / 100;
  const total = subtotal + shipping;

  const handlePayNow = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    try {
      const a = shippingData.address;
      const result = await placeOrder(
        cart.items,
        getProductById,
        {
          name: `${shippingData.customerName} ${shippingData.customerLastName}`.trim(),
          phone: shippingData.phone,
          line1: [a.line1, a.line2].filter(Boolean).join(', '),
          suburb: a.suburb,
          city: a.city,
          province: a.province,
          postalCode: a.postal_code,
        },
        { referralCode: referralCode.trim() },
      );
      // The cart stays until PayFast confirms payment (the order page clears it)
      sessionStorage.setItem('skipaman:pendingOrder', result.order.id);
      submitToPayFast(result.payfast);
    } catch (e) {
      setIsProcessingPayment(false);
      setPaymentError(e instanceof Error ? e.message : 'Could not start payment. Please try again.');
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setShippingTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, getFieldValue(name));
    setFieldError(name, error);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-20 relative overflow-hidden">
        {/* Premium background with subtle pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center border border-gray-200"
          >
            <button
              type="button"
              onClick={() => navigate('/')}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 z-50 shadow-lg"
              aria-label="Close"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            <div className="flex justify-start mb-10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-all duration-300"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-black uppercase tracking-wider">Back</span>
              </button>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-10 h-28 w-28 rounded-3xl bg-black flex items-center justify-center shadow-2xl"
            >
              <ShoppingBag className="w-14 h-14 text-white" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12 space-y-5"
            >
              <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black leading-tight">
                Your Collection Awaits
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
                Curate your signature style. Discover pieces crafted for those who demand excellence and refuse to blend in.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-bold text-white bg-black shadow-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                Explore Collection
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-8 py-5 rounded-xl text-lg font-bold text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300"
              >
                Return Home
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <div className="p-8 rounded-2xl border-2 border-black bg-white hover:bg-black hover:text-white transition-all duration-300 group">
                <p className="font-black text-lg mb-3 group-hover:text-white">Premium Quality</p>
                <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed">Meticulously crafted pieces that define modern luxury and timeless style.</p>
              </div>
              <div className="p-8 rounded-2xl border-2 border-black bg-white hover:bg-black hover:text-white transition-all duration-300 group">
                <p className="font-black text-lg mb-3 group-hover:text-white">Express Delivery</p>
                <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed">Swift, secure shipping with real-time tracking from our atelier to your door.</p>
              </div>
              <div className="p-8 rounded-2xl border-2 border-black bg-white hover:bg-black hover:text-white transition-all duration-300 group">
                <p className="font-black text-lg mb-3 group-hover:text-white">Expert Styling</p>
                <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed">Personalized guidance to help you curate a wardrobe that commands attention.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-20 relative overflow-hidden">
      {/* Clean minimal background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div>
            <h1 className="text-5xl font-black text-black mb-3">Checkout</h1>
            <p className="text-gray-600 text-lg">Complete your purchase securely</p>
        </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              <div className={`flex items-center ${currentStep === 'shipping' ? 'text-black' : 'text-black'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'shipping' ? 'bg-black text-white' : 'bg-black text-white'}`}>
                  {currentStep === 'shipping' ? '1' : <CheckCircle className="w-5 h-5" />}
                </div>
                <span className="ml-2 font-semibold">Shipping</span>
              </div>
              <div className="flex-1 h-px bg-gray-200 mx-4"></div>
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-black' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 font-semibold">Payment</span>
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
                  className="bg-white rounded-3xl shadow-lg p-8 border-2 border-gray-200"
                >
                  <div className="flex items-center mb-6">
                    <Truck className="w-6 h-6 text-black mr-3" />
                    <h2 className="text-2xl font-bold text-black">Shipping Information</h2>
                  </div>

                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingData.phone}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={getInputClasses('phone')}
                          placeholder="0XX XXX XXXX or +27 XX XXX XXXX"
                          autoComplete="tel"
                          aria-invalid={Boolean(shippingTouched['phone'] && shippingErrors['phone'])}
                          aria-describedby="checkout-hint-phone"
                        />
                        <p id="checkout-hint-phone" className="mt-1.5 text-xs text-gray-500">
                          South African mobile or landline: 10 digits starting with 0, or +27 and 9 digits after the country code.
                        </p>
                        {renderFieldError('phone')}
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="border-t pt-6">
                      <div className="flex items-center mb-4">
                        <MapPin className="w-5 h-5 text-black mr-2" />
                        <h3 className="text-lg font-semibold text-black">Shipping Address</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
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
                          <label className="block text-sm font-semibold text-black mb-2">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            name="address.line2"
                            value={shippingData.address.line2}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-black focus:border-black focus:ring-2 focus:ring-black/20"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">Suburb *</label>
                            <input
                              type="text"
                              name="address.suburb"
                              value={shippingData.address.suburb}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                              className={getInputClasses('address.suburb')}
                              autoComplete="address-level3"
                              aria-invalid={Boolean(shippingTouched['address.suburb'] && shippingErrors['address.suburb'])}
                            />
                            {renderFieldError('address.suburb')}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">Province *</label>
                            <select
                              name="address.province"
                              value={shippingData.address.province}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                              className={getInputClasses('address.province')}
                              autoComplete="address-level1"
                              aria-invalid={Boolean(shippingTouched['address.province'] && shippingErrors['address.province'])}
                            >
                              <option value="">Select province</option>
                              {SA_PROVINCES.map((pr) => (
                                <option key={pr} value={pr}>{pr}</option>
                              ))}
                            </select>
                            {renderFieldError('address.province')}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
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
                            <label className="block text-sm font-semibold text-black mb-2">
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              name="address.postal_code"
                              inputMode="numeric"
                              value={shippingData.address.postal_code}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                              className={getInputClasses('address.postal_code')}
                              placeholder="e.g. 0157"
                              autoComplete="postal-code"
                              aria-invalid={Boolean(
                                shippingTouched['address.postal_code'] && shippingErrors['address.postal_code'],
                              )}
                              aria-describedby="checkout-hint-postal"
                            />
                            <p id="checkout-hint-postal" className="mt-1.5 text-xs text-gray-500">
                              4-digit South African postal code.
                            </p>
                            {renderFieldError('address.postal_code')}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              name="address.country"
                              value={shippingData.address.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-black focus:border-black focus:ring-2 focus:ring-black/20"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {paymentError && (
                      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                          <p className="text-red-800 font-medium">{paymentError}</p>
                        </div>
                      </div>
                    )}

                    {/* Continue Button */}
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-4 px-6 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
                  <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-200 space-y-5">
                    <h2 className="text-2xl font-bold text-black">Review and pay</h2>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold text-black">Delivering to</p>
                      <p>{shippingData.customerName} {shippingData.customerLastName} · {shippingData.phone}</p>
                      <p>{shippingData.address.line1}{shippingData.address.line2 ? ', ' + shippingData.address.line2 : ''}, {shippingData.address.suburb}</p>
                      <p>{shippingData.address.city}, {shippingData.address.province}, {shippingData.address.postal_code}</p>
                      {quote && (
                        <p className="mt-2">
                          Estimated delivery: <span className="font-semibold text-black">
                            {new Date(quote.estimatedDeliveryFrom).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}, {new Date(quote.estimatedDeliveryTo).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                          </span>
                        </p>
                      )}
                    </div>
                    {priced.savingCents > 0 && (
                      <p className="text-sm font-semibold text-green-700">Bulk discount applied: you save R{(priced.savingCents / 100).toFixed(2)}</p>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2" htmlFor="referral">Referral code (optional, first orders only)</label>
                      <input
                        id="referral"
                        value={referralCode}
                        onChange={(ev) => setReferralCode(ev.target.value.toUpperCase())}
                        placeholder="SKIP-XXXXXX"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-black focus:border-black focus:ring-2 focus:ring-black/20"
                      />
                    </div>
                    {!isAuthenticated && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
                        Please <a className="font-bold underline" href="/login">sign in</a> or <a className="font-bold underline" href="/register">create an account</a> to place your order. Your cart will be kept.
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('shipping')}
                        disabled={isProcessingPayment}
                        className="px-6 py-4 rounded-xl border-2 border-gray-300 font-semibold text-black hover:bg-gray-50 disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handlePayNow}
                        disabled={isProcessingPayment || !isAuthenticated}
                        className="flex-1 bg-black text-white py-4 px-6 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <Lock className="w-5 h-5" />
                        <span>{isProcessingPayment ? 'Redirecting to PayFast…' : 'Pay R' + total.toFixed(2) + ' with PayFast'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-black mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item, idx) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId + '-' + item.size + '-' + item.color.name} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.color.name} / Size {item.size}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-black">
                        R{((priced.lines[idx]?.cents ?? product.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t-2 border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">{!quote ? 'Choose province' : shipping === 0 ? 'Free' : 'R' + shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-black pt-3 border-t-2 border-gray-200">
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-5 bg-black rounded-xl shadow-lg">
                <div className="flex items-center text-sm text-white">
                  <Lock className="w-5 h-5 mr-2" />
                  <span className="font-bold">Secure checkout powered by PayFast</span>
                </div>
                <p className="text-xs text-gray-300 mt-2 ml-7">
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
