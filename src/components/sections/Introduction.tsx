'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import ProfileCard from '@/components/ui/ProfileCard';
import SocialMediaLinks from '@/components/shared/SocialMediaLinks';

gsap.registerPlugin(ScrollTrigger);

const Introduction: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(false);

  // Ambient parallax effect on mouse move (desktop only)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    setMousePosition({
      x: (clientX - centerX) / 50,
      y: (clientY - centerY) / 50
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Card entrance with 3D perspective
      gsap.fromTo(cardRef.current, 
        { x: -80, opacity: 0, rotateY: -15, scale: 0.95 },
        { 
          x: 0, 
          opacity: 1, 
          rotateY: 0,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Badge pop-in after card
      gsap.fromTo(badgeRef.current,
        { scale: 0, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Content words stagger reveal
      const contentElements = contentRef.current
        ? contentRef.current.querySelectorAll('.reveal-text')
        : [];
      gsap.fromTo(contentElements,
        { y: 30, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Parallax on scroll for card vs content
      gsap.to(cardRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });

    }, sectionRef);

    // Intersection Observer for performance (pause animations when off-screen)
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef} 
      id="introduction"
      aria-label="Introduction section"
      className="relative min-h-screen flex items-center py-20 lg:py-0 overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-700"
      style={{
        perspective: '1000px'
      }}
    >
      {/* Ambient Background Elements */}
      <div 
        className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, var(--color-beautician-primary) 0%, transparent 70%)',
          transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-barista-accent) 0%, transparent 70%)'
        }}
      />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 xl:gap-28">
          
          {/* Left Column - Profile Card with Enhancements */}
          <div className="relative w-full max-w-[380px] lg:max-w-[420px] flex-shrink-0">
            {/* Floating Availability Badge */}
            <div
              ref={badgeRef}
              className="absolute -top-4 -right-4 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-beautician-primary)] text-white text-xs font-bold uppercase tracking-wider shadow-lg border border-white/20 backdrop-blur-md animate-pulse-slow"
              style={{ animation: 'pulse-gentle 3s ease-in-out infinite' }}
            >
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              Open for Work
            </div>

            {/* Profile Card Container with Parallax */}
            <div
              ref={cardRef}
              className="relative"
              style={{
                transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <ProfileCard 
                avatarUrl="/assets/profilecard/profilecard.jpg"
                name="Kamala Saru"
                title="Creative Artisan"
                behindGlowColor="rgba(201, 168, 124, 0.3)"
                showUserInfo={true}
                hideFooter={true}
                onContactClick={scrollToContact}
                className="w-full shadow-[0_25px_100px_-20px_rgba(201,168,124,0.25)] hover:shadow-[0_35px_120px_-15px_rgba(201,168,124,0.35)] transition-shadow duration-700 cursor-pointer"
              />
              
              {/* Decorative ring behind card */}
              <div className="absolute -inset-3 rounded-[32px] border border-[var(--color-beautician-primary)]/10 -z-10 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            </div>

            {/* Location Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-[var(--color-text-muted)] text-sm"
            >
              <MapPin className="w-4 h-4 text-[var(--color-beautician-primary)]" />
              <span>Butwal, Nepal</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)] mx-2" />
              <Calendar className="w-4 h-4" />
              <span>8+ Years Experience</span>
            </motion.div>

            {/* Social Dock with Magnetic Container */}
            <motion.div 
              className="mt-8 flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-beautician-primary)]/20 to-[var(--color-barista-accent)]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <SocialMediaLinks />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div ref={contentRef} className="flex-1 max-w-2xl text-center lg:text-left relative">
            
            {/* Section Label */}
            <div className="reveal-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] mb-6">
              <Sparkles className="w-4 h-4 text-[var(--color-beautician-primary)]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">About Me</span>
            </div>

            {/* Main Heading */}
            <h2 className="reveal-text font-display text-[var(--color-text-primary)] text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
              Crafting Beauty &<br />
              <span className="italic text-[var(--color-beautician-primary)]">Perfect Brews</span>
            </h2>

            {/* Subtitle */}
            <p className="reveal-text font-accent italic text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
              "Where precision meets passion in every brush stroke and coffee pour."
            </p>

            {/* Body Content with Highlights */}
            <div className="space-y-5 text-[var(--color-text-secondary)] font-body text-base md:text-lg leading-relaxed">
              <p className="reveal-text">
                I am a professional {' '}
                <span className="italic text-[var(--color-beautician-primary)] font-semibold">
                  makeup artist
                </span>
                {' '}and{' '}
                <span className="italic text-[var(--color-beautician-primary)] font-semibold">
                  barista trainer
                </span>
                {' '}based in Butwal, Nepal.
              </p>
              
              <p className="reveal-text">
                Running <strong className="text-[var(--color-beautician-primary)]">Sister Beauty Corner</strong>, I specialize in transformative bridal looks and skincare treatments. Simultaneously, as Lead Trainer at <strong className="text-[var(--color-beautician-primary)]">Cocina Mitho Chha</strong>, I mentor the next generation of coffee artisans.
              </p>
              
              <p className="reveal-text text-[var(--color-text-muted)]">
                Whether creating the perfect bridal glow or extracting an espresso with exact TDS measurements, I believe every craft deserves reverence, precision, and artistic intuition.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="reveal-text mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
              onClick={scrollToContact}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-beautician-primary)] text-[var(--color-bg-primary)] rounded-full font-bold uppercase tracking-wider text-xs overflow-hidden transition-transform active:scale-95 hover:scale-105 shadow-lg"
              aria-label="Navigate to contact section"
            >
              <span className="relative z-10">Work With Me</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              {/* Matching slide-up background */}
              <div className="absolute inset-0 bg-[var(--color-barista-accent)] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
              
              <a
                href="#philosophy"
                className="inline-flex items-center gap-2 px-6 py-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors text-sm font-medium"
              >
                <span>Read My Philosophy</span>
                <span className="w-6 h-px bg-current transition-all group-hover:w-10" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(0.98); }
        }
      `}</style>
    </section>
  );
};

export default Introduction;