import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: IPaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  adminNotes?: string;
  statusHistory: IStatusUpdate[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderModel extends mongoose.Model<IOrder> {
  getOrderStats(): Promise<any>;
  getOrdersByStatus(status: OrderStatus): Promise<IOrder[]>;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: {
    name: string;
    value: string;
  };
  price: number;
  total: number;
}

export interface IAddress {
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
}

export interface IPaymentMethod {
  type: 'stripe' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  details: {
    last4?: string;
    brand?: string;
    email?: string;
    transactionId?: string;
  };
}

export interface IStatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  updatedBy: string;
  notes?: string;
  estimatedDelivery?: Date;
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

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
  color: {
    name: { type: String, required: true },
    value: { type: String, required: true }
  },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const AddressSchema = new Schema<IAddress>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
  phone: { type: String, required: true }
});

const PaymentMethodSchema = new Schema<IPaymentMethod>({
  type: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  details: {
    last4: { type: String },
    brand: { type: String },
    email: { type: String },
    transactionId: { type: String }
  }
});

const StatusUpdateSchema = new Schema<IStatusUpdate>({
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true },
  notes: { type: String },
  estimatedDelivery: { type: Date }
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    uppercase: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  items: [OrderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  shippingAddress: { type: AddressSchema, required: true },
  billingAddress: { type: AddressSchema, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  shipping: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: PaymentMethodSchema, required: true },
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },
  notes: { type: String },
  adminNotes: { type: String },
  statusHistory: [StatusUpdateSchema]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'items.productId': 1 });

// Pre-save middleware to generate order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `SKP${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Pre-save middleware to add status to history
OrderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: 'system', // This should be updated by the controller
      estimatedDelivery: this.estimatedDelivery
    });
  }
  next();
});

// Static method to get order statistics
OrderSchema.statics.getOrderStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);
  
  return stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
};

// Static method to get orders by status
OrderSchema.statics.getOrdersByStatus = function(status: OrderStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

export const Order = mongoose.model<IOrder, IOrderModel>('Order', OrderSchema);

