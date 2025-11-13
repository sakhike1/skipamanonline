// PayPal Payment Service
// Replaces the previous PayFast integration and submits customers to a hosted PayPal checkout button.

export interface OrderData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerLastName: string;
  customerPhone?: string;
  amount: number;
  subtotal?: number;
  shippingAmount?: number;
  currency?: string;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

class PayPalService {
  private paymentUrl: string;

  constructor() {
    this.paymentUrl = import.meta.env.VITE_PAYPAL_PAYMENT_URL || 'https://www.paypal.com/ncp/payment/64D66FJ3E455E';
  }

  async processPayment(order: OrderData): Promise<void> {
    if (!this.paymentUrl) {
      throw new Error('PayPal payment URL is not configured. Set VITE_PAYPAL_PAYMENT_URL in your environment variables.');
    }

    // Hosted buttons embed all configuration (amount, currency) on PayPal's side.
    // Open in a new tab so the customer can complete payment.
    window.open(this.paymentUrl, '_blank', 'noopener');
  }
}

export const paypalService = new PayPalService();
export default paypalService;
