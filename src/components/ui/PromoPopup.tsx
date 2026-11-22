import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Gift, ArrowRight, Clock, Flame, Star, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PromoOffer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  description: string;
  urgency: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
}

const promoOffers: PromoOffer[] = [
  {
    id: 'flash-sale',
    title: 'FLASH SALE',
    subtitle: 'Limited Time Only',
    discount: '30% OFF',
    code: 'FLASH30',
    description: 'On all streetwear essentials',
    urgency: 'Ends in 2 hours',
    icon: Zap,
    gradient: 'from-black via-gray-900 to-black',
    accentColor: 'white'
  },
  {
    id: 'new-arrival',
    title: 'NEW DROPS',
    subtitle: 'Just Landed',
    discount: '20% OFF',
    code: 'NEWDROP20',
    description: 'First purchase on new arrivals',
    urgency: 'This week only',
    icon: Sparkles,
    gradient: 'from-gray-900 via-black to-gray-900',
    accentColor: 'white'
  },
  {
    id: 'vip-exclusive',
    title: 'EXCLUSIVE',
    subtitle: 'VIP Access',
    discount: 'R100 OFF',
    code: 'VIP100',
    description: 'Orders over R500',
    urgency: 'Members only',
    icon: Gift,
    gradient: 'from-black via-gray-800 to-black',
    accentColor: 'white'
  },
  {
    id: 'weekend-deal',
    title: 'WEEKEND',
    subtitle: 'Special Deal',
    discount: '25% OFF',
    code: 'WEEKEND25',
    description: 'All hoodies & tees',
    urgency: 'Sat & Sun only',
    icon: Flame,
    gradient: 'from-gray-800 via-black to-gray-800',
    accentColor: 'white'
  }
];

const PromoPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<PromoOffer>(promoOffers[0]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if popup was recently shown (within last 30 minutes)
    const lastShown = localStorage.getItem('promoPopupLastShown');
    const now = Date.now();
    
    if (lastShown && now - parseInt(lastShown) < 30 * 60 * 1000) {
      return; // Don't show if shown in last 30 minutes
    }

    // Random delay between 5-15 seconds for first popup
    const initialDelay = Math.random() * 10000 + 5000;
    
    const showPopup = () => {
      // Select random offer
      const randomOffer = promoOffers[Math.floor(Math.random() * promoOffers.length)];
      setCurrentOffer(randomOffer);
      setIsVisible(true);
      localStorage.setItem('promoPopupLastShown', now.toString());
    };

    const timer = setTimeout(showPopup, initialDelay);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentOffer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShopNow = () => {
    setIsVisible(false);
    navigate('/shop');
  };

  const IconComponent = currentOffer.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto">
              {/* Main Card */}
              <motion.div
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentOffer.gradient} p-1`}
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(255,255,255,0.1)",
                    "0 0 60px rgba(255,255,255,0.2)",
                    "0 0 30px rgba(255,255,255,0.1)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Inner Content */}
                <div className="relative bg-black rounded-[22px] p-8 overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '30px 30px'
                      }}
                      animate={{ 
                        backgroundPosition: ["0px 0px", "30px 30px"]
                      }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Floating Particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + (i % 3) * 30}%`
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3
                      }}
                    />
                  ))}

                  {/* Close Button */}
                  <motion.button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-20"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} className="text-white" />
                  </motion.button>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <IconComponent size={40} className="text-black" />
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4"
                    >
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-sm font-medium text-white tracking-wider uppercase">
                        {currentOffer.subtitle}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
                    >
                      {currentOffer.title}
                    </motion.h2>

                    {/* Discount */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      className="relative inline-block mb-4"
                    >
                      <motion.span
                        className="text-6xl md:text-7xl font-black text-white"
                        animate={{
                          textShadow: [
                            "0 0 20px rgba(255,255,255,0.3)",
                            "0 0 40px rgba(255,255,255,0.5)",
                            "0 0 20px rgba(255,255,255,0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {currentOffer.discount}
                      </motion.span>
                      
                      {/* Sparkles around discount */}
                      <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Star size={16} className="text-white fill-white" />
                      </motion.div>
                      <motion.div
                        className="absolute -bottom-1 -left-3"
                        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Star size={12} className="text-white fill-white" />
                      </motion.div>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-300 text-lg mb-6"
                    >
                      {currentOffer.description}
                    </motion.p>

                    {/* Promo Code */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mb-6"
                    >
                      <p className="text-gray-400 text-sm mb-2">Use code:</p>
                      <motion.button
                        onClick={handleCopyCode}
                        className="relative group px-8 py-3 bg-white/10 border-2 border-dashed border-white/30 rounded-xl hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl font-black text-white tracking-widest">
                          {currentOffer.code}
                        </span>
                        
                        {/* Copy indicator */}
                        <motion.div
                          className="absolute -top-2 -right-2 px-2 py-1 bg-white text-black text-xs font-bold rounded-full"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0 }}
                        >
                          Copied!
                        </motion.div>
                        
                        <p className="text-gray-400 text-xs mt-1 group-hover:text-white transition-colors">
                          Click to copy
                        </p>
                      </motion.button>
                    </motion.div>

                    {/* Urgency */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center justify-center gap-2 mb-6"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Clock size={16} className="text-white" />
                      </motion.div>
                      <span className="text-white font-medium">{currentOffer.urgency}</span>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                      onClick={handleShopNow}
                      className="group relative w-full py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                      />
                      
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <ShoppingBag size={20} />
                        Shop Now
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>

                    {/* Skip Link */}
                    <motion.button
                      onClick={handleClose}
                      className="mt-4 text-gray-500 hover:text-white text-sm transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      Maybe later
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 bg-white rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute top-1/2 -right-2 w-4 h-4 bg-white rounded-full"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromoPopup;
