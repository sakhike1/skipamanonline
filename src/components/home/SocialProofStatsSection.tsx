import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Award, Shield, Heart } from 'lucide-react';

interface Stat {
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: Stat[] = [
  { number: "50K+", label: "Happy Customers", icon: Users },
  { number: "4.9/5", label: "Average Rating", icon: Star },
  { number: "99%", label: "Satisfaction Rate", icon: Heart },
  { number: "24/7", label: "Customer Support", icon: Shield }
];

/**
 * Stats section for SocialProof component
 * Displays key statistics in a grid layout
 */
export const SocialProofStatsSection: React.FC = () => {
  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewport={{ once: true }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="text-center group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm">
            <stat.icon className="w-8 h-8 text-white drop-shadow-sm" />
          </div>
          <motion.div
            className="text-3xl md:text-4xl font-black text-gray-900 mb-2"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1, type: "spring" }}
            viewport={{ once: true }}
          >
            {stat.number}
          </motion.div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

