import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  loadingText,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden transform hover:scale-[1.02]';
  
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-900 focus:ring-black shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-800 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-black bg-transparent hover:bg-black text-black hover:text-white focus:ring-black',
    ghost: 'bg-transparent hover:bg-gray-100 text-black focus:ring-black',
  };
  
  const sizeStyles = {
    sm: 'text-sm px-3 py-2 gap-2',
    md: 'text-base px-4 py-2 gap-2',
    lg: 'text-lg px-6 py-3 gap-3',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`;
  
  return (
    <button 
      className={buttonStyles} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner
            variant="default"
            size="sm"
            color="white"
          />
          <span>{loadingText || 'Loading...'}</span>
        </>
      ) : children}
    </button>
  );
};