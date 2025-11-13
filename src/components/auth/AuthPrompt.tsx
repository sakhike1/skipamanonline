import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  title?: string;
  description?: string;
  redirectTo?: string;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({
  isOpen,
  onClose,
  action,
  title,
  description,
  redirectTo
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        await login({
          email: formData.email,
          password: formData.password
        });

        onClose();
        if (redirectTo) {
          navigate(redirectTo);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        await register({
          firstName: formData.name.split(' ')[0] || '',
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          password: formData.password
        });

        onClose();
        if (redirectTo) {
          navigate(redirectTo);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionInfo = () => {
    switch (action) {
      case 'submit_design_request':
        return {
          title: 'Submit Design Request',
          description: 'Log in to submit your custom t-shirt design request',
          icon: '🎨'
        };
      case 'add_to_cart':
        return {
          title: 'Add to Cart',
          description: 'Log in to add items to your cart and start shopping',
          icon: '🛒'
        };
      case 'checkout':
        return {
          title: 'Complete Purchase',
          description: 'Log in to complete your purchase securely',
          icon: '💳'
        };
      case 'view_profile':
        return {
          title: 'View Profile',
          description: 'Log in to view your profile and order history',
          icon: '👤'
        };
      case 'write_review':
        return {
          title: 'Write a Review',
          description: 'Log in to share your experience and help other customers',
          icon: '⭐'
        };
      case 'add_to_wishlist':
        return {
          title: 'Add to Wishlist',
          description: 'Log in to save items to your wishlist and never lose track of products you love',
          icon: '❤️'
        };
      default:
        return {
          title: 'Authentication Required',
          description: 'Please log in to continue',
          icon: '🔒'
        };
    }
  };

  const actionInfo = getActionInfo();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                {actionInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {title || actionInfo.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {description || actionInfo.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLoginMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogIn size={16} className="inline mr-2" />
                Log In
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLoginMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlus size={16} className="inline mr-2" />
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLoginMode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLoginMode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <Lock size={16} />
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 pb-6">
            <p className="text-xs text-gray-500 text-center">
              By {isLoginMode ? 'signing in' : 'creating an account'}, you agree to our{' '}
              <a href="/terms" className="text-purple-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthPrompt;



