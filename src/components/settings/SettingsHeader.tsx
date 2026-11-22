import React from 'react';
import { motion } from 'framer-motion';

const SettingsHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-600">Manage your account settings and preferences</p>
    </motion.div>
  );
};

export default SettingsHeader;
































































