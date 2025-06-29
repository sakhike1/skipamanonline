import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/home/Hero';
import NewArrivals from '../components/home/NewArrivals';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CustomRequest from '../components/home/CustomRequest';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Customer testimonials data
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      initials: "JD",
      rating: 5,
      text: "The quality of these t-shirts is exceptional. The fabric is soft, the fit is perfect, and the designs are unique. I've received many compliments!"
    },
    {
      id: 2,
      name: "Jane Smith",
      initials: "JS",
      rating: 5,
      text: "I love the minimalist designs on these shirts. They're modern, eye-catching, and unlike anything else in my wardrobe. The shipping was also impressively fast."
    },
    {
      id: 3,
      name: "Robert Johnson",
      initials: "RJ",
      rating: 4,
      text: "Great customer service and the t-shirt quality is top-notch. Would definitely recommend to friends and family looking for unique, high-quality apparel."
    },
    {
      id: 4,
      name: "Sarah Wilson",
      initials: "SW",
      rating: 5,
      text: "These t-shirts are absolutely amazing! The designs are so creative and the material feels premium. I've already ordered my second batch!"
    },
    {
      id: 5,
      name: "Michael Brown",
      initials: "MB",
      rating: 5,
      text: "Fast delivery and excellent quality. The t-shirts fit perfectly and the prints are vibrant. Highly recommend this brand!"
    },
    {
      id: 6,
      name: "Emily Davis",
      initials: "ED",
      rating: 5,
      text: "I'm in love with these designs! They're unique, comfortable, and the customer service is outstanding. Will definitely be a returning customer."
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div>
      <Hero />
      <NewArrivals />
      <FeaturedProducts onProductClick={handleProductClick} />
      <CustomRequest />
      
      {/* Newsletter Section */}
      <div className="bg-white py-16 border-t border-gray-100">
      <div className="bg-white py-16 border-t border-gray-100 border-b">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-gray-900">
      New Arrivals Every Week
    </h2>
    <p className="max-w-2xl mx-auto text-lg mb-8 text-gray-600">
      Subscribe to our newsletter and be the first to know about our latest designs and exclusive offers.
    </p>
    <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        placeholder="Your email address"
        className="flex-1 px-5 py-3 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
      />
      <button className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
        Subscribe
      </button>
    </div>
    <p className="mt-4 text-sm text-gray-500">
      We respect your privacy. Unsubscribe at any time.
    </p>
  </div>
</div>
      </div>
      
      {/* Testimonials */}
      <div className="relative py-16 overflow-hidden">
        {/* Sophisticated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900/40 to-purple-800/20"></div>
        
        {/* Floating purple glassmorphism elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-r from-purple-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-purple-600/5 to-purple-700/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
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
    </div>
  );
};

export default HomePage;