/**
 * UI Components Barrel Export
 * 
 * Centralized exports for all reusable UI components.
 * Import from this file for cleaner imports throughout the application.
 * 
 * @example
 * import { Button, Card, Container, Input, ProfileCard } from '@/components/ui';
 */

// Button Components
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonTheme } from './Button';

// Card Components
export { 
  PortfolioCard, 
  TestimonialCard, 
  ServiceCard 
} from './Card';
export type { 
  PortfolioCardProps, 
  TestimonialCardProps, 
  ServiceCardProps,
  CardTheme 
} from './Card';

// Container Components
export { 
  Container, 
  HeroContainer, 
  SectionContainer, 
  ArticleContainer, 
  WideContainer, 
  CompactContainer,
  GridContainer,
  FlexContainer 
} from './Container';
export type { 
  ContainerProps, 
  ContainerSize, 
  ContainerPadding, 
  ContainerTheme,
  GridContainerProps,
  FlexContainerProps 
} from './Container';

// Input Components
export { 
  TextInput, 
  EmailInput, 
  Textarea, 
  PhoneInput, 
  SelectInput 
} from './Input';
export type { 
  TextInputProps, 
  EmailInputProps, 
  TextareaProps, 
  PhoneInputProps, 
  SelectInputProps,
  InputTheme,
  InputSize 
} from './Input';

// Profile Card Component
export { default as ProfileCard } from './ProfileCard';

// Default export for convenience
export { default } from './Button';