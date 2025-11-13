import React, { createContext, useContext, useState, useCallback } from 'react';
import { useCart } from './CartContext';

interface PaymentContextType {
  isProcessing: boolean;
  processPayment: (paymentData: PaymentData) => Promise<PaymentResult>;
  clearPaymentState: () => void;
  paymentError: string | null;
  paymentSuccess: boolean;
}

interface PaymentData {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

interface PaymentResult {
  success: boolean;
  error?: string;
  paymentUrl?: string;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// PayPal configuration
const PAYPAL_PAYMENT_URL =
  import.meta.env.VITE_PAYPAL_PAYMENT_URL || 'https://www.paypal.com/ncp/payment/64D66FJ3E455E';

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { cart } = useCart();

  const processPayment = useCallback(async (_paymentData: PaymentData): Promise<PaymentResult> => {
    setIsProcessing(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      if (cart.items.length === 0) {
        throw new Error('Your cart is empty. Add items before proceeding to payment.');
      }

      if (!PAYPAL_PAYMENT_URL) {
        throw new Error('PayPal payment link is not configured.');
      }

      const trimmedUrl = PAYPAL_PAYMENT_URL.trim();
      const popup = window.open(trimmedUrl, '_blank', 'noopener');

      if (!popup) {
        throw new Error('Unable to open PayPal checkout. Please allow pop-ups and try again.');
      }

      setPaymentSuccess(true);
      return {
        success: true,
        paymentUrl: trimmedUrl,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsProcessing(false);
    }
  }, [cart]);

  const clearPaymentState = useCallback(() => {
    setPaymentError(null);
    setPaymentSuccess(false);
  }, []);

  return (
    <PaymentContext.Provider
      value={{
        isProcessing,
        processPayment,
        clearPaymentState,
        paymentError,
        paymentSuccess,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
