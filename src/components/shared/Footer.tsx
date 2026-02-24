'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Music2, 
  MessageCircle,
  Heart,
  Sparkles,
  Coffee,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Footer() {
  const [theme, setTheme] = useState<'beautician' | 'barista' | 'default'>('default');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateTheme = () => {
      const current = document.documentElement.getAttribute('data-theme') as 'beautician' | 'barista' | 'default';
      if (current) setTheme(current);
    };

    updateTheme();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isBeautician = theme === 'beautician';
  const isBarista = theme === 'barista';

  // Enhanced theme colors with hover states for premium interactions
  const colors = {
    bg: isBeautician ? 'bg-[#FAF7F4]' : 'bg-[#050505]',
    text: isBeautician ? 'text-[#2C2416]' : 'text-white',
    muted: isBeautician ? 'text-[#2C2416]/50' : 'text-white/50',
    accent: isBeautician ? 'text-[#C9A87C]' : 'text-[#D7A86E]',
    accentHover: isBeautician ? 'hover:text-[#B8986C]' : 'hover:text-[#E8B87E]',
    border: isBeautician ? 'border-[#C9A87C]/20' : 'border-white/10',
    divider: isBeautician ? 'from-[#C9A87C]/0 via-[#C9A87C]/40 to-[#C9A87C]/0' : 'from-[#D7A86E]/0 via-[#D7A86E]/40 to-[#D7A86E]/0',
    socialBg: isBeautician ? 'bg-[#C9A87C]/5 hover:bg-[#C9A87C]/15' : 'bg-white/5 hover:bg-white/10',
    socialBorder: isBeautician ? 'border-[#C9A87C]/20 hover:border-[#C9A87C]/60' : 'border-white/10 hover:border-[#D7A86E]/60',
    socialIcon: isBeautician ? 'text-[#C9A87C]' : 'text-[#D7A86E]',
    glow: isBeautician ? 'group-hover:shadow-[#C9A87C]/20' : 'group-hover:shadow-[#D7A86E]/20',
  };

  const socials = [
    { icon: Instagram, href: 'https://www.instagram.com/sanam_saru/?hl=en', label: 'Personal', handle: '@kamala.saru' },
    { icon: Instagram, href: 'https://www.instagram.com/sis_tersbeautycorner/?hl=en', label: 'Work', handle: '@sisterbeautycorner' },
    { icon: Facebook, href: 'https://www.facebook.com/makeupwith.sanam', label: 'Facebook', handle: 'Kamala Saru' },
    { icon: Music2, href: 'https://www.tiktok.com/@san_aam', label: 'TikTok', handle: '@kamalasaru' },
    { icon: MessageCircle, href: 'https://wa.me/qr/N5RYHGQDGDKWI1', label: 'WhatsApp', handle: '+977 9821407395' },
  ];

  // Animation variants for staggered reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for premium feel
      }
    }
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4 + (i * 0.05),
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1] // Slight overshoot for playful bounce
      }
    })
  };

  return (
    <footer className={cn(
      "relative overflow-hidden transition-colors duration-700 ease-out",
      colors.bg
    )}>
      {/* Premium Gradient Divider Line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-px bg-gradient-to-r",
        colors.divider
      )} />

      <motion.div 
        className="max-w-7xl mx-auto px-6 py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={prefersReducedMotion ? undefined : containerVariants}
      >
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          
          {/* Left: Brand Identity & Storytelling (5 cols) */}
          <motion.div 
            className="md:col-span-5 space-y-6"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            <div className="space-y-2">
              <motion.h3 
                className={cn(
                  "font-display text-3xl md:text-4xl font-bold tracking-tight",
                  colors.text
                )}
                whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                transition={{ duration: 0.3 }}
              >
                Kamala Saru
              </motion.h3>
              
              {/* Theme-aware Tagline for Storytelling Continuity */}
              <p className={cn(
                "text-sm font-medium tracking-wide uppercase",
                colors.muted
              )}>
                {isBeautician ? 'Beauty Artisan & Care Specialist' : 
                 isBarista ? 'Coffee Craftsman & Barista' : 
                 'Beauty & Coffee Artisan'}
              </p>
            </div>

            {/* Animated Theme Indicator with Storytelling */}
            <motion.div 
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm",
                isBeautician 
                  ? "border-[#C9A87C]/30 bg-[#C9A87C]/5" 
                  : "border-[#D7A86E]/30 bg-[#D7A86E]/5"
              )}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={prefersReducedMotion ? undefined : { 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3 
                }}
              >
                {isBeautician ? <Sparkles size={14} className="text-[#C9A87C]" /> : 
                 <Coffee size={14} className="text-[#D7A86E]" />}
              </motion.div>
              <span className={cn(
                "text-xs font-semibold uppercase tracking-widest",
                colors.accent
              )}>
                {isBeautician ? 'Currently: Beautician Mode' : 
                 isBarista ? 'Currently: Barista Mode' : 
                 'Dual Artisan'}
              </span>
            </motion.div>

            {/* Contact Details with Hover Micro-interactions */}
            <div className="space-y-3 pt-2">
              <motion.a 
                href="mailto:sanam@kamalasaru.com.np" 
                className={cn(
                  "group flex items-center gap-2 text-sm transition-all duration-300",
                  colors.muted,
                  colors.accentHover
                )}
                whileHover={prefersReducedMotion ? undefined : { x: 4 }}
              >
                <Mail size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="relative">
                  sanam@kamalasaru.com.np
                  <span className={cn(
                    "absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover:w-full",
                    isBeautician ? "bg-[#C9A87C]" : "bg-[#D7A86E]"
                  )} />
                </span>
              </motion.a>
              
              <motion.div 
                className={cn(
                  "flex items-center gap-2 text-sm",
                  colors.muted
                )}
                variants={prefersReducedMotion ? undefined : itemVariants}
              >
                <MapPin size={14} className="opacity-60" />
                <span>Butwal, Nepal</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Center: Social Constellation (4 cols) */}
          <motion.div 
            className="md:col-span-4 flex flex-col items-center md:items-start space-y-4"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            <h4 className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              colors.muted
            )}>
              Connect
            </h4>
            
            {/* Social Dock with Magnetic Hover Effect */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {socials.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={index}
                  variants={prefersReducedMotion ? undefined : socialVariants}
                  whileHover={prefersReducedMotion ? undefined : { 
                    y: -4, 
                    scale: 1.15,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "group relative w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500",
                    colors.socialBg,
                    colors.socialBorder,
                    colors.socialIcon,
                    "hover:shadow-lg",
                    colors.glow
                  )}
                  aria-label={`${social.label} - ${social.handle}`}
                >
                  <social.icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                  
                  {/* Tooltip Handle on Hover */}
                  <span className={cn(
                    "absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none",
                    isBeautician ? "bg-[#2C2416] text-[#FAF7F4]" : "bg-white text-[#050505]"
                  )}>
                    {social.handle}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Storytelling Closing Statement */}
            <p className={cn(
              "text-xs italic leading-relaxed max-w-xs text-center md:text-left mt-4",
              colors.muted
            )}>
              "Crafting beauty in every cup and every touch. 
              {isBeautician ? ' Where elegance meets expertise.' : 
               isBarista ? ' Where passion meets precision.' : 
               ' Welcome to my craft.'}"
            </p>
          </motion.div>

          {/* Right: Credits & Navigation (3 cols) */}
          <motion.div 
            className="md:col-span-3 flex flex-col items-center md:items-end justify-between h-full space-y-8 md:space-y-0"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            {/* Back to Top Indicator */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={cn(
                "group flex items-center gap-2 text-xs font-medium uppercase tracking-widest transition-colors",
                colors.muted,
                colors.accentHover
              )}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              aria-label="Scroll to top"
            >
              <span>Return to Top</span>
              <motion.span
                animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight size={14} className="rotate-[-45deg]" />
              </motion.span>
            </motion.button>

            {/* Copyright Block */}
            <div className={cn(
              "flex flex-col items-center md:items-end text-xs gap-3",
              colors.muted
            )}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                <span>© {new Date().getFullYear()} Kamala Saru</span>
              </div>
              
              <motion.p 
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              >
                <span>Crafted with</span>
                <motion.span
                  animate={prefersReducedMotion ? undefined : { 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    repeatDelay: 2 
                  }}
                >
                  <Heart size={10} className="text-red-500 fill-current" />
                </motion.span>
                <span>by</span>
                <a 
                  href="https://bishalkhatri.info.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "font-semibold underline-offset-4 hover:underline transition-all",
                    colors.accent
                  )}
                >
                  Bishal Khatri
                </a>
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Decorative Element - Subtle Grid Pattern */}
        <motion.div 
          className={cn(
            "mt-16 pt-8 border-t",
            colors.border
          )}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em]">
            <span className={colors.muted}>Est. Butwal</span>
            <div className={cn(
              "flex gap-4",
              colors.muted
            )}>
              <span>Precision</span>
              <span className="opacity-30">•</span>
              <span>Passion</span>
              <span className="opacity-30">•</span>
              <span>Presence</span>
            </div>
            <span className={colors.muted}>Nepal</span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
