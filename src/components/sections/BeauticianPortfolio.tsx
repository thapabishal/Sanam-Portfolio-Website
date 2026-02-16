'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSanity, queries } from '@/hooks/useSanity';
import { getImageUrl } from '@/lib/sanity';
import { PortfolioItem } from '@/types/sanity.types';
import PortfolioLightbox from '../ui/PortfolioLightbox';
import { Skeleton } from '../ui/Skeleton';
import { fadeInOnScroll } from '@/lib/animations';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sparkles, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  GripHorizontal,
  Clock,
  ArrowRight,
  ZoomIn
} from 'lucide-react';
import FormSheet from '../ui/FormSheet';
import BeauticianBookingForm from '../forms/BeauticianBookingForm';

gsap.registerPlugin(ScrollTrigger);

// Categories with icons - labels adapt to current theme text colors
const categories = [
  { id: 'all', label: 'All Projects', icon: Sparkles },
  { id: 'bridal', label: 'Bridal', icon: Calendar },
  { id: 'editorial', label: 'Editorial', icon: Sparkles },
  { id: 'glam', label: 'Glam', icon: Sparkles },
  { id: 'sfx', label: 'SFX Art', icon: Sparkles }
];

// Enhanced Before/After Slider with theme-aware colors
const BeforeAfterSlider = ({ 
  before, 
  after, 
  alt, 
  isHovered = false 
}: { 
  before: string; 
  after: string; 
  alt?: string;
  isHovered?: boolean;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({ before: false, after: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      const handleGlobalMouseMove = (e: MouseEvent) => handleMove(e.clientX);
      
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }
  }, [isDragging, handleMove]);

  // Gentle auto-animate on hover to entice interaction
  useEffect(() => {
    if (isHovered && !isDragging) {
      const timeout = setTimeout(() => {
        setSliderPosition(prev => prev === 50 ? 75 : 50);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isHovered, isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none bg-page ${ // Theme-aware bg
        isDragging ? 'cursor-col-resize' : 'cursor-ew-resize'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* Loading Skeleton */}
      {(!imagesLoaded.before || !imagesLoaded.after) && (
        <div className="absolute inset-0 bg-card animate-pulse z-20" />
      )}

      {/* After Image (Base) */}
      <div className="absolute inset-0">
        <img 
          src={after} 
          alt={`${alt} - After`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          onLoad={() => setImagesLoaded(prev => ({ ...prev, after: true }))}
          draggable={false}
        />
        {/* Theme-aware after label */}
        <span className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-widest text-white font-bold rounded-full border border-white/20">
          After
        </span>
      </div>

      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden border-r border-accent-primary/30" // Theme accent border
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={before} 
          alt={`${alt} - Before`}
          className="w-full h-full object-cover max-w-none transition-transform duration-700"
          style={{ 
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
          onLoad={() => setImagesLoaded(prev => ({ ...prev, before: true }))}
          draggable={false}
        />
        <span className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-widest text-white font-bold rounded-full border border-white/20">
          Before
        </span>
      </div>

      {/* Slider Handle - Theme aware gold color */}
      <div 
        className="absolute top-0 bottom-0 w-[3px] bg-accent-primary shadow-[0_0_20px_rgba(201,168,124,0.5)] z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a1a1a] border-2 border-accent-primary rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-110">
          <GripHorizontal className="w-5 h-5 text-accent-primary" />
        </div>
      </div>

      {/* Interaction Hint - Theme aware */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-accent-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-[10px] uppercase tracking-[0.2em] text-accent-primary font-semibold whitespace-nowrap flex items-center gap-2">
          <GripHorizontal className="w-3 h-3" />
          Drag to Compare
        </span>
      </div>
    </div>
  );
};

// Theme-aware Skeleton
const PortfolioSkeleton = () => (
  <div className="flex gap-6 overflow-hidden">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card border border-theme">
          <div className="absolute inset-0 shimmer-bg" />
        </div>
        <div className="mt-4 h-6 w-3/4 bg-card rounded shimmer-bg" />
        <div className="mt-2 h-4 w-1/2 bg-card rounded shimmer-bg" />
      </div>
    ))}
    <style dangerouslySetInnerHTML={{ __html: `
      .shimmer-bg {
        background: linear-gradient(90deg, var(--bg-elevated) 0%, var(--bg-card) 50%, var(--bg-elevated) 100%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}} />
  </div>
);

// Empty State - Theme aware
const EmptyState = ({ category }: { category: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-full bg-accent-primary/10 flex items-center justify-center mb-6 border border-accent-primary/20">
      <Sparkles className="w-10 h-10 text-accent-primary/50" />
    </div>
    <h3 className="font-display text-2xl text-text-primary mb-2">No projects found</h3>
    <p className="text-text-secondary text-sm max-w-md">
      No {category !== 'all' ? category : ''} projects available at the moment. Check back soon for updates!
    </p>
  </div>
);

export const BeauticianPortfolio = () => {
  const { data: items, loading } = useSanity<PortfolioItem[]>({
    query: queries.portfolio
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const progress = container.scrollLeft / (container.scrollWidth - container.clientWidth);
    setScrollProgress(progress);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = 400;
    
    if (e.key === 'ArrowLeft') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight') {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Entrance animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        fadeInOnScroll(titleRef.current, 0);
      }

      gsap.fromTo('.filter-btn',
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    });
  };

  // Filter items
  const filteredItems = items?.filter(item => 
    activeFilter === 'all' || item.category === activeFilter
  ) || [];

  if (loading) return <PortfolioSkeleton />;

  return (
    <section 
      ref={sectionRef}
      id="works"
      className="relative py-24 md:py-32 bg-page text-text-primary overflow-hidden transition-colors duration-700" // THEME: bg-page and text-text-primary
      aria-label="Portfolio Gallery"
    >
      {/* Ambient Background - Theme aware */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent-primary)_08_0%,_transparent_70%)] pointer-events-none opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />

      <div className="relative max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header Section - Theme aware typography */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16">
          <div className="flex-1">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-accent italic text-accent-primary text-lg md:text-xl mb-4 block" // THEME: text-accent-primary
            >
              Selected Works
            </motion.span>
            <h2 
              ref={titleRef}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-text-primary leading-[0.9] tracking-tight" // THEME: text-text-primary
            >
              Portfolio
            </h2>
            <p className="mt-4 text-text-secondary max-w-xl text-lg"> {/* THEME: text-text-secondary */}
              Browse through transformations and creative works. Drag cards to explore before & after results.
            </p>
          </div>

          {/* Right Side: Filters */}
          <div className="flex flex-col items-start lg:items-end gap-6">
            {/* Filter Pills with Count - Theme aware */}
            <div className="flex flex-wrap gap-3" role="tablist" aria-label="Portfolio categories">
              {categories.map((cat) => {
                const count = cat.id === 'all' 
                  ? items?.length || 0 
                  : items?.filter(i => i.category === cat.id).length || 0;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === cat.id}
                    aria-controls="portfolio-gallery"
                    className={`filter-btn relative px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] font-bold transition-all duration-500 overflow-hidden group flex items-center gap-2 border ${
                      activeFilter === cat.id 
                        ? 'text-bg-page bg-accent-primary border-accent-primary shadow-[0_0_20px_rgba(201,168,124,0.3)]' // Active: bg accent, text page bg
                        : 'text-text-secondary border-border-default hover:border-accent-primary/50 hover:text-text-primary bg-transparent' // Inactive
                    }`}
                  >
                    <cat.icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">{cat.label}</span>
                    <span className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeFilter === cat.id ? 'bg-black/20' : 'bg-bg-card'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Primary Booking CTA - Theme aware */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsBookingOpen(true)}
              className="group relative flex items-center gap-3 px-8 py-4 bg-accent-primary text-bg-page font-bold uppercase tracking-[0.15em] text-xs rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(201,168,124,0.2)] hover:shadow-[0_0_40px_rgba(201,168,124,0.4)]"
              aria-label="Book an appointment"
            >
              <Calendar size={18} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Book Appointment</span>
              <span className="relative z-10 hidden sm:inline-block w-1.5 h-1.5 bg-bg-page rounded-full animate-pulse" />
              {/* Slide-up highlight background */}
              <div className="absolute inset-0 bg-[var(--color-barista-accent)] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </motion.button>
          </div>
        </div>

        {/* Gallery Container */}
        <div className="relative group/gallery">
          {/* Navigation Buttons - Theme aware */}
          <button
            type="button"
            onClick={() => scrollGallery('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-bg-elevated/90 backdrop-blur-md border border-border-default rounded-full flex items-center justify-center text-text-primary opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hover:bg-accent-primary hover:text-bg-page hover:border-accent-primary -translate-x-1/2 lg:-translate-x-6"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={() => scrollGallery('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-bg-elevated/90 backdrop-blur-md border border-border-default rounded-full flex items-center justify-center text-text-primary opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hover:bg-accent-primary hover:text-bg-page hover:border-accent-primary translate-x-1/2 lg:translate-x-6"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Gallery Grid - Horizontal Scroll */}
          <div 
            ref={scrollContainerRef}
            id="portfolio-gallery"
            role="tabpanel"
            onScroll={handleScroll}
            className="flex gap-6 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const beforeUrl = item.beforeImage ? getImageUrl(item.beforeImage, 800, 1000, 80) : null;
                  const afterUrl = item.afterImage ? getImageUrl(item.afterImage, 800, 1000, 80) : null;
                  const hasSlider = beforeUrl && afterUrl;
                  const isHovered = hoveredCard === item._id;

                  return (
                    <motion.article
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.05,
                        layout: { duration: 0.3 }
                      }}
                      onClick={() => setSelectedItem(item)}
                      onMouseEnter={() => setHoveredCard(item._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="portfolio-card relative flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw] snap-center cursor-pointer group"
                    >
                      {/* Background Number - Theme aware */}
                      <span className="absolute -top-6 -left-2 text-[100px] md:text-[140px] font-display text-text-primary/[0.03] leading-none pointer-events-none select-none z-0 transition-transform duration-500 group-hover:translate-x-2">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* 
                        CARD CONTAINER - FIXED: No tilt, elegant scale + shadow + glow 
                      */}
                      <motion.div 
                        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card border border-border-default transition-all duration-500 ease-out"
                        animate={{
                          scale: isHovered ? 1.03 : 1,
                          boxShadow: isHovered 
                            ? '0 25px 50px -12px rgba(201, 169, 98, 0.25), 0 0 0 1px rgba(201, 169, 98, 0.3)' 
                            : '0 10px 30px -15px rgba(0,0,0,0.3)',
                          borderColor: isHovered ? 'rgba(201, 168, 124, 0.5)' : 'var(--border-default)'
                        }}
                      >
                        {/* Image Content */}
                        {hasSlider && beforeUrl && afterUrl ? (
                          <BeforeAfterSlider 
                            before={beforeUrl} 
                            after={afterUrl} 
                            alt={item.title}
                            isHovered={isHovered}
                          />
                        ) : afterUrl ? (
                          <div className="w-full h-full overflow-hidden">
                            <img 
                              src={afterUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted">
                            <span className="text-xs uppercase tracking-widest">No Preview</span>
                          </div>
                        )}

                        {/* Gradient Overlay - Theme aware */}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Hover Content - Elegant fade in */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-accent-primary text-bg-page text-[10px] uppercase tracking-widest font-bold rounded-full">
                              {item.category}
                            </span>
                            {item.duration && (
                              <span className="text-text-secondary text-xs flex items-center gap-1 bg-bg-page/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border-default">
                                <Clock size={12} />
                                {item.duration}
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-2xl text-text-primary leading-tight mb-2">
                            {item.title}
                          </h3>
                          
                          {/* Story caption */}
                          {item.description && (
                            <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 text-accent-primary text-xs uppercase tracking-widest font-bold group/link">
                            <span>View Details</span>
                            <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
                          </div>
                        </div>

                        {/* Quick View Icon - Theme aware */}
                        <div className="absolute top-4 right-4 w-10 h-10 bg-bg-elevated/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent-primary hover:text-bg-page border border-border-default shadow-lg">
                          <ZoomIn className="w-4 h-4 text-text-primary hover:text-bg-page" />
                        </div>
                      </motion.div>

                      {/* Mobile Title Overlay */}
                      <div className="mt-4 md:hidden">
                        <h3 className="font-display text-xl text-text-primary mb-1">{item.title}</h3>
                        <p className="text-text-secondary text-sm uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                          {item.category}
                        </p>
                      </div>
                    </motion.article>
                  );
                })
              ) : (
                <EmptyState category={activeFilter} />
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar - Theme aware */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
              style={{ width: `${Math.max(scrollProgress * 100, 5)}%` }}
              layoutId="scrollProgress"
            />
          </div>

          {/* Mobile Drag Indicator */}
          <div className="md:hidden flex items-center justify-center gap-2 mt-6 text-text-muted text-xs uppercase tracking-[0.3em]">
            <GripHorizontal className="w-4 h-4" />
            <span>Swipe to explore</span>
          </div>
        </div>

        {/* Desktop Scroll Hint */}
        <div className="hidden md:flex items-center justify-center gap-4 mt-12 text-text-muted text-xs uppercase tracking-[0.3em]">
          <span className="w-12 h-[1px] bg-border-default" />
          <span>Use arrow keys to navigate</span>
          <span className="w-12 h-[1px] bg-border-default" />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <PortfolioLightbox 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)}
            onBook={() => {
              setSelectedItem(null);
              setIsBookingOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Booking Sheet */}
      <FormSheet
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Book Your Appointment"
        subtitle="Secure your spot with our easy booking system"
        theme="beautician"
      >
        <div className="max-w-lg mx-auto">
          <BeauticianBookingForm 
            theme="beautician" 
            onSuccess={() => {
              setTimeout(() => setIsBookingOpen(false), 3000);
            }}
          />
        </div>
      </FormSheet>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default BeauticianPortfolio;