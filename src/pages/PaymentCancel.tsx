import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

const PaymentCancel: React.FC = () => {
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
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <XCircle className="w-10 h-10 text-red-600" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Payment Cancelled
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your payment was cancelled. No charges have been made to your account.
        </motion.p>

        <motion.div 
          className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center text-yellow-800 mb-2">
            <ShoppingCart size={16} className="mr-2" />
            <span className="font-medium">Your Cart is Safe</span>
          </div>
          <p className="text-yellow-700 text-sm">
            Your items are still in your cart. You can continue shopping or try again later.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            onClick={() => navigate('/checkout')} 
            variant="outline" 
            className="flex items-center justify-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            variant="primary" 
            className="flex items-center justify-center"
          >
            Continue Shopping
          </Button>
        </motion.div>

        <motion.p 
          className="text-xs text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          If you continue to experience issues, please contact our customer support.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
