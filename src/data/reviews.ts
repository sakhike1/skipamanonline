import { Review, ReviewStats } from '../types';

export const reviews: Review[] = [
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
  },
  {
    id: '3',
    productId: '1',
    userId: 'user3',
    userName: 'Mike Johnson',
    userInitials: 'MJ',
    rating: 5,
    title: 'My new favorite tee',
    comment: 'I\'ve been wearing this tee for a month now and it still looks brand new. The color hasn\'t faded and the fabric hasn\'t pilled. Highly recommend!',
    date: '2024-01-08',
    verified: true,
    helpful: 15,
  },
  {
    id: '4',
    productId: '2',
    userId: 'user4',
    userName: 'Alex Chen',
    userInitials: 'AC',
    rating: 5,
    title: 'Love the AI design!',
    comment: 'The AI Future graphic is so unique and well-printed. The colors are vibrant and the design is exactly as shown. Perfect for tech enthusiasts!',
    date: '2024-01-12',
    verified: true,
    helpful: 9,
  },
  {
    id: '5',
    productId: '2',
    userId: 'user5',
    userName: 'Emily Davis',
    userInitials: 'ED',
    rating: 4,
    title: 'Great conversation starter',
    comment: 'I get so many compliments on this shirt! The design is eye-catching and the quality is good. The only minor issue is that it runs a bit small.',
    date: '2024-01-05',
    verified: true,
    helpful: 6,
  },
  {
    id: '6',
    productId: '3',
    userId: 'user6',
    userName: 'David Brown',
    userInitials: 'DB',
    rating: 5,
    title: 'Minimalist perfection',
    comment: 'This is exactly what I was looking for - a simple, elegant tee with a subtle logo. The fit is perfect and the fabric is comfortable.',
    date: '2024-01-14',
    verified: true,
    helpful: 11,
  },
  {
    id: '7',
    productId: '3',
    userId: 'user7',
    userName: 'Lisa Garcia',
    userInitials: 'LG',
    rating: 4,
    title: 'Clean and simple',
    comment: 'Love the minimalist design. The quality is good and it\'s very comfortable to wear. Perfect for everyday use.',
    date: '2024-01-09',
    verified: true,
    helpful: 7,
  },
  {
    id: '8',
    productId: '4',
    userId: 'user8',
    userName: 'Tom Wilson',
    userInitials: 'TW',
    rating: 4,
    title: 'Stunning gradient design',
    comment: 'The gradient pattern is absolutely beautiful! The colors are vibrant and the design is unique. Great quality fabric too.',
    date: '2024-01-11',
    verified: true,
    helpful: 10,
  },
];

export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews.filter(review => review.productId === productId);
};

export const getReviewStats = (productId: string): ReviewStats => {
  const productReviews = getReviewsByProductId(productId);
  const totalReviews = productReviews.length;
  
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;
  
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  productReviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
  });
  
  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution
  };
}; 