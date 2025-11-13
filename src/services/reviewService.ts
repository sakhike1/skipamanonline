import { Review } from '../types';

// Mock service for handling reviews - in a real app, this would make API calls
export const reviewService = {
  // Submit a new review
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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would:
    // 1. Upload images to a cloud storage service (AWS S3, Cloudinary, etc.)
    // 2. Save review data to your database
    // 3. Update product statistics
    
    // For now, we'll simulate the response
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      productId: reviewData.productId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      userInitials: reviewData.userInitials,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0,
      images: reviewData.images.length > 0 ? 
        reviewData.images.map((_, index) => `/api/images/reviews/${Math.random().toString(36).substr(2, 9)}_${index}.jpg`) : 
        undefined,
      size: reviewData.size,
      color: reviewData.color,
      fit: reviewData.fit,
      quality: reviewData.quality,
      wouldRecommend: reviewData.wouldRecommend,
      pointsEarned: calculateReviewPoints(reviewData)
    };

    // Store in localStorage for demo purposes
    const existingReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
    existingReviews.push(newReview);
    localStorage.setItem('user_reviews', JSON.stringify(existingReviews));

    return newReview;
  },

  // Get reviews for a specific product
  async getProductReviews(productId: string): Promise<Review[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // In a real app, this would fetch from your database
    const allReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
    const productReviews = allReviews.filter((review: Review) => review.productId === productId);
    
    // For demo, combine with static reviews
    const staticReviews = [
      {
        id: '1',
        productId: '1',
        userId: 'user1',
        userName: 'John Doe',
        userInitials: 'JD',
        rating: 5,
        title: 'Perfect fit and quality!',
        comment: 'This classic black tee exceeded my expectations. The fabric is incredibly soft and the fit is perfect. I ordered a medium and it fits exactly as expected. The quality is outstanding for the price.',
        date: '2024-01-15',
        verified: true,
        helpful: 12,
        size: 'M',
        color: 'Black',
        fit: 'Perfect',
        quality: 'Excellent',
        wouldRecommend: true
      },
      {
        id: '2',
        productId: '1',
        userId: 'user2',
        userName: 'Sarah Wilson',
        userInitials: 'SW',
        rating: 4,
        title: 'Great quality, slightly large',
        comment: 'The quality is excellent and the fabric feels premium. However, I found it runs slightly large. I usually wear a medium but would size down to small next time.',
        date: '2024-01-10',
        verified: true,
        helpful: 8,
        size: 'M',
        color: 'Black',
        fit: 'Too Big',
        quality: 'Good',
        wouldRecommend: true
      }
    ];

    const relevantStaticReviews = staticReviews.filter((review: Review) => review.productId === productId);
    
    return [...productReviews, ...relevantStaticReviews].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  // Upload image to server (mock implementation)
  async uploadImage(file: File): Promise<string> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would upload to your server/cloud storage
    // For demo purposes, return a mock URL
    const mockImageUrl = `/api/images/reviews/${Math.random().toString(36).substr(2, 9)}.jpg`;
    
    // Store file reference for demo (in real app, file would be uploaded)
    const imageRefs = JSON.parse(localStorage.getItem('review_images') || '{}');
    imageRefs[mockImageUrl] = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
    localStorage.setItem('review_images', JSON.stringify(imageRefs));

    return mockImageUrl;
  },

  // Update review helpfulness
  async markReviewHelpful(reviewId: string, userId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // In a real app, this would update the database
    const allReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
    const reviewIndex = allReviews.findIndex((review: Review) => review.id === reviewId);
    
    if (reviewIndex !== -1) {
      allReviews[reviewIndex].helpful += 1;
      localStorage.setItem('user_reviews', JSON.stringify(allReviews));
    }
  }
};

// Helper function to calculate points for a review
function calculateReviewPoints(reviewData: any): number {
  let points = 0;
  
  // Base points for writing a review
  points += 50;
  
  // Bonus points for rating
  if (reviewData.rating >= 4) {
    points += 25;
  }
  
  // Bonus points for detailed review
  if (reviewData.comment && reviewData.comment.length > 100) {
    points += 30;
    if (reviewData.comment.length > 300) {
      points += 20; // Extra bonus for detailed reviews
    }
  }
  
  // Bonus points for images
  if (reviewData.images && reviewData.images.length > 0) {
    points += reviewData.images.length * 15; // 15 points per image
  }
  
  // Bonus points for complete information
  if (reviewData.size && reviewData.color) {
    points += 20;
  }
  
  if (reviewData.title && reviewData.title.length > 10) {
    points += 15;
  }
  
  // Bonus for recommendation
  if (reviewData.wouldRecommend) {
    points += 10;
  }
  
  return points;
}
