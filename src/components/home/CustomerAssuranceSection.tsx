import React from 'react';
import { motion } from 'framer-motion';
import { TRUST_INDICATORS, APP_CONFIG } from '../../utils/constants';

/**
 * Customer assurance section displaying delivery, returns, and refunds information
 * Builds customer trust with clear service guarantees
 */
export const CustomerAssuranceSection: React.FC = () => {
  return (
    <div className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Join Our Happy Customers
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Experience the quality and service that thousands of customers trust
          </motion.p>
        </div>

        {/* Assurance Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Fast Delivery */}
          <motion.div 
            className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">Fast Delivery</h3>
            <p className="text-gray-300 leading-relaxed">
              Get your orders delivered within {APP_CONFIG.DELIVERY_DAYS}. Free shipping on orders over ${APP_CONFIG.FREE_SHIPPING_THRESHOLD} with tracking included.
            </p>
          </motion.div>

          {/* Easy Returns */}
          <motion.div 
            className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">Easy Returns</h3>
            <p className="text-gray-300 leading-relaxed">
              {APP_CONFIG.RETURN_DAYS}-day hassle-free returns. If you're not satisfied, return your items for a full refund or exchange.
            </p>
          </motion.div>

          {/* Secure Refunds */}
          <motion.div 
            className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">Secure Refunds</h3>
            <p className="text-gray-300 leading-relaxed">
              Your money is safe with us. Secure payment processing and guaranteed refunds within {APP_CONFIG.REFUND_DAYS} business days.
            </p>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-semibold text-white">{TRUST_INDICATORS.HAPPY_CUSTOMERS} Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-semibold text-white">{TRUST_INDICATORS.SATISFACTION_RATE} Satisfaction Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-semibold text-white">{TRUST_INDICATORS.SUPPORT_AVAILABILITY} Customer Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

