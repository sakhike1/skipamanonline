import express from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticate, requireAdmin } from '../middleware/auth';
import DesignRequest from '../models/DesignRequest';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/design-requests/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Create design request
router.post('/', [
  authenticate,
  upload.array('referenceImages', 5), // Allow up to 5 images
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('category').isIn(['Dress', 'Suit', 'Shirt', 'Pants', 'Jacket', 'Coat', 'Skirt', 'Blouse', 'Other']).withMessage('Invalid category'),
  body('budget').isIn(['Under $100', '$100 - $300', '$300 - $500', '$500 - $1000', 'Over $1000']).withMessage('Invalid budget range'),
  body('timeline').isIn(['1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months', 'Flexible']).withMessage('Invalid timeline'),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Measurements']).withMessage('Invalid size'),
  body('materials').optional().isArray().withMessage('Materials must be an array'),
  body('colors').optional().isArray().withMessage('Colors must be an array'),
  body('additionalNotes').optional().trim().isLength({ max: 1000 }).withMessage('Additional notes must be less than 1000 characters')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const {
    title,
    description,
    category,
    budget,
    timeline,
    materials,
    colors,
    size,
    additionalNotes
  } = req.body;

  // Get uploaded file paths
  const referenceImages = (req.files as Express.Multer.File[])?.map(file => file.path) || [];

  const designRequest = await DesignRequest.create({
    title,
    description,
    category,
    budget,
    timeline,
    materials: materials ? JSON.parse(materials) : [],
    colors: colors ? JSON.parse(colors) : [],
    size,
    additionalNotes,
    referenceImages,
    userId: req.user!._id
  });

  // Emit real-time notification to admins
  const io = req.app.get('io');
  io.emit('newDesignRequest', {
    id: designRequest._id,
    title: designRequest.title,
    category: designRequest.category,
    userId: designRequest.userId,
    createdAt: designRequest.createdAt
  });

  return res.status(201).json({
    success: true,
    message: 'Design request submitted successfully',
    data: { designRequest }
  });
}));

// Get user's design requests
router.get('/my-requests', authenticate, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const designRequests = await DesignRequest.find({ userId: req.user!._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await DesignRequest.countDocuments({ userId: req.user!._id });

  return res.json({
    success: true,
    data: {
      designRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// Get single design request
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const designRequest = await DesignRequest.findById(req.params.id);

  if (!designRequest) {
    throw createError('Design request not found', 404);
  }

  // Check if user owns the request or is admin
  if (designRequest.userId !== req.user!._id && req.user!.role !== 'admin') {
    throw createError('Access denied', 403);
  }

  return res.json({
    success: true,
    data: { designRequest }
  });
}));

// Admin routes
// Get all design requests (admin only)
router.get('/', requireAdmin, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status as string;
  const category = req.query.category as string;

  const filter: any = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const designRequests = await DesignRequest.find(filter)
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await DesignRequest.countDocuments(filter);

  return res.json({
    success: true,
    data: {
      designRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// Update design request status (admin only)
router.put('/:id/status', [
  requireAdmin,
  body('status').isIn(['pending', 'reviewed', 'approved', 'in_progress', 'completed', 'rejected']).withMessage('Invalid status'),
  body('adminNotes').optional().trim().isLength({ max: 1000 }).withMessage('Admin notes must be less than 1000 characters'),
  body('estimatedPrice').optional().isNumeric().withMessage('Estimated price must be a number'),
  body('estimatedDelivery').optional().isISO8601().withMessage('Invalid estimated delivery date')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { status, adminNotes, estimatedPrice, estimatedDelivery } = req.body;

  const designRequest = await DesignRequest.findById(req.params.id);
  if (!designRequest) {
    throw createError('Design request not found', 404);
  }

  const updateData: any = { status };
  if (adminNotes) updateData.adminNotes = adminNotes;
  if (estimatedPrice) updateData.estimatedPrice = estimatedPrice;
  if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);

  const updatedRequest = await DesignRequest.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  ).populate('userId', 'firstName lastName email');

  // Emit real-time notification to user
  const io = req.app.get('io');
  io.to(designRequest.userId).emit('designRequestUpdate', {
    id: updatedRequest!._id,
    status: updatedRequest!.status,
    adminNotes: updatedRequest!.adminNotes,
    estimatedPrice: updatedRequest!.estimatedPrice,
    estimatedDelivery: updatedRequest!.estimatedDelivery,
    updatedAt: updatedRequest!.updatedAt
  });

  return res.json({
    success: true,
    message: 'Design request updated successfully',
    data: { designRequest: updatedRequest }
  });
}));

// Get design request statistics (admin only)
router.get('/admin/stats', requireAdmin, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const stats = await DesignRequest.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await DesignRequest.countDocuments();
  const recentRequests = await DesignRequest.find()
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(5);

  const categoryStats = await DesignRequest.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return res.json({
    success: true,
    data: {
      total,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {} as Record<string, number>),
      byCategory: categoryStats,
      recentRequests
    }
  });
}));

export default router;
