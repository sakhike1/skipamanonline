import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LoginCredentials } from '../../types';
import { User, Lock, AlertCircle, Info } from 'lucide-react';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  // Clear error when component mounts or when user starts typing
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Monitor error state changes
  useEffect(() => {
    if (error) {
      console.log('LoginForm: Error state changed to:', error);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) {
      console.log('Clearing error due to input change'); // Debug log
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      await login(formData);
      // Only navigate if login is successful (no error thrown)
      console.log('Login successful, navigating to home');
      navigate('/');
    } catch (error) {
      // Error is handled by the auth context
      console.log('Login failed, staying on form to show error');
      // Don't navigate - stay on the form to show error
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (error: string | null) => {
    if (!error) return null;

    console.log('Processing error:', error); // Debug log

    // Check for specific error types - make the matching more flexible
    if (error.toLowerCase().includes('user not found') || 
        error.toLowerCase().includes('please sign up first') ||
        error.toLowerCase().includes('sign up first')) {
              return {
          type: 'info' as const,
          title: 'Account Not Found',
          message: 'You don\'t have an account yet. Please sign up first to continue.',
          action: {
            text: 'Sign Up Now',
            link: '/register'
          }
        };
    }

    if (error.toLowerCase().includes('invalid email or password')) {
      return {
        type: 'error' as const,
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect. Please try again.',
        action: null
      };
    }

    // Default error
    return {
      type: 'error' as const,
      title: 'Login Failed',
      message: error,
      action: null
    };
  };

  // Debug: Log the current error state
  console.log('Current error in LoginForm:', error);
  console.log('Error type:', typeof error);
  console.log('Error length:', error ? error.length : 0);
  
  const errorInfo = getErrorMessage(error);
  console.log('ErrorInfo result:', errorInfo);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Sign in to your account to continue
          </motion.p>
        </div>

        {/* Proactive guidance message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">New here?</p>
              <p>Don't have an account yet? <Link to="/register" className="font-semibold hover:underline">Create one now</Link></p>
            </div>
          </div>
        </motion.div>

        {/* Error Messages */}
        {errorInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-lg p-4 border shadow-sm ${
              errorInfo.type === 'info' 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="flex items-start">
              {errorInfo.type === 'info' ? (
                <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <Lock className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`text-sm font-medium ${
                  errorInfo.type === 'info' ? 'text-blue-800' : 'text-red-800'
                }`}>
                  {errorInfo.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  errorInfo.type === 'info' ? 'text-blue-700' : 'text-red-700'
                }`}>
                  {errorInfo.message}
                </p>
                {errorInfo.action && (
                  <div className="mt-3">
                    <Link
                      to={errorInfo.action.link}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                        errorInfo.type === 'info'
                          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                          : 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500'
                      } transition-colors duration-200`}
                    >
                      {errorInfo.action.text}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}



        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              } transition-colors duration-200`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginForm; 