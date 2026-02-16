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

export function PillNav({ currentTheme, onThemeChange, isScrolled }: PillNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Section tracking with IntersectionObserver
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
      setIsMobileMenuOpen(false);
    }
  };

  const isBeauty = currentTheme === 'beautician';

  const navClass = isBeauty
    ? 'bg-[#FAF7F4]/98 border-[#C9A87C]/30 text-[#2C2416]'
    : 'bg-[#1A1512]/98 border-[#D7A86E]/30 text-[#F5F5F5]';

  const menuClass = isBeauty
    ? 'bg-[#FAF7F4] border-[#C9A87C]/20'
    : 'bg-[#1A1512] border-[#D7A86E]/20';

  const ActiveIcon = navItems[activeIndex]?.icon || Home;

  return (
    <>
      {/* Desktop Navigation */}
      <div
        className={cn(
          'hidden md:flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl border shadow-lg transition-all duration-500',
          navClass,
          isScrolled ? 'scale-[0.98]' : 'scale-100'
        )}
      >
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
        >
          {isBeauty ? <Coffee className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          <span className="hidden lg:inline">{isBeauty ? 'Coffee' : 'Beauty'}</span>
        </button>
      </div>

      {/* Mobile Navigation - Fixed Layout */}
      <div className="md:hidden flex items-center gap-2">
        {/* Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-xl border shadow-lg shrink-0',
            navClass
          )}
          aria-label="Toggle menu"
          type="button"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Active Section Display */}
        <div
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-3 rounded-full backdrop-blur-xl border shadow-lg min-w-[120px]',
            navClass
          )}
        >
          <ActiveIcon className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium truncate">
            {navItems[activeIndex]?.label}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => onThemeChange(isBeauty ? 'barista' : 'beautician')}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-xl border shadow-lg shrink-0',
            navClass,
            isBeauty ? 'text-[#C9A87C]' : 'text-[#D7A86E]'
          )}
          aria-label="Toggle theme"
          type="button"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTheme}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isBeauty ? <Sparkles className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'md:hidden fixed left-4 right-4 top-20 rounded-3xl p-6 z-50 shadow-2xl border mx-auto max-w-sm',
                menuClass
              )}
            >
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300',
                      navClass,
                      activeIndex === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    <div className={cn('p-2 rounded-full', isBeauty ? 'bg-[#C9A87C]/20' : 'bg-[#D7A86E]/20')}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">{item.label}</span>
                    </div>
                  </motion.button>
                ))}

                <div className={cn('h-px my-3 opacity-20', isBeauty ? 'bg-[#2C2416]' : 'bg-[#F5F5F5]')} />

                <div className="px-1">
                  <p className={cn('text-xs uppercase tracking-wider mb-3 font-bold opacity-60', navClass)}>
                    View Mode
                  </p>
                  <div className={cn('flex items-center rounded-full p-1 gap-1 border', isBeauty ? 'bg-[#EDE5DE] border-[#C9A87C]/30' : 'bg-[#2C2416] border-[#D7A86E]/30')}>
                    <button
                      type="button"
                      onClick={() => onThemeChange('beautician')}
                      className={cn(
                        'flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-1',
                        isBeauty ? 'bg-[#C9A87C] text-white' : 'text-[#2C2416]/60'
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Beauty
                    </button>
                    <button
                      type="button"
                      onClick={() => onThemeChange('barista')}
                      className={cn(
                        'flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-1',
                        !isBeauty ? 'bg-[#D7A86E] text-[#1A1512]' : 'text-[#F5F5F5]/60'
                      )}
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      Coffee
                    </button>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}