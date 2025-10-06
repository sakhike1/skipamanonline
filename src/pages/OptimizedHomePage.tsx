import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import LazySection from '../components/ui/LazySection';

// Lazy load heavy components
const Hero = lazy(() => import('../components/home/Hero'));
const NewArrivals = lazy(() => import('../components/home/NewArrivals'));
const FeaturedProducts = lazy(() => import('../components/home/OptimizedFeaturedProducts'));

// Loading components
const HeroSkeleton = () => (
  <div className="h-screen bg-gradient-to-br from-gray-900 to-slate-700 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

const SectionSkeleton = () => (
  <div className="py-16">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-gray-200 rounded-lg w-1/3 mx-auto mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

const OptimizedHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      initials: "SJ",
      rating: 5,
      text: "The quality of these t-shirts is incredible! I love how they feel and the designs are so unique. Definitely my new favorite brand."
    },
    {
      name: "Michael Chen",
      initials: "MC",
      rating: 5,
      text: "Fast shipping and amazing customer service. The fit is perfect and the material is so comfortable. Highly recommend!"
    },
    {
      name: "Emma Davis",
      initials: "ED",
      rating: 5,
      text: "I've been looking for stylish, high-quality t-shirts and finally found them here. The attention to detail is outstanding."
    }
  ];

  // Optimized testimonial rotation - only start when testimonials section is visible
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const startTestimonialRotation = () => {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    };

    // Start rotation after a delay to let other components load first
    const timeout = setTimeout(startTestimonialRotation, 3000);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToastMessage('Please enter your email address', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToastMessage('Please enter a valid email address', 'error');
      return;
    }

    setIsSubscribing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      showToastMessage('Successfully subscribed to our newsletter!', 'success');
      setEmail('');
    } catch (error) {
      showToastMessage('Failed to subscribe. Please try again.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div>
      {/* Hero Section - Load immediately */}
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      {/* New Arrivals - Lazy load */}
      <LazySection delay={200}>
        <Suspense fallback={<SectionSkeleton />}>
          <NewArrivals />
        </Suspense>
      </LazySection>

      {/* Featured Products - Lazy load */}
      <LazySection delay={400}>
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedProducts onProductClick={handleProductClick} />
        </Suspense>
      </LazySection>
      
      {/* Newsletter Section - Lazy load */}
      <LazySection delay={600}>
        <div className="bg-white py-16 border-t border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-5 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              New Arrivals Every Week
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-lg mb-8 text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Subscribe to our newsletter and be the first to know about our latest designs and exclusive offers.
            </motion.p>
            
            <motion.form 
              onSubmit={handleSubscribe}
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-10 pr-5 py-3 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                    disabled={isSubscribing}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            </motion.form>
            
            <motion.p 
              className="mt-4 text-sm text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              We respect your privacy. Unsubscribe at any time.
            </motion.p>
          </div>
        </div>
      </LazySection>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
              toastType === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {toastType === 'success' ? (
                <CheckCircle size={20} className="flex-shrink-0" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Testimonials - Lazy load with delay */}
      <LazySection delay={800}>
        <div className="relative py-16 overflow-hidden">
          {/* Simplified background - removed heavy animations */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              What Our Customers Say
            </h2>
            
            {/* Testimonials Slider */}
            <div className="relative max-w-4xl mx-auto">
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-lg border border-purple-400/30 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-lg border border-purple-400/30 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Testimonial Content */}
              <div className="relative h-64 md:h-48 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-lg border border-purple-400/30 p-8 rounded-2xl max-w-2xl mx-auto text-center">
                      <div className="flex items-center justify-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-800/30 flex items-center justify-center mr-4 border border-purple-400/30">
                          <span className="text-white font-bold text-lg">{testimonials[currentSlide].initials}</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-white text-lg">{testimonials[currentSlide].name}</h3>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < testimonials[currentSlide].rating ? 'text-yellow-400' : 'text-gray-500'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-white/90 text-lg leading-relaxed italic">
                        "{testimonials[currentSlide].text}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-purple-400 scale-125'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 max-w-md mx-auto">
                <div className="w-full bg-white/20 rounded-full h-1">
                  <motion.div
                    className="bg-purple-400 h-1 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentSlide + 1) / testimonials.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LazySection>
    </div>
  );
};

export default OptimizedHomePage;
