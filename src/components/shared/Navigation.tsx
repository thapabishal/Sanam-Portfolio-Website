// Navigation.tsx - Fixed mobile positioning
'use client';

import { useState, useEffect } from 'react';
import { PillNav } from './PillNav';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Navigation() {
  const { theme, setTheme, isReady } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleThemeChange = (newTheme: 'beautician' | 'barista') => {
    setTheme(newTheme);
  };

  if (!isMounted || !isReady) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* CRITICAL FIX: Use justify-center for both mobile and desktop during loading */}
          <div className="flex justify-center">
            <div className="w-full md:w-auto max-w-full">
              <div className="md:hidden flex items-center gap-3 w-full max-w-[calc(100vw-2rem)] mx-auto">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-elevated)]/50 backdrop-blur-sm border shrink-0" />
                <div className="flex-1 h-12 rounded-full bg-[var(--bg-elevated)]/50 backdrop-blur-sm border" />
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-elevated)]/50 backdrop-blur-sm border shrink-0" />
              </div>
              <div className="hidden md:block h-12 w-[700px] rounded-full bg-[var(--bg-elevated)]/50 backdrop-blur-sm border" />
            </div>
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
        {/* CRITICAL FIX: Changed from justify-start to justify-center for mobile */}
        {/* This ensures the nav stays centered and doesn't overflow right */}
        <div className="flex justify-center md:justify-center">
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