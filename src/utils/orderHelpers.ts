import type { CartItem, Product, StrapiOrderPayload } from '../types';

interface ShippingData {
  customerName: string;
  customerLastName?: string;
  email: string;
  phone?: string;
  address: {
    street?: string;
    line1?: string;
    line2?: string;
    city: string;
    province?: string;
    state?: string;
    postalCode?: string;
    postal_code?: string;
    country: string;
  };
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  productId?: string;
}

/**
 * Build order payload for backend persistence.
 */
export function buildStrapiOrderPayload(
  cartItems: CartItem[],
  products: Product[],
  shippingData: ShippingData,
  totals: {
    subtotal: number;
    shipping: number;
    tax?: number;
    total: number;
  },
  paymentMethod: string = 'Credit Card',
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' = 'paid',
  userId?: string,
  notes?: string
): StrapiOrderPayload {
  // Build items array
  const items: OrderItem[] = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      name: product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: product ? product.price / 100 : 0, // Convert from cents to Rands
      productId: item.productId,
    };
  });

  // Build shipping address
  // Province is required by some backends; use city as fallback if not provided.
  const shippingAddress = {
    street: shippingData.address.street || shippingData.address.line1 || '',
    city: shippingData.address.city,
    province: shippingData.address.province || shippingData.address.state || shippingData.address.city || 'N/A',
    postalCode: shippingData.address.postalCode || shippingData.address.postal_code || '',
    country: shippingData.address.country,
  };

  // Build billing address (same as shipping if not provided)
  const billingAddress = shippingAddress;

  // Combine customer name
  const customerName = shippingData.customerLastName
    ? `${shippingData.customerName} ${shippingData.customerLastName}`
    : shippingData.customerName;

  return {
    customerName,
    customerEmail: shippingData.email,
    customerPhone: shippingData.phone,
    shippingAddress,
    billingAddress,
    items,
    subtotal: totals.subtotal,
    shippingCost: totals.shipping,
    tax: totals.tax || 0,
    total: totals.total,
    paymentMethod,
    paymentStatus,
    notes,
    userId,
    source: 'website',
  };
}

