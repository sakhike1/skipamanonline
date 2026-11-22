import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LoginCredentials } from '../../types';
import { User, Lock, Info } from 'lucide-react';

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
      // Error state changed - handled by getErrorMessage
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const user = await login(formData);
      // Redirect based on user role
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      // Error is handled by the auth context
      // Don't navigate - stay on the form to show error
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (error: string | null) => {
    if (!error) return null;

    // Check for specific error types - make the matching more flexible
    if (error.toLowerCase().includes('user not found') || 
        error.toLowerCase().includes('please sign up first') ||
        error.toLowerCase().includes('sign up first')) {
      
      // Special case for admin user
      if (formData.email === 'admin@demo.com') {
        return {
          type: 'info' as const,
          title: 'Admin Account Not Found',
          message: 'The admin account doesn\'t exist yet. You need to create it first.',
          action: {
            text: 'Create Admin Account',
            link: '/admin-setup'
          }
        };
      }
      
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

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
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
            className="text-4xl font-black text-black mb-2"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg"
          >
            Sign in to your account to continue
          </motion.p>
        </div>

        {/* Proactive guidance message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4"
        >
          <div className="flex items-start">
            <Info className="h-5 w-5 text-black mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-black">
              <p className="font-bold">New here?</p>
              <p>Don't have an account yet? <Link to="/register" className="font-bold hover:underline">Create one now</Link></p>
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
                className="appearance-none relative block w-full px-3 py-3 border-2 border-gray-200 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:z-10 sm:text-sm transition-colors duration-200 bg-white"
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
                className="appearance-none relative block w-full px-3 py-3 border-2 border-gray-200 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:z-10 sm:text-sm transition-colors duration-200 bg-white"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-full text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg hover:shadow-xl'
              } transition-all duration-200`}
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

          <div className="text-center space-y-2 mt-8">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-black hover:text-gray-700 transition-colors duration-200 underline"
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