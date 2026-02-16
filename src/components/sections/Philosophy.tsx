'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Coffee, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Sub-component: Magnetic skill tags with physics-based hover
const MagneticTag = ({ children, accentClass }: { children: React.ReactNode; accentClass: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 1024) return; // Disable on mobile
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(ref.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { 
      x: 0, 
      y: 0, 
      duration: 0.6, 
      ease: 'elastic.out(1, 0.5)' 
    });
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`flex items-center gap-2 cursor-default transition-all duration-300 hover:scale-105 group ${accentClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 group-hover:opacity-100 transition-opacity" />
      <span className="text-sm font-medium tracking-wide">{children}</span>
    </div>
  );
};

// Sub-component: Word-by-word reveal quote
const RevealQuote = ({ text, highlightWord }: { text: string; highlightWord: string }) => {
  const containerRef = useRef<HTMLQuoteElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(wordRefs.current,
            { opacity: 0, y: 20, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              stagger: 0.04,
              duration: 0.6,
              ease: 'power3.out'
            }
          );
        }
      });
    });
    
    return () => ctx.revert();
  }, []);

  const words = text.split(' ');

  return (
    <blockquote ref={containerRef} className="font-accent italic text-2xl md:text-3xl leading-relaxed text-[var(--color-text-primary)]">
      <span className="text-[var(--color-beautician-primary)] opacity-80">"</span>
      {words.map((word, i) => {
        const isHighlight = word.toLowerCase().includes(highlightWord.toLowerCase());
        return (
          <span 
            key={i} 
            ref={el => { wordRefs.current[i] = el; }}
            className={`inline-block mr-[0.25em] transition-colors duration-500 ${
              isHighlight 
                ? 'bg-gradient-to-r from-[var(--color-beautician-primary)] to-[var(--color-barista-accent)] bg-clip-text text-transparent font-bold' 
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            {word}
          </span>
        );
      })}
      <span className="text-[var(--color-barista-accent)] opacity-80">"</span>
    </blockquote>
  );
};

// Global styles for custom animations
const globalStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 90%',
          toggleActions: 'play none none reverse'
        }
      });

      // Left column sweep
      tl.fromTo(leftColRef.current,
        { opacity: 0, x: -60, filter: 'blur(10px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
        0
      );

      // Right column sweep  
      tl.fromTo(rightColRef.current,
        { opacity: 0, x: 60, filter: 'blur(10px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
        0.2
      );

      // Connector pulse
      tl.fromTo(connectorRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' },
        0.8
      );

      // Scroll-driven flowing line (Enhancement 1)
      gsap.fromTo(lineProgressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'center center',
            scrub: 0.8
          }
        }
      );

      // Floating orb animation
      gsap.to(orbRef.current, {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="philosophy"
      className="relative min-h-screen flex items-center py-24 lg:py-32 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden transition-colors duration-700 selection:bg-[var(--color-beautician-primary)] selection:text-white"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-beautician-primary)]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-barista-accent)]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 lg:mb-28 space-y-6">
          <span className="inline-block text-[var(--color-beautician-primary)] font-accent italic text-xl mb-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            The Foundation
          </span>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight opacity-0 animate-[fadeInUp_0.8s_ease-out_0.1s_forwards]">
            Two Crafts,{' '}
            <span className="italic text-[var(--color-beautician-primary)] bg-gradient-to-r from-[var(--color-beautician-primary)] to-[var(--color-barista-accent)] bg-clip-text text-transparent">
              One Philosophy
            </span>
          </h2>
          
          <p className="font-body text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            Whether shaping a bridal look or extracting the perfect espresso, I follow the same principles:{' '}
            <span className="italic text-[var(--color-beautician-primary)] bg-gradient-to-r from-[var(--color-beautician-primary)] to-[var(--color-barista-accent)] bg-clip-text text-transparent">
              precision, patience, and passion
            </span>
          </p>
        </div>

        {/* Two Pillars Grid with Central Spine */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 relative">
          
          {/* Beauty Pillar - Left */}
          <div ref={leftColRef} className="lg:pr-16 text-center lg:text-right relative z-10 group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-beautician-primary)]/10 border border-[var(--color-beautician-primary)]/20 mb-6 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Sparkles className="w-8 h-8 text-[var(--color-beautician-primary)]" />
            </div>
            
            <h3 className="font-display text-3xl md:text-4xl mb-4 transition-colors duration-300">
              The Beauty of{' '}
              <span className="italic text-[var(--color-beautician-primary)] group-hover:text-[var(--color-barista-accent)] transition-colors duration-500">
                Precision
              </span>
            </h3>
            
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mb-8 text-base md:text-lg max-w-md lg:ml-auto">
              Every face is a unique canvas. I don't chase trends—I enhance natural bone structure and personality. From the chemistry of skincare to the geometry of contouring, beauty is technical mastery meeting artistic intuition.
            </p>
            
            <div className="space-y-4 text-right flex flex-col items-center lg:items-end text-[var(--color-text-muted)]">
              <MagneticTag accentClass="text-[var(--color-beautician-primary)] hover:text-[var(--color-beautician-dark)]">
                Clinical skin analysis
              </MagneticTag>
              <MagneticTag accentClass="text-[var(--color-beautician-primary)] hover:text-[var(--color-beautician-dark)]">
                Bridal artistry
              </MagneticTag>
              <MagneticTag accentClass="text-[var(--color-beautician-primary)] hover:text-[var(--color-beautician-dark)]">
                Beauty education
              </MagneticTag>
            </div>
          </div>

          {/* Central Spine - The Flowing River */}
          <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center w-px">
            {/* Static track */}
            <div className="absolute inset-0 bg-[var(--color-border)]/30" />
            
            {/* Animated flow fill */}
            <div 
              ref={lineProgressRef}
              className="absolute top-0 left-0 right-0 w-full bg-gradient-to-b from-[var(--color-beautician-primary)] via-[var(--color-barista-accent)] to-transparent origin-top"
              style={{ height: '100%' }}
            />
            
            {/* Floating orb */}
            <div 
              ref={orbRef}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-beautician-primary)] shadow-[0_0_20px_rgba(201,168,124,0.6)] z-10"
            />
            
            {/* Connector dot */}
            <div 
              ref={connectorRef}
              className="absolute bottom-0 w-3 h-3 rounded-full bg-[var(--color-barista-accent)] ring-4 ring-[var(--color-bg-primary)] shadow-[0_0_20px_rgba(215,168,110,0.5)]"
            />
            
            {/* Scroll hint */}
            <div className="absolute -bottom-12 animate-bounce">
              <ArrowDown className="w-5 h-5 text-[var(--color-barista-accent)] opacity-50" />
            </div>
          </div>

          {/* Coffee Pillar - Right */}
          <div ref={rightColRef} className="lg:pl-16 text-center lg:text-left relative z-10 pt-12 lg:pt-0 border-t lg:border-t-0 border-[var(--color-border)] group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-barista-accent)]/10 border border-[var(--color-barista-accent)]/20 mb-6 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
              <Coffee className="w-8 h-8 text-[var(--color-barista-accent)]" />
            </div>
            
            <h3 className="font-display text-3xl md:text-4xl mb-4 transition-colors duration-300">
              The Ritual of{' '}
              <span className="italic text-[var(--color-barista-accent)] group-hover:text-[var(--color-beautician-primary)] transition-colors duration-500">
                Craft
              </span>
            </h3>
            
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mb-8 text-base md:text-lg max-w-md">
              Coffee is chemistry in motion. TDS, extraction yield, milk emulsion—every variable matters. A master barista doesn't just make drinks; they orchestrate an experience, one precise movement at a time.
            </p>
            
            <div className="space-y-4 text-left flex flex-col items-center lg:items-start text-[var(--color-text-muted)]">
              <MagneticTag accentClass="text-[var(--color-barista-accent)] hover:text-[var(--color-barista-primary)]">
                SCA brewing techniques
              </MagneticTag>
              <MagneticTag accentClass="text-[var(--color-barista-accent)] hover:text-[var(--color-barista-primary)]">
                Latte art mastery
              </MagneticTag>
              <MagneticTag accentClass="text-[var(--color-barista-accent)] hover:text-[var(--color-barista-primary)]">
                Sensory analysis
              </MagneticTag>
            </div>
          </div>
        </div>

        {/* Connecting Statement */}
        <div className="mt-28 lg:mt-36 text-center max-w-3xl mx-auto relative px-4">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[var(--color-beautician-primary)] to-[var(--color-barista-accent)] mx-auto mb-10 opacity-60" />
          
          <RevealQuote 
            text="Excellence is not a single act, but a habit. The same hands that hold a makeup brush can tamp espresso—both require reverence for the craft."
            highlightWord="habit"
          />
          
          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-[var(--color-text-muted)] font-bold opacity-0 animate-[fadeIn_1s_ease_2s_forwards]">
            The Philosophy guides The Journey
          </p>
        </div>
      </div>

      <style>{globalStyles}</style>
    </section>
  );
};

export default Philosophy;