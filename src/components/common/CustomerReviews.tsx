import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, ThumbsUp, Award } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  helpful: number;
  purchase: string;
}

interface CustomerReviewsProps {
  productId?: string;
  className?: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ productId, className = '' }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Sample reviews - in a real app, these would come from an API
  const reviews: Review[] = [
    {
      id: 1,
      name: "Alex M.",
      location: "Cape Town",
      rating: 5,
      text: "Perfect fit and amazing quality! The fabric is so soft and comfortable. I've worn it multiple times and it still looks brand new.",
      date: "2 days ago",
      verified: true,
      helpful: 12,
      purchase: "Premium Cotton Tee - Size M"
    },
    {
      id: 2,
      name: "Jessica K.",
      location: "Johannesburg",
      rating: 5,
      text: "Love the design and the quality is outstanding. Shipping was super fast too! Definitely ordering more colors.",
      date: "1 week ago",
      verified: true,
      helpful: 8,
      purchase: "Urban Street Collection - Size S"
    },
    {
      id: 3,
      name: "Ryan T.",
      location: "Durban",
      rating: 4,
      text: "Great t-shirt overall. The material is good quality and the fit is perfect. Would recommend to others.",
      date: "3 days ago",
      verified: false,
      helpful: 5,
      purchase: "Sport Collection - Size L"
    },
    {
      id: 4,
      name: "Sarah L.",
      location: "Pretoria",
      rating: 5,
      text: "Absolutely love this t-shirt! The design is unique and the quality is top-notch. Will definitely buy again.",
      date: "5 days ago",
      verified: true,
      helpful: 15,
      purchase: "Casual Comfort Line - Size M"
    }
  ];

  const filteredReviews = selectedRating 
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;

  const ratingStats = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Reviews Header */}
      <motion.div 
        className="border-b border-gray-200 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Rating Summary */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {reviews.length} reviews
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-3">
                    {rating}
                  </span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(ratingStats[rating as keyof typeof ratingStats] / reviews.length) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingStats[rating as keyof typeof ratingStats]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">
                Verified Reviews
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-medium text-gray-700">
                Quality Guaranteed
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedRating(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedRating === null
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Reviews
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setSelectedRating(rating)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedRating === rating
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {rating} Stars ({ratingStats[rating as keyof typeof ratingStats]})
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                {/* Customer Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    {review.verified && (
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{review.location}</p>
                  <p className="text-xs text-gray-500">{review.purchase}</p>
                </div>
              </div>

              {/* Rating and Date */}
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 leading-relaxed mb-4">
              {review.text}
            </p>

            {/* Helpful Button */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-sm">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      <motion.div 
        className="text-center pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105">
          Load More Reviews
        </button>
      </motion.div>
    </div>
  );
};

export default CustomerReviews;
