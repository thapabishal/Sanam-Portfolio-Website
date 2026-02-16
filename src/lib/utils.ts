import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => { func(...args); }, wait);
  };
}

export function splitTextToSpans(text: string): string[] {
  return Array.from(text).map(char => char === ' ' ? '\u00A0' : char);
}

export function calculateStagger(textLength: number, maxDuration: number = 1.5): number {
  const baseStagger = 0.05;
  const calculated = maxDuration / textLength;
  return Math.min(calculated, baseStagger);
}

export type Theme = 'beautician' | 'barista' | 'default';

export function getCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'default';
  return (document.documentElement.getAttribute('data-theme') as Theme) || 'default';
}

export function getThemeColors(theme: Theme) {
  switch (theme) {
    case 'beautician':
      return { primary: '#C9A87C', secondary: '#A67C52', accent: '#D7A86E', text: '#2C2416', bg: '#FAF7F4' };
    case 'barista':
      return { primary: '#D7A86E', secondary: '#6D4C41', accent: '#C9A87C', text: '#F5F5F5', bg: '#1A1512' };
    default:
      return { primary: '#FFFFFF', secondary: '#C9A87C', accent: '#D7A86E', text: '#FFFFFF', bg: '#050505' };
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}