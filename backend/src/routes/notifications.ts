import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { Notification } from '../models/Notification';

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', asyncHandler(async (req: AuthRequest, res: express.Response) => {
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

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const unreadCount = await Notification.getUnreadCount(req.user!._id);

  return res.json({
    success: true,
    data: { unreadCount }
  });
}));

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', asyncHandler(async (req: AuthRequest, res: express.Response) => {
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
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  await Notification.markAllAsRead(req.user!._id);

  return res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  return res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
}));

export default router;

