import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsMessageProps {
  message: { type: 'success' | 'error'; text: string } | null;
}

const SettingsMessage: React.FC<SettingsMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 p-4 rounded-lg flex items-center ${
        message.type === 'success' 
          ? 'bg-green-50 text-green-800 border border-green-200' 
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}
    >
      {message.type === 'success' ? (
        <CheckCircle className="w-5 h-5 mr-3" />
      ) : (
        <AlertCircle className="w-5 h-5 mr-3" />
      )}
      {message.text}
    </motion.div>
  );
};

export default SettingsMessage;
































































