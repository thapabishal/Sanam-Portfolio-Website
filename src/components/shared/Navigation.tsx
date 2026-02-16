// Navigation.tsx - Bulletproof centered positioning
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
      <header className="fixed top-0 left-0 right-0 z-50 py-4 pointer-events-none">
        {/* Centered placeholder using left-1/2 transform */}
        <div className="absolute left-1/2 -translate-x-1/2 px-4 w-full max-w-fit">
          <div className="h-12 w-[280px] md:w-[700px] rounded-full bg-[var(--bg-elevated)]/50 backdrop-blur-sm" />
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
      {/* BULLETPROOF CENTERING: absolute positioning with transform */}
      <div className="absolute left-1/2 -translate-x-1/2 px-4 w-full max-w-fit">
        <PillNav 
          currentTheme={theme} 
          onThemeChange={handleThemeChange} 
          isScrolled={isScrolled}
        />
      </div>
    </header>
  );
}