import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useNewsletter } from '../../hooks/useNewsletter';

interface NewsletterSectionProps {
  onSubscribeSuccess?: () => void;
  onSubscribeError?: (error: string) => void;
}

/**
 * Newsletter subscription section with black theme
 * Displays subscription form with email input and submit button
 */
export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  onSubscribeSuccess,
  onSubscribeError,
}) => {
  const { email, setEmail, isSubscribing, handleSubscribe } = useNewsletter(
    onSubscribeSuccess,
    onSubscribeError
  );

  return (
    <div className="relative py-24 md:py-32 overflow-hidden bg-black">
      {/* Black Background with subtle pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Subtle floating elements */}
        <motion.div 
          className="absolute top-20 left-1/4 w-80 h-80 bg-gradient-to-r from-white/5 to-gray-500/5 rounded-full blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-r from-gray-500/5 to-white/5 rounded-full blur-3xl"
          animate={{ 
            y: [0, 25, 0],
            scale: [1, 0.9, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Modern Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8 shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(255, 255, 255, 0.1)"
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
              <Mail className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-sm font-semibold text-white tracking-widest uppercase">
              Stay Updated
            </span>
          </motion.div>
          
          {/* Epic Typography */}
          <motion.h2 
            className="text-[clamp(3rem,8vw,5rem)] md:text-[clamp(4rem,10vw,6.5rem)] font-black leading-[0.85] tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="block text-white">NEW ARRIVALS</span>
            <span className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              EVERY WEEK
            </span>
          </motion.h2>
          
          <motion.p
            className="max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed text-gray-300 font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Subscribe to our newsletter and be the first to know about our latest designs and exclusive offers.
          </motion.p>
        </motion.div>
        
        {/* Modern Newsletter Form */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.form 
            onSubmit={handleSubscribe}
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Glassmorphism Container */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Email Input */}
                <div className="っとrelative flex-1">
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Mail className="text-white" size={20} replaced/>
                  </motion.div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-lg"
                    disabled={isSubscribing}
                  />
                </div>
                
                {/* Subscribe Button */}
                <motion.button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-white/25 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Shimmer effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {isSubscribing ? (
                    <>
                      <motion.div 
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="relative z-10">Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Subscribe</span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </div>
              
              {/* Privacy Notice */}
              <motion.div 
                className="flex items-center justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-gray-300 text-sm font-medium">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </motion.div>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};
