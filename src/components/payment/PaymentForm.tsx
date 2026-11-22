import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';
import type { OrderData } from '../../services/paypalService';
import { useNavigate } from 'react-router-dom';
import PayPalSmartButtons from './PayPalSmartButtons';
import { PayPalCheckoutBoundary } from './PayPalCheckoutBoundary';

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
  const navigate = useNavigate();

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

      <PayPalCheckoutBoundary>
        <PayPalSmartButtons
          orderData={orderData}
          onPaymentStart={onPaymentStart}
          onPaymentComplete={onPaymentComplete}
          onPaid={() => navigate('/payment/success')}
        />
      </PayPalCheckoutBoundary>

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