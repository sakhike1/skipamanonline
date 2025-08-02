import React from 'react';
import { ArrowRight, Info, Shirt, MapPin, Users, Leaf, Camera, Star, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TshirtStoreAboutUsV2() {
  return (
    // Full width dark gradient background with subtle purple overlay
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 sm:px-6 lg:px-8 pt-24 pb-24 min-h-screen bg-slate-900 text-slate-100 relative"
    > 
      {/* Purple gradient background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900/40 to-purple-800/20"></div>
      
      {/* Floating purple glassmorphism elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-600/5 to-purple-700/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      {/* Subtle purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-purple-800/5 pointer-events-none"></div>
      
      {/* Content container */}
      <div className="relative z-10">
      {/* Hero Banner */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full h-[400px] md:h-[600px] overflow-hidden rounded-3xl mb-20 relative"
      >
        <img 
          src="/images/6.jpg"
          alt="Fashion design workshop" 
          className="w-full h-full object-cover object-center filter grayscale hover:filter-none transition-all duration-1000 ease-out scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="p-8 md:p-16 text-white max-w-3xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Enhanced glassmorphism on the tag */}
              <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium mb-6">
                Est. 2019
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Our <span className="border-b-4 border-white pb-1">Story</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-xl">
                Crafting premium streetwear with purpose, passion, and sustainability at our core.
              </p>
            </motion.div>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        >
          <ChevronDown className="h-10 w-10 animate-bounce" />
        </motion.div>
      </motion.div>
      
      {/* About Us Header - Full width with centered content */}
      <div className="flex flex-col items-center text-center mb-20 max-w-4xl mx-auto"> 
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1 mb-6">
            <Info className="h-4 w-4 text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-slate-200 uppercase tracking-wider">About Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Innovative fashion for a <br className="hidden sm:block" />
            <span className="text-slate-400">digital age</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We're a Munich-based t-shirt brand creating comfortable, stylish designs that express 
            your personality while maintaining the highest quality and ethical standards.
          </p>
        </motion.div>
      </div>
      
      {/* Main Content Section - Full width grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24 max-w-7xl mx-auto"> 
        {/* Brand Description */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="prose prose-lg max-w-none mb-10 prose-invert prose-p:text-slate-300">
            <p className="leading-relaxed"> 
              In a world of fast fashion, we take the slow, sustainable approach. Each design is carefully 
              crafted to balance artistic expression with everyday wearability, giving you pieces that 
              stand out while integrating seamlessly into your wardrobe.
            </p>
            <p className="leading-relaxed">
              Our fabrics are selected for their quality, comfort, and environmental impact. We partner 
              with suppliers who share our commitment to ethical manufacturing and fair labor practices.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-indigo-600 text-white px-8 py-4 rounded-full flex items-center gap-2 hover:bg-indigo-500 transition-all duration-300 group"
          >
            Shop Collection 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
        
        {/* Stats/Highlights - Key Glassmorphism Section */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4 h-fit"
        >
          {[
            { icon: <Shirt className="h-6 w-6 text-indigo-400" />, value: "50+", label: "Unique Designs" },
            { icon: <Leaf className="h-6 w-6 text-indigo-400" />, value: "100%", label: "Organic Cotton" },
            { icon: <MapPin className="h-6 w-6 text-indigo-400" />, value: "10+", label: "Countries Served" },
            { icon: <Users className="h-6 w-6 text-indigo-400" />, value: "5K+", label: "Happy Customers" }
          ].map((item, index) => (
            // Glass card item with purple-black gradient
            <motion.div 
              key={index} 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              className="bg-gradient-to-br from-purple-900/20 via-purple-800/15 to-black/20 backdrop-blur-lg border border-purple-500/20 p-5 rounded-2xl hover:bg-gradient-to-br hover:from-purple-800/25 hover:via-purple-700/20 hover:to-black/25 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="bg-gradient-to-br from-purple-600/20 to-black/30 p-3 rounded-full mb-3">
                {item.icon}
              </div>
              <p className="text-3xl font-bold text-white">{item.value}</p>
              <p className="text-sm text-slate-400 mt-1">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Featured Images Grid - Full width */}
      <div className="mb-24 w-full">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          <div className="md:col-span-8 h-[320px] md:h-[500px] overflow-hidden rounded-2xl">
            <img 
              src="/images/7.jpg"
              alt="Fashion design team collaboration" 
              className="w-full h-full object-cover object-center filter grayscale hover:filter-none transition-all duration-700 ease-out"
            />
          </div>
          <div className="md:col-span-4 h-[320px] md:h-[500px] overflow-hidden rounded-2xl">
            <img 
              src="/images/8.jpg" 
              alt="T-shirt screen printing process" 
              className="w-full h-full object-cover object-center filter grayscale hover:filter-none transition-all duration-700 ease-out"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Our Journey Section - Full width with max-width for content */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-24 bg-gradient-to-br from-purple-900/10 via-purple-800/8 to-black/15 backdrop-blur-xl border border-purple-500/20 p-10 md:p-16 rounded-3xl max-w-7xl mx-auto"
      > 
        <div className="flex items-center space-x-4 mb-12">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-3 rounded-full">
            <Camera className="h-6 w-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Our Journey</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          <div className="space-y-6 text-lg text-slate-300 leading-relaxed"> 
            <p>
              Founded in 2019, our journey began with a simple idea: create t-shirts that people would love 
              to wear every day, made with sustainable materials and ethical practices.
            </p>
            <p>
              What started as a small operation in a Munich apartment has grown into a beloved brand with 
              customers across Europe who share our passion for quality, style, and sustainability.
            </p>
          </div>
          <div className="space-y-6 text-lg text-slate-300 leading-relaxed"> 
            <p>
              Each of our designs is created in-house by our talented team of artists who draw inspiration 
              from urban culture, nature, and contemporary art movements.
            </p>
            <p>
              We believe that fashion should be both personal and responsible – that's why we use organic cotton 
              and ensure fair labor practices throughout our supply chain.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
          {[2019, 2021, 2023].map((year) => (
            <div key={year} className="bg-gradient-to-br from-purple-800/15 via-purple-700/10 to-black/20 border border-purple-500/20 p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-700/20 hover:via-purple-600/15 hover:to-black/25 transition-all duration-300">
              <p className="text-4xl font-bold text-white mb-3">{year}</p>
              <p className="text-slate-400">
                {year === 2019 && "Founded in Munich with just 5 designs and a dream."}
                {year === 2021 && "Expanded to 10 team members and 30+ retail partners."}
                {year === 2023 && "Launched our sustainability initiative and online store."}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Designer Spotlight - Full width with max-width for content */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-24 flex flex-col md:flex-row gap-12 items-center max-w-7xl mx-auto"
      >
        <div className="md:w-1/2 h-[400px] md:h-[550px] overflow-hidden rounded-2xl">
          <img 
            src="/images/6.jpg" 
            alt="Our lead designer at work" 
            className="w-full h-full object-cover object-center filter grayscale hover:filter-none transition-all duration-700 ease-out"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium mb-6 self-start">
            The Team
          </span>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">Meet Our Design Team</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Our talented designers bring diverse backgrounds in fashion, graphic design, and fine arts. 
            They collaborate to create collections that blend contemporary trends with timeless appeal.
          </p>
          {/* Award section as a glass card */}
          <div className="p-6 bg-gradient-to-br from-purple-800/15 via-purple-700/10 to-black/20 backdrop-blur-lg border border-purple-500/20 rounded-xl hover:bg-gradient-to-br hover:from-purple-700/20 hover:via-purple-600/15 hover:to-black/25 transition-all duration-300">
            <div className="flex items-center gap-1 text-yellow-400 mb-3">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-slate-200 font-medium">
              Recognized among top 10 indie fashion labels in 2022 by Fashion Forward Magazine
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Mission Section - Full width */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="border-t border-white/10 pt-16 w-full"
      > 
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium mb-4">
            Our Purpose
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Our Mission</h2>
        </div>
        
        {/* Final glassmorphism card with a gradient for visual interest - Full width with max-width for content */}
        <div className="bg-gradient-to-br from-purple-900/20 via-purple-800/15 to-black/25 backdrop-blur-xl border border-purple-500/20 text-white p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden max-w-7xl mx-auto hover:bg-gradient-to-br hover:from-purple-800/25 hover:via-purple-700/20 hover:to-black/30 transition-all duration-300"> 
          <div className="relative z-10">
            <p className="text-2xl md:text-3xl italic font-light mb-10 leading-relaxed max-w-4xl mx-auto text-center text-slate-100"> 
              "To redefine streetwear by combining innovative design with sustainable practices, 
              creating clothing that looks good and does good."
            </p>
            <div className="max-w-3xl mx-auto text-center">
              <p className="leading-relaxed text-slate-300 mb-10">
                We're committed to reducing our environmental impact while delivering premium quality apparel 
                that tells a story. Every stitch, every print, and every shipment reflects our dedication 
                to these principles.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-purple-500 text-white px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-purple-600 hover:border-purple-600 transition-all duration-300 group"
              >
                Our Sustainability Pledge
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </motion.main>
  );
}