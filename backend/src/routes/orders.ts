import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { Order, IOrder, OrderStatus } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { emailService } from '../services/emailService';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', authenticate, [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  body('billingAddress')
    .isObject()
    .withMessage('Billing address is required'),
  body('paymentMethod')
    .isObject()
    .withMessage('Payment method is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

  // Validate and calculate order totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw createError(`Product with ID ${item.productId} not found`, 404);
    }

    if (!product.isActive) {
      throw createError(`Product ${product.name} is no longer available`, 400);
    }

    if (product.stock < item.quantity) {
      throw createError(`Insufficient stock for ${product.name}. Available: ${product.stock}`, 400);
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      productId: product._id,
      productName: product.name,
      productImage: product.images[0],
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: product.price,
      total: itemTotal
    });
  }

  // Calculate tax (8% for example)
  const tax = subtotal * 0.08;
  
  // Calculate shipping (free for orders over $50, otherwise $5.99)
  const shipping = subtotal >= 50 ? 0 : 5.99;
  
  // Calculate total
  const total = subtotal + tax + shipping;

  // Create order
  const order = await Order.create({
    userId: req.user!._id,
    items: orderItems,
    shippingAddress,
    billingAddress,
    subtotal,
    tax,
    shipping,
    total,
    paymentMethod,
    notes,
    status: 'pending',
    paymentStatus: 'pending'
  });

  // Update product stock
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } }
    );
  }

  // Get user details for email
  const user = await User.findById(req.user!._id);
  if (user) {
    // Send order confirmation email
    await emailService.sendOrderConfirmation(user, order);
  }

  // Create order confirmation notification
  await Notification.createOrderNotification(
    req.user!._id,
    order._id,
    order.orderNumber,
    'pending'
  );

  // Emit real-time notification via Socket.IO
  const io = req.app.get('io');
  io.to(req.user!._id).emit('orderUpdate', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    message: `Your order ${order.orderNumber} has been confirmed and is being processed.`,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order }
  });
}));

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ userId: req.user!._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ userId: req.user!._id });

  return res.json({
    success: true,
    data: {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', authenticate, [
  param('id').isMongoId().withMessage('Invalid order ID')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw createError('Order not found', 404);
  }

  // Check if user owns this order or is admin
  if (order.userId !== req.user!._id && req.user!.role !== 'admin') {
    throw createError('Access denied', 403);
  }

  return res.json({
    success: true,
    data: { order }
  });
}));

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', authenticate, authorize('admin'), [
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

  // Create notification for user
  await Notification.createOrderNotification(
    order.userId,
    order._id,
    order.orderNumber,
    status
  );

  // Emit real-time notification via Socket.IO
  const io = req.app.get('io');
  io.to(order.userId).emit('orderUpdate', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: status,
    message: `Your order ${order.orderNumber} status has been updated to ${status}.`,
    estimatedDelivery,
    trackingNumber
  });

  return res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { order: updatedOrder }
  });
}));

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', authenticate, [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('reason').optional().isString().withMessage('Cancellation reason must be a string')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw createError('Order not found', 404);
  }

  // Check if user owns this order
  if (order.userId !== req.user!._id) {
    throw createError('Access denied', 403);
  }

  // Check if order can be cancelled
  if (['delivered', 'cancelled', 'returned', 'refunded'].includes(order.status)) {
    throw createError('Order cannot be cancelled', 400);
  }

  // Update order status
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: 'cancelled',
      $push: {
        statusHistory: {
          status: 'cancelled',
          timestamp: new Date(),
          updatedBy: req.user!._id,
          notes: reason || 'Order cancelled by customer'
        }
      }
    },
    { new: true, runValidators: true }
  );

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: item.quantity } }
    );
  }

  // Create notification
  await Notification.createOrderNotification(
    order.userId,
    order._id,
    order.orderNumber,
    'cancelled'
  );

  return res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order: updatedOrder }
  });
}));

// @desc    Get order tracking info
// @route   GET /api/orders/:id/tracking
// @access  Private
router.get('/:id/tracking', authenticate, [
  param('id').isMongoId().withMessage('Invalid order ID')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const order = await Order.findById(req.params.id).select('orderNumber status statusHistory trackingNumber estimatedDelivery createdAt');

  if (!order) {
    throw createError('Order not found', 404);
  }

  // Check if user owns this order
  if (order.userId !== req.user!._id) {
    throw createError('Access denied', 403);
  }

  // Calculate delivery estimate based on status
  let deliveryEstimate = null;
  if (order.status === 'shipped' || order.status === 'out_for_delivery') {
    deliveryEstimate = order.estimatedDelivery || new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours from now
  }

  return res.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: deliveryEstimate,
      statusHistory: order.statusHistory,
      createdAt: order.createdAt
    }
  });
}));

export default router;

