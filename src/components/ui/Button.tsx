/**
 * Button Component
 * 
 * A reusable button component with three variants: Primary, Secondary, and Ghost.
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonTheme = 'beautician' | 'barista' | 'neutral';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: ButtonTheme;
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      theme = 'neutral',
      children,
      disabled = false,
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const variantClasses = {
      primary: {
        beautician: 'bg-[#C9A87C] text-[#2C2416] hover:bg-[#A67C52] focus:ring-[#C9A87C]/30 shadow-md hover:shadow-lg active:scale-[0.98]',
        barista: 'bg-[#D7A86E] text-[#1A1512] hover:bg-[#C79A60] focus:ring-[#D7A86E]/30 shadow-md hover:shadow-lg active:scale-[0.98]',
        neutral: 'bg-[#1A1A1A] text-white hover:bg-[#4A4A4A] focus:ring-[#1A1A1A]/30 shadow-md hover:shadow-lg active:scale-[0.98]',
      },
      secondary: {
        beautician: 'bg-transparent border-2 border-[#C9A87C] text-[#C9A87C] hover:bg-[#C9A87C] hover:text-[#2C2416] focus:ring-[#C9A87C]/30 active:scale-[0.98]',
        barista: 'bg-transparent border-2 border-[#D7A86E] text-[#D7A86E] hover:bg-[#D7A86E] hover:text-[#1A1512] focus:ring-[#D7A86E]/30 active:scale-[0.98]',
        neutral: 'bg-transparent border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white focus:ring-[#1A1A1A]/30 active:scale-[0.98]',
      },
      ghost: {
        beautician: 'bg-transparent text-[#C9A87C] hover:bg-[#FAF7F4] hover:underline underline-offset-4 focus:ring-[#C9A87C]/20',
        barista: 'bg-transparent text-[#D7A86E] hover:bg-[#1A1512]/5 hover:underline underline-offset-4 focus:ring-[#D7A86E]/20',
        neutral: 'bg-transparent text-[#1A1A1A] hover:bg-[#F5F5F5] hover:underline underline-offset-4 focus:ring-[#1A1A1A]/20',
      },
    };
    
    const sizeClasses = {
      sm: 'text-sm px-4 py-2 rounded-md gap-2',
      md: 'text-base px-6 py-3 rounded-lg gap-2',
      lg: 'text-lg px-8 py-4 rounded-lg gap-3',
      xl: 'text-xl px-10 py-5 rounded-xl gap-3',
    };
    
    const widthClasses = fullWidth ? 'w-full' : '';
    
    const combinedClasses = `
      ${baseClasses}
      ${variantClasses[variant][theme]}
      ${sizeClasses[size]}
      ${widthClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');
    
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    );
    
    return (
      <motion.button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || isLoading}
        type={type}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          leftIcon && <span className="inline-flex">{leftIcon}</span>
        )}
        
        <span>{children}</span>
        
        {!isLoading && rightIcon && (
          <span className="inline-flex">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;