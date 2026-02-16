'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export default function FormSheet({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  theme = 'barista', 
  children 
}: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollY = String(scrollY);

    return () => {
      const saved = parseInt(document.body.dataset.scrollY || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      delete document.body.dataset.scrollY;
      window.scrollTo(0, saved);
    };
  }, [isOpen]);

  // Handle wheel events explicitly
  useEffect(() => {
    if (!isOpen) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow default scroll behavior within the container
      e.stopPropagation();
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  const colors = {
    bg: theme === 'beautician' ? 'bg-[#FAF7F4]' : 'bg-[#0a0a0a]',
    border: theme === 'beautician' ? 'border-[#E8D5C4]' : 'border-[#2C2416]',
    text: theme === 'beautician' ? 'text-[#2C2416]' : 'text-[#F5F5F5]',
    accent: 'text-[#C9A87C]',
    muted: theme === 'beautician' ? 'text-[#A67C52]' : 'text-[#A67C52]',
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[640px] ${colors.bg} border-l ${colors.border} z-[101] shadow-2xl flex flex-col`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-8 pb-6 border-b ${colors.border} flex-shrink-0`}>
          <div>
            <div className={`flex items-center gap-2 mb-2 ${colors.accent}`}>
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase">Book Your Session</span>
            </div>
            <h2 className={`font-display text-3xl ${colors.text}`} style={{ fontFamily: 'Playfair Display, serif' }}>
              {title}
            </h2>
            {subtitle && <p className={`mt-2 ${colors.muted} text-sm`}>{subtitle}</p>}
          </div>
          
          <button onClick={onClose} className={`p-3 rounded-full border ${colors.border} ${colors.text} hover:bg-[#C9A87C] hover:text-white transition-all`}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-8"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          {children}
          <div className="h-20" />
        </div>
      </motion.div>
    </>
  );
}