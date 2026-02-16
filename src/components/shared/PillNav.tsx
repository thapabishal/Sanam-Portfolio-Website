'use client';

import { useState, useEffect } from 'react';
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
  Coffee,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'beautician' | 'barista';

interface PillNavProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  isScrolled: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Start', icon: Home },
  { id: 'introduction', label: 'About', icon: User },
  { id: 'philosophy', label: 'Philosophy', icon: Sparkles },
  { id: 'works', label: 'Portfolio', icon: Palette },
  { id: 'training', label: 'Training', icon: GraduationCap },
  { id: 'timeline', label: 'Journey', icon: MapPin },
  { id: 'testimonials', label: 'Stories', icon: Quote },
  { id: 'contact', label: 'Connect', icon: Mail },
];

export function PillNav({ currentTheme, onThemeChange }: PillNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = navItems.findIndex((item) => item.id === entry.target.id);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );

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
      setIsMenuOpen(false);
    }
  };

  const isBeauty = currentTheme === 'beautician';

  const navClass = isBeauty
    ? 'bg-[#FAF7F4]/98 border-[#C9A87C]/30 text-[#2C2416]'
    : 'bg-[#1A1512]/98 border-[#D7A86E]/30 text-[#F5F5F5]';

  const ActiveIcon = navItems[activeIndex]?.icon || Home;

  return (
    <>
      {/* Desktop - Top Navigation (unchanged) */}
      <div className={cn(
        'hidden md:flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl border shadow-lg',
        navClass
      )}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:opacity-80 transition-opacity"
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden lg:inline">{item.label}</span>
          </button>
        ))}
        <div className={cn('w-px h-5 mx-2 opacity-30', isBeauty ? 'bg-[#2C2416]' : 'bg-[#F5F5F5]')} />
        <button
          onClick={() => onThemeChange(isBeauty ? 'barista' : 'beautician')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
        >
          {isBeauty ? <Coffee className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          <span className="hidden lg:inline">{isBeauty ? 'Coffee' : 'Beauty'}</span>
        </button>
      </div>

      {/* MOBILE: Bottom Dock Design */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className={cn(
          'flex items-center gap-2 px-2 py-2 rounded-full backdrop-blur-xl border shadow-2xl',
          navClass
        )}>
          {/* Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
            type="button"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className={cn('w-px h-6 opacity-30', isBeauty ? 'bg-[#2C2416]' : 'bg-[#F5F5F5]')} />

          {/* Active Section */}
          <button
            onClick={() => scrollToSection(navItems[activeIndex].id)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/5 transition-colors min-w-[100px]"
          >
            <ActiveIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{navItems[activeIndex]?.label}</span>
          </button>

          <div className={cn('w-px h-6 opacity-30', isBeauty ? 'bg-[#2C2416]' : 'bg-[#F5F5F5]')} />

          {/* Theme Toggle */}
          <button
            onClick={() => onThemeChange(isBeauty ? 'barista' : 'beautician')}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors',
              isBeauty ? 'text-[#C9A87C]' : 'text-[#D7A86E]'
            )}
            type="button"
          >
            {isBeauty ? <Sparkles className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Bottom Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'md:hidden fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 z-50 shadow-2xl border-t',
                isBeauty ? 'bg-[#FAF7F4] border-[#C9A87C]/20' : 'bg-[#1A1512] border-[#D7A86E]/20'
              )}
            >
              <div className="flex justify-center mb-4">
                <div className={cn('w-12 h-1 rounded-full', isBeauty ? 'bg-[#C9A87C]/30' : 'bg-[#D7A86E]/30')} />
              </div>
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-2xl text-left transition-all',
                      navClass,
                      activeIndex === index 
                        ? (isBeauty ? 'bg-[#C9A87C]/20' : 'bg-[#D7A86E]/20')
                        : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-opacity-20">
                <p className={cn('text-xs uppercase tracking-wider mb-2 opacity-60', navClass)}>View Mode</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onThemeChange('beautician')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all',
                      isBeauty 
                        ? 'bg-[#C9A87C] text-white' 
                        : 'bg-black/5 opacity-60'
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                    Beauty
                  </button>
                  <button
                    onClick={() => onThemeChange('barista')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all',
                      !isBeauty 
                        ? 'bg-[#D7A86E] text-[#1A1512]' 
                        : 'bg-black/5 opacity-60'
                    )}
                  >
                    <Coffee className="w-4 h-4" />
                    Coffee
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}