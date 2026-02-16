/**
 * Container Component
 * 
 * Section wrapper component providing consistent padding, max-width constraints,
 * and responsive layout throughout the portfolio website.
 * 
 * Implements the spacing system from PRD design tokens.
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerTheme = 'beautician' | 'barista' | 'neutral' | 'transparent';

export interface ContainerProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  /**
   * Container content
   */
  children: React.ReactNode;
  
  /**
   * Maximum width constraint
   * @default 'xl'
   */
  size?: ContainerSize;
  
  /**
   * Vertical padding (top/bottom)
   * @default 'lg'
   */
  paddingY?: ContainerPadding;
  
  /**
   * Horizontal padding (left/right)
   * @default 'md'
   */
  paddingX?: ContainerPadding;
  
  /**
   * Background theme
   * @default 'transparent'
   */
  theme?: ContainerTheme;
  
  /**
   * Whether to center the container
   * @default true
   */
  centered?: boolean;
  
  /**
   * Whether the container should be full viewport height
   * @default false
   */
  fullHeight?: boolean;
  
  /**
   * Custom background gradient (overrides theme)
   */
  gradient?: string;
  
  /**
   * Section ID for navigation/anchoring
   */
  id?: string;
  
  /**
   * Semantic HTML tag to use
   * @default 'section'
   */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============================================================================
// Component Implementation
// ============================================================================

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  paddingY = 'lg',
  paddingX = 'md',
  theme = 'transparent',
  centered = true,
  fullHeight = false,
  gradient,
  id,
  as: Component = 'section',
  className = '',
  ...props
}) => {
  // Max-width classes based on size
  const sizeClasses = {
    sm: 'max-w-3xl',      // 768px
    md: 'max-w-5xl',      // 1024px
    lg: 'max-w-6xl',      // 1152px
    xl: 'max-w-7xl',      // 1280px
    full: 'max-w-full',   // No constraint
  };

  // Vertical padding classes (mobile-first)
  const paddingYClasses = {
    none: 'py-0',
    sm: 'py-8 md:py-12',           // 32px mobile, 48px desktop
    md: 'py-12 md:py-16',          // 48px mobile, 64px desktop
    lg: 'py-16 md:py-24',          // 64px mobile, 96px desktop
    xl: 'py-24 md:py-32',          // 96px mobile, 128px desktop
  };

  // Horizontal padding classes (mobile-first)
  const paddingXClasses = {
    none: 'px-0',
    sm: 'px-4 md:px-6',            // 16px mobile, 24px desktop
    md: 'px-6 md:px-12',           // 24px mobile, 48px desktop
    lg: 'px-8 md:px-16',           // 32px mobile, 64px desktop
    xl: 'px-12 md:px-24',          // 48px mobile, 96px desktop
  };

  // Theme background colors
  const themeColors = {
    beautician: 'bg-[#FAF7F4]',
    barista: 'bg-[#1A1512]',
    neutral: 'bg-white',
    transparent: 'bg-transparent',
  };

  // Combine all classes
  const containerClasses = [
    themeColors[theme],
    paddingYClasses[paddingY],
    paddingXClasses[paddingX],
    fullHeight ? 'min-h-screen' : '',
    className,
  ].join(' ');

  const innerClasses = [
    sizeClasses[size],
    centered ? 'mx-auto' : '',
    'w-full',
  ].join(' ');

  // Use motion component dynamically
  const MotionComponent = motion[Component] as typeof motion.section;

  return (
    <MotionComponent
      id={id}
      className={containerClasses}
      style={gradient ? { background: gradient } : undefined}
      {...props}
    >
      <div className={innerClasses}>
        {children}
      </div>
    </MotionComponent>
  );
};

// ============================================================================
// Pre-configured Container Variants
// ============================================================================

/**
 * Hero Container - Full viewport height with centered content
 */
export const HeroContainer: React.FC<Omit<ContainerProps, 'as' | 'fullHeight' | 'paddingY'>> = ({ 
  children, 
  ...props 
}) => (
  <Container
    as="section"
    fullHeight
    paddingY="none"
    theme="transparent"
    {...props}
  >
    {children}
  </Container>
);

/**
 * Section Container - Standard section spacing
 */
export const SectionContainer: React.FC<Omit<ContainerProps, 'as'>> = ({ 
  children, 
  ...props 
}) => (
  <Container
    as="section"
    paddingY="lg"
    {...props}
  >
    {children}
  </Container>
);

/**
 * Article Container - Narrower width for reading content
 */
export const ArticleContainer: React.FC<Omit<ContainerProps, 'as' | 'size'>> = ({ 
  children, 
  ...props 
}) => (
  <Container
    as="article"
    size="md"
    {...props}
  >
    {children}
  </Container>
);

/**
 * Wide Container - Full-width with minimal constraints
 */
export const WideContainer: React.FC<Omit<ContainerProps, 'size'>> = ({ 
  children, 
  ...props 
}) => (
  <Container
    size="full"
    {...props}
  >
    {children}
  </Container>
);

/**
 * Compact Container - Smaller max-width for focused content
 */
export const CompactContainer: React.FC<Omit<ContainerProps, 'size'>> = ({ 
  children, 
  ...props 
}) => (
  <Container
    size="sm"
    {...props}
  >
    {children}
  </Container>
);

// ============================================================================
// Grid Layout Component
// ============================================================================

export interface GridContainerProps {
  /**
   * Grid children
   */
  children: React.ReactNode;
  
  /**
   * Number of columns on mobile
   * @default 1
   */
  colsMobile?: 1 | 2;
  
  /**
   * Number of columns on tablet
   * @default 2
   */
  colsTablet?: 1 | 2 | 3 | 4;
  
  /**
   * Number of columns on desktop
   * @default 3
   */
  colsDesktop?: 1 | 2 | 3 | 4 | 5 | 6;
  
  /**
   * Gap between grid items
   * @default 'md'
   */
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  colsMobile = 1,
  colsTablet = 2,
  colsDesktop = 3,
  gap = 'md',
  className = '',
}) => {
  const colsClasses = {
    mobile: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
    },
    tablet: {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
    },
    desktop: {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
    },
  };

  const gapClasses = {
    sm: 'gap-4',    // 16px
    md: 'gap-6',    // 24px
    lg: 'gap-8',    // 32px
    xl: 'gap-12',   // 48px
  };

  return (
    <div
      className={[
        'grid',
        colsClasses.mobile[colsMobile],
        colsClasses.tablet[colsTablet],
        colsClasses.desktop[colsDesktop],
        gapClasses[gap],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
};

// ============================================================================
// Flex Layout Component
// ============================================================================

export interface FlexContainerProps {
  /**
   * Flex children
   */
  children: React.ReactNode;
  
  /**
   * Flex direction
   * @default 'row'
   */
  direction?: 'row' | 'col';
  
  /**
   * Justify content
   * @default 'start'
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  
  /**
   * Align items
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  
  /**
   * Gap between items
   * @default 'md'
   */
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Whether items should wrap
   * @default false
   */
  wrap?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 'md',
  wrap = false,
  className = '',
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  return (
    <div
      className={[
        'flex',
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        wrap ? 'flex-wrap' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
};

// ============================================================================
// Exports
// ============================================================================

export default {
  Container,
  HeroContainer,
  SectionContainer,
  ArticleContainer,
  WideContainer,
  CompactContainer,
  GridContainer,
  FlexContainer,
};