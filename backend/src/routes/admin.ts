import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { Order, IOrder } from '../models/Order';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Notification } from '../models/Notification';
import { emailService } from '../services/emailService';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// @desc    Get all orders with filtering and pagination
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']).withMessage('Invalid status'),
  query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded', 'partially_refunded']).withMessage('Invalid payment status'),
  query('dateFrom').optional().isISO8601().withMessage('Invalid date format'),
  query('dateTo').optional().isISO8601().withMessage('Invalid date format')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.paymentStatus) {
    filter.paymentStatus = req.query.paymentStatus;
  }
  
  if (req.query.dateFrom || req.query.dateTo) {
    filter.createdAt = {};
    if (req.query.dateFrom) {
      filter.createdAt.$gte = new Date(req.query.dateFrom as string);
    }
    if (req.query.dateTo) {
      filter.createdAt.$lte = new Date(req.query.dateTo as string);
    }
  }

  const orders = await Order.find(filter)
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  // Calculate summary statistics
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        processingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
        },
        shippedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
        }
      }
    }
  ]);

  return res.json({
    success: true,
    data: {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0
      }
    }
  });
}));

// @desc    Get single order details
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
router.get('/orders/:id', [
  param('id').isMongoId().withMessage('Invalid order ID')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'firstName lastName email phone');

  if (!order) {
    throw createError('Order not found', 404);
  }

  return res.json({
    success: true,
    data: { order }
  });
}));

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
router.put('/orders/:id/status', [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'])
    .withMessage('Invalid order status'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('estimatedDelivery').optional().isISO8601().withMessage('Invalid delivery date'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { status, notes, estimatedDelivery, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw createError('Order not found', 404);
  }

  // Update order
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status,
      adminNotes: notes,
      estimatedDelivery,
      trackingNumber,
      $push: {
        statusHistory: {
          status,
          timestamp: new Date(),
          updatedBy: req.user!._id,
          notes,
          estimatedDelivery
        }
      }
    },
    { new: true, runValidators: true }
  );

  // Get user details for email
  const user = await User.findById(order.userId);
  if (user) {
    // Send order status update email
    await emailService.sendOrderStatusUpdate(user, updatedOrder!, status);
  }

  // Create notification for user
  await Notification.createOrderNotification(
    order.userId,
    order._id,
    order.orderNumber,
    status
  );

  // Emit real-time notification via Socket.IO
  const io = req.app.get('io');
  
  // Send to specific user
  io.to(order.userId).emit('orderUpdate', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: status,
    message: `Your order ${order.orderNumber} status has been updated to ${status}.`,
    estimatedDelivery,
    trackingNumber,
    timestamp: new Date().toISOString()
  });

  // Send admin notification to all users for important status changes
  if (['shipped', 'delivered', 'cancelled'].includes(status)) {
    io.emit('adminBroadcast', {
      id: `order-update-${order._id}-${Date.now()}`,
      type: 'info',
      title: 'Order Status Update',
      message: `Order ${order.orderNumber} has been ${status}.`,
      priority: status === 'delivered' ? 'high' : 'medium',
      timestamp: new Date().toISOString(),
      actionRequired: false,
      actionUrl: `/orders/${order._id}`
    });
  }

  return res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { order: updatedOrder }
  });
}));

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get order statistics
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        todayOrders: {
          $sum: { $cond: [{ $gte: ['$createdAt', startOfDay] }, 1, 0] }
        },
        todayRevenue: {
          $sum: { $cond: [{ $gte: ['$createdAt', startOfDay] }, '$total', 0] }
        },
        weekOrders: {
          $sum: { $cond: [{ $gte: ['$createdAt', startOfWeek] }, 1, 0] }
        },
        weekRevenue: {
          $sum: { $cond: [{ $gte: ['$createdAt', startOfWeek] }, '$total', 0] }
        },
        monthOrders: {
          $sum: { $cond: [{ $gte: ['$createdAt', startOfMonth] }, 1, 0] }
        },
        monthRevenue: {
          $sum: { $cond: [{ $gte: ['$createdAt', startOfMonth] }, '$total', 0] }
        }
      }
    }
  ]);

  // Get status distribution
  const statusDistribution = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get recent orders
  const recentOrders = await Order.find()
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get user statistics
  const userStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        adminUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
        }
      }
    }
  ]);

  // Get product statistics
  const productStats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        lowStockProducts: {
          $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] }
        }
      }
    }
  ]);

  return res.json({
    success: true,
    data: {
      orderStats: orderStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        todayOrders: 0,
        todayRevenue: 0,
        weekOrders: 0,
        weekRevenue: 0,
        monthOrders: 0,
        monthRevenue: 0
      },
      statusDistribution,
      recentOrders,
      userStats: userStats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0
      },
      productStats: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0
      }
    }
  });
}));

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['buyer', 'admin']).withMessage('Invalid role'),
  query('isActive').optional().isBoolean().withMessage('isActive must be boolean')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};
  
  if (req.query.role) {
    filter.role = req.query.role;
  }
  
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return res.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('isActive').isBoolean().withMessage('isActive must be boolean')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw createError('User not found', 404);
  }

  return res.json({
    success: true,
    message: 'User status updated successfully',
    data: { user }
  });
}));

// @desc    Send notification to user
// @route   POST /api/admin/notifications
// @access  Private/Admin
router.post('/notifications', [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('type')
    .isIn(['order_confirmation', 'order_status_update', 'order_shipped', 'order_delivered', 'order_cancelled', 'payment_success', 'payment_failed', 'low_stock', 'price_drop', 'back_in_stock', 'promotion', 'system', 'admin_message'])
    .withMessage('Invalid notification type'),
  body('title').isString().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('message').isString().isLength({ min: 1, max: 500 }).withMessage('Message is required and must be less than 500 characters')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { userId, type, title, message, data } = req.body;

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found', 404);
  }

  // Create notification
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    data
  });

  // Emit real-time notification via Socket.IO
  const io = req.app.get('io');
  io.to(userId).emit('newNotification', {
    id: notification._id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt
  });

  res.status(201).json({
    success: true,
    message: 'Notification sent successfully',
    data: { notification }
  });
}));

// @desc    Send broadcast notification to all users
// @route   POST /api/admin/broadcast
// @access  Private/Admin
router.post('/broadcast', [
  body('title').isString().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('message').isString().isLength({ min: 1, max: 500 }).withMessage('Message is required and must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level'),
  body('actionRequired').optional().isBoolean().withMessage('actionRequired must be boolean'),
  body('actionUrl').optional().isString().withMessage('actionUrl must be a string')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { title, message, priority = 'medium', actionRequired = false, actionUrl } = req.body;

  // Emit broadcast notification via Socket.IO
  const io = req.app.get('io');
  io.emit('adminBroadcast', {
    id: `broadcast-${Date.now()}`,
    type: 'admin_message',
    title,
    message,
    priority,
    timestamp: new Date().toISOString(),
    actionRequired,
    actionUrl
  });

  res.status(201).json({
    success: true,
    message: 'Broadcast notification sent successfully'
  });
}));

// @desc    Send system announcement
// @route   POST /api/admin/announcement
// @access  Private/Admin
router.post('/announcement', [
  body('title').isString().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('message').isString().isLength({ min: 1, max: 500 }).withMessage('Message is required and must be less than 500 characters'),
  body('type').optional().isIn(['info', 'warning', 'success', 'error']).withMessage('Invalid announcement type'),
  body('persistent').optional().isBoolean().withMessage('persistent must be boolean')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { title, message, type = 'info', persistent = false } = req.body;

  // Emit system announcement via Socket.IO
  const io = req.app.get('io');
  io.emit('systemAnnouncement', {
    id: `announcement-${Date.now()}`,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    persistent
  });

  res.status(201).json({
    success: true,
    message: 'System announcement sent successfully'
  });
}));

// @desc    Test email configuration
// @route   POST /api/admin/test-email
// @access  Private/Admin
router.post('/test-email', [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('subject').optional().isString().withMessage('Subject must be a string'),
  body('message').optional().isString().withMessage('Message must be a string')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { to, subject = 'SkipaMan Store - Test Email', message = 'This is a test email from SkipaMan Store.' } = req.body;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Test Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">SkipaMan Store</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Email Configuration Test</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #333; margin-top: 0;">Test Email Successful!</h2>
        <p>${message}</p>
        <p>If you're receiving this email, your email configuration is working correctly.</p>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0; color: #1976d2;">Email Service Status</h3>
          <p style="margin-bottom: 0; color: #28a745; font-weight: bold;">✅ Email service is operational</p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6c757d;">
        <p>&copy; 2024 SkipaMan Store. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const success = await emailService.sendCustomEmail(to, subject, html, message);

  if (success) {
    res.json({
      success: true,
      message: 'Test email sent successfully'
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to send test email'
    });
  }
}));

export default router;

