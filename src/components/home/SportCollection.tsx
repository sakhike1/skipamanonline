import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Zap, Shield, Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';

const SportCollection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get hoody products for the slider
  const hoodyProducts = products.filter(product => product.category === 'hoodies');

  const features = [
    { icon: Shield, text: "Premium Quality", description: "High-quality hoodie materials" },
    { icon: Zap, text: "Urban Style", description: "Modern hoodie designs" },
    { icon: Heart, text: "Casual Comfort", description: "Perfect hoodies for everyday wear" }
  ];

  const stats = [
    { number: hoodyProducts.length.toString(), label: "Hoodies", suffix: "" },
    { number: "95", label: "Since", suffix: "" },
    { number: "25K", label: "Hoodies", suffix: " Sold" }
  ];
  
  // Create slider items for each image of each hoody product
  const sportImages = hoodyProducts.flatMap(product => 
    product.images.map((image, index) => ({
      src: image,
      title: product.name,
      description: product.description,
      price: product.price,
      id: product.id,
      imageIndex: index,
      totalImages: product.images.length
    }))
  );

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sportImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sportImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sportImages.length);
    setIsAutoPlaying(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + sportImages.length) % sportImages.length);
    setIsAutoPlaying(false);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white/5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-white text-black rounded-full border-2 border-black"
            >
              <div className="w-2 h-2 bg-black rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-bold text-black tracking-wide">NEW</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <h2 className="text-6xl lg:text-8xl font-black tracking-tight leading-none">
                  <span className="text-white drop-shadow-2xl">
                    HOODIE
                  </span>
                  <br />
                  <span className="text-white drop-shadow-2xl">
                    COLLECTION
                  </span>
                </h2>
                
                {/* Decorative Line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="h-1 bg-gradient-to-r from-white via-gray-300 to-transparent rounded-full"
                ></motion.div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
                  Our hoodie collection was originally designed for men's streetwear. Starting in 1995, we expanded to include women's hoodies in all styles: from the most urban and edgy designs to casual everyday comfort.
                </p>
                
                {/* Highlighted Text */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center px-6 py-3 bg-white text-black rounded-full border-2 border-black"
                >
                  <div className="w-2 h-2 bg-black rounded-full mr-3 animate-pulse"></div>
                    <span className="text-black font-bold tracking-wide">HOODIE COLLECTION</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="relative p-6 bg-white rounded-2xl border-2 border-black hover:bg-gray-100 hover:border-gray-800 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <feature.icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-bold text-black text-lg">{feature.text}</h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="relative p-4 bg-white rounded-xl border-2 border-black group-hover:bg-gray-100 transition-all duration-300">
                    <div className="text-3xl lg:text-4xl font-black text-black mb-1">
                      {stat.number}<span className="text-gray-700">{stat.suffix}</span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium tracking-wide">{stat.label}</div>
                    
                    {/* Decorative Element */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 pt-8"
            >
              <Link to="/shop">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 transition-all duration-300 group relative overflow-hidden border border-gray-400"
                  >
                    <ShoppingBag size={20} className="mr-3 relative z-10" />
                    <span className="relative z-10 font-bold">Shop Hoodies</span>
                    <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/lookbook">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border border-gray-400 text-black hover:bg-gray-100 transition-all duration-300 group relative overflow-hidden bg-white"
                  >
                    <span className="relative z-10 font-bold">View Hoodie Styles</span>
                    <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Image Slider Container */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur-3xl scale-110"></div>
              
              {/* Slider Container */}
              <motion.div
                initial={{ scale: 0.9, rotateY: 15 }}
                whileInView={{ scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-2xl p-8 border-2 border-black overflow-hidden"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {/* Image Slider */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => window.location.href = `/product/${sportImages[currentImageIndex].id}`}
                    >
                      <img
                        src={sportImages[currentImageIndex].src}
                        alt={sportImages[currentImageIndex].title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-6 left-6 right-6 z-10">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {sportImages[currentImageIndex].title}
                          </h3>
                          {sportImages[currentImageIndex].totalImages > 1 && (
                            <div className="text-xs text-gray-300 mb-2">
                              View {sportImages[currentImageIndex].imageIndex + 1} of {sportImages[currentImageIndex].totalImages}
                            </div>
                          )}
                          <p className="text-gray-200 text-sm mb-3 line-clamp-2">
                            {sportImages[currentImageIndex].description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-white">
                              R{(sportImages[currentImageIndex].price / 100).toFixed(2)}
                            </span>
                            <Link to={`/product/${sportImages[currentImageIndex].id}`}>
                              <button className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-100 transition-colors border-2 border-white">
                                View Product
                              </button>
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-20"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-20"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                    {sportImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center z-10"
                >
                  <Shield size={20} className="text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-4 left-4 w-10 h-10 bg-black rounded-full flex items-center justify-center z-10"
                >
                  <Heart size={16} className="text-white" />
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full border-2 border-black flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-black rounded-full border-2 border-white"
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </section>
  );
};

export default SportCollection;
