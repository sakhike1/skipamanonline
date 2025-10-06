import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePayment } from '../../context/PaymentContext';
import { Button } from '../ui/Button';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';

interface PaymentFormProps {
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

const PaymentForm: React.FC<PaymentFormProps> = ({ formData, onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { processPayment, isProcessing, paymentError } = usePayment();
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    // Clear any previous errors
    setCardError(null);

    try {
      // Process payment through our payment context
      const result = await processPayment(formData);
      
      if (result.success) {
        onSuccess();
      } else {
        setCardError(result.error || 'Payment failed');
      }
    } catch (error) {
      setCardError('An unexpected error occurred');
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-black">
          <CardElement
            options={cardElementOptions}
            onChange={(event) => {
              setCardError(event.error ? event.error.message : null);
            }}
          />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-600">{cardError}</p>
        )}
      </div>

      {/* Billing Address (same as shipping for simplicity) */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
        <p className="text-sm text-gray-600">
          {formData.customerName}<br />
          {formData.shippingAddress.line1}<br />
          {formData.shippingAddress.line2 && `${formData.shippingAddress.line2}\n`}
          {formData.shippingAddress.city}, {formData.shippingAddress.postal_code}<br />
          {formData.shippingAddress.country}
        </p>
      </div>

      {/* Security Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <Lock size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-800 font-medium">Secure Payment</p>
            <p className="text-blue-700 mt-1">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
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
          type="submit"
          variant="primary"
          disabled={!stripe || isProcessing}
          className="flex-1 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              Complete Payment
              <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Accepted Payment Methods */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">We accept</p>
        <div className="flex justify-center space-x-4">
          <div className="text-xs text-gray-400">Visa</div>
          <div className="text-xs text-gray-400">Mastercard</div>
          <div className="text-xs text-gray-400">American Express</div>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;
