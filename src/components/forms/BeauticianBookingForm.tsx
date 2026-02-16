/**
 * Beautician Booking Form
 * 
 * Full-featured booking form with validation, calendar integration, and email notifications
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  beauticianBookingSchema,
  type BeauticianBookingData,
  SERVICE_OPTIONS,
  TIME_OPTIONS,
} from '@/lib/validations';
import { TextInput, EmailInput, PhoneInput, SelectInput, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface BeauticianBookingFormProps {
  /**
   * Theme for form styling
   */
  theme?: 'beautician' | 'neutral';
  
  /**
   * Callback on successful submission
   */
  onSuccess?: (data: BeauticianBookingData) => void;
  
  /**
   * Whether to show Cal.com embed instead of form
   */
  useCalEmbed?: boolean;
  
  /**
   * Cal.com booking URL
   */
  calComUrl?: string;
}

export default function BeauticianBookingForm({
  theme = 'beautician',
  onSuccess,
  useCalEmbed = false,
  calComUrl,
}: BeauticianBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BeauticianBookingData>({
    resolver: zodResolver(beauticianBookingSchema),
  });

  // Watch service selection to show relevant info
  const selectedService = watch('service');

  const onSubmit = async (data: BeauticianBookingData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/bookings/beautician', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit booking');
      }

      setSubmitStatus('success');
      setConfirmationNumber(result.data?.confirmationNumber || '');
      reset();
      onSuccess?.(data);

      // Scroll to success message
      setTimeout(() => {
        document.getElementById('booking-success')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If using Cal.com embed
  if (useCalEmbed && calComUrl) {
    return (
      <div className="w-full">
        <iframe
          src={calComUrl}
          width="100%"
          height="800"
          frameBorder="0"
          title="Booking Calendar"
          className="rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Success Message */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            id="booking-success"
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
                <h3 className="text-lg font-bold text-green-900 mb-2">Booking Request Received!</h3>
                <p className="text-green-800 mb-2">
                  Thank you for your booking request. We've received your information and will contact you within 24 hours to confirm your appointment.
                </p>
                {confirmationNumber && (
                  <p className="text-sm text-green-700 font-mono bg-green-100 px-3 py-2 rounded">
                    Confirmation: {confirmationNumber}
                  </p>
                )}
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
                <h3 className="text-lg font-bold text-red-900 mb-2">Submission Failed</h3>
                <p className="text-red-800">{errorMessage}</p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-3 text-sm text-red-700 hover:text-red-900 underline"
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
        {/* Personal Information Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-[#2C2416]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Personal Information
          </h3>

          <TextInput
            label="Full Name"
            placeholder="Jane Doe"
            theme={theme}
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <EmailInput
            label="Email Address"
            placeholder="jane@example.com"
            theme={theme}
            required
            error={errors.email?.message}
            helperText="We'll send confirmation to this email"
            {...register('email')}
          />

          <PhoneInput
            label="Phone Number"
            placeholder="(555) 123-4567"
            theme={theme}
            required
            error={errors.phone?.message}
            helperText="For appointment reminders"
            {...register('phone')}
          />
        </div>

        {/* Service Selection Section */}
        <div className="space-y-6 pt-6 border-t-2 border-[#E8D5C4]">
          <h3 className="text-2xl font-bold text-[#2C2416]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Service Details
          </h3>

          <SelectInput
            label="Service Type"
            placeholder="Select a service"
            options={[...SERVICE_OPTIONS]}
            theme={theme}
            required
            error={errors.service?.message}
            helperText="Choose the service you're interested in"
            {...register('service')}
          />

          {/* Service Info Box */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-[#FAF7F4] rounded-lg border border-[#E8D5C4]"
            >
              <p className="text-sm text-[#2C2416]">
                <strong>Note:</strong>{' '}
                {selectedService === 'bridal' &&
                  'Bridal services include a trial session. Please book at least 2 months in advance.'}
                {selectedService === 'editorial' &&
                  'Editorial makeup is perfect for photoshoots and fashion events.'}
                {selectedService === 'sfx' &&
                  'Special effects makeup requires a consultation to discuss your vision.'}
                {selectedService === 'glam' &&
                  'Everyday glam is perfect for special occasions and events.'}
                {selectedService === 'consultation' &&
                  'Consultation sessions last approximately 1 hour.'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Scheduling Section */}
        <div className="space-y-6 pt-6 border-t-2 border-[#E8D5C4]">
          <h3 className="text-2xl font-bold text-[#2C2416]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Preferred Schedule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              type="date"
              label="Preferred Date"
              theme={theme}
              required
              error={errors.preferredDate?.message}
              min={new Date().toISOString().split('T')[0]}
              {...register('preferredDate')}
            />

            <SelectInput
              label="Preferred Time"
              placeholder="Select time slot"
              options={[...TIME_OPTIONS]}
              theme={theme}
              required
              error={errors.preferredTime?.message}
              {...register('preferredTime')}
            />
          </div>

          <p className="text-sm text-[#A67C52]">
            * Final appointment time will be confirmed via email based on availability
          </p>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-6 pt-6 border-t-2 border-[#E8D5C4]">
          <h3 className="text-2xl font-bold text-[#2C2416]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Additional Information
          </h3>

          <Textarea
            label="Special Requests or Notes"
            placeholder="Please share any specific requirements, allergies, or preferences..."
            theme={theme}
            rows={5}
            showCharacterCount
            maxLength={1000}
            error={errors.specialRequests?.message}
            helperText="Let us know about any allergies, skin sensitivities, or specific looks you have in mind"
            {...register('specialRequests')}
          />
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-4 pt-6 border-t-2 border-[#E8D5C4]">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              className="mt-1 w-4 h-4 rounded border-[#E8D5C4] text-[#C9A87C] focus:ring-[#C9A87C]"
              {...register('agreeToTerms')}
            />
            <label htmlFor="agreeToTerms" className="text-sm text-[#2C2416]">
              I agree to the{' '}
              <a href="/terms" className="text-[#C9A87C] hover:underline" target="_blank">
                terms and conditions
              </a>{' '}
              and understand that a deposit may be required to secure my appointment.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
          )}
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
            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
          </Button>

          <p className="mt-4 text-sm text-center text-[#A67C52]">
            We'll contact you within 24 hours to confirm your appointment
          </p>
        </div>
      </form>
    </div>
  );
}
