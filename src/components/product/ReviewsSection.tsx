import React, { useState, useMemo, useEffect } from 'react';
import { Review, ReviewStats } from '../../types';
import ReviewSummary from './ReviewSummary';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import AuthPrompt from '../auth/AuthPrompt';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/useAuth';
import { usePoints } from '../../context/PointsContext';
import { supabase } from '../../lib/supabase';

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

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  stats: ReviewStats;
  onWriteReview?: () => void;
  productName?: string;
  onReviewSubmitted?: (newReview: Review) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  reviews,
  stats,
  productName = 'this product',
  onReviewSubmitted
}) => {
  const { user, isAuthenticated } = useAuth();
  const { addPoints, getPointsForReview } = usePoints();
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !supabase) {
      setAlreadyReviewed(false);
      return;
    }
    void reviewService.hasUserReviewed(productId, user.id).then(setAlreadyReviewed);
  }, [isAuthenticated, user?.id, productId]);

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;
    
    // Filter by rating
    if (filterRating !== null) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    
    // Sort reviews
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'helpful':
          comparison = a.helpful - b.helpful;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [reviews, filterRating, sortBy, sortOrder]);

  const handleRatingFilter = (rating: number | null) => {
    setFilterRating(rating);
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    if (alreadyReviewed) {
      setSubmitError('You have already reviewed this product.');
      return;
    }
    setSubmitError(null);
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (reviewData: ReviewData) => {
    if (!user) return;

    setIsSubmittingReview(true);
    setSubmitError(null);

    try {
      // Submit the review
      const newReview = await reviewService.submitReview({
        productId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userInitials: `${user.firstName[0]}${user.lastName[0]}`,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        images: reviewData.images,
        size: reviewData.size,
        color: reviewData.color,
        fit: reviewData.fit,
        quality: reviewData.quality,
        wouldRecommend: reviewData.wouldRecommend
      });

      // Calculate and add points
      const pointsEarned = getPointsForReview(reviewData);
      addPoints(pointsEarned, 'review', `Review for ${productName}`, {
        productId,
        reviewId: newReview.id
      });

      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }

      setShowReviewForm(false);
      setAlreadyReviewed(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to submit review';
      setSubmitError(msg);
      console.error('Error submitting review:', error);
      throw error;
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
        <p className="text-gray-600">
          Read what our customers have to say about this product
        </p>
      </div>

      {submitError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {submitError}
        </div>
      ) : null}

      {alreadyReviewed && !showReviewForm ? (
        <p className="text-sm text-gray-600 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
          Thanks, you&apos;ve already reviewed this product.
        </p>
      ) : null}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8">
          <ReviewForm
            productId={productId}
            productName={productName}
            onSubmit={handleReviewSubmit}
            isSubmitting={isSubmittingReview}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review Summary */}
        <div className="lg:col-span-1">
          <ReviewSummary stats={stats} onWriteReview={handleWriteReview} />
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {/* Filters and Sorting */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Rating Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <button
                  onClick={() => handleRatingFilter(null)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    filterRating === null
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingFilter(rating)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      filterRating === rating
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-gray-900">Sort by:</span>
                <div className="relative">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('-') as ['date' | 'rating' | 'helpful', 'asc' | 'desc'];
                      setSortBy(newSortBy);
                      setSortOrder(newSortOrder);
                    }}
                    className="appearance-none px-4 py-2.5 pr-10 rounded-full bg-white/95 backdrop-blur-sm border-[0.5px] border-gray-300/50 text-sm font-medium text-gray-900 
                      focus:outline-none focus:ring-1 focus:ring-gray-900/20 focus:border-gray-400/70 
                      hover:border-gray-400/70 hover:bg-white transition-all duration-200 cursor-pointer
                      shadow-sm hover:shadow-lg"
                    style={{
                      backgroundImage: 'none',
                      borderWidth: '0.5px'
                    }}
                  >
                    <option value="date-desc" className="bg-white text-gray-900 py-2 hover:bg-gray-50">Newest First</option>
                    <option value="date-asc" className="bg-white text-gray-900 py-2 hover:bg-gray-50">Oldest First</option>
                    <option value="rating-desc" className="bg-white text-gray-900 py-2 hover:bg-gray-50">Highest Rating</option>
                    <option value="rating-asc" className="bg-white text-gray-900 py-2 hover:bg-gray-50">Lowest Rating</option>
                    <option value="helpful-desc" className="bg-white text-gray-900 py-2 hover:bg-gray-50">Most Helpful</option>
                  </select>
                  {/* Modern custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
              {filterRating !== null && ` (${filterRating}-star only)`}
            </p>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredAndSortedReviews.length > 0 ? (
              filteredAndSortedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500">No reviews found with the selected filters.</p>
                <button
                  onClick={() => setFilterRating(null)}
                  className="mt-2 text-gray-900 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Prompt */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        action="write_review"
        title="Write a Review"
        description="Log in to share your experience and help other customers"
      />
    </div>
  );
};

export default ReviewsSection; 