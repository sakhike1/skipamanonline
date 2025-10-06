import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationModel extends mongoose.Model<INotification> {
  getUnreadCount(userId: string): Promise<number>;
  markAllAsRead(userId: string): Promise<any>;
  getNotificationsByType(userId: string, type: NotificationType, limit?: number): Promise<INotification[]>;
  createOrderNotification(userId: string, orderId: string, orderNumber: string, status: string): Promise<INotification | null>;
}

export type NotificationType = 
  | 'order_confirmation'
  | 'order_status_update'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'low_stock'
  | 'price_drop'
  | 'back_in_stock'
  | 'promotion'
  | 'system'
  | 'admin_message';

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'order_confirmation',
      'order_status_update',
      'order_shipped',
      'order_delivered',
      'order_cancelled',
      'payment_success',
      'payment_failed',
      'low_stock',
      'price_drop',
      'back_in_stock',
      'promotion',
      'system',
      'admin_message'
    ],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  }
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
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ createdAt: -1 });

// Static method to get unread notifications count
NotificationSchema.statics.getUnreadCount = function(userId: string) {
  return this.countDocuments({ userId, isRead: false });
};

// Static method to mark all notifications as read
NotificationSchema.statics.markAllAsRead = function(userId: string) {
  return this.updateMany({ userId, isRead: false }, { isRead: true });
};

// Static method to get notifications by type
NotificationSchema.statics.getNotificationsByType = function(userId: string, type: NotificationType, limit = 20) {
  return this.find({ userId, type })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to create order notification
NotificationSchema.statics.createOrderNotification = function(
  userId: string,
  orderId: string,
  orderNumber: string,
  status: string
) {
  const notifications = {
    pending: {
      type: 'order_confirmation' as NotificationType,
      title: 'Order Confirmed',
      message: `Your order ${orderNumber} has been confirmed and is being processed.`
    },
    confirmed: {
      type: 'order_status_update' as NotificationType,
      title: 'Order Confirmed',
      message: `Your order ${orderNumber} has been confirmed and is being prepared.`
    },
    processing: {
      type: 'order_status_update' as NotificationType,
      title: 'Order Processing',
      message: `Your order ${orderNumber} is being processed and will be shipped soon.`
    },
    packed: {
      type: 'order_status_update' as NotificationType,
      title: 'Order Packed',
      message: `Your order ${orderNumber} has been packed and is ready for shipment.`
    },
    shipped: {
      type: 'order_shipped' as NotificationType,
      title: 'Order Shipped',
      message: `Your order ${orderNumber} has been shipped and is on its way to you.`
    },
    out_for_delivery: {
      type: 'order_status_update' as NotificationType,
      title: 'Out for Delivery',
      message: `Your order ${orderNumber} is out for delivery and should arrive within 8 hours.`
    },
    delivered: {
      type: 'order_delivered' as NotificationType,
      title: 'Order Delivered',
      message: `Your order ${orderNumber} has been delivered successfully.`
    },
    cancelled: {
      type: 'order_cancelled' as NotificationType,
      title: 'Order Cancelled',
      message: `Your order ${orderNumber} has been cancelled.`
    }
  };

  const notificationData = notifications[status as keyof typeof notifications];
  if (notificationData) {
    return this.create({
      userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: { orderId, orderNumber, status }
    });
  }
  return null;
};

export const Notification = mongoose.model<INotification, INotificationModel>('Notification', NotificationSchema);

