export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  verified: boolean;
  purchase: string;
  date: string;
  helpful?: number;
  images?: string[];
  tags?: string[];
}

/**
 * Testimonials data for SocialProof component
 */
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah J.",
    location: "New York",
    rating: 5,
    text: "The quality of these t-shirts is incredible! I love how they feel and the designs are so unique. Definitely my new favorite brand.",
    avatar: "SJ",
    verified: true,
    purchase: "Premium Collection",
    date: "2 days ago",
    helpful: 32,
    images: ["/images/reviews/sarah-1.jpg"],
    tags: ["Incredible Quality", "Unique Designs", "Favorite Brand", "Trusted Review"]
  },
  {
    id: 2,
    name: "Michael T.",
    location: "Johannesburg",
    rating: 5,
    text: "Absolutely blown away by the quality! The Urban Street Collection exceeded all my expectations. The fabric is incredibly soft and durable, perfect for daily wear. The fit is spot-on - not too tight, not too loose. What really impressed me was the attention to detail in the stitching and design. Plus, the shipping was lightning fast and the customer service team was incredibly helpful when I had sizing questions. This is now my go-to brand for premium streetwear!",
    avatar: "MT",
    verified: true,
    purchase: "Urban Street Collection",
    date: "1 week ago",
    helpful: 24,
    images: ["/images/reviews/michael-1.jpg", "/images/reviews/michael-2.jpg"],
    tags: ["Perfect Fit", "Premium Quality", "Fast Shipping", "Great Service"]
  },
  {
    id: 3,
    name: "Emma L.",
    location: "Durban",
    rating: 5,
    text: "I've been searching for the perfect blend of style and quality for months, and I finally found it here! The Sport Collection is absolutely incredible - the fabric feels luxurious against the skin and the fit is absolutely perfect. What really sets this brand apart is the attention to detail in every stitch and design element. The colors are vibrant and stay true even after multiple washes. The customer service was exceptional too - they helped me choose the right size and even offered styling tips. I'm already planning my next order!",
    avatar: "EL",
    verified: true,
    purchase: "Sport Collection",
    date: "3 days ago",
    helpful: 18,
    images: ["/images/reviews/emma-1.jpg", "/images/reviews/emma-2.jpg"],
    tags: ["Stylish Design", "Premium Quality", "Perfect Fit", "Vibrant Colors"]
  },
  {
    id: 4,
    name: "David K.",
    location: "Pretoria",
    rating: 5,
    text: "Best t-shirt brand I've found! The Casual Comfort Line is exactly what I was looking for - trendy designs with top-notch quality. The fabric is incredibly soft and the fit is perfect for my body type. I love how the designs are modern yet timeless, making them perfect for both casual outings and more dressed-up occasions. The customer service was outstanding and the packaging was eco-friendly too. Will definitely be ordering again and recommending to all my friends!",
    avatar: "DK",
    verified: true,
    purchase: "Casual Comfort Line",
    date: "5 days ago",
    helpful: 22,
    images: ["/images/reviews/david-1.jpg"],
    tags: ["Trendy Designs", "Top Quality", "Eco-Friendly", "Perfect Fit"]
  },
  {
    id: 5,
    name: "Lisa M.",
    location: "Cape Town",
    rating: 5,
    text: "I'm absolutely obsessed with my new t-shirts! The quality is beyond compare - they've survived countless washes and still look brand new. The designs are so unique and eye-catching, I get compliments every time I wear them. The customer service team was incredibly helpful in helping me choose the perfect sizes. This is definitely my new favorite brand!",
    avatar: "LM",
    verified: true,
    purchase: "Premium Collection",
    date: "1 week ago",
    helpful: 28,
    images: ["/images/reviews/sarah-1.jpg"],
    tags: ["Durable", "Unique Designs", "Great Service", "Compliment Magnet"]
  },
  {
    id: 6,
    name: "James P.",
    location: "Port Elizabeth",
    rating: 5,
    text: "Outstanding quality and service! The t-shirts fit perfectly and the material is so comfortable. I've bought multiple items and each one has exceeded my expectations. The shipping was fast and the packaging was professional. Highly recommend to anyone looking for premium quality streetwear!",
    avatar: "JP",
    verified: true,
    purchase: "Urban Street Collection",
    date: "2 weeks ago",
    helpful: 19,
    images: ["/images/reviews/michael-1.jpg"],
    tags: ["Perfect Fit", "Comfortable", "Fast Shipping", "Premium Quality"]
  },
  {
    id: 7,
    name: "Rachel W.",
    location: "Bloemfontein",
    rating: 5,
    text: "These t-shirts are absolutely incredible! The designs are so stylish and the quality is unmatched. I love how they feel against my skin - soft, breathable, and perfect for any occasion. The customer service was exceptional and they even helped me with styling tips. Will definitely be a returning customer!",
    avatar: "RW",
    verified: true,
    purchase: "Sport Collection",
    date: "3 days ago",
    helpful: 31,
    images: ["/images/reviews/emma-1.jpg"],
    tags: ["Stylish", "Breathable", "Versatile", "Great Service"]
  },
  {
    id: 8,
    name: "Tom H.",
    location: "Polokwane",
    rating: 5,
    text: "Best purchase I've made this year! The t-shirts are of exceptional quality and the designs are so unique. The fit is perfect and they're incredibly comfortable to wear. The brand really cares about their customers and it shows in every detail. Highly recommend!",
    avatar: "TH",
    verified: true,
    purchase: "Casual Comfort Line",
    date: "6 days ago",
    helpful: 25,
    images: ["/images/reviews/david-1.jpg"],
    tags: ["Exceptional Quality", "Unique Designs", "Comfortable", "Customer Focused"]
  },
  {
    id: 9,
    name: "Sophie B.",
    location: "Nelspruit",
    rating: 5,
    text: "I'm in love with these t-shirts! The quality is outstanding and they've become my go-to pieces for everyday wear. The designs are trendy yet timeless, and the fabric is so soft. The customer service was amazing and shipping was super fast. This brand has a customer for life!",
    avatar: "SB",
    verified: true,
    purchase: "Premium Collection",
    date: "4 days ago",
    helpful: 27,
    images: ["/images/reviews/sarah-1.jpg"],
    tags: ["Go-To Pieces", "Timeless", "Soft Fabric", "Fast Shipping"]
  },
  {
    id: 10,
    name: "Chris R.",
    location: "East London",
    rating: 5,
    text: "Amazing quality and service! The t-shirts are exactly as described and the fit is perfect. I love the attention to detail in both the design and construction. The customer service team was incredibly helpful and responsive. Will definitely be ordering more!",
    avatar: "CR",
    verified: true,
    purchase: "Urban Street Collection",
    date: "1 week ago",
    helpful: 21,
    images: ["/images/reviews/michael-2.jpg"],
    tags: ["Perfect Fit", "Attention to Detail", "Responsive Service", "Quality"]
  },
  {
    id: 11,
    name: "Amy F.",
    location: "Kimberley",
    rating: 5,
    text: "These are the best t-shirts I've ever owned! The quality is exceptional and they've held up beautifully after many washes. The designs are unique and I always get compliments when I wear them. The customer service was top-notch and the whole experience was wonderful!",
    avatar: "AF",
    verified: true,
    purchase: "Sport Collection",
    date: "5 days ago",
    helpful: 33,
    images: ["/images/reviews/emma-2.jpg"],
    tags: ["Best Quality", "Durable", "Unique Designs", "Top Service"]
  },
  {
    id: 12,
    name: "Mark S.",
    location: "Rustenburg",
    rating: 5,
    text: "Fantastic quality and great designs! The t-shirts are comfortable, well-made, and stylish. I've bought several items and each one has been perfect. The customer service is excellent and they really care about their customers. Highly recommend this brand!",
    avatar: "MS",
    verified: true,
    purchase: "Casual Comfort Line",
    date: "2 weeks ago",
    helpful: 17,
    images: ["/images/reviews/david-1.jpg"],
    tags: ["Comfortable", "Well-Made", "Stylish", "Customer Care"]
  }
];

