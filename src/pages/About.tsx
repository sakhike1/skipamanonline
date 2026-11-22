import { ArrowRight, Shirt, MapPin, Users, Leaf, Camera, Star, ChevronDown, Sparkles, TrendingUp, Award, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

export default function TshirtStoreAboutUsV2() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToAboutContent = useCallback(() => {
    document.getElementById('about-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full px-4 sm:px-6 lg:px-8 pt-24 pb-24 min-h-screen bg-white relative overflow-hidden"
    >
      {/* Clean minimal background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white opacity-40"></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Hero Banner with enhanced effects */}
      <motion.div 
          initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full h-[400px] sm:h-[500px] md:h-[700px] overflow-hidden rounded-2xl sm:rounded-3xl mb-12 sm:mb-16 md:mb-24 relative group shadow-lg hover:shadow-2xl hover:shadow-gray-400/25 transition-shadow duration-500"
      >
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          src="/images/6.jpg"
          alt="Fashion design workshop" 
            className="w-full h-full object-cover object-center filter grayscale group-hover:filter-none transition-all duration-1000 ease-out"
          />
          
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
            <div className="p-4 sm:p-6 md:p-8 lg:p-16 text-white max-w-4xl w-full">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {/* Badge tag */}
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-black text-white border border-slate-200/70 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 md:mb-8 shadow-md hover:shadow-lg hover:shadow-gray-400/20 transition-shadow duration-300"
                >
                  <Sparkles className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Est. 2019
                </motion.span>
                
                <motion.h1 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black leading-tight mb-4 sm:mb-6 md:mb-8 text-white"
                >
                  Our <span className="text-white">Story</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed"
                >
                Crafting premium streetwear with purpose, passion, and sustainability at our core.
                </motion.p>
            </motion.div>
          </div>
        </div>
          
          {/* Animated scroll indicator */}
        <motion.button
            type="button"
            onClick={scrollToAboutContent}
            aria-label="Scroll to about section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 cursor-pointer text-white hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" aria-hidden />
            </motion.div>
          </motion.button>
        </motion.div>
        
        {/* About Us Header with enhanced styling */}
        <motion.div id="about-content" className="flex flex-col items-center text-center mb-24 max-w-5xl mx-auto scroll-mt-28"> 
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center bg-black text-white border border-slate-200/70 rounded-full px-6 py-2 mb-8 shadow-md hover:shadow-lg hover:shadow-gray-400/20 transition-shadow duration-300"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm font-bold uppercase tracking-wider">About Us</span>
      </motion.div>
      
            <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black leading-tight mb-4 sm:mb-6 md:mb-8"
        >
            Innovative fashion for a <br className="hidden sm:block" />
              <span className="text-black">digital age</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4"
            >
            We're a Munich-based t-shirt brand creating comfortable, stylish designs that express 
            your personality while maintaining the highest quality and ethical standards.
            </motion.p>
        </motion.div>
      </motion.div>
      
        {/* Main Content Section with enhanced grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-20 mb-16 sm:mb-24 md:mb-32 max-w-7xl mx-auto px-4 sm:px-6"> 
        {/* Brand Description */}
        <motion.div 
            initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          className="lg:col-span-2"
        >
            <div className="prose prose-lg max-w-none mb-12 prose-p:text-gray-600 prose-headings:text-black">
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="leading-relaxed text-lg text-gray-700"
              > 
              In a world of fast fashion, we take the slow, sustainable approach. Each design is carefully 
              crafted to balance artistic expression with everyday wearability, giving you pieces that 
              stand out while integrating seamlessly into your wardrobe.
              </motion.p>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="leading-relaxed text-lg text-gray-700"
              >
              Our fabrics are selected for their quality, comfort, and environmental impact. We partner 
              with suppliers who share our commitment to ethical manufacturing and fair labor practices.
              </motion.p>
          </div>
          
          <MotionLink
              to="/shop"
              whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
              className="relative z-20 inline-flex cursor-pointer items-center gap-3 rounded-xl bg-black px-10 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-400/25 group"
          >
            Shop Collection 
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
          </MotionLink>
        </motion.div>
        
          {/* Stats/Highlights with enhanced glassmorphism */}
        <motion.div 
            initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6 h-fit"
          >
            {[
              { icon: <Shirt className="h-7 w-7 text-black" />, value: "50+", label: "Unique Designs" },
              { icon: <Leaf className="h-7 w-7 text-black" />, value: "100%", label: "Organic Cotton" },
              { icon: <MapPin className="h-7 w-7 text-black" />, value: "10+", label: "Countries Served" },
              { icon: <Users className="h-7 w-7 text-black" />, value: "5K+", label: "Happy Customers" }
          ].map((item, index) => (
            <motion.div 
              key={index} 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="bg-white border border-slate-200/70 p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:border-slate-400 hover:shadow-xl hover:shadow-gray-400/25 transition-all duration-500 flex flex-col items-center text-center group shadow-md"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-black p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                  style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 2px, transparent 2px)`,
                    backgroundSize: '14px 14px'
                  }}
                >
                <div className="text-white relative z-10">{item.icon}</div>
                </motion.div>
                                 <p className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-1 sm:mb-2">{item.value}</p>
                 <p className="text-xs sm:text-sm text-gray-600 font-semibold">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
        {/* Featured Images Grid with enhanced effects */}
        <div className="mb-32 w-full">
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-8 h-[400px] md:h-[600px] overflow-hidden rounded-3xl group shadow-md hover:shadow-xl hover:shadow-gray-400/25 transition-shadow duration-500"
            >
              <motion.img 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.8 }}
              src="/images/7.jpg"
              alt="Fashion design team collaboration" 
                className="w-full h-full object-cover object-center filter grayscale group-hover:filter-none transition-all duration-700 ease-out"
              />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-4 h-[400px] md:h-[600px] overflow-hidden rounded-3xl group shadow-md hover:shadow-xl hover:shadow-gray-400/25 transition-shadow duration-500"
            >
              <motion.img 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.8 }}
              src="/images/8.jpg" 
              alt="T-shirt screen printing process" 
                className="w-full h-full object-cover object-center filter grayscale group-hover:filter-none transition-all duration-700 ease-out"
            />
            </motion.div>
        </motion.div>
      </div>
      
        {/* Our Journey Section with enhanced glassmorphism */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-32 bg-white border border-slate-200/70 p-12 md:p-20 rounded-3xl max-w-7xl mx-auto shadow-xl hover:shadow-2xl hover:shadow-gray-400/15 transition-shadow duration-500"
        > 
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-4 mb-16"
          >
            <div className="bg-black text-white p-4 rounded-full shadow-md hover:shadow-lg hover:shadow-gray-400/20 transition-shadow duration-300">
              <Camera className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black">Our Journey</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-6 text-lg text-gray-700 leading-relaxed"
            > 
            <p>
              Founded in 2019, our journey began with a simple idea: create t-shirts that people would love 
              to wear every day, made with sustainable materials and ethical practices.
            </p>
            <p>
              What started as a small operation in a Munich apartment has grown into a beloved brand with 
              customers across Europe who share our passion for quality, style, and sustainability.
            </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6 text-lg text-gray-700 leading-relaxed"
            > 
            <p>
              Each of our designs is created in-house by our talented team of artists who draw inspiration 
              from urban culture, nature, and contemporary art movements.
            </p>
            <p>
              We believe that fashion should be both personal and responsible – that's why we use organic cotton 
              and ensure fair labor practices throughout our supply chain.
            </p>
            </motion.div>
        </div>
        
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20"
          >
            {[
              { year: 2019, text: "Founded in Munich with just 5 designs and a dream." },
              { year: 2021, text: "Expanded to 10 team members and 30+ retail partners." },
              { year: 2023, text: "Launched our sustainability initiative and online store." }
            ].map((item) => (
              <motion.div 
                key={item.year} 
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white border border-slate-200/70 p-8 rounded-2xl hover:border-slate-400 hover:shadow-lg hover:shadow-gray-400/20 transition-all duration-500 shadow-sm"
              >
                <p className="text-5xl font-black text-black mb-4">{item.year}</p>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
      </motion.div>
      
        {/* Designer Spotlight with enhanced layout */}
      <motion.div 
          initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-32 flex flex-col md:flex-row gap-16 items-center max-w-7xl mx-auto"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:w-1/2 h-[500px] md:h-[650px] overflow-hidden rounded-3xl group border border-slate-200/70 shadow-md hover:shadow-xl hover:shadow-gray-400/25 transition-shadow duration-500"
          >
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8 }}
            src="/images/6.jpg" 
            alt="Our lead designer at work" 
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
            />
          </motion.div>
          
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="md:w-1/2 flex flex-col justify-center"
          >
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-block px-6 py-2 bg-black text-white border border-slate-200/70 rounded-full text-sm font-bold mb-8 self-start shadow-md hover:shadow-lg hover:shadow-gray-400/20 transition-shadow duration-300"
            >
              <Heart className="inline w-4 h-4 mr-2" />
            The Team
            </motion.span>
            
            <h3 className="text-4xl md:text-5xl font-black mb-8 text-black">Meet Our Design Team</h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-10">
            Our talented designers bring diverse backgrounds in fashion, graphic design, and fine arts. 
            They collaborate to create collections that blend contemporary trends with timeless appeal.
          </p>
            
            {/* Enhanced award section */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-8 bg-white border border-slate-200/70 rounded-3xl hover:border-slate-400 hover:shadow-lg hover:shadow-gray-400/20 transition-all duration-500 shadow-md"
            >
              <div className="flex items-center gap-1 text-black mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: i * 0.1, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Star className="h-6 w-6 fill-black text-black" />
                  </motion.div>
                ))}
            </div>
              <p className="text-black font-bold text-lg leading-relaxed">
              Recognized among top 10 indie fashion labels in 2022 by Fashion Forward Magazine
            </p>
            </motion.div>
          </motion.div>
      </motion.div>
      
        {/* Mission Section with enhanced styling */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="border-t border-slate-200/70 pt-20 w-full"
        >
          <div className="text-center mb-16">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-block px-6 py-2 bg-black text-white border border-slate-200/70 rounded-full text-sm font-bold mb-6 shadow-md hover:shadow-lg hover:shadow-gray-400/20 transition-shadow duration-300"
            >
              <Award className="inline w-4 h-4 mr-2" />
            Our Purpose
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black text-black">Our Mission</h2>
        </div>
        
          {/* Enhanced final card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -10 }}
            className="bg-white border border-slate-200/70 p-12 md:p-20 rounded-3xl shadow-md hover:shadow-xl hover:shadow-gray-400/20 relative overflow-hidden max-w-7xl mx-auto transition-all duration-500 hover:border-slate-400"
          > 
          <div className="relative z-10">
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl italic font-light mb-12 leading-relaxed max-w-5xl mx-auto text-center text-black"
              > 
              "To redefine streetwear by combining innovative design with sustainable practices, 
              creating clothing that looks good and does good."
              </motion.p>
              
              <div className="max-w-4xl mx-auto text-center">
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="leading-relaxed text-gray-600 mb-12 text-lg"
                >
                We're committed to reducing our environmental impact while delivering premium quality apparel 
                that tells a story. Every stitch, every print, and every shipment reflects our dedication 
                to these principles.
                </motion.p>
                
              <MotionLink
                  to="/printing"
                  whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                  className="relative z-20 inline-flex cursor-pointer items-center gap-3 rounded-xl bg-black px-10 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-400/25 group"
              >
                Our Sustainability Pledge
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
              </MotionLink>
            </div>
          </div>
          </motion.div>
      </motion.div>
      </div>
    </motion.main>
  );
}