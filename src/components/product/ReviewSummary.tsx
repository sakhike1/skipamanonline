import React from 'react';
import { ReviewStats } from '../../types';

interface ReviewSummaryProps {
  stats: ReviewStats;
  onWriteReview?: () => void;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ stats, onWriteReview }) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
            <div className="flex text-yellow-400 justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
        
        {onWriteReview && (
          <button
            onClick={onWriteReview}
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0;
          const percentage = getPercentage(count);
          
          return (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-8">
                <span className="text-sm text-gray-600">{rating}</span>
                <span className="text-yellow-400">★</span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-right">
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      {totalReviews > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {getPercentage(ratingDistribution[5] + ratingDistribution[4])}%
              </div>
              <div className="text-gray-500">Would recommend</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {getPercentage(ratingDistribution[5])}%
              </div>
              <div className="text-gray-500">5-star reviews</div>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {onWriteReview && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={onWriteReview}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write a Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSummary; 