import { PaymentMethod, Order } from '../types';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Load Stripe script
let stripe: any = null;
let elements: any = null;

export const loadStripe = async () => {
  if (typeof window !== 'undefined' && !stripe) {
    const { loadStripe: loadStripeLibrary } = await import('@stripe/stripe-js');
    stripe = await loadStripeLibrary(STRIPE_PUBLISHABLE_KEY);
  }
  return stripe;
};

export const loadStripeElements = async () => {
  if (!stripe) {
    await loadStripe();
  }
  if (!elements) {
    elements = stripe.elements();
  }
  return elements;
};

// Payment intent types
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
}

export interface PaymentMethodData {
  type: 'card';
  card: {
    token: string;
  };
  billing_details: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

// Payment service class
class PaymentService {
  private stripe: any = null;
  private elements: any = null;

  // Initialize Stripe
  async initialize() {
    try {
      this.stripe = await loadStripe();
      this.elements = await loadStripeElements();
      return true;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      return false;
    }
  }

  // Create payment intent
  async createPaymentIntent(order: Order): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${API_BASE}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.total,
          currency: 'zar', // South African Rand
          payment_method_types: ['card'],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId: string, paymentMethod: PaymentMethodData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Process payment with card details
  async processPayment(order: Order, cardElement: any): Promise<any> {
    try {
      // Create payment intent
      const paymentIntent = await this.createPaymentIntent(order);

      // Confirm payment with Stripe
      const { error, paymentIntent: confirmedIntent } = await this.stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
              email: order.shippingAddress.email || '',
              address: {
                line1: order.shippingAddress.address1,
                line2: order.shippingAddress.address2,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                postal_code: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
              },
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Update order payment status
      await this.updateOrderPaymentStatus(order.id, confirmedIntent.status === 'succeeded' ? 'paid' : 'failed');

      return confirmedIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Save payment method for future use
  async savePaymentMethod(paymentMethodData: PaymentMethodData): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${API_BASE}/payments/save-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(paymentMethodData),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw error;
    }
  }

  // Get saved payment methods
  async getSavedPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${API_BASE}/payments/methods`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  // Delete saved payment method
  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/payments/methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(orderId: string, amount?: number, reason?: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId,
          amount,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Update order payment status
  private async updateOrderPaymentStatus(orderId: string, status: 'paid' | 'failed' | 'refunded'): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Validate card number (Luhn algorithm)
  validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Validate expiry date
  validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    if (expMonth < 1 || expMonth > 12) return false;

    return true;
  }

  // Validate CVV
  validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  // Format card number for display
  formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  }

  // Mask card number for security
  maskCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4) return cleaned;
    return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
  }

  // Get card brand from number
  getCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    // Visa
    if (/^4/.test(cleaned)) return 'visa';
    
    // Mastercard
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    
    // American Express
    if (/^3[47]/.test(cleaned)) return 'amex';
    
    // Discover
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    
    return 'unknown';
  }

  // Calculate payment processing fee
  calculateProcessingFee(amount: number): number {
    // Stripe fee: 2.9% + 30 cents for South Africa
    return Math.round((amount * 0.029 + 30) * 100) / 100;
  }

  // Get available payment methods
  getAvailablePaymentMethods(): string[] {
    return ['card', 'paypal']; // Add more as needed
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Export utility functions
export const formatCurrency = (amount: number, currency: string = 'ZAR'): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Convert from cents
};

export const parseCurrency = (amount: string): number => {
  return Math.round(parseFloat(amount.replace(/[^0-9.-]+/g, '')) * 100);
}; 