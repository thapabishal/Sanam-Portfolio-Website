'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Clock, Sparkles, Calendar, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { getImageUrl } from '@/lib/sanity';
import type { PortfolioItem } from '@/types/sanity.types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { gsap } from 'gsap';

interface PortfolioLightboxProps {
  item: PortfolioItem;
  onClose: () => void;
  onBook: () => void;
}

const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({ item, onClose, onBook }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'process' | 'results'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMounted, setIsMounted] = useState(false);

  // Parallax scroll effect within modal
  const { scrollYProgress } = useScroll({
    container: contentRef
  });
  
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Lock body scroll and handle escape
  useEffect(() => {
    setIsMounted(true);
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    
    // Entrance animation
    if (typeof window !== 'undefined') {
      gsap.fromTo('.lightbox-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
      );
    }

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Smooth parallax on mouse move (subtle, not tilt)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, []);

  const beforeUrl = item.beforeImage ? getImageUrl(item.beforeImage, 1400) : null;
  const afterUrl = item.afterImage ? getImageUrl(item.afterImage, 1400) : null;
  const showSlider = beforeUrl && afterUrl;

  // Narrative sections
  const getProcessSteps = () => {
    switch(item.category) {
      case 'bridal':
        return [
          { step: '01', title: 'Consultation', desc: 'Understanding your vision and skin needs' },
          { step: '02', title: 'Preparation', desc: 'Skin prep and primer application for lasting results' },
          { step: '03', title: 'Creation', desc: 'Layering techniques for luminous, camera-ready finish' }
        ];
      case 'editorial':
        return [
          { step: '01', title: 'Concept', desc: 'Developing the artistic direction with photography team' },
          { step: '02', title: 'Execution', desc: 'High-definition techniques for studio lighting' },
          { step: '03', title: 'Final Touches', desc: 'Setting sprays and touch-ups for endurance' }
        ];
      default:
        return [
          { step: '01', title: 'Analysis', desc: 'Assessment of features and desired outcome' },
          { step: '02', title: 'Technique', desc: 'Application of specialized methods' },
          { step: '03', title: 'Perfection', desc: 'Final adjustments and setting' }
        ];
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#0a0a0a]/95 backdrop-blur-sm"
      >
        {/* Ambient Glow Following Mouse (Subtle) */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(201,169,98,0.3) 0%, transparent 70%)',
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(100px)'
          }}
        />

        {/* Close Button - Fixed Position */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onClose}
          className="fixed top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-black/80 border border-white/10 text-white hover:bg-[#C9A962] hover:text-black hover:border-[#C9A962] transition-all duration-300 shadow-2xl"
          aria-label="Close project view"
        >
          <X size={20} strokeWidth={2.5} />
        </motion.button>

        {/* Save Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsSaved(!isSaved)}
          className="fixed top-6 right-20 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-black/80 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
          aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
        >
          <Bookmark size={18} className={isSaved ? 'fill-[#C9A962] text-[#C9A962]' : ''} />
        </motion.button>

        {/* Main Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-7xl h-[90vh] bg-[#111] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row"
        >
          {/* LEFT: Visual Experience */}
          <div className="relative flex-1 h-[40vh] lg:h-full overflow-hidden bg-black group">
            {/* Parallax Image Container */}
            <motion.div 
              className="absolute inset-0"
              style={{ scale: imageScale }}
            >
              {showSlider ? (
                <BeforeAfterSlider before={beforeUrl} after={afterUrl} isCardView={false} />
              ) : afterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={afterUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  No image available
                </div>
              )}
            </motion.div>

            {/* Semi-transparent Gradient Overlay (READABLE) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none hidden lg:block" />

            {/* Image Navigation Hints */}
            {showSlider && (
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div className="flex items-center gap-3 text-white/80 text-xs uppercase tracking-widest font-bold bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Drag to Compare
                </div>
                
                {/* Mobile-only swipe hint */}
                <div className="lg:hidden text-white/60 text-xs uppercase tracking-widest flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <ChevronLeft size={14} />
                  <ChevronRight size={14} />
                  <span>Slide</span>
                </div>
              </div>
            )}

            {/* Project Title Overlay (on image for mobile) */}
            <div className="absolute top-6 left-6 lg:hidden">
              <span className="inline-block px-3 py-1 bg-[#C9A962] text-black text-[10px] uppercase tracking-widest font-bold rounded-full mb-2">
                {item.category}
              </span>
              <h2 className="font-display text-3xl text-white drop-shadow-lg leading-tight">
                {item.title}
              </h2>
            </div>
          </div>

          {/* RIGHT: Story Content */}
          <motion.div 
            ref={contentRef}
            style={{ opacity: contentOpacity }}
            className="w-full lg:w-[450px] xl:w-[500px] h-full overflow-y-auto bg-[#111] border-l border-white/5 relative scrollbar-hide"
          >
            {/* Content Padding */}
            <div className="p-8 md:p-10 pb-32">
              
              {/* Category & Title - Desktop */}
              <div className="hidden lg:block mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <span className="w-8 h-[2px] bg-[#C9A962]" />
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A962] font-bold">
                    Case Study
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-4xl xl:text-5xl text-white leading-[1.1] mb-2"
                >
                  {item.title}
                </motion.h1>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 mt-4"
                >
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                    {item.category}
                  </span>
                  {item.duration && (
                    <span className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-1">
                      <Clock size={12} />
                      {item.duration}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Story Narrative - No Glass Morphism, Solid Backgrounds */}
              <div className="space-y-8">
                
                {/* The Story Section */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="lightbox-content"
                >
                  <h3 className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={12} className="text-[#C9A962]" />
                    The Story
                  </h3>
                  <p className="text-white/90 font-body text-lg leading-relaxed">
                    {item.description || "Every transformation tells a story of precision meeting artistry. This project showcases the meticulous attention to detail that defines my approach—whether preparing for a bride's special day or creating an editorial masterpiece."}
                  </p>
                </motion.section>

                {/* Process Steps - Timeline Style */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="lightbox-content border-t border-white/5 pt-8"
                >
                  <h3 className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-bold mb-6">
                    The Process
                  </h3>
                  
                  <div className="space-y-6 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#C9A962] via-white/10 to-transparent" />
                    
                    {getProcessSteps().map((step, idx) => (
                      <div key={idx} className="relative pl-12 group cursor-default">
                        {/* Step Number */}
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[#C9A962] font-bold text-xs group-hover:border-[#C9A962]/50 group-hover:bg-[#C9A962]/10 transition-all duration-300">
                          {step.step}
                        </div>
                        
                        <div className="pt-2">
                          <h4 className="text-white font-display text-lg mb-1 group-hover:text-[#C9A962] transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-white/50 text-sm leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Techniques Used */}
                {item.techniques && item.techniques.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="lightbox-content border-t border-white/5 pt-8"
                  >
                    <h3 className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-bold mb-6">
                      Techniques Applied
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.techniques.map((tech, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 hover:bg-[#C9A962]/10 hover:border-[#C9A962]/30 hover:text-[#C9A962] transition-all duration-300 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Chapter Indicator */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-4 py-8 text-white/20 text-[10px] uppercase tracking-[0.3em]"
                >
                  <span className="w-12 h-[1px] bg-white/10" />
                  <span>Chapter of Transformation</span>
                  <span className="w-12 h-[1px] bg-white/10" />
                </motion.div>
              </div>

              {/* Fixed Bottom CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111] via-[#111] to-transparent border-t border-white/5">
                <button 
                  onClick={onBook}
                  className="w-full py-4 bg-[#C9A962] text-[#0a0a0a] font-bold uppercase tracking-[0.2em] text-[11px] rounded-xl hover:bg-white transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(201,169,98,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(201,169,98,0.6)] active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  <Calendar size={16} className="group-hover:rotate-12 transition-transform" />
                  Book This Treatment
                </button>
                <p className="text-center text-white/30 text-[10px] uppercase tracking-widest mt-4">
                  Consultation included with all bookings
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PortfolioLightbox;