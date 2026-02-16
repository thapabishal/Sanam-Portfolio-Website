/**
 * Card Components
 * 
 * Three specialized card variants for different content types:
 * - PortfolioCard: Showcases beautician work with before/after
 * - TestimonialCard: Displays client testimonials with ratings
 * - ServiceCard: Presents service offerings with pricing
 * 
 * All cards implement WCAG 2.1 AA accessibility standards.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// ============================================================================
// Shared Card Types
// ============================================================================

export type CardTheme = 'beautician' | 'barista' | 'neutral';

// ============================================================================
// PORTFOLIO CARD
// ============================================================================

export interface PortfolioCardProps {
  /**
   * Portfolio item title
   */
  title: string;
  
  /**
   * Category of work
   */
  category: string;
  
  /**
   * Before image URL
   */
  beforeImage: string;
  
  /**
   * After image URL
   */
  afterImage: string;
  
  /**
   * Brief description
   */
  description?: string;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Theme for color scheme
   * @default 'neutral'
   */
  theme?: CardTheme;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  title,
  category,
  beforeImage,
  afterImage,
  description,
  onClick,
  theme = 'neutral',
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [showAfter, setShowAfter] = React.useState(false);

  const themeColors = {
    beautician: {
      bg: 'bg-[#FAF7F4]',
      text: 'text-[#2C2416]',
      accent: 'text-[#C9A87C]',
      border: 'border-[#E8D5C4]',
      hover: 'hover:border-[#C9A87C]',
    },
    barista: {
      bg: 'bg-[#1A1512]',
      text: 'text-[#F5F5F5]',
      accent: 'text-[#D7A86E]',
      border: 'border-[#6D4C41]',
      hover: 'hover:border-[#D7A86E]',
    },
    neutral: {
      bg: 'bg-white',
      text: 'text-[#1A1A1A]',
      accent: 'text-[#4A4A4A]',
      border: 'border-[#E0E0E0]',
      hover: 'hover:border-[#1A1A1A]',
    },
  };

  const colors = themeColors[theme];

  return (
    <motion.div
      className={`
        ${colors.bg} rounded-xl overflow-hidden border-2 ${colors.border} ${colors.hover}
        transition-all duration-300 cursor-pointer shadow-md hover:shadow-2xl
        ${className}
      `}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      role="article"
      aria-label={`Portfolio item: ${title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Image Container with Before/After Toggle */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        {/* Before Image */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: showAfter ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={beforeImage}
            alt={`${title} - Before`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* After Image */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: showAfter ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={afterImage}
            alt={`${title} - After`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Before/After Toggle Button */}
        <button
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-[#1A1A1A] hover:bg-white transition-all z-10"
          onClick={(e) => {
            e.stopPropagation();
            setShowAfter(!showAfter);
          }}
          aria-label={showAfter ? 'Show before image' : 'Show after image'}
        >
          {showAfter ? 'Before' : 'After'}
        </button>

        {/* View Details Overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 text-white z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium">Click to view details →</p>
        </motion.div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-3">
        {/* Category Badge */}
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.accent} bg-opacity-10`}>
          {category}
        </span>

        {/* Title */}
        <h3 className={`text-xl font-bold ${colors.text}`} style={{ fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className={`text-sm ${colors.accent} line-clamp-2`} style={{ fontFamily: 'Inter, sans-serif' }}>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// TESTIMONIAL CARD
// ============================================================================

export interface TestimonialCardProps {
  /**
   * Client name
   */
  name: string;
  
  /**
   * Client role or service type
   */
  role: string;
  
  /**
   * Testimonial text
   */
  quote: string;
  
  /**
   * Star rating (1-5)
   */
  rating: number;
  
  /**
   * Optional client photo URL
   */
  photo?: string;
  
  /**
   * Optional date
   */
  date?: string;
  
  /**
   * Theme for color scheme
   * @default 'neutral'
   */
  theme?: CardTheme;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  quote,
  rating,
  photo,
  date,
  theme = 'neutral',
  className = '',
}) => {
  const themeColors = {
    beautician: {
      bg: 'bg-[#FAF7F4]',
      text: 'text-[#2C2416]',
      accent: 'text-[#A67C52]',
      star: 'text-[#C9A87C]',
      border: 'border-[#E8D5C4]',
    },
    barista: {
      bg: 'bg-[#1A1512]',
      text: 'text-[#F5F5F5]',
      accent: 'text-[#D7A86E]',
      star: 'text-[#D7A86E]',
      border: 'border-[#6D4C41]',
    },
    neutral: {
      bg: 'bg-white',
      text: 'text-[#1A1A1A]',
      accent: 'text-[#4A4A4A]',
      star: 'text-[#F59E0B]',
      border: 'border-[#E0E0E0]',
    },
  };

  const colors = themeColors[theme];

  // Star Rating Component
  const StarRating = () => (
    <div className="flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? colors.star : 'text-[#E0E0E0]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <motion.div
      className={`
        ${colors.bg} rounded-xl p-8 border-2 ${colors.border}
        shadow-md hover:shadow-xl transition-all duration-300
        ${className}
      `}
      whileHover={{ y: -4 }}
      role="article"
      aria-label={`Testimonial from ${name}`}
    >
      {/* Quote Icon */}
      <div className={`mb-4 ${colors.accent} opacity-20`}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
          <path d="M12 34h6l4-8V14H10v12h6zm16 0h6l4-8V14H26v12h6z" />
        </svg>
      </div>

      {/* Quote Text */}
      <blockquote className={`mb-6 ${colors.text} text-lg leading-relaxed italic`} style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        "{quote}"
      </blockquote>

      {/* Rating */}
      <div className="mb-6">
        <StarRating />
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-4">
        {/* Photo */}
        {photo && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}

        {/* Name and Role */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${colors.text} truncate`} style={{ fontFamily: 'Inter, sans-serif' }}>
            {name}
          </p>
          <p className={`text-sm ${colors.accent} truncate`} style={{ fontFamily: 'Inter, sans-serif' }}>
            {role}
          </p>
        </div>

        {/* Date */}
        {date && (
          <p className={`text-xs ${colors.accent} flex-shrink-0`} style={{ fontFamily: 'Inter, sans-serif' }}>
            {date}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// SERVICE CARD
// ============================================================================

export interface ServiceCardProps {
  /**
   * Service icon (SVG or component)
   */
  icon: React.ReactNode;
  
  /**
   * Service title
   */
  title: string;
  
  /**
   * Service description
   */
  description: string;
  
  /**
   * Price or price range
   */
  price: string;
  
  /**
   * Duration (e.g., "2 hours")
   */
  duration?: string;
  
  /**
   * List of features/includes
   */
  features?: string[];
  
  /**
   * CTA button text
   * @default 'Book Now'
   */
  ctaText?: string;
  
  /**
   * CTA click handler
   */
  onCtaClick?: () => void;
  
  /**
   * Whether this is a featured/popular service
   * @default false
   */
  featured?: boolean;
  
  /**
   * Theme for color scheme
   * @default 'neutral'
   */
  theme?: CardTheme;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  price,
  duration,
  features = [],
  ctaText = 'Book Now',
  onCtaClick,
  featured = false,
  theme = 'neutral',
  className = '',
}) => {
  const themeColors = {
    beautician: {
      bg: 'bg-[#FAF7F4]',
      text: 'text-[#2C2416]',
      accent: 'text-[#A67C52]',
      icon: 'text-[#C9A87C]',
      border: 'border-[#E8D5C4]',
      featuredBg: 'bg-[#C9A87C]',
      featuredText: 'text-[#2C2416]',
      button: 'bg-[#C9A87C] text-[#2C2416] hover:bg-[#A67C52]',
    },
    barista: {
      bg: 'bg-[#1A1512]',
      text: 'text-[#F5F5F5]',
      accent: 'text-[#D7A86E]',
      icon: 'text-[#D7A86E]',
      border: 'border-[#6D4C41]',
      featuredBg: 'bg-[#D7A86E]',
      featuredText: 'text-[#1A1512]',
      button: 'bg-[#D7A86E] text-[#1A1512] hover:bg-[#C9A87C]',
    },
    neutral: {
      bg: 'bg-white',
      text: 'text-[#1A1A1A]',
      accent: 'text-[#4A4A4A]',
      icon: 'text-[#1A1A1A]',
      border: 'border-[#E0E0E0]',
      featuredBg: 'bg-[#1A1A1A]',
      featuredText: 'text-white',
      button: 'bg-[#1A1A1A] text-white hover:bg-[#4A4A4A]',
    },
  };

  const colors = themeColors[theme];

  return (
    <motion.div
      className={`
        ${colors.bg} rounded-xl p-8 border-2 ${colors.border}
        shadow-md hover:shadow-2xl transition-all duration-300 relative
        ${featured ? 'ring-2 ring-offset-4 ring-offset-white' : ''}
        ${className}
      `}
      whileHover={{ y: -8, scale: 1.02 }}
      role="article"
      aria-label={`Service: ${title}`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${colors.featuredBg} ${colors.featuredText} px-4 py-1 rounded-full text-sm font-semibold shadow-lg`}>
          Most Popular
        </div>
      )}

      {/* Icon */}
      <div className={`mb-6 ${colors.icon} w-16 h-16 flex items-center justify-center`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className={`text-2xl font-bold ${colors.text} mb-3`} style={{ fontFamily: 'Playfair Display, serif' }}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${colors.accent} mb-6 leading-relaxed`} style={{ fontFamily: 'Inter, sans-serif' }}>
        {description}
      </p>

      {/* Price & Duration */}
      <div className="mb-6 space-y-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${colors.text}`} style={{ fontFamily: 'Playfair Display, serif' }}>
            {price}
          </span>
          {duration && (
            <span className={`text-sm ${colors.accent}`} style={{ fontFamily: 'Inter, sans-serif' }}>
              / {duration}
            </span>
          )}
        </div>
      </div>

      {/* Features List */}
      {features.length > 0 && (
        <ul className="mb-8 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className={`text-sm ${colors.text}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <motion.button
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${colors.button}`}
        onClick={onCtaClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`${ctaText} for ${title}`}
      >
        {ctaText}
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// Exports
// ============================================================================

export default {
  PortfolioCard,
  TestimonialCard,
  ServiceCard,
};
