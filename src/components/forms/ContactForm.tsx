/**
 * General Contact Form
 * 
 * Simple contact form for general inquiries
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  contactFormSchema,
  type ContactFormData,
  CONTACT_CATEGORY_OPTIONS,
} from '@/lib/validations';
import { TextInput, EmailInput, PhoneInput, SelectInput, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ContactFormProps {
  theme?: 'beautician' | 'barista' | 'neutral';
  onSuccess?: (data: ContactFormData) => void;
}

export default function ContactForm({ theme = 'neutral', onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      setSubmitStatus('success');
      reset();
      onSuccess?.(data);
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Success Message */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-900 mb-2">Message Sent!</h3>
                <p className="text-green-800">
                  Thank you for reaching out. We've received your message and will respond within 1-2 business days.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">Failed to Send</h3>
                <p className="text-red-800">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TextInput
          label="Name"
          placeholder="Your name"
          theme={theme}
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmailInput
            label="Email Address"
            placeholder="you@example.com"
            theme={theme}
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <PhoneInput
            label="Phone Number (Optional)"
            placeholder="(555) 123-4567"
            theme={theme}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <SelectInput
          label="Category (Optional)"
          placeholder="Select a category"
          options={CONTACT_CATEGORY_OPTIONS}
          theme={theme}
          error={errors.category?.message}
          helperText="Helps us route your message to the right person"
          {...register('category')}
        />

        <TextInput
          label="Subject"
          placeholder="What is this regarding?"
          theme={theme}
          required
          error={errors.subject?.message}
          {...register('subject')}
        />

        <Textarea
          label="Message"
          placeholder="Tell us what you need help with..."
          theme={theme}
          required
          rows={6}
          showCharacterCount
          maxLength={2000}
          error={errors.message?.message}
          {...register('message')}
        />

        <Button
          type="submit"
          variant="primary"
          theme={theme}
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting || submitStatus === 'success'}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>

        <p className="text-sm text-center text-[#4A4A4A]">
          We typically respond within 1-2 business days
        </p>
      </form>
    </div>
  );
}
