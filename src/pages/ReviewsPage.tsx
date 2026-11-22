import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHeader } from '../context/HeaderContext';
import { 
  Star, 
  CheckCircle, 
  TrendingUp, 
  Award, 
  Users, 
  ThumbsUp,
  Shield,
  Sparkles,
  Heart,
  ArrowRight
} from 'lucide-react';
import { testimonials } from '../data/testimonials';
import { useNavigate } from 'react-router-dom';

const ReviewsPage: React.FC = () => {
  const { setIsHeaderDark } = useHeader();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Set header to dark when component mounts
  React.useEffect(() => {
    setIsHeaderDark(true);
    return () => {
      setIsHeaderDark(false);
    };
  }, [setIsHeaderDark]);

  // Display all testimonials
  const displayedTestimonials = testimonials;

  // Calculate stats
  const stats = useMemo(() => {
    const totalReviews = testimonials.length;
    const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews;
    const fiveStarCount = testimonials.filter(t => t.rating === 5).length;
    const verifiedCount = testimonials.filter(t => t.verified).length;
    
    return {
      totalReviews,
      averageRating: averageRating.toFixed(1),
      fiveStarCount,
      verifiedCount,
      fiveStarPercentage: ((fiveStarCount / totalReviews) * 100).toFixed(0)
    };
  }, []);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    testimonials.forEach(t => {
      distribution[t.rating] = (distribution[t.rating] || 0) + 1;
    });
    return distribution;
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background - Black & White Theme */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover grayscale"
            style={{ filter: 'grayscale(100%) contrast(1.1)' }}
            poster="/images/background1.jpg"
          >
            <source src="/images/background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Dark Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>
          
          {/* Subtle animated overlay for breathing effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Animated vignette effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
            }}
            animate={{
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-center py-32 md:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6 md:mb-8 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </motion.div>
                <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Customer Reviews</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tight"
              >
                <motion.span
                  className="block mb-2"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.3)",
                      "0 0 40px rgba(255,255,255,0.5)",
                      "0 0 20px rgba(255,255,255,0.3)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  What Our
                </motion.span>
                <motion.span
                  className="block"
                  animate={{
                    textShadow: [
                      "0 0 30px rgba(255,255,255,0.4)",
                      "0 0 50px rgba(255,255,255,0.6)",
                      "0 0 30px rgba(255,255,255,0.4)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  Customers Say
                </motion.span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed font-light"
              >
                Join thousands of satisfied customers who trust us for premium quality and exceptional service
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto"
              >
                {[
                  { icon: Star, label: 'Average Rating', value: stats.averageRating, delay: 0.9 },
                  { icon: Users, label: 'Total Reviews', value: `${stats.totalReviews}+`, delay: 1.0 },
                  { icon: TrendingUp, label: '5-Star Reviews', value: `${stats.fiveStarPercentage}%`, delay: 1.1 },
                  { icon: Shield, label: 'Verified', value: `${stats.verifiedCount}+`, delay: 1.2 }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: stat.delay, type: "spring", stiffness: 150 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 shadow-lg"
                  >
                    <motion.div
                      className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 border-2 border-white/30 backdrop-blur-sm"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                    </motion.div>
                    <motion.div
                      className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-1 md:mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: stat.delay + 0.2, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-[10px] md:text-xs lg:text-sm text-white/70 font-semibold uppercase tracking-wider px-1 md:px-2">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* Floating Elements for Visual Interest - Outside content for full screen coverage */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
              style={{
                left: `${15 + (i * 12)}%`,
                top: `${20 + (i % 4) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.8, 1],
                x: [0, Math.sin(i) * 10, 0]
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{
            y: [0, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{
                y: [0, 12, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {displayedTestimonials.length} Review{displayedTestimonials.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {/* Rating Distribution */}
          <div className="hidden md:flex items-center gap-4">
            {[5, 4, 3].map(rating => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{testimonial.rating}.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {testimonial.verified && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-semibold text-green-700">Verified</span>
                        </div>
                      )}
                      <span className="text-xs font-semibold text-gray-500">{testimonial.date}</span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <blockquote className="mb-6">
                    <p className="text-gray-700 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                      "{testimonial.text}"
                    </p>
                  </blockquote>

                  {/* Purchase Badge */}
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                      <Sparkles className="w-3 h-3" />
                      {testimonial.purchase}
                    </span>
                  </div>

                  {/* Tags */}
                  {testimonial.tags && testimonial.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {testimonial.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                    </div>
                    {testimonial.helpful && (
                      <button className="flex items-center gap-1 px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                        <ThumbsUp className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                        <span className="text-sm font-semibold text-gray-700">{testimonial.helpful}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}
              ></div>
            </div>
            <div className="relative z-10">
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl md:text-4xl font-black mb-4">
                Ready to Share Your Experience?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join our community of satisfied customers and share your story!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ReviewsPage;
