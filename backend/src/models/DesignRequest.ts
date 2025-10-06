import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignRequest extends Document {
  title: string;
  description: string;
  category: string;
  budget: string;
  timeline: string;
  materials: string[];
  colors: string[];
  size: string;
  additionalNotes?: string;
  referenceImages: string[];
  userId: string;
  status: 'pending' | 'reviewed' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  adminNotes?: string;
  estimatedPrice?: number;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DesignRequestSchema = new Schema<IDesignRequest>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Dress', 'Suit', 'Shirt', 'Pants', 'Jacket', 'Coat', 'Skirt', 'Blouse', 'Other']
  },
  budget: {
    type: String,
    required: [true, 'Budget is required'],
    enum: ['Under $100', '$100 - $300', '$300 - $500', '$500 - $1000', 'Over $1000']
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    enum: ['1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months', 'Flexible']
  },
  materials: [{
    type: String,
    enum: ['Cotton', 'Silk', 'Wool', 'Linen', 'Denim', 'Leather', 'Suede', 'Cashmere', 'Polyester', 'Rayon']
  }],
  colors: [{
    type: String,
    enum: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Brown', 'Gray', 'Navy']
  }],
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Measurements']
  },
  additionalNotes: {
    type: String,
    trim: true
  },
  referenceImages: [{
    type: String // URLs to uploaded images
  }],
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  estimatedPrice: {
    type: Number,
    min: 0
  },
  estimatedDelivery: {
    type: Date
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
DesignRequestSchema.index({ userId: 1 });
DesignRequestSchema.index({ status: 1 });
DesignRequestSchema.index({ category: 1 });
DesignRequestSchema.index({ createdAt: -1 });

// Static method to get design request statistics
DesignRequestSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await this.countDocuments();
  
  return {
    total,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as Record<string, number>)
  };
};

const DesignRequest = mongoose.model<IDesignRequest>('DesignRequest', DesignRequestSchema);

export default DesignRequest;
