import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div 
        className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Payment Successful!
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Thank you for your purchase! Your order has been confirmed and payment processed successfully.
        </motion.p>

        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center text-blue-800 mb-2">
            <Mail size={16} className="mr-2" />
            <span className="font-medium">Order Confirmation</span>
          </div>
          <p className="text-blue-700 text-sm">
            You will receive an order confirmation email shortly with your order details and tracking information.
          </p>
        </motion.div>

        <motion.div 
          className="bg-green-50 border border-green-200 rounded-md p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center text-green-800 mb-2">
            <Package size={16} className="mr-2" />
            <span className="font-medium">Order Processing</span>
          </div>
          <p className="text-green-700 text-sm">
            Your order is being prepared and will be shipped within 1-2 business days.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button 
            onClick={() => navigate('/orders')} 
            variant="outline" 
            className="flex items-center justify-center"
          >
            View Orders
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            variant="primary" 
            className="flex items-center justify-center"
          >
            Continue Shopping
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </motion.div>

        <motion.p 
          className="text-xs text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          If you have any questions about your order, please contact our customer support.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
