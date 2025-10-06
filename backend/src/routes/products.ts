import express from 'express';
import { query, param } from 'express-validator';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { Product } from '../models/Product';

const router = express.Router();

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('sortBy').optional().isIn(['price', 'rating', 'newest', 'name']).withMessage('Invalid sort option'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], optionalAuth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = { isActive: true };
  
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  if (req.query.featured !== undefined) {
    filter.featured = req.query.featured === 'true';
  }
  
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) {
      filter.price.$gte = parseFloat(req.query.minPrice as string);
    }
    if (req.query.maxPrice) {
      filter.price.$lte = parseFloat(req.query.maxPrice as string);
    }
  }

  // Build sort object
  let sort: any = { createdAt: -1 }; // Default sort by newest
  
  if (req.query.sortBy) {
    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'price':
        sort = { price: sortOrder };
        break;
      case 'rating':
        sort = { rating: sortOrder };
        break;
      case 'newest':
        sort = { createdAt: sortOrder };
        break;
      case 'name':
        sort = { name: sortOrder };
        break;
    }
  }

  let query = Product.find(filter).sort(sort);

  // Handle search
  if (req.query.search) {
    const searchTerm = req.query.search as string;
    query = Product.find({
      ...filter,
      $text: { $search: searchTerm }
    }).sort({ score: { $meta: 'textScore' }, ...sort });
  }

  const products = await query.skip(skip).limit(limit);
  const total = await Product.countDocuments(filter);

  return res.json({
    success: true,
    data: {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid product ID')
], optionalAuth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw createError('Product not found', 404);
  }

  if (!product.isActive) {
    throw createError('Product is no longer available', 404);
  }

  return res.json({
    success: true,
    data: { product }
  });
}));

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], optionalAuth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const products = await Product.getFeaturedProducts(limit);

  return res.json({
    success: true,
    data: { products }
  });
}));

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.get('/category/:category', [
  param('category').isString().withMessage('Category must be a string'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], optionalAuth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const limit = parseInt(req.query.limit as string) || 20;

  const products = await Product.getProductsByCategory(req.params.category, limit);

  return res.json({
    success: true,
    data: { products }
  });
}));

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
router.get('/search/:query', [
  param('query').isString().withMessage('Search query must be a string'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], optionalAuth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const limit = parseInt(req.query.limit as string) || 20;

  const products = await Product.searchProducts(req.params.query, limit);

  return res.json({
    success: true,
    data: { products }
  });
}));

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
router.get('/categories', optionalAuth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const categories = await Product.distinct('category', { isActive: true });

  return res.json({
    success: true,
    data: { categories }
  });
}));

export default router;

