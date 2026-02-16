/**
 * Input Components
 * 
 * Form input components with full validation, error handling, and accessibility.
 */

'use client';

import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type InputTheme = 'beautician' | 'barista' | 'neutral';
export type InputSize = 'sm' | 'md' | 'lg';

interface BaseInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  theme?: InputTheme;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseInputProps {}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      theme = 'neutral',
      size = 'md',
      leftIcon,
      rightIcon,
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) => {
    // Use React's useId hook for stable IDs across server/client
    const generatedId = useId();
    const inputId = providedId || `input-${generatedId}`;
    const hasError = !!error;

    const themeColors = {
      beautician: {
        label: 'text-[#2C2416]',
        input: 'border-[#E8D5C4] focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 bg-[#FAF7F4]',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        text: 'text-[#2C2416]',
        placeholder: 'placeholder-[#A67C52]',
      },
      barista: {
        label: 'text-[#F5F5F5]',
        input: 'border-[#6D4C41] focus:border-[#D7A86E] focus:ring-[#D7A86E]/20 bg-[#1A1512] text-[#F5F5F5]',
        error: 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
        text: 'text-[#F5F5F5]',
        placeholder: 'placeholder-[#D7A86E]',
      },
      neutral: {
        label: 'text-[#1A1A1A]',
        input: 'border-[#E0E0E0] focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/10 bg-white',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        text: 'text-[#1A1A1A]',
        placeholder: 'placeholder-[#4A4A4A]',
      },
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    const colors = themeColors[theme];

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block mb-2 font-medium ${colors.label}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={`
              w-full rounded-lg border-2 transition-all duration-200
              focus:outline-none focus:ring-4
              disabled:opacity-50 disabled:cursor-not-allowed
              ${colors.input}
              ${colors.text}
              ${colors.placeholder}
              ${hasError ? colors.error : ''}
              ${sizeClasses[size]}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {rightIcon}
            </div>
          )}

          {hasError && !rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {hasError ? (
            <motion.p
              key="error"
              id={`${inputId}-error`}
              className="mt-2 text-sm text-red-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              role="alert"
            >
              {error}
            </motion.p>
          ) : helperText ? (
            <motion.p
              key="helper"
              id={`${inputId}-helper`}
              className="mt-2 text-sm text-[#4A4A4A]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {helperText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export interface EmailInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, BaseInputProps {}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (props, ref) => {
    const emailIcon = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-[#4A4A4A]">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    );

    return (
      <TextInput
        ref={ref}
        type="email"
        leftIcon={emailIcon}
        {...props}
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>, BaseInputProps {
  rows?: number;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      theme = 'neutral',
      size = 'md',
      className = '',
      id: providedId,
      rows = 4,
      showCharacterCount = false,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId || `textarea-${generatedId}`;
    const hasError = !!error;
    const currentLength = typeof value === 'string' ? value.length : 0;

    const themeColors = {
      beautician: {
        label: 'text-[#2C2416]',
        input: 'border-[#E8D5C4] focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 bg-[#FAF7F4]',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        text: 'text-[#2C2416]',
        placeholder: 'placeholder-[#A67C52]',
      },
      barista: {
        label: 'text-[#F5F5F5]',
        input: 'border-[#6D4C41] focus:border-[#D7A86E] focus:ring-[#D7A86E]/20 bg-[#1A1512] text-[#F5F5F5]',
        error: 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
        text: 'text-[#F5F5F5]',
        placeholder: 'placeholder-[#D7A86E]',
      },
      neutral: {
        label: 'text-[#1A1A1A]',
        input: 'border-[#E0E0E0] focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/10 bg-white',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        text: 'text-[#1A1A1A]',
        placeholder: 'placeholder-[#4A4A4A]',
      },
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    const colors = themeColors[theme];

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block mb-2 font-medium ${colors.label}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          value={value}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`
            w-full rounded-lg border-2 transition-all duration-200 resize-y
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed
            ${colors.input}
            ${colors.text}
            ${colors.placeholder}
            ${hasError ? colors.error : ''}
            ${sizeClasses[size]}
          `}
          {...props}
        />

        <div className="flex justify-between mt-1">
          {hasError ? (
            <p className={`text-sm text-red-500`}>{error}</p>
          ) : helperText ? (
            <p className={`text-sm text-[#4A4A4A]`}>{helperText}</p>
          ) : <div />}
          {showCharacterCount && maxLength && (
            <span className={`text-xs ${currentLength > maxLength ? 'text-red-500' : 'text-[#4A4A4A]'}`}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, BaseInputProps {}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (props, ref) => {
    const phoneIcon = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-[#4A4A4A]">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    );

    return (
      <TextInput
        ref={ref}
        type="tel"
        leftIcon={phoneIcon}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export interface SelectInputProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>, BaseInputProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      theme = 'neutral',
      size = 'md',
      className = '',
      id: providedId,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId || `select-${generatedId}`;
    const hasError = !!error;

    const themeColors = {
      beautician: {
        label: 'text-[#2C2416]',
        input: 'border-[#E8D5C4] focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 bg-[#FAF7F4]',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        text: 'text-[#2C2416]',
      },
      barista: {
        label: 'text-[#F5F5F5]',
        input: 'border-[#6D4C41] focus:border-[#D7A86E] focus:ring-[#D7A86E]/20 bg-[#1A1512] text-[#F5F5F5]',
        error: 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
        text: 'text-[#F5F5F5]',
      },
      neutral: {
        label: 'text-[#1A1A1A]',
        input: 'border-[#E0E0E0] focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/10 bg-white',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        text: 'text-[#1A1A1A]',
      },
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    const colors = themeColors[theme];

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block mb-2 font-medium ${colors.label}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={`
              w-full rounded-lg border-2 transition-all duration-200 appearance-none
              focus:outline-none focus:ring-4
              disabled:opacity-50 disabled:cursor-not-allowed
              ${colors.input}
              ${colors.text}
              ${hasError ? colors.error : ''}
              ${sizeClasses[size]}
              pr-10
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-[#4A4A4A]">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {hasError ? (
            <motion.p
              key="error"
              id={`${inputId}-error`}
              className="mt-2 text-sm text-red-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              role="alert"
            >
              {error}
            </motion.p>
          ) : helperText ? (
            <motion.p
              key="helper"
              id={`${inputId}-helper`}
              className="mt-2 text-sm text-[#4A4A4A]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {helperText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export default {
  TextInput,
  EmailInput,
  Textarea,
  PhoneInput,
  SelectInput,
};