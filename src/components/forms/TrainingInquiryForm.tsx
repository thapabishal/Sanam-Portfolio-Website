/**
 * Training Inquiry Form
 * 
 * Clean, minimal form with global CSS variable theming
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  trainingInquirySchema,
  type TrainingInquiryData,
  TRAINING_TYPE_OPTIONS,
  TRAINING_MODULE_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from '@/lib/validations';
import { TextInput, EmailInput, PhoneInput, SelectInput, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface TrainingInquiryFormProps {
  theme?: 'barista' | 'neutral';
  onSuccess?: (data: TrainingInquiryData) => void;
}

export default function TrainingInquiryForm({
  theme = 'barista',
  onSuccess,
}: TrainingInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TrainingInquiryData>({
    resolver: zodResolver(trainingInquirySchema),
    defaultValues: {
      numberOfTrainees: 1,
    },
  });

  const trainingType = watch('trainingType');
  const numberOfTrainees = watch('numberOfTrainees');

  const onSubmit = async (data: TrainingInquiryData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit inquiry');
      }

      setSubmitStatus('success');
      reset();
      onSuccess?.(data);

      setTimeout(() => {
        document.getElementById('inquiry-success')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Inquiry submission error:', error);
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
            id="inquiry-success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-green-50/10 border-2 border-green-200/20 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--accent-primary)] mb-2">Inquiry Received!</h3>
                <p className="text-[var(--text-secondary)]">
                  Thank you for your interest in our training programs. We'll review your inquiry and contact you within 24 hours with a custom proposal.
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
            className="mb-8 p-6 bg-red-50/10 border-2 border-red-200/20 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400 mb-2">Submission Failed</h3>
                <p className="text-red-300">{errorMessage}</p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-3 text-sm text-[var(--accent-primary)] hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Business Information
          </h3>

          <TextInput
            label="Company/Business Name"
            placeholder="Your Coffee Shop"
            theme={theme}
            required
            error={errors.companyName?.message}
            {...register('companyName')}
          />
        </div>

        {/* Contact Person */}
        <div className="space-y-6 pt-6 border-t-2 border-[var(--border-default)]">
          <h3 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Contact Details
          </h3>

          <TextInput
            label="Your Name"
            placeholder="John Smith"
            theme={theme}
            required
            error={errors.contactName?.message}
            {...register('contactName')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmailInput
              label="Email Address"
              placeholder="john@coffeeshop.com"
              theme={theme}
              required
              error={errors.contactEmail?.message}
              {...register('contactEmail')}
            />

            <PhoneInput
              label="Phone Number"
              placeholder="(555) 123-4567"
              theme={theme}
              required
              error={errors.contactPhone?.message}
              {...register('contactPhone')}
            />
          </div>
        </div>

        {/* Training Details */}
        <div className="space-y-6 pt-6 border-t-2 border-[var(--border-default)]">
          <h3 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Training Requirements
          </h3>

          <SelectInput
            label="Training Type"
            placeholder="Select training type"
            options={TRAINING_TYPE_OPTIONS}
            theme={theme}
            required
            error={errors.trainingType?.message}
            helperText="Choose the format that best fits your needs"
            {...register('trainingType')}
          />

          {/* Info Box for Group Training */}
          {trainingType === 'group' && numberOfTrainees > 5 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-[var(--accent-primary)]/10 rounded-lg border border-[var(--accent-primary)]/20"
            >
              <p className="text-sm text-[var(--accent-primary)]">
                <strong>Tip:</strong> For groups over 5, consider our Corporate Training option for better pricing.
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              type="number"
              label="Number of Trainees"
              theme={theme}
              required
              error={errors.numberOfTrainees?.message}
              min={1}
              max={50}
              {...register('numberOfTrainees', { valueAsNumber: true })}
            />

            <SelectInput
              label="Training Module (Optional)"
              placeholder="Select a module"
              options={TRAINING_MODULE_OPTIONS}
              theme={theme}
              error={errors.trainingModule?.message}
              helperText="Leave blank if you're not sure"
              {...register('trainingModule')}
            />
          </div>
        </div>

        {/* Schedule & Details */}
        <div className="space-y-6 pt-6 border-t-2 border-[var(--border-default)]">
          <h3 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Schedule & Additional Details
          </h3>

          <TextInput
            label="Preferred Dates/Timeframe"
            placeholder="e.g., Week of March 15th, Weekends only, Flexible"
            theme={theme}
            required
            error={errors.preferredDates?.message}
            helperText="When would you like to schedule the training?"
            {...register('preferredDates')}
          />

          <Textarea
            label="Tell Us About Your Needs"
            placeholder="Please describe your team's current skill level, specific goals, equipment available, and any other relevant details..."
            theme={theme}
            required
            rows={5}
            showCharacterCount
            maxLength={2000}
            error={errors.message?.message}
            helperText="The more details you provide, the better we can customize your training program"
            {...register('message')}
          />

          <TextInput
            label="Budget Range (Optional)"
            placeholder="e.g., $500-1000, Flexible, Need quote"
            theme={theme}
            error={errors.budget?.message}
            helperText="Helps us provide appropriate pricing options"
            {...register('budget')}
          />
        </div>

        {/* How Did You Hear */}
        <div className="space-y-6 pt-6 border-t-2 border-[var(--border-default)]">
          <SelectInput
            label="How Did You Hear About Us? (Optional)"
            placeholder="Select one"
            options={REFERRAL_SOURCE_OPTIONS}
            theme={theme}
            error={errors.referralSource?.message}
            {...register('referralSource')}
          />
        </div>

        {/* Pricing Info Box */}
        <div className="p-5 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-default)]">
          <h4 className="font-bold text-[var(--text-primary)] mb-2">Pricing Information</h4>
          <ul className="text-sm text-[var(--text-secondary)] space-y-1">
            <li>• Individual training: Starting at $200 per session</li>
            <li>• Group rates available for 2+ people</li>
            <li>• Team training: Custom pricing based on group size</li>
            <li>• All prices include materials and certification</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            theme={theme}
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting || submitStatus === 'success'}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Training Inquiry'}
          </Button>

          <p className="mt-4 text-sm text-center text-[var(--text-muted)]">
            We'll respond within 1-2 business days with a custom proposal
          </p>
        </div>
      </form>
    </div>
  );
}