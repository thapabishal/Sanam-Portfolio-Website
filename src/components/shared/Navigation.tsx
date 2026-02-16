// Navigation.tsx - Zero hydration dependencies
'use client';

import { useState, useEffect } from 'react';
import { PillNav } from './PillNav';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  // CRITICAL: Start with true to match SSR, then client can update
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Only add scroll listener after mount
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleThemeChange = (newTheme: 'beautician' | 'barista') => {
    setTheme(newTheme);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      {/* CRITICAL: Use CSS grid for perfect centering */}
      <div className="grid place-items-center px-4">
        <PillNav 
          currentTheme={theme} 
          onThemeChange={handleThemeChange} 
          isScrolled={isScrolled}
        />
      </div>
    </header>
  );
}