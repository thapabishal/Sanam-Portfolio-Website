'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'beautician' | 'barista';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'kamala-theme-preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('barista');
  const [isReady, setIsReady] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
    
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let initialTheme: Theme = 'barista';
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && ['beautician', 'barista'].includes(stored)) {
        initialTheme = stored;
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = prefersDark ? 'barista' : 'beautician';
      }
    } catch (e) {
      console.warn('Failed to read theme preference:', e);
    }

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setIsReady(true);
  }, [applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useIsDark() {
  const { theme } = useTheme();
  return theme === 'barista';
}