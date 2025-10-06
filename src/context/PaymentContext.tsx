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
  paymentId?: string;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// PayFast configuration
const PAYFAST_MERCHANT_ID = process.env.REACT_APP_PAYFAST_MERCHANT_ID || 'your_merchant_id';
const PAYFAST_MERCHANT_KEY = process.env.REACT_APP_PAYFAST_MERCHANT_KEY || 'your_merchant_key';
const PAYFAST_PASSPHRASE = process.env.REACT_APP_PAYFAST_PASSPHRASE || 'your_passphrase';

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { cart, clearCart } = useCart();

  const processPayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResult> => {
    setIsProcessing(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      // Create PayFast payment request
      const response = await fetch('/api/create-payfast-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cart.total, // Amount in cents
          items: cart.items,
          customer: paymentData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { paymentUrl, paymentId } = await response.json();

      if (paymentUrl) {
        // Redirect to PayFast payment page
        window.location.href = paymentUrl;
        
        return {
          success: true,
          paymentUrl,
          paymentId,
        };
      } else {
        throw new Error('Failed to get payment URL');
      }
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
