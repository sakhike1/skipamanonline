// Legacy backend API types kept for UI mapping.
// These are used only as TypeScript shapes in a Supabase-only app.

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Color {
  name: string;
  value: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface PaymentMethod {
  type: 'stripe' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  details: {
    last4?: string;
    brand?: string;
    email?: string;
    transactionId?: string;
  };
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: Color;
  price: number;
  total: number;
}

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
  estimatedDelivery?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  adminNotes?: string;
  statusHistory: StatusUpdate[];
  createdAt: string;
  updatedAt: string;
}

