'use client';

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSanity, queries } from '@/hooks/useSanity';
import { getImageUrl } from '@/lib/sanity';
import type { TimelineEvent } from '@/types/sanity.types';
import { cn } from '@/lib/utils';
import { 
  Award, 
  Building2, 
  Star, 
  GraduationCap, 
  Briefcase,
  Calendar,
  ChevronDown,
  X,
  ZoomIn,
  MapPin,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
/* CATEGORY CONFIGURATION */
// ============================================================================

type CategoryType = 'certification' | 'experience' | 'milestone' | 'training' | 'education';

interface CategoryConfig {
  icon: React.ElementType;
  label: string;
  color: string;
  subtleColor: string;
}

const categoryStyles: Record<string, CategoryConfig> = {
  certification: {
    icon: Award,
    label: 'Certification',
    color: 'text-amber-400',
    subtleColor: 'bg-amber-400/5 border-amber-400/10'
  },
  experience: {
    icon: Building2,
    label: 'Experience',
    color: 'text-[var(--accent-primary)]',
    subtleColor: 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/10'
  },
  milestone: {
    icon: Star,
    label: 'Milestone',
    color: 'text-purple-400',
    subtleColor: 'bg-purple-400/5 border-purple-400/10'
  },
  training: {
    icon: GraduationCap,
    label: 'Training',
    color: 'text-blue-400',
    subtleColor: 'bg-blue-400/5 border-blue-400/10'
  },
  education: {
    icon: Briefcase,
    label: 'Education',
    color: 'text-emerald-400',
    subtleColor: 'bg-emerald-400/5 border-emerald-400/10'
  }
};

const defaultCategory: CategoryConfig = {
  icon: Building2,
  label: 'Experience',
  color: 'text-[var(--accent-primary)]',
  subtleColor: 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/10'
};

// ============================================================================
/* LIGHTBOX - Fixed backdrop click and hooks safety */
// ============================================================================

interface LightboxProps {
  image: string | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateLightbox = ({ image, title, isOpen, onClose }: LightboxProps) => {
  // Handle escape key - safely at top level
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => { 
      document.body.style.overflow = ''; 
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Fix: Proper backdrop click handler
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Don't render anything if not open (AnimatePresence will handle exit animation)
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl cursor-zoom-out"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <motion.button 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        onClick={(e) => { 
          e.stopPropagation();
          onClose(); 
        }}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 backdrop-blur-md group"
        aria-label="Close certificate view"
      >
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      {/* Certificate Container - stops propagation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {image && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={image} 
              alt={`${title} certificate`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))',
              }}
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-16 left-0 right-0 text-center"
            >
              <h3 className="text-white font-display text-xl md:text-2xl tracking-wide mb-1">{title}</h3>
              <p className="text-white/50 text-sm font-accent italic">
                Click anywhere outside to close or press ESC
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
/* TIMELINE CARD - Safe hook usage */
// ============================================================================

interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
  isLeft: boolean;
  isLast: boolean;
  onImageClick: (image: string, title: string) => void;
}

const TimelineCard = ({ event, index, isLeft, isLast, onImageClick }: TimelineCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const categoryKey = (event?.category as CategoryType) || 'experience';
  const config = categoryStyles[categoryKey] || defaultCategory;
  const Icon = config.icon;
  
  const monthNames: Record<string, string> = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
  };
  
  const dateDisplay = event?.month && monthNames[event.month]
    ? `${monthNames[event.month]} ${event.year || ''}`
    : event?.year || '';

  // Safe image URL generation
  const imageUrl = useMemo(() => {
    if (!event?.image || imageError) return null;
    try {
      return getImageUrl(event.image, 800, 600, 85);
    } catch (e) {
      return null;
    }
  }, [event?.image, imageError]);

  const thumbnailUrl = useMemo(() => {
    if (!event?.image || imageError) return null;
    try {
      return getImageUrl(event.image, 400, 300, 75);
    } catch (e) {
      return null;
    }
  }, [event?.image, imageError]);

  const handleImageClick = useCallback(() => {
    if (imageUrl) onImageClick(imageUrl, event.title || 'Certificate');
  }, [imageUrl, event.title, onImageClick]);

  if (!event) return null;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        'relative md:w-[calc(50%-60px)] w-full',
        isLeft ? 'md:mr-auto' : 'md:ml-auto',
        'mb-12 md:mb-16'
      )}
    >
      {/* Desktop Timeline Node */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ delay: 0.3 + (index * 0.1), type: 'spring', stiffness: 200, damping: 15 }}
        className={cn(
          'hidden md:flex absolute top-6 w-12 h-12 rounded-full border-2 z-20 items-center justify-center backdrop-blur-sm',
          'bg-[var(--bg-card)] border-[var(--border-default)]',
          isLeft ? 'right-[-84px]' : 'left-[-84px]'
        )}
        style={{
          boxShadow: isInView ? `0 0 20px ${isLeft ? 'rgba(201, 168, 124, 0.3)' : 'rgba(215, 168, 110, 0.3)'}` : 'none'
        }}
      >
        <Icon className={cn("w-5 h-5", config.color)} />
      </motion.div>

      {/* Mobile Timeline Line */}
      <div className="md:hidden absolute left-[22px] top-12 bottom-[-48px] w-px bg-gradient-to-b from-[var(--accent-primary)]/30 to-transparent" />
      
      <motion.div 
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className={cn(
          "md:hidden absolute left-0 top-0 w-11 h-11 rounded-full border flex items-center justify-center z-10 bg-[var(--bg-card)]",
          "border-[var(--border-default)]",
          config.subtleColor
        )}
      >
        <Icon className={cn("w-4 h-4", config.color)} />
      </motion.div>

      {/* Card Container */}
      <motion.div 
        className={cn(
          "relative bg-[var(--bg-card)]/40 backdrop-blur-sm rounded-xl overflow-hidden",
          "border border-[var(--border-default)]",
          "transition-all duration-500",
          "md:ml-0 ml-12",
          "hover:border-[var(--accent-primary)]/30 hover:shadow-lg hover:shadow-[var(--accent-primary)]/5"
        )}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact Image Section */}
        {thumbnailUrl && (
          <div 
            className="relative w-full aspect-[4/3] max-h-[240px] overflow-hidden bg-[var(--bg-page)] group cursor-pointer"
            onClick={handleImageClick}
          >
            <motion.img
              src={thumbnailUrl}
              alt={`${event.title || 'Certificate'} thumbnail`}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </motion.div>

            <div className="absolute top-3 left-3">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border backdrop-blur-md",
                "bg-[var(--bg-card)]/90 border-[var(--border-default)] text-[var(--text-muted)]"
              )}>
                <config.icon className={cn("w-3 h-3", config.color)} />
                {config.label}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)]">
            <Clock className="w-3 h-3" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium">{dateDisplay}</span>
          </div>

          <h3 className="font-display text-lg md:text-xl text-[var(--text-primary)] mb-2 leading-tight tracking-tight">
            {event.title || 'Untitled'}
          </h3>

          <div className="relative">
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, height: 'auto' }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3 text-[var(--text-secondary)] text-sm leading-relaxed">
                    <p>{event.description}</p>
                    
                    {event.fullStory && (
                      <div className="space-y-2 border-l border-[var(--accent-primary)]/20 pl-3 mt-3">
                        {event.fullStory.map((block: any, idx: number) => (
                          <motion.p 
                            key={idx}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="text-[var(--text-muted)] text-xs leading-relaxed"
                          >
                            {block.children?.[0]?.text}
                          </motion.p>
                        ))}
                      </div>
                    )}
                    
                    {event.metrics && (
                      <div className="mt-4 p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-default)]">
                        <div className="flex items-center gap-3">
                          <span className={cn("text-2xl font-display", config.color)}>
                            {event.metrics.number}
                          </span>
                          <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider leading-tight">
                            {event.metrics.label}
                          </span>
                        </div>
                      </div>
                    )}

                    {event.link?.url && (
                      <a 
                        href={event.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors text-xs uppercase tracking-wider font-medium group"
                      >
                        {event.link.text || 'View details'}
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-300 group"
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? 'Show Less' : 'Read Story'}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Connector Line */}
      {!isLast && (
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "hidden md:block absolute top-full w-px h-8 origin-top bg-gradient-to-b from-[var(--border-default)] to-transparent",
            isLeft ? 'right-[-72px]' : 'left-[-72px]'
          )}
        />
      )}
    </motion.div>
  );
};

// ============================================================================
/* PREMIUM PRESENT MARKER */
// ============================================================================

const PresentMarker = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
      className="relative flex flex-col items-center pt-8 pb-4"
    >
      <div className="relative">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-6 h-6 rounded-full bg-[var(--accent-primary)] blur-xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute inset-0 w-6 h-6 rounded-full bg-[var(--accent-secondary)] blur-lg"
        />
        
        <div className="relative w-4 h-4 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-lg">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-[var(--accent-primary)]"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 px-4 py-2 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--bg-card)]/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent-primary)]">
            Present Day
          </span>
          <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-16 h-px mt-3 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent origin-center"
      />
      
      <p className="mt-3 text-[10px] text-[var(--text-muted)] italic font-accent">
        The story continues...
      </p>
    </motion.div>
  );
};

// ============================================================================
/* MAIN SECTION - Crash Free */
// ============================================================================

export function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState('');
  
  const { data: events, loading, error } = useSanity<TimelineEvent[]>({
    query: queries.timeline,
  });

  // SAFE: All scroll hooks at top level, outside of loops
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothProgress = useSpring(lineProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  // Convert motion value to regular value for the orb position
  const [lineHeight, setLineHeight] = useState("0%");
  
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      setLineHeight(`${latest}%`);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  const sortedEvents = useMemo(() => {
    if (!events || !Array.isArray(events)) return [];
    return [...events].sort((a: TimelineEvent, b: TimelineEvent) => {
      if (a.year !== b.year) return (a.year || 0) - (b.year || 0);
      if (a.month && b.month) return parseInt(a.month) - parseInt(b.month);
      return 0;
    });
  }, [events]);

  // Header entrance
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const openLightbox = useCallback((image: string, title: string) => {
    setLightboxImage(image);
    setLightboxTitle(title);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxImage(null), 300);
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-[var(--bg-page)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full border border-[var(--accent-primary)] border-t-transparent" 
          />
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] font-accent">Loading Journey</span>
        </div>
      </section>
    );
  }

  if (error || !sortedEvents.length) {
    return (
      <section id="timeline" className="py-32 bg-[var(--bg-page)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-[var(--text-primary)] mb-4">The Journey</h2>
          <p className="text-[var(--text-secondary)]">Timeline coming soon...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section 
        ref={sectionRef}
        id="timeline"
        className="relative py-24 md:py-32 bg-[var(--bg-page)] overflow-hidden transition-colors duration-700"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10">
          <div ref={headerRef} className="text-center mb-16 md:mb-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--accent-primary)]/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]/60" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--accent-primary)]/50" />
            </motion.div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] mb-4 tracking-tight">
              The <span className="italic text-[var(--accent-primary)]">Journey</span>
            </h2>
            
            <p className="font-accent italic text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-6">
              From foundational training to mastery—a chronicle of growth, 
              dedication, and the pursuit of excellence.
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[var(--text-muted)] text-[10px] uppercase tracking-[0.2em]">
              <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
              <span>{sortedEvents.length} Chapters</span>
              <span className="opacity-30">•</span>
              <span>2014 — Present</span>
            </div>
          </div>

          <div ref={containerRef} className="relative">
            {/* Scroll-based center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-[var(--border-default)]/20 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] rounded-full"
                style={{ 
                  height: lineHeight,
                  boxShadow: '0 0 20px rgba(201, 168, 124, 0.4)'
                }}
              />
            </div>

            {/* Traveling Orb - uses state instead of direct motion value to avoid hydration issues */}
            <div 
              className="hidden md:block absolute left-1/2 w-3 h-3 -ml-1.5 rounded-full bg-[var(--accent-primary)] border-2 border-[var(--bg-page)] z-20 transition-all duration-75 ease-out"
              style={{ 
                top: lineHeight,
                boxShadow: '0 0 15px rgba(201, 168, 124, 0.8)'
              }}
            />

            {/* Timeline Events */}
            <div className="relative space-y-0">
              {sortedEvents.map((event, index) => (
                <div 
                  key={event._id || index}
                  className={cn(
                    "md:flex md:items-start",
                    index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                  )}
                >
                  <TimelineCard
                    event={event}
                    index={index}
                    isLeft={index % 2 === 0}
                    isLast={index === sortedEvents.length - 1}
                    onImageClick={openLightbox}
                  />
                </div>
              ))}
            </div>

            {/* Present Marker */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-2">
              <PresentMarker />
            </div>
            
            <div className="md:hidden ml-12 mt-8">
              <PresentMarker />
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
          <CertificateLightbox 
            image={lightboxImage}
            title={lightboxTitle}
            isOpen={lightboxOpen}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Timeline;