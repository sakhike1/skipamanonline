import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Sparkles, Mail, UserCircle } from 'lucide-react';
import { debugAuth } from '../../utils/authDebug';
import { supabase } from '../../lib/supabase';
import { trackSignUp } from '../../lib/analytics';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Debug auth in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      debugAuth();
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user starts typing
    if (error || validationError) {
      clearError();
      setValidationError('');
    }
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      void confirmPassword; // Explicitly mark as intentionally unused
      await register(registerData);
      // If email confirmations are enabled, Supabase may not create a session on sign up.
      const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
      if (!data.session) {
        setValidationError('Account created. Please check your email to confirm, then sign in.');
        navigate('/login');
        return;
      }

      trackSignUp('email');
      navigate('/');
    } catch (error: unknown) {
      // Error is handled by the auth context
      // Avoid noisy console errors for expected auth outcomes (e.g. "already registered").
      if (import.meta.env.DEV) {
        console.debug('Registration result:', error);
      }
      // Don't navigate on error - let user see the error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-black/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-black/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-black/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-lg w-full space-y-6 z-10"
      >
        {/* Premium Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-200/50 overflow-hidden"
        >
          {/* Premium gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/50 pointer-events-none"></div>
          
          <div className="relative p-8 md:p-9">
            {/* Header Section */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-black/5 via-black/3 to-black/5 rounded-full mb-4 border border-black/10"
              >
                <Sparkles className="h-4 w-4 text-black" />
                <span className="text-xs font-bold uppercase tracking-wider text-black">Join Premium</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-black text-black mb-2 tracking-tight"
              >
                Create Account
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-sm font-medium"
              >
                Join us and start your premium shopping journey
              </motion.p>
            </div>

            {/* Proactive guidance message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/60 rounded-2xl p-4 mb-5 backdrop-blur-sm"
            >
              <div className="flex items-start">
                <div className="p-2 bg-black/5 rounded-lg mr-3 flex-shrink-0">
                  <UserCircle className="h-4 w-4 text-black" />
                </div>
                <div className="text-sm text-black">
                  <p className="font-bold mb-1">Already have an account?</p>
                  <p className="text-gray-700">Welcome back! <Link to="/login" className="font-bold text-black hover:text-gray-700 transition-colors underline">Sign in here</Link></p>
                </div>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-gray-300/80 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:border-black/30 focus:bg-white sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-400/80 hover:bg-white/80 shadow-sm"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-800 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-gray-300/80 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:border-black/30 focus:bg-white sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-400/80 hover:bg-white/80 shadow-sm"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-gray-300/80 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:border-black/30 focus:bg-white sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-400/80 hover:bg-white/80 shadow-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300/80 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:border-black/30 focus:bg-white sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-400/80 hover:bg-white/80 shadow-sm"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300/80 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:border-black/30 focus:bg-white sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-gray-400/80 hover:bg-white/80 shadow-sm"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {(error || validationError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl p-4 border border-red-200/80 shadow-sm bg-gradient-to-r from-red-50 to-red-50/50 backdrop-blur-sm"
                >
                  <div className="flex items-start">
                    <div className="p-1.5 bg-red-100 rounded-lg mr-3 flex-shrink-0">
                      <Lock className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-800 mb-1">
                        Registration Error
                      </h3>
                      <p className="text-sm text-red-700">
                        {error || validationError}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative w-full flex justify-center items-center py-3.5 px-6 border border-transparent text-sm font-bold rounded-xl text-white overflow-hidden ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-900 focus:outline-none shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]'
                  } transition-all duration-300`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10">Create Account</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-black hover:text-gray-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
