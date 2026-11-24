import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User } from 'lucide-react';
import AuthShell, { authInputClass, authButtonClass } from './AuthShell';
import { debugAuth } from '../../utils/authDebug';
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
    <AuthShell mode="signup" title="Create your account" subtitle="It takes a minute. Then you can track orders and save favourites.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="sr-only">First name</label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={authInputClass}
                    placeholder="First name"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#211527]/50">
                    <User className="h-5 w-5" aria-hidden />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last name</label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={authInputClass}
                    placeholder="Last name"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#211527]/50">
                    <User className="h-5 w-5" aria-hidden />
                  </span>
                </div>
              </div>
        </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={authInputClass}
                    placeholder="Enter your email"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#211527]/50">
                    <Mail className="h-5 w-5" aria-hidden />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={authInputClass}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-4 flex items-center text-[#211527]/50 transition-colors hover:text-[#211527]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={authInputClass}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-4 flex items-center text-[#211527]/50 transition-colors hover:text-[#211527]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {(error || validationError) && (
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error || validationError}
                </div>
              )}

        <button type="submit" disabled={isSubmitting} className={`${authButtonClass} mt-2`}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthShell>
  );
};

export default RegisterForm;
