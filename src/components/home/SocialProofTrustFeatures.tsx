import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Award, CheckCircle } from 'lucide-react';

interface TrustFeature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  gradient: string;
}

const trustFeatures: TrustFeature[] = [
  { 
    icon: Shield, 
    text: "Secure Payments",
    gradient: "from-purple-500 to-indigo-500"
  },
  { 
    icon: Truck, 
    text: "Free Shipping",
    gradient: "from-pink-500 to-rose-500"
  },
  { 
    icon: Award, 
    text: "Premium Quality",
    gradient: "from-purple-600 to-violet-600"
  },
  { 
    icon: CheckCircle, 
    text: "Easy Returns",
    gradient: "from-blue-500 to-cyan-500"
  }
];

/**
 * Trust features section for SocialProof component
 */
export const SocialProofTrustFeatures: React.FC = () => {
  return (
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
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          />
          
          <motion.div
            className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
            animate={{ y: [0, -5, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
          />
          
          <motion.div 
            className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl relative overflow-hidden`}
            whileHover={{ scale: 1.15, rotate: 10, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
            <feature.icon className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
          </motion.div>
          
          <motion.p 
            className="font-bold text-white text-base relative z-10"
            whileHover={{ color: "#a855f7", scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {feature.text}
          </motion.p>
          
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}20, ${feature.gradient.split(' ')[3]}20)`
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

