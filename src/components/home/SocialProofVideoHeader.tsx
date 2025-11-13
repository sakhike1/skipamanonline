import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';

/**
 * Enhanced Video header section for SocialProof component
 * Displays video background with testimonial content - Improved version
 */
export const SocialProofVideoHeader: React.FC = () => {
  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl mb-16 -mx-4 md:-mx-8 lg:-mx-16 xl:-mx-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <div className="relative w-full h-[65vh] min-h-[550px] rounded-3xl overflow-hidden shadow-2xl">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/background1.jpg"
        >
          <source src="/images/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-purple-900/70 to-black/90 rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl"></div>
        
        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-6 py-12">
          <div className="text-center max-w-5xl w-full">
            {/* Main Title - Enhanced Typography */}
            <motion.h2 
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.span 
                className="block text-white drop-shadow-2xl mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                viewport={{ once: true }}
              >
                WHAT OUR
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                CUSTOMERS SAY
              </motion.span>
            </motion.h2>
            
            {/* Subtitle - Enhanced */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 font-light drop-shadow-lg max-w-3xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Join thousands of satisfied customers who trust us for premium quality and exceptional service
            </motion.p>

            {/* Featured Testimonial Card - Enhanced Design */}
            <motion.div
              className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 md:p-10 border-2 border-white/30 shadow-2xl max-w-3xl mx-auto hover:bg-white/20 hover:border-white/40 transition-all duration-500"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Quote Icon - Enhanced */}
              <motion.div
                className="text-7xl md:text-8xl text-yellow-400 font-serif mb-6 flex justify-center"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.85, 1, 0.85]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                "
              </motion.div>
              
              {/* Testimonial Text - Enhanced */}
              <blockquote className="text-xl md:text-2xl lg:text-3xl text-white font-semibold leading-relaxed mb-8 px-4">
                "Fast shipping and amazing customer service. The fit is perfect and the material is so comfortable. Highly recommend!"
              </blockquote>
              
              {/* Customer Info - Enhanced */}
              <div className="flex items-center justify-center gap-5 mt-8">
                {/* Avatar - Enhanced */}
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-xl ring-4 ring-white/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  MC
                </motion.div>
                
                {/* Customer Details - Enhanced */}
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-bold text-lg md:text-xl">Michael C.</h4>
                    <CheckCircle className="w-5 h-5 text-green-400" fill="currentColor" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-300 text-sm md:text-base">Verified Customer</span>
                    <span className="text-white/50">•</span>
                    <span className="text-gray-300 text-sm md:text-base">Los Angeles</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-yellow-400 text-sm font-bold ml-2">Trusted Review</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Closing Message - Enhanced */}
            <motion.div
              className="mt-10 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.h3 
                className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 drop-shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Join Our Happy Customers
              </motion.h3>
              <p className="text-gray-200 text-lg md:text-xl font-light max-w-2xl mx-auto">
                Experience the quality and service that thousands of customers trust
              </p>
            </motion.div>
          </div>
        </div>

        {/* Floating Star Icons - Enhanced */}
        {[
          { pos: 'top-8 left-8', delay: 0, size: 'w-6 h-6' },
          { pos: 'top-12 right-12', delay: 1, size: 'w-5 h-5' },
          { pos: 'bottom-12 left-12', delay: 2, size: 'w-7 h-7' },
          { pos: 'bottom-8 right-8', delay: 0.5, size: 'w-5 h-5' }
        ].map((star, i) => (
          <motion.div
            key={i}
            className={`absolute ${star.pos} text-yellow-400/25`}
            animate={{ 
              y: [0, i % 2 === 0 ? -20 : 15, 0],
              rotate: [0, i % 2 === 0 ? 15 : -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay
            }}
          >
            <svg className={star.size} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </motion.div>
        ))}
        
        {/* Subtle Particle Effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              top: `${10 + i * 12}%`,
              left: `${5 + (i * 13)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
