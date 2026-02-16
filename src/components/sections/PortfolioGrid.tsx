'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { ArrowUpRight } from 'lucide-react';

// Register ScrollTrigger (one-time registration check)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'bridal' | 'editorial' | 'sfx' | 'glam';
  beforeImage: string;
  afterImage: string;
  description: string;
  techniques: string[];
  duration: string;
  processImages?: string[];
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  onItemClick: (item: PortfolioItem) => void;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items, onItemClick }) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  // Detect mobile for fallback layout
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  }, []);

  useEffect(() => {
    // Skip horizontal scroll on mobile—use standard grid instead
    if (isMobile || !triggerRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const trigger = triggerRef.current;
      
      if (!container || !trigger) return;

      const scrollWidth = container.scrollWidth;
      const windowWidth = window.innerWidth;
      const amountToScroll = scrollWidth - windowWidth;

      if (amountToScroll > 0) {
        const tween = gsap.to(container, {
          x: -amountToScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: trigger,
            start: 'top top',
            end: `+=${amountToScroll * 1.5}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefresh: (self) => {
              scrollTriggerInstance.current = self;
            }
          }
        });

        return () => {
          tween.kill();
        };
      }
    }, triggerRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [items, isMobile]);

  // Mobile: Standard vertical grid (better UX than trapped horizontal scroll)
  if (isMobile) {
    return (
      <section 
        id="portfolio"
        className="relative min-h-screen py-24 bg-[var(--color-bg-primary)] transition-colors duration-700"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-[var(--color-beautician-primary)] font-accent italic text-lg block mb-2">Selected Works</span>
            <h2 className="font-display text-[var(--color-text-primary)] text-4xl md:text-5xl">Portfolio</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {items.map((item) => (
              <article 
                key={item.id} 
                className="group cursor-pointer"
                onClick={() => onItemClick(item)}
                aria-label={`View ${item.title} case study`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <BeforeAfterSlider 
                    before={item.beforeImage} 
                    after={item.afterImage} 
                    isCardView={true}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-[var(--color-beautician-primary)]/10 border border-[var(--color-beautician-primary)]/20 text-[var(--color-beautician-primary)] text-[10px] uppercase tracking-widest font-bold rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest font-bold">
                    {item.duration}
                  </span>
                </div>
                
                <h3 className="font-display text-xl md:text-2xl text-[var(--color-text-primary)] group-hover:text-[var(--color-beautician-primary)] transition-colors">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: Horizontal cinematic scroll
  return (
    <div 
      ref={triggerRef} 
      id="portfolio"
      className="h-screen flex flex-col justify-center overflow-hidden bg-[var(--color-bg-primary)] transition-colors duration-700 relative"
    >
      {/* Background Heading - Theme aware */}
      <div className="absolute top-24 left-24 pointer-events-none opacity-[0.03] select-none z-0">
        <h2 className="font-display text-[12rem] md:text-[15rem] text-[var(--color-text-primary)] leading-none tracking-tighter">
          WORKS
        </h2>
      </div>

      {/* Scroll Hint */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20 flex flex-col items-center gap-2 opacity-50 animate-pulse">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[var(--color-beautician-primary)] to-transparent" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-text-muted)] rotate-90 origin-center translate-x-4">
          Scroll
        </span>
      </div>

      <div 
        ref={containerRef} 
        className="flex items-center gap-12 md:gap-24 px-[10vw] md:px-[15vw] min-w-full relative z-10 will-change-transform"
      >
        {items.map((item, index) => (
          <article 
            key={item.id} 
            className="flex-shrink-0 w-[70vw] md:w-[40vw] lg:w-[35vw] group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-beautician-primary)] rounded-2xl"
            onClick={() => onItemClick(item)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onItemClick(item);
              }
            }}
            aria-label={`View ${item.title} case study. Category: ${item.category}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Card Container with Before/After Slider */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-8 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] transition-transform duration-500 group-hover:scale-[1.02]">
              {/* The Interactive Slider */}
              <BeforeAfterSlider 
                before={item.beforeImage} 
                after={item.afterImage} 
                isCardView={true}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2 text-white border border-white/30 px-6 py-3 rounded-full backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">Explore Case Study</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[var(--color-beautician-primary)]/10 border border-[var(--color-beautician-primary)]/20 text-[var(--color-beautician-primary)] text-[10px] uppercase tracking-widest font-bold rounded-full">
                {item.category}
              </span>
              <span className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest font-bold">
                {item.duration}
              </span>
            </div>
            
            <h3 className="font-display text-3xl md:text-4xl text-[var(--color-text-primary)] group-hover:text-[var(--color-beautician-primary)] transition-colors duration-300 leading-tight">
              {item.title}
            </h3>
          </article>
        ))}

        {/* End Cap */}
        <div className="flex-shrink-0 w-[40vw] h-[50vh] flex flex-col justify-center border-l border-[var(--color-border)] pl-16 md:pl-24">
          <p className="font-accent italic text-3xl md:text-5xl text-[var(--color-text-muted)]/30 leading-snug select-none">
            Every detail, <br />
            a calculated choice.
          </p>
          <div className="mt-8 h-px w-24 bg-[var(--color-beautician-primary)]/20" />
        </div>
      </div>
    </div>
  );
};

export default PortfolioGrid;