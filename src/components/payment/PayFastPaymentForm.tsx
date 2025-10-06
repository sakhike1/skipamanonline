import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { Button } from '../ui/Button';
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Banknote } from 'lucide-react';

interface PayFastPaymentFormProps {
  formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
      line1: string;
      line2: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
  onSuccess: () => void;
  onBack: () => void;
}

const PayFastPaymentForm: React.FC<PayFastPaymentFormProps> = ({ formData, onSuccess, onBack }) => {
  const { processPayment, isProcessing, paymentError } = usePayment();
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'card' | 'eft' | 'mobile'>('all');

  const handlePayment = async () => {
    const result = await processPayment(formData);
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedMethod('all')}
            className={`p-4 border rounded-lg text-center transition-all ${
              selectedMethod === 'all'
                ? 'border-black bg-black text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CreditCard size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">All Methods</p>
          </button>
          
          <button
            onClick={() => setSelectedMethod('card')}
            className={`p-4 border rounded-lg text-center transition-all ${
              selectedMethod === 'card'
                ? 'border-black bg-black text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CreditCard size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Credit/Debit Card</p>
          </button>
          
          <button
            onClick={() => setSelectedMethod('eft')}
            className={`p-4 border rounded-lg text-center transition-all ${
              selectedMethod === 'eft'
                ? 'border-black bg-black text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Banknote size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Instant EFT</p>
          </button>
          
          <button
            onClick={() => setSelectedMethod('mobile')}
            className={`p-4 border rounded-lg text-center transition-all ${
              selectedMethod === 'mobile'
                ? 'border-black bg-black text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Smartphone size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Mobile Wallet</p>
          </button>
        </div>
      </div>

      {/* Payment Method Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <CreditCard size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-800 font-medium">
              {selectedMethod === 'all' && 'Secure Payment Options'}
              {selectedMethod === 'card' && 'Credit/Debit Card Payment'}
              {selectedMethod === 'eft' && 'Instant EFT Payment'}
              {selectedMethod === 'mobile' && 'Mobile Wallet Payment'}
            </p>
            <p className="text-blue-700 mt-1">
              {selectedMethod === 'all' && 'Choose from credit cards, instant EFT, or mobile wallets on the next page.'}
              {selectedMethod === 'card' && 'Pay securely with Visa, Mastercard, or American Express.'}
              {selectedMethod === 'eft' && 'Make a secure bank-to-bank transfer instantly.'}
              {selectedMethod === 'mobile' && 'Pay using your mobile wallet like SnapScan or Zapper.'}
            </p>
          </div>
        </div>
      </div>

      {/* Supported Banks/Payment Methods */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Supported Payment Methods</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
          <div>• Visa</div>
          <div>• Mastercard</div>
          <div>• American Express</div>
          <div>• ABSA Instant EFT</div>
          <div>• FNB Instant EFT</div>
          <div>• Standard Bank EFT</div>
          <div>• Nedbank EFT</div>
          <div>• SnapScan</div>
          <div>• Zapper</div>
        </div>
      </div>

      {/* Payment Error */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{paymentError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Shipping
        </Button>
        <Button
          onClick={handlePayment}
          variant="primary"
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              Proceed to Payment
              <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
          <CreditCard size={16} className="mr-2" />
          <span>Powered by PayFast - Secure Payment Gateway</span>
        </div>
        <p className="text-xs text-gray-400">
          Your payment information is encrypted and secure. We never store your payment details.
        </p>
      </div>
    </div>
  );
};

export default PayFastPaymentForm;
