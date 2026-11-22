import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Camera, Upload, X, Image as ImageIcon, AlertCircle, CheckCircle, Gift, Trophy } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  isSubmitting: boolean;
}

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  images: File[];
  size: string;
  color: string;
  fit: 'Perfect' | 'Too Small' | 'Too Big' | 'Just Right';
  quality: 'Excellent' | 'Good' | 'Average' | 'Poor';
  wouldRecommend: boolean;
}

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName,
  onSubmit,
  isSubmitting
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [fit, setFit] = useState<'Perfect' | 'Too Small' | 'Too Big' | 'Just Right'>('Perfect');
  const [quality, setQuality] = useState<'Excellent' | 'Good' | 'Average' | 'Poor'>('Excellent');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Points calculation based on review completeness
  const calculatePoints = useCallback(() => {
    let points = 0;
    
    // Base points for writing a review
    points += 50;
    
    // Bonus points for rating
    if (rating >= 4) points += 25;
    
    // Bonus points for detailed review
    if (comment.length > 100) points += 30;
    if (comment.length > 300) points += 20; // Extra bonus for detailed reviews
    
    // Bonus points for images
    points += images.length * 15; // 15 points per image
    
    // Bonus points for complete information
    if (size && color) points += 20;
    if (title.length > 10) points += 15;
    
    return points;
  }, [rating, comment, images, size, color, title]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImagePreview[] = [];
    
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => [...prev, `${file.name} is not a valid image file`]);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => [...prev, `${file.name} is too large (max 5MB)`]);
        return;
      }
      
      // Check total image limit (max 5 images)
      if (images.length + newImages.length >= 5) {
        setErrors(prev => [...prev, 'Maximum 5 images allowed']);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          file,
          preview: e.target?.result as string,
          id: Math.random().toString(36).substr(2, 9)
        });
        
        if (newImages.length === files.length || newImages.length === (5 - images.length)) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images.length]);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validation
    const validationErrors: string[] = [];
    
    if (rating === 0) {
      validationErrors.push('Please select a rating');
    }
    
    if (!title.trim()) {
      validationErrors.push('Please enter a review title');
    }
    
    if (!comment.trim()) {
      validationErrors.push('Please write a review comment');
    }
    
    if (comment.length < 20) {
      validationErrors.push('Review comment must be at least 20 characters');
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const reviewData: ReviewData = {
      rating,
      title: title.trim(),
      comment: comment.trim(),
      images: images.map(img => img.file),
      size,
      color,
      fit,
      quality,
      wouldRecommend
    };

    try {
      await onSubmit(reviewData);
      // Reset form after successful submission
      setRating(0);
      setTitle('');
      setComment('');
      setImages([]);
      setSize('');
      setColor('');
      setFit('Perfect');
      setQuality('Excellent');
      setWouldRecommend(true);
      setShowForm(false);
      setErrors([]);
    } catch (error) {
      setErrors(['Failed to submit review. Please try again.']);
    }
  }, [rating, title, comment, images, size, color, fit, quality, wouldRecommend, onSubmit]);

  const points = calculatePoints();

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Points with Reviews!</h3>
          <p className="text-gray-600 mb-4">
            Sign in to write reviews and earn points for sharing your experience with other customers.
          </p>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Review Rewards:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Base review: 50 points</li>
              <li>• High rating (4+ stars): +25 points</li>
              <li>• Detailed review: +30-50 points</li>
              <li>• Upload photos: +15 points each</li>
              <li>• Complete info: +20 points</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Write a Review</h3>
            <p className="text-red-100">Share your experience with {productName}</p>
          </div>
          <div className="text-right">
            <div className="bg-red-500 rounded-full px-4 py-2">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <span className="font-bold">{points} points</span>
              </div>
            </div>
            <p className="text-xs text-red-200 mt-1">You'll earn these points!</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Please fix the following:</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Overall Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Review Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this product. What did you like? What could be improved?"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">{comment.length}/1000 characters</p>
              {comment.length >= 100 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-xs font-medium">+30 points for detailed review</span>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Upload Photos ({images.length}/5)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-3 text-gray-600 hover:text-red-600 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-medium">Click to upload photos</p>
                  <p className="text-sm">Show how you styled this item!</p>
                </div>
              </button>
            </div>
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Review"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">+15 points per photo uploaded</p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Size Purchased
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Color Purchased
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Black, Navy, Red"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Fit & Quality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                How did it fit?
              </label>
              <select
                value={fit}
                onChange={(e) => setFit(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="Perfect">Perfect fit</option>
                <option value="Too Small">Too small</option>
                <option value="Too Big">Too big</option>
                <option value="Just Right">Just right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Quality Rating
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          {/* Recommendation */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recommend"
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
              className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
            />
            <label htmlFor="recommend" className="text-sm font-medium text-gray-900">
              I would recommend this product to others
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>Complete this review to earn <span className="font-bold text-red-600">{points} points</span></p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Submit Review & Earn {points} Points
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
