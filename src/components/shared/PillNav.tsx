'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Sparkles,
  Palette,
  GraduationCap,
  MapPin,
  Quote,
  Mail,
  Menu,
  X,
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'beautician' | 'barista';

interface PillNavProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  isScrolled: boolean;
}

const navItems = [
  { id: 'hero', label: 'Start', icon: <Home className="w-4 h-4" /> },
  { id: 'introduction', label: 'About', icon: <User className="w-4 h-4" /> },
  { id: 'philosophy', label: 'Philosophy', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'works', label: 'Portfolio', icon: <Palette className="w-4 h-4" /> },
  { id: 'training', label: 'Training', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'timeline', label: 'Journey', icon: <MapPin className="w-4 h-4" /> },
  { id: 'testimonials', label: 'Stories', icon: <Quote className="w-4 h-4" /> },
  { id: 'contact', label: 'Connect', icon: <Mail className="w-4 h-4" /> },
];

export function PillNav({ currentTheme, onThemeChange, isScrolled }: PillNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = navItems.findIndex(item => item.id === entry.target.id);
          if (index !== -1) setActiveIndex(index);
        }
      });
    }, { rootMargin: '-10% 0px -70% 0px' });

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const getStyles = () => {
    if (currentTheme === 'beautician') {
      return {
        nav: 'bg-[#FAF7F4]/98 border-[#C9A87C]/30',
        text: 'text-[#2C2416]',
        muted: 'text-[#2C2416]/60',
        mobileBg: 'bg-[#FAF7F4]',
        mobileBorder: 'border-[#C9A87C]/20',
      };
    }
    return {
      nav: 'bg-[#1A1512]/98 border-[#D7A86E]/30',
      text: 'text-[#F5F5F5]',
      muted: 'text-[#F5F5F5]/60',
      mobileBg: 'bg-[#1A1512]',
      mobileBorder: 'border-[#D7A86E]/20',
    };
  };

  const styles = getStyles();

  return (
    <>
      {/* Desktop */}
      <div className={cn(
        'hidden md:flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl border shadow-lg',
        styles.nav
      )}>
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeIndex === index ? styles.text : styles.muted
            )}
          >
            {item.icon}
            <span className="hidden lg:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile - SIMPLIFIED: No complex layouts, just flex */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            'w-12 h-12 rounded-full backdrop-blur-xl border shadow-lg flex items-center justify-center',
            styles.nav, styles.text
          )}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className={cn(
          'px-4 py-3 rounded-full backdrop-blur-xl border shadow-lg flex items-center gap-2 text-sm font-medium',
          styles.nav, styles.text
        )}>
          {navItems[activeIndex]?.icon}
          <span>{navItems[activeIndex]?.label}</span>
        </div>

        <button
          onClick={() => onThemeChange(currentTheme === 'barista' ? 'beautician' : 'barista')}
          className={cn(
            'w-12 h-12 rounded-full backdrop-blur-xl border shadow-lg flex items-center justify-center',
            styles.nav,
            currentTheme === 'barista' ? 'text-[#D7A86E]' : 'text-[#C9A87C]'
          )}
        >
          {currentTheme === 'barista' ? <Coffee className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={cn(
                'md:hidden fixed left-4 right-4 top-20 rounded-2xl p-4 z-50 shadow-2xl border',
                styles.mobileBg, styles.mobileBorder
              )}
            >
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl w-full text-left',
                    activeIndex === index ? styles.text : styles.muted
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}