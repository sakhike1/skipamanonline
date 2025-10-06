import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, Award, Shield, Truck, Heart, Quote, CheckCircle } from 'lucide-react';

interface SocialProofProps {
  className?: string;
}

const SocialProof: React.FC<SocialProofProps> = ({ className = '' }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Enhanced testimonials with more details
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      location: "Cape Town",
      rating: 5,
      text: "Absolutely love my new t-shirts! The quality is incredible and the designs are so unique. The Premium Cotton Tee feels like a dream to wear - soft, breathable, and perfectly fitted. I love how the unique designs make me stand out while still being comfortable for everyday wear. The ordering process was seamless and delivery was super fast. I've already ordered 3 more in different colors! This brand has definitely become my new favorite.",
      avatar: "SM",
      verified: true,
      purchase: "Premium Cotton Tee",
      date: "2 days ago",
      helpful: 31,
      images: ["/images/reviews/sarah-1.jpg"],
      tags: ["Unique Designs", "Comfortable", "Fast Delivery", "Great Quality"]
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
    }
  ];

  // Social proof stats
  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "99%", label: "Satisfaction Rate", icon: Heart },
    { number: "24/7", label: "Customer Support", icon: Shield }
  ];

  // Trust indicators
  const trustFeatures = [
    { 
      icon: Shield, 
      text: "Secure Payments", 
      color: "text-purple-500",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200/50"
    },
    { 
      icon: Truck, 
      text: "Free Shipping", 
      color: "text-pink-500",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200/50"
    },
    { 
      icon: Award, 
      text: "Premium Quality", 
      color: "text-purple-600",
      gradient: "from-purple-600 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50",
      borderColor: "border-purple-200/50"
    },
    { 
      icon: CheckCircle, 
      text: "Easy Returns", 
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200/50"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000); // Increased from 5000ms to 8000ms (8 seconds)
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className={`relative py-24 md:py-32 overflow-hidden ${className}`}>
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-white to-pink-50/30"></div>
        
        {/* Secondary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/20 via-transparent to-purple-50/20"></div>
        
        {/* Enhanced pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-200/15 to-purple-200/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-purple-200/25 to-blue-200/25 rounded-full blur-lg"></div>
        
        {/* Subtle mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Trust Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm border-2 border-purple-200/60 rounded-full mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)"
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="w-5 h-5 text-purple-500" />
            </motion.div>
            <span className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
              Trusted by Thousands
            </span>
          </motion.div>
          
          {/* Main Title */}
          <motion.h2 
            className="text-[clamp(2.5rem,6vw,4rem)] md:text-[clamp(3.5rem,8vw,5rem)] font-black leading-[0.85] tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="block text-gray-800 drop-shadow-sm">LOVED BY</span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
              CUSTOMERS
            </span>
          </motion.h2>
          
          <motion.p 
            className="max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed text-gray-700 font-light drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Join thousands of satisfied customers who trust us for premium quality and exceptional service.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm">
                <stat.icon className="w-8 h-8 text-white drop-shadow-sm" />
              </div>
              <motion.div
                className="text-3xl md:text-4xl font-black text-gray-900 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1, type: "spring" }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          className="max-w-8xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            {/* Enhanced Testimonial Card */}
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl p-12 md:p-20 lg:p-28 shadow-2xl shadow-black/50 border-2 border-gray-700/50 relative overflow-hidden hover:shadow-3xl hover:shadow-purple-500/20 hover:border-gray-600/70 transition-all duration-500 group">
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none"></div>
              
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-tr-3xl pointer-events-none"></div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-6 right-6 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-40"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-8 right-12 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-50"
                animate={{
                  y: [0, 8, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {/* Quote Icon */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Quote className="w-12 h-12 text-purple-500/50 mx-auto" />
                  </motion.div>
                  
                  {/* Enhanced Testimonial Text */}
                  <motion.div
                    className="relative mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Decorative Line */}
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-6"></div>
                    
                    <motion.blockquote
                      className="text-xl md:text-2xl text-white leading-relaxed font-medium relative px-12 bg-gradient-to-br from-gray-800/90 via-black/80 to-gray-900/90 backdrop-blur-sm rounded-3xl py-10 border-2 border-gray-600/40 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:border-gray-500/60"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <motion.span 
                        className="text-7xl text-purple-400 font-serif absolute -top-6 -left-6 leading-none drop-shadow-lg"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        "
                      </motion.span>
                      <span className="relative z-10 block leading-relaxed text-white/95">{testimonials[currentTestimonial].text}</span>
                      <motion.span 
                        className="text-7xl text-purple-400 font-serif absolute -bottom-8 -right-6 leading-none drop-shadow-lg"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.5
                        }}
                      >
                        "
                      </motion.span>
                    </motion.blockquote>
                    
                    {/* Review Tags */}
                    {testimonials[currentTestimonial].tags && (
                      <motion.div 
                        className="flex flex-wrap justify-center gap-4 mt-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {testimonials[currentTestimonial].tags.map((tag, index) => (
                          <motion.span
                            key={tag}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white text-sm font-bold rounded-full border-2 border-purple-300/50 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 300 }}
                            whileHover={{ scale: 1.15, y: -3, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                            />
                            <span className="relative z-10">{tag}</span>
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                    
                    {/* Bottom Decorative Line */}
                    <div className="w-12 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-6"></div>
                  </motion.div>
                  
                  {/* Enhanced Customer Info */}
                  <motion.div
                    className="flex flex-col items-center space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Enhanced Avatar with Shimmer */}
                    <motion.div 
                      className="relative w-20 h-20 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                        animate={{
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <span className="relative z-10">{testimonials[currentTestimonial].avatar}</span>
                    </motion.div>
                    
                    {/* Enhanced Details Card */}
                    <motion.div 
                      className="text-center bg-gradient-to-br from-gray-800/95 via-black/90 to-gray-900/95 backdrop-blur-sm rounded-3xl p-12 md:p-14 lg:p-16 border-2 border-gray-600/60 shadow-xl hover:shadow-2xl hover:border-gray-500/80 transition-all duration-500 max-w-xl mx-auto relative overflow-hidden group"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      {/* Floating background elements */}
                      <motion.div
                        className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
                        animate={{
                          y: [0, -10, 0],
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div
                        className="absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-40"
                        animate={{
                          y: [0, 8, 0],
                          scale: [1, 0.8, 1],
                          opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                      />
                      {/* Name with Verification */}
                      <div className="flex items-center justify-center gap-4 mb-8">
                        <motion.p 
                          className="text-white font-bold text-4xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {testimonials[currentTestimonial].name}
                        </motion.p>
                        {testimonials[currentTestimonial].verified && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7, type: "spring" }}
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            className="relative"
                          >
                            <CheckCircle className="w-10 h-10 text-purple-500 drop-shadow-lg" />
                            <motion.div
                              className="absolute inset-0 bg-purple-500 rounded-full opacity-20"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.2, 0, 0.2]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Location with Icon */}
                      <motion.div 
                        className="flex items-center justify-center gap-4 mb-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <motion.div 
                          className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <p className="text-purple-300 text-xl font-bold uppercase tracking-wider bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                          {testimonials[currentTestimonial].location}
                        </p>
                      </motion.div>
                      
                      {/* Purchase Info */}
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <motion.div 
                          className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 px-10 py-5 rounded-full border-2 border-purple-300/50 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                          />
                          <p className="text-white text-lg font-bold relative z-10">
                            Purchased: {testimonials[currentTestimonial].purchase}
                          </p>
                        </motion.div>
                        <div className="flex items-center justify-center gap-6">
                          <motion.div 
                            className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <p className="text-gray-300 text-lg font-semibold">
                            {testimonials[currentTestimonial].date}
                          </p>
                          <motion.div 
                            className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          />
                        </div>
                      </motion.div>
                      
                      {/* Trust Badge */}
                      <motion.div 
                        className="mt-3 flex items-center justify-center gap-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 }}
                      >
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-400 ml-2 font-medium">Verified Purchase</span>
                      </motion.div>
                      
                      {/* Helpful Votes */}
                      {testimonials[currentTestimonial].helpful && (
                        <motion.div 
                          className="mt-8 flex items-center justify-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                        >
                          <motion.div 
                            className="flex items-center gap-4 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 px-8 py-4 rounded-full border-2 border-red-300/50 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                            whileHover={{ scale: 1.05, y: -2 }}
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                            />
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ 
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Heart className="w-6 h-6 text-white fill-current relative z-10" />
                            </motion.div>
                            <span className="text-lg text-white font-bold relative z-10">
                              {testimonials[currentTestimonial].helpful} found this helpful
                            </span>
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                  
                  {/* Rating Stars */}
                  <motion.div 
                    className="flex justify-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.5, type: "spring" }}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </motion.svg>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Dots */}
                  <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-purple-500 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Features */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.text}
              className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl shadow-2xl shadow-black/50 border-2 border-gray-700/50 hover:border-gray-600/70 transition-all duration-500 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.08, y: -8 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />
              
              {/* Floating background elements */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
                animate={{
                  y: [0, -5, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
              />
              
              <motion.div 
                className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl relative overflow-hidden`}
                whileHover={{ 
                  scale: 1.15,
                  rotate: 10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Icon shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
                <feature.icon className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
              </motion.div>
              
              <motion.p 
                className="font-bold text-white text-base relative z-10"
                whileHover={{ 
                  color: "#a855f7",
                  scale: 1.05
                }}
                transition={{ duration: 0.2 }}
              >
                {feature.text}
              </motion.p>
              
              {/* Subtle glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}20, ${feature.gradient.split(' ')[3]}20)`
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
