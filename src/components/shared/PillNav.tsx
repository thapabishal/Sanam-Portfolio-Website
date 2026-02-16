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

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  theme: Theme;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'hero',
    label: 'Start',
    shortLabel: 'Start',
    icon: <Home className="w-4 h-4" />,
    theme: 'beautician',
    description: 'The beginning'
  },
  {
    id: 'introduction',
    label: 'About',
    shortLabel: 'About',
    icon: <User className="w-4 h-4" />,
    theme: 'beautician',
    description: 'Meet Kamala'
  },
  {
    id: 'philosophy',
    label: 'Philosophy',
    shortLabel: 'Philosophy',
    icon: <Sparkles className="w-4 h-4" />,
    theme: 'beautician',
    description: 'Core beliefs'
  },
  {
    id: 'works',
    label: 'Portfolio',
    shortLabel: 'Work',
    icon: <Palette className="w-4 h-4" />,
    theme: 'beautician',
    description: 'Beauty craft'
  },
  {
    id: 'training',
    label: 'Training',
    shortLabel: 'Skills',
    icon: <GraduationCap className="w-4 h-4" />,
    theme: 'barista',
    description: 'Coffee mastery'
  },
  {
    id: 'timeline',
    label: 'Journey',
    shortLabel: 'Journey',
    icon: <MapPin className="w-4 h-4" />,
    theme: 'barista',
    description: 'Path through time'
  },
  {
    id: 'testimonials',
    label: 'Stories',
    shortLabel: 'Stories',
    icon: <Quote className="w-4 h-4" />,
    theme: 'barista',
    description: 'Client voices'
  },
  {
    id: 'contact',
    label: 'Connect',
    shortLabel: 'Connect',
    icon: <Mail className="w-4 h-4" />,
    theme: 'barista',
    description: 'Get in touch'
  },
];

export function PillNav({
  currentTheme,
  onThemeChange,
  isScrolled,
}: PillNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, height: 0, top: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updatePillPosition = useCallback(() => {
    if (!isMounted) return;
    
    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    const button = buttonsRef.current[targetIndex];
    const container = containerRef.current;

    if (button && container) {
      const buttonRect = button.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const left = buttonRect.left - containerRect.left;
      const top = buttonRect.top - containerRect.top;

      setPillStyle({ left, width: buttonRect.width, height: buttonRect.height, top });
    }
  }, [activeIndex, hoveredIndex, isMounted]);

  useEffect(() => {
    if (isMounted) {
      updatePillPosition();
      window.addEventListener('resize', updatePillPosition);
      return () => window.removeEventListener('resize', updatePillPosition);
    }
  }, [updatePillPosition, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const timer = setTimeout(() => {
      const options = {
        root: null,
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0,
      };

      observerRef.current = new IntersectionObserver((entries) => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        
        if (visibleEntries.length > 0) {
          const targetId = visibleEntries[0].target.id;
          const index = navItems.findIndex(item => item.id === targetId);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      }, options);

      navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section && observerRef.current) {
          observerRef.current.observe(section);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isMounted]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const getThemeStyles = () => {
    switch (currentTheme) {
      case 'beautician':
        return {
          nav: 'bg-[#FAF7F4]/98 border-[#C9A87C]/30 shadow-lg',
          text: 'text-[#2C2416]',
          muted: 'text-[#2C2416]/60',
          pill: 'bg-[#C9A87C]/25',
          activeText: 'text-[#2C2416]',
          underline: 'bg-[#C9A87C]',
          mobileBg: 'bg-[#FAF7F4]',
          mobileBorder: 'border-[#C9A87C]/20',
          toggle: {
            bg: 'bg-[#EDE5DE]',
            active: 'bg-[#C9A87C] text-white shadow-md',
            inactive: 'text-[#2C2416]/60 hover:text-[#2C2416] hover:bg-[#C9A87C]/10'
          }
        };
      case 'barista':
        return {
          nav: 'bg-[#1A1512]/98 border-[#D7A86E]/30 shadow-lg',
          text: 'text-[#F5F5F5]',
          muted: 'text-[#F5F5F5]/60',
          pill: 'bg-[#D7A86E]/20',
          activeText: 'text-white',
          underline: 'bg-[#D7A86E]',
          mobileBg: 'bg-[#1A1512]',
          mobileBorder: 'border-[#D7A86E]/20',
          toggle: {
            bg: 'bg-[#2C2416]',
            active: 'bg-[#D7A86E] text-[#1A1512] shadow-md',
            inactive: 'text-[#D7A86E]/60 hover:text-[#D7A86E] hover:bg-[#D7A86E]/10'
          }
        };
    }
  };

  const styles = getThemeStyles();

  const ThemeToggle = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "flex items-center rounded-full p-1 gap-1 border",
      isMobile ? "w-full" : "",
      styles.toggle.bg,
      currentTheme === 'beautician' ? 'border-[#C9A87C]/30' : 'border-[#D7A86E]/30'
    )}>
      <button
        type="button"
        onClick={() => onThemeChange('beautician')}
        className={cn(
          "flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
          currentTheme === 'beautician' ? styles.toggle.active : styles.toggle.inactive,
          isMobile && "flex-1"
        )}
        aria-pressed={currentTheme === 'beautician'}
        aria-label="Switch to Beautician mode"
        style={{ touchAction: 'manipulation' }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Beauty</span>
      </button>

      <button
        type="button"
        onClick={() => onThemeChange('barista')}
        className={cn(
          "flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
          currentTheme === 'barista' ? styles.toggle.active : styles.toggle.inactive,
          isMobile && "flex-1"
        )}
        aria-pressed={currentTheme === 'barista'}
        aria-label="Switch to Barista mode"
        style={{ touchAction: 'manipulation' }}
      >
        <Coffee className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Coffee</span>
      </button>
    </div>
  );

  return (
    <div className="relative inline-block">
      {/* Desktop Navigation */}
      <div
        ref={containerRef}
        className={cn(
          'hidden md:flex items-center gap-1 relative px-2 py-2 rounded-full backdrop-blur-xl border transition-all duration-500',
          styles.nav,
          isScrolled ? 'shadow-2xl scale-[0.98]' : 'scale-100'
        )}
      >
        {isMounted && (
          <div
            className={cn('pill-indicator absolute rounded-full pointer-events-none z-0 transition-all duration-400 ease-out', styles.pill)}
            style={{ 
              left: pillStyle.left, 
              top: pillStyle.top, 
              width: pillStyle.width, 
              height: pillStyle.height 
            }}
          />
        )}

        <nav className="flex items-center gap-0.5 relative z-10" aria-label="Main navigation">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => { buttonsRef.current[index] = el; }}
              type="button"
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap group',
                (activeIndex === index || hoveredIndex === index) ? styles.activeText : styles.muted
              )}
              aria-current={activeIndex === index ? 'page' : undefined}
              title={item.description}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {item.icon}
              </span>
              <span className="hidden lg:inline">{item.label}</span>
              <span className="lg:hidden">{item.shortLabel}</span>

              <span className={cn(
                "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ease-out w-0 group-hover:w-4/5 opacity-0 group-hover:opacity-100",
                styles.underline,
                activeIndex === index && "w-4/5 opacity-100"
              )} />
            </button>
          ))}
        </nav>

        <div className={cn('w-px h-5 mx-2 opacity-30', styles.text)} />

        <ThemeToggle />
      </div>

      {/* Mobile Navigation - Simple flex, no complex layouts */}
      <div className="md:hidden flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg',
            styles.nav,
            styles.text
          )}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          style={{ touchAction: 'manipulation' }}
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

        <div className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-xl border text-sm font-medium shadow-lg transition-all duration-300',
          styles.nav,
          styles.text
        )}>
          <span>{navItems[activeIndex]?.icon}</span>
          <span>{navItems[activeIndex]?.label || 'Menu'}</span>
        </div>

        <button
          type="button"
          onClick={() => onThemeChange(currentTheme === 'barista' ? 'beautician' : 'barista')}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg',
            styles.nav,
            currentTheme === 'barista' ? 'text-[#D7A86E]' : 'text-[#C9A87C]'
          )}
          aria-label={`Switch to ${currentTheme === 'barista' ? 'Beautician' : 'Barista'} mode`}
          style={{ touchAction: 'manipulation' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTheme}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentTheme === 'barista' ? <Coffee className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
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
              aria-hidden="true"
            />

            <motion.div
              id="mobile-menu"
              initial={{ y: -30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'md:hidden fixed left-4 right-4 top-20 rounded-3xl p-6 z-50 shadow-2xl border mx-auto max-w-sm',
                styles.mobileBg,
                styles.mobileBorder
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
                      'flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 group',
                      activeIndex === index
                        ? (currentTheme === 'beautician'
                          ? 'bg-[#C9A87C]/20 text-[#2C2416]'
                          : 'bg-[#D7A86E]/20 text-white')
                        : (currentTheme === 'beautician'
                          ? 'text-[#2C2416]/70 hover:bg-[#C9A87C]/10 hover:text-[#2C2416]'
                          : 'text-[#F5F5F5]/70 hover:bg-[#D7A86E]/10 hover:text-[#F5F5F5]')
                    )}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div className={cn(
                      'p-2 rounded-full transition-all duration-300 shrink-0',
                      activeIndex === index
                        ? (currentTheme === 'beautician'
                          ? 'bg-[#C9A87C] text-white'
                          : 'bg-[#D7A86E] text-black')
                        : 'bg-white/10 group-hover:scale-110'
                    )}>
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">{item.label}</span>
                      <span className={cn(
                        'text-xs',
                        currentTheme === 'beautician' ? 'text-[#2C2416]/50' : 'text-white/50'
                      )}>
                        {item.description}
                      </span>
                    </div>

                    {activeIndex === index && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={cn(
                          "ml-auto w-2 h-2 rounded-full",
                          currentTheme === 'beautician' ? 'bg-[#C9A87C]' : 'bg-[#D7A86E]'
                        )}
                      />
                    )}
                  </motion.button>
                ))}

                <div className={cn('h-px my-3 opacity-20', styles.text)} />

                <div className="px-1">
                  <p className={cn('text-xs uppercase tracking-wider mb-3 font-bold opacity-60', styles.text)}>
                    View Mode
                  </p>
                  <ThemeToggle isMobile />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>'use client';

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

  // IntersectionObserver for section tracking
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = navItems.findIndex(item => item.id === entry.target.id);
          if (index !== -1) setActiveIndex(index);
        }
      });
    }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });

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

  const Icon = navItems[activeIndex]?.icon || Home;

  return (
    <>
      {/* Desktop - Simple centered flex */}
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
      </div>

      {/* Mobile - CSS Grid for perfect alignment */}
      <div 
        className="md:hidden grid gap-2"
        style={{ 
          gridTemplateColumns: '48px 1fr 48px',
          width: 'fit-content',
          margin: '0 auto'
        }}
      >
        {/* Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            'w-12 h-12 rounded-full backdrop-blur-xl border shadow-lg flex items-center justify-center',
            navClass
          )}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Active Section - Fixed width, not flex-grow */}
        <div 
          className={cn(
            'rounded-full backdrop-blur-xl border shadow-lg flex items-center justify-center gap-2 text-sm font-medium px-4',
            navClass
          )}
          style={{ minWidth: '120px', maxWidth: '200px' }}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="truncate">{navItems[activeIndex]?.label}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => onThemeChange(isBeauty ? 'barista' : 'beautician')}
          className={cn(
            'w-12 h-12 rounded-full backdrop-blur-xl border shadow-lg flex items-center justify-center',
            navClass,
            isBeauty ? 'text-[#C9A87C]' : 'text-[#D7A86E]'
          )}
          aria-label="Toggle theme"
        >
          {isBeauty ? <Sparkles className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
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
                menuClass
              )}
              style={{ maxWidth: '400px', margin: '0 auto' }}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl w-full text-left transition-colors',
                    navClass
                  )}
                >
                  <item.icon className="w-4 h-4" />
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
  );
}