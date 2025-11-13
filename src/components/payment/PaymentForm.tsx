import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import paypalService, { OrderData } from '../../services/paypalService';
import { strapiOrders } from '../../services/strapiOrders';
import { StrapiOrderCreateInput } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface PaymentFormProps {
  orderData: OrderData;
  onPaymentStart: () => void;
  onPaymentComplete: (success: boolean) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  orderData, 
  onPaymentStart, 
  onPaymentComplete 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();
  const { user } = useAuth();

  const buildStrapiOrderPayload = (): StrapiOrderCreateInput => {
    const subtotal = orderData.subtotal ?? orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = orderData.amount ?? subtotal;
    const shippingAmount = orderData.shippingAmount ?? Math.max(totalAmount - subtotal, 0);
    const currency = orderData.currency || 'ZAR';

    const orderPayload: StrapiOrderCreateInput = {
      orderNumber: orderData.orderId,
      paymentStatus: 'pending',
      subtotal,
      shippingTotal: shippingAmount,
      total: totalAmount,
      currency,
      customer: {
        firstName: orderData.customerName,
        lastName: orderData.customerLastName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone || '',
        userId: user?.id,
      },
      shippingAddress: {
        line1: orderData.shippingAddress.line1,
        line2: orderData.shippingAddress.line2 || '',
        city: orderData.shippingAddress.city,
        postalCode: orderData.shippingAddress.postal_code,
        country: orderData.shippingAddress.country,
      },
      orderItems: orderData.items.map(item => ({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
      })),
      metadata: {
        source: 'frontend',
      },
    };

    const orderStatusField = import.meta.env.VITE_STRAPI_ORDER_STATUS_FIELD;
    if (orderStatusField) {
      (orderPayload as Record<string, unknown>)[orderStatusField] = 'pending';
    }

    return orderPayload;
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      onPaymentStart();

      // Store order in Strapi before redirecting to PayPal
      const orderPayload = buildStrapiOrderPayload();
      await strapiOrders.createOrder(orderPayload);

      // Process payment through PayPal
      await paypalService.processPayment(orderData);

      onPaymentComplete(true);

      // Clear cart after successful payment initiation
      clearCart();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      onPaymentComplete(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number, currency: string = 'R') => {
    return `${currency}${amount.toFixed(2)}`;
  };

  const itemsSubtotal = orderData.subtotal ?? orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = orderData.amount ?? itemsSubtotal;
  const shippingAmount = orderData.shippingAmount ?? Math.max(totalAmount - itemsSubtotal, 0);
  const displayCurrency = orderData.currency === 'ZAR' || !orderData.currency ? 'R' : `${orderData.currency} `;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CreditCard className="w-8 h-8 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h2>
        <p className="text-gray-600">Complete your purchase securely with PayPal</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          {orderData.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatAmount(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatAmount(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-blue-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium text-gray-900">{orderData.customerName} {orderData.customerLastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{orderData.customerEmail}</p>
          </div>
        </div>
      </div>

      {/* Payment Security Info */}
      <div className="bg-green-50 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <Shield className="w-6 h-6 text-green-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Secure Payment</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                SSL encrypted connection
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                PCI DSS compliant
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Powered by PayPal
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Payment Button */}
      <motion.button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-[#FFD140] hover:bg-[#f7c632] disabled:bg-gray-400 text-black py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? (
          <>
            <Lock className="w-5 h-5 text-black" />
            <span>Redirecting to PayPal...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 text-black" />
            <span>Pay with PayPal</span>
          </>
        )}
      </motion.button>

      {/* Payment Methods Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-3">Accepted Payment Methods:</p>
        <div className="flex justify-center space-x-4 text-xs text-gray-500">
          <span>🅿️ PayPal</span>
          <span>💳 Visa / Mastercard</span>
          <span>💳 American Express</span>
          <span>💰 PayPal Pay Later</span>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            <span>Secure</span>
          </div>
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-1" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;