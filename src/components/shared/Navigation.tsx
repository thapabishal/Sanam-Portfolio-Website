// Navigation.tsx - Client-only rendering to eliminate hydration mismatch
'use client';

import { useState, useEffect } from 'react';
import { PillNav } from './PillNav';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Navigation() {
  const { theme, setTheme, isReady } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  // CRITICAL: Only render after client-side hydration is complete
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleThemeChange = (newTheme: 'beautician' | 'barista') => {
    setTheme(newTheme);
  };

  // CRITICAL: Return null during SSR and initial hydration
  // This ensures zero hydration mismatch
  if (!hasMounted || !isReady) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 py-4">
        {/* Empty placeholder that matches dimensions */}
        <div className="h-12" />
      </header>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      {/* Use a centered container with explicit max-width */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
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