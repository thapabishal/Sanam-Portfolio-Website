// Navigation.tsx - For bottom dock version
'use client';

import { useState, useEffect } from 'react';
import { PillNav } from './PillNav';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Navigation() {
  const { theme, setTheme, isReady } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!hasMounted || !isReady) {
    return (
      <>
        {/* Desktop placeholder */}
        <header className="hidden md:block fixed top-0 left-0 right-0 z-50 py-4">
          <div className="h-12" />
        </header>
        {/* Mobile placeholder - bottom */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="h-12 w-48" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop: Top navigation */}
      <header 
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <PillNav 
              currentTheme={theme} 
              onThemeChange={setTheme} 
              isScrolled={isScrolled}
            />
          </div>
        </div>
      </header>
      {/* Mobile: Bottom dock (rendered inside PillNav) */}
      <div className="md:hidden">
        <PillNav 
          currentTheme={theme} 
          onThemeChange={setTheme} 
          isScrolled={isScrolled}
        />
      </div>
    </>
  );
}