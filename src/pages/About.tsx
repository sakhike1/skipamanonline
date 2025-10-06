import { ArrowRight, Shirt, MapPin, Users, Leaf, Camera, Star, ChevronDown, Sparkles, TrendingUp, Award, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TshirtStoreAboutUsV2() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full px-4 sm:px-6 lg:px-8 pt-24 pb-24 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-slate-100 relative overflow-hidden"
    > 
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/20"></div>
      
      {/* Floating animated orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
      ></motion.div>
      
      <motion.div 
        animate={{ 
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
      ></motion.div>
      
      <motion.div 
        animate={{ 
          x: [0, 60, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"
      ></motion.div>
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Hero Banner with enhanced effects */}
      <motion.div 
          initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full h-[500px] md:h-[700px] overflow-hidden rounded-3xl mb-24 relative group"
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
            <div className="p-8 md:p-16 text-white max-w-4xl">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {/* Glowing tag */}
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 rounded-full text-sm font-semibold mb-8 shadow-lg shadow-purple-500/25"
                >
                  <Sparkles className="inline w-4 h-4 mr-2" />
                Est. 2019
                </motion.span>
                
                <motion.h1 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-6xl md:text-8xl font-black leading-tight mb-8"
                >
                  Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Story</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed"
                >
                Crafting premium streetwear with purpose, passion, and sustainability at our core.
                </motion.p>
            </motion.div>
          </div>
        </div>
          
          {/* Animated scroll indicator */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="h-12 w-12" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* About Us Header with enhanced styling */}
        <div className="flex flex-col items-center text-center mb-24 max-w-5xl mx-auto"> 
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 rounded-full px-6 py-2 mb-8 shadow-lg shadow-purple-500/25"
            >
              <TrendingUp className="h-5 w-5 text-purple-300 mr-2" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">About Us</span>
      </motion.div>
      
            <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black text-white leading-tight mb-8"
        >
            Innovative fashion for a <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">digital age</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
            >
            We're a Munich-based t-shirt brand creating comfortable, stylish designs that express 
            your personality while maintaining the highest quality and ethical standards.
            </motion.p>
        </motion.div>
      </div>
      
        {/* Main Content Section with enhanced grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mb-32 max-w-7xl mx-auto"> 
        {/* Brand Description */}
        <motion.div 
            initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          className="lg:col-span-2"
        >
            <div className="prose prose-lg max-w-none mb-12 prose-invert prose-p:text-slate-300 prose-headings:text-white">
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="leading-relaxed text-lg"
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
                className="leading-relaxed text-lg"
              >
              Our fabrics are selected for their quality, comfort, and environmental impact. We partner 
              with suppliers who share our commitment to ethical manufacturing and fair labor practices.
              </motion.p>
          </div>
          
          <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full flex items-center gap-3 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 group shadow-lg shadow-purple-500/25 font-semibold text-lg"
          >
            Shop Collection 
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
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
              { icon: <Shirt className="h-7 w-7 text-purple-300" />, value: "50+", label: "Unique Designs", color: "from-purple-500/20 to-pink-500/20" },
              { icon: <Leaf className="h-7 w-7 text-green-300" />, value: "100%", label: "Organic Cotton", color: "from-green-500/20 to-emerald-500/20" },
              { icon: <MapPin className="h-7 w-7 text-blue-300" />, value: "10+", label: "Countries Served", color: "from-blue-500/20 to-cyan-500/20" },
              { icon: <Users className="h-7 w-7 text-yellow-300" />, value: "5K+", label: "Happy Customers", color: "from-yellow-500/20 to-orange-500/20" }
          ].map((item, index) => (
            <motion.div 
              key={index} 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className={`bg-gradient-to-br ${item.color} backdrop-blur-xl border border-white/20 p-6 rounded-2xl hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center group`}
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`bg-gradient-to-br ${item.color} p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                {item.icon}
                </motion.div>
                                 <p className="text-4xl font-black text-white mb-2">{item.value}</p>
                 <p className="text-sm text-white font-medium">{item.label}</p>
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
              className="md:col-span-8 h-[400px] md:h-[600px] overflow-hidden rounded-3xl group"
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
              className="md:col-span-4 h-[400px] md:h-[600px] overflow-hidden rounded-3xl group"
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
          className="mb-32 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-black/40 backdrop-blur-2xl border border-purple-500/30 p-12 md:p-20 rounded-3xl max-w-7xl mx-auto shadow-2xl shadow-purple-500/10"
        > 
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-4 mb-16"
          >
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg shadow-purple-500/25">
              <Camera className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">Our Journey</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-6 text-lg text-slate-300 leading-relaxed"
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
              className="space-y-6 text-lg text-slate-300 leading-relaxed"
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
              { year: 2019, text: "Founded in Munich with just 5 designs and a dream.", color: "from-purple-500/20 to-pink-500/20" },
              { year: 2021, text: "Expanded to 10 team members and 30+ retail partners.", color: "from-blue-500/20 to-cyan-500/20" },
              { year: 2023, text: "Launched our sustainability initiative and online store.", color: "from-green-500/20 to-emerald-500/20" }
            ].map((item) => (
              <motion.div 
                key={item.year} 
                whileHover={{ y: -10, scale: 1.05 }}
                className={`bg-gradient-to-br ${item.color} backdrop-blur-xl border border-white/20 p-8 rounded-2xl hover:shadow-2xl transition-all duration-500`}
              >
                <p className="text-5xl font-black text-white mb-4">{item.year}</p>
                <p className="text-slate-300 leading-relaxed">{item.text}</p>
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
            className="md:w-1/2 h-[500px] md:h-[650px] overflow-hidden rounded-3xl group"
          >
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8 }}
            src="/images/6.jpg" 
            alt="Our lead designer at work" 
              className="w-full h-full object-cover object-center filter grayscale group-hover:filter-none transition-all duration-700 ease-out"
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
              className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 rounded-full text-sm font-semibold mb-8 self-start shadow-lg shadow-purple-500/25"
            >
              <Heart className="inline w-4 h-4 mr-2" />
            The Team
            </motion.span>
            
            <h3 className="text-4xl md:text-5xl font-black mb-8 text-white">Meet Our Design Team</h3>
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
            Our talented designers bring diverse backgrounds in fashion, graphic design, and fine arts. 
            They collaborate to create collections that blend contemporary trends with timeless appeal.
          </p>
            
            {/* Enhanced award section */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-8 bg-gradient-to-br from-purple-800/30 via-purple-700/20 to-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: i * 0.1, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </motion.div>
                ))}
            </div>
              <p className="text-slate-200 font-semibold text-lg">
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
          className="border-t border-white/20 pt-20 w-full"
        > 
          <div className="text-center mb-16">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-purple-500/25"
            >
              <Award className="inline w-4 h-4 mr-2" />
            Our Purpose
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black text-white">Our Mission</h2>
        </div>
        
          {/* Enhanced final card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -10 }}
            className="bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-black/50 backdrop-blur-2xl border border-purple-500/40 text-white p-12 md:p-20 rounded-3xl shadow-2xl shadow-purple-500/20 relative overflow-hidden max-w-7xl mx-auto transition-all duration-500"
          > 
          <div className="relative z-10">
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl italic font-light mb-12 leading-relaxed max-w-5xl mx-auto text-center text-slate-100"
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
                  className="leading-relaxed text-slate-300 mb-12 text-lg"
                >
                We're committed to reducing our environmental impact while delivering premium quality apparel 
                that tells a story. Every stitch, every print, and every shipment reflects our dedication 
                to these principles.
                </motion.p>
                
              <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                  className="border-2 border-purple-500 text-white px-10 py-4 rounded-full inline-flex items-center gap-3 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:border-purple-600 transition-all duration-300 group font-semibold text-lg shadow-lg shadow-purple-500/25"
              >
                Our Sustainability Pledge
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>
          </div>
          </motion.div>
      </motion.div>
      </div>
    </motion.main>
  );
}