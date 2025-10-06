import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: IColor[];
  category: string;
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  stock: number;
  sku: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductModel extends mongoose.Model<IProduct> {
  getFeaturedProducts(limit?: number): Promise<IProduct[]>;
  getProductsByCategory(category: string, limit?: number): Promise<IProduct[]>;
  searchProducts(query: string, limit?: number): Promise<IProduct[]>;
}

export interface IColor {
  name: string;
  value: string;
}

const ColorSchema = new Schema<IColor>({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL'],
    required: true
  }],
  colors: [ColorSchema],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    trim: true,
    uppercase: true
  },
  weight: {
    type: Number,
    required: [true, 'Product weight is required'],
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
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
ProductSchema.index({ sku: 1 }, { unique: true });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });

// Pre-save middleware to generate SKU if not provided
ProductSchema.pre('save', async function(next) {
  if (this.isNew && !this.sku) {
    const count = await mongoose.model('Product').countDocuments();
    this.sku = `SKP-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Static method to get featured products
ProductSchema.statics.getFeaturedProducts = function(limit = 10) {
  return this.find({ featured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get products by category
ProductSchema.statics.getProductsByCategory = function(category: string, limit = 20) {
  return this.find({ category, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search products
ProductSchema.statics.searchProducts = function(query: string, limit = 20) {
  return this.find({
    $text: { $search: query },
    isActive: true
  })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
};

export const Product = mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

