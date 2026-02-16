// Navigation.tsx - Refined for mobile responsiveness
'use client';

import { useState, useEffect, useCallback } from 'react';
import { PillNav } from './PillNav';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Navigation() {
  const { theme, setTheme, isReady } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  const handleThemeChange = useCallback((newTheme: 'beautician' | 'barista') => {
    setTheme(newTheme);
  }, [setTheme]);

  if (!isMounted || !isReady) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 py-4 pointer-events-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start md:justify-center">
            <div className="h-12 w-full md:w-[700px] rounded-full bg-[var(--bg-elevated)]/50 backdrop-blur-sm" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile: Left-aligned, Desktop: Centered - stays consistent on scroll */}
        <div className="flex justify-start md:justify-center">
          <PillNav 
            currentTheme={theme} 
            onThemeChange={handleThemeChange} 
            isScrolled={isScrolled}
          />
        </div>
      </div>
    </header>
  );
}