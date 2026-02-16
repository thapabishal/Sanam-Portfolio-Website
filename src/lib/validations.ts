import { z } from 'zod';

export const beauticianBookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number'),
  service: z.enum(['bridal', 'editorial', 'sfx', 'glam', 'consultation'], {
    errorMap: () => ({ message: 'Please select a service' }),
  }),
  preferredDate: z.string().min(1, 'Please select a date').refine((date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, { message: 'Date must be in the future' }),
  preferredTime: z.enum(['morning', 'afternoon', 'evening', 'flexible'], {
    errorMap: () => ({ message: 'Please select a time' }),
  }),
  specialRequests: z.string().max(1000).optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
});

export const trainingInquirySchema = z.object({
  companyName: z.string().min(2, 'Company name required').max(200),
  contactName: z.string().min(2, 'Contact name required').max(100),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().min(10, 'Valid phone required').regex(/^[\d\s\-\+\(\)]+$/),
  trainingType: z.enum(['individual', 'group', 'team', 'custom']),
  numberOfTrainees: z.number().min(1).max(50),
  trainingModule: z.enum(['espresso', 'milk', 'latteArt', 'workflow', 'equipment', 'comprehensive', 'custom']).optional(),
  preferredDates: z.string().min(1, 'Please provide preferred dates'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
  budget: z.string().max(100).optional(),
  referralSource: z.enum(['google', 'instagram', 'facebook', 'linkedin', 'referral', 'other']).optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional().refine((val) => !val || val.length >= 10, 'Invalid phone'),
  subject: z.string().min(3).max(200),
  category: z.enum(['beautician', 'training', 'collaboration', 'press', 'other']).optional(),
  message: z.string().min(10).max(2000),
});

export type BeauticianBookingData = z.infer<typeof beauticianBookingSchema>;
export type TrainingInquiryData = z.infer<typeof trainingInquirySchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;

export const SERVICE_OPTIONS = [
  { value: 'bridal', label: 'Bridal Makeup' },
  { value: 'editorial', label: 'Editorial Makeup' },
  { value: 'sfx', label: 'Special Effects' },
  { value: 'glam', label: 'Everyday Glam' },
  { value: 'consultation', label: 'Consultation' },
] as const;

export const TIME_OPTIONS = [
  { value: 'morning', label: 'Morning (9am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { value: 'evening', label: 'Evening (5pm - 8pm)' },
  { value: 'flexible', label: 'Flexible' },
] as const;

export const TRAINING_TYPE_OPTIONS = [
  { value: 'individual', label: 'Individual Training' },
  { value: 'group', label: 'Small Group (2-5)' },
  { value: 'team', label: 'Team Training (6+)' },
  { value: 'custom', label: 'Custom Program' },
] as const;

export const TRAINING_MODULE_OPTIONS = [
  { value: 'espresso', label: 'Espresso Fundamentals' },
  { value: 'milk', label: 'Milk Steaming' },
  { value: 'latteArt', label: 'Latte Art' },
  { value: 'workflow', label: 'Workflow & Efficiency' },
  { value: 'equipment', label: 'Equipment Maintenance' },
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'custom', label: 'Custom Curriculum' },
] as const;

export const CONTACT_CATEGORY_OPTIONS = [
  { value: 'beautician', label: 'Beautician Services' },
  { value: 'training', label: 'Barista Training' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'press', label: 'Press & Media' },
  { value: 'other', label: 'Other' },
] as const;

export const REFERRAL_SOURCE_OPTIONS = [
  { value: 'google', label: 'Google' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' },
] as const;