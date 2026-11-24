import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import AuthShell, { authInputClass, authButtonClass } from './AuthShell';
import { resolvePostLoginPath } from '../../utils/loginRedirect';

type LoginFormProps = {
  redirectTo?: string;
  showAdminButton?: boolean;
  /** Staff portal at `/admin/login` — only admin/store_manager accounts may complete sign-in. */
  adminPortal?: boolean;
};

const LoginForm: React.FC<LoginFormProps> = ({
  redirectTo = '/',
  showAdminButton = true,
  adminPortal = false,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, error, clearError, isAuthenticated, isSubmitting, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated (send admins to admin portal unless URL targets /admin)
  useEffect(() => {
    if (isAuthenticated && user) {
      if (adminPortal && user.role !== 'admin') {
        return;
      }
      navigate(resolvePostLoginPath(redirectTo, user));
    }
  }, [isAuthenticated, user, navigate, redirectTo, adminPortal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedIn = await login(formData, adminPortal ? { adminPortal: true } : undefined);
      navigate(resolvePostLoginPath(redirectTo, loggedIn));
    } catch {
      // error is already set in AuthContext
    }
  };

  return (
    <AuthShell
      mode="signin"
      hideTabs={adminPortal}
      title={adminPortal ? 'Staff sign-in' : 'Welcome back!'}
      subtitle={adminPortal ? 'Admin and store manager accounts only.' : 'Good to see you again. Sign in to continue.'}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
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
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={authInputClass}
                    placeholder="Enter your password"
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
              {error && (
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

        <button type="submit" disabled={isSubmitting} className={`${authButtonClass} mt-2`}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>

        {showAdminButton ? (
          <button
            type="button"
            onClick={() => navigate('/admin/login')}
            className="w-full rounded-full border border-[#211527]/20 bg-white px-6 py-3 text-sm font-semibold text-[#211527] transition hover:bg-[#211527] hover:text-white"
          >
            Staff admin sign-in
          </button>
        ) : (
          <p className="pt-1 text-center text-sm text-[#6b5a73]">
            Shopping account?{' '}
            <Link to="/login" className="font-semibold text-[#211527] underline underline-offset-4">
              Customer sign in
            </Link>
          </p>
        )}
      </form>
    </AuthShell>
  );
};

export default LoginForm;
