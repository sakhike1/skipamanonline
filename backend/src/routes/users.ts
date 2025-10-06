import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Notification } from '../models/Notification';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const user = await User.findById(req.user!._id);
  
  return res.json({
    success: true,
    data: { user }
  });
}));

// @desc    Get user's order history
// @route   GET /api/users/orders
// @access  Private
router.get('/orders', asyncHandler(async (req: AuthRequest, res: express.Response) => {
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

// @desc    Get user's notifications
// @route   GET /api/users/notifications
// @access  Private
router.get('/notifications', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId: req.user!._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ userId: req.user!._id });
  const unreadCount = await Notification.countDocuments({ userId: req.user!._id, isRead: false });

  return res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
router.put('/notifications/:id/read', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  return res.json({
    success: true,
    message: 'Notification marked as read',
    data: { notification }
  });
}));

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/read-all
// @access  Private
router.put('/notifications/read-all', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  await Notification.updateMany(
    { userId: req.user!._id, isRead: false },
    { isRead: true }
  );

  return res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

export default router;

