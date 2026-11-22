import { supabase } from '../lib/supabase';
import type { Review } from '../types';
import {
  computeReviewStats,
  fetchPublishedReviewsForProduct,
  submitProductReview,
  userHasReviewedProduct,
} from './productReviews';

export const reviewService = {
  async getProductReviews(productId: string): Promise<Review[]> {
    if (!supabase) return [];
    return fetchPublishedReviewsForProduct(supabase, productId);
  },

  async hasUserReviewed(productId: string, userId: string): Promise<boolean> {
    if (!supabase) return false;
    return userHasReviewedProduct(supabase, userId, productId);
  },

  async submitReview(reviewData: {
    productId: string;
    userId: string;
    userName: string;
    userInitials: string;
    rating: number;
    title: string;
    comment: string;
    images: File[];
    size?: string;
    color?: string;
    fit?: 'Perfect' | 'Too Small' | 'Too Big' | 'Just Right';
    quality?: 'Excellent' | 'Good' | 'Average' | 'Poor';
    wouldRecommend?: boolean;
  }): Promise<Review> {
    if (!supabase) {
      throw new Error('Reviews are unavailable (database not configured).');
    }

    // Image upload to storage can be added later; reviews work without photos for now.
    void reviewData.images;
    void reviewData.userName;
    void reviewData.userInitials;

    return submitProductReview(supabase, {
      productId: reviewData.productId,
      userId: reviewData.userId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      size: reviewData.size,
      color: reviewData.color,
      fit: reviewData.fit,
      quality: reviewData.quality,
      wouldRecommend: reviewData.wouldRecommend,
    });
  },

  async markReviewHelpful(_reviewId: string, _userId: string): Promise<void> {
    // Optional future: increment helpful_count with dedupe table
  },
};

export { computeReviewStats };
