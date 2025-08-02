import React, { useState, useMemo } from 'react';
import { Review, ReviewStats } from '../../types';
import ReviewSummary from './ReviewSummary';
import ReviewCard from './ReviewCard';

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  stats: ReviewStats;
  onWriteReview?: () => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  reviews,
  stats,
  onWriteReview
}) => {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const handleSort = (newSortBy: 'date' | 'rating' | 'helpful') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review Summary */}
        <div className="lg:col-span-1">
          <ReviewSummary stats={stats} onWriteReview={onWriteReview} />
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
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-') as ['date' | 'rating' | 'helpful', 'asc' | 'desc'];
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="rating-desc">Highest Rating</option>
                  <option value="rating-asc">Lowest Rating</option>
                  <option value="helpful-desc">Most Helpful</option>
                </select>
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
    </div>
  );
};

export default ReviewsSection; 