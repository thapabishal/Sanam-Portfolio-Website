'use client';

import React, { 
  useRef, 
  useEffect, 
  useState, 
  useCallback, 
  forwardRef, 
  memo
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, ArrowDown, Sparkles, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// Types
type Theme = 'beautician' | 'barista' | 'default';

interface HeroPanelProps {
  side: 'left' | 'right';
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  cvAction: () => void;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isRevealed: boolean;
  mouseX: any;
  mouseY: any;
}

interface CVData {
  beauty: { path: string; filename: string; };
  barista: { path: string; filename: string; };
}

// Config
const SITE_CONFIG = {
  name: 'Kamala Saru',
  tagline: 'Clinical Aesthetics & Specialty Coffee',
  location: 'Butwal, Nepal',
} as const;

const CV_FILES: CVData = {
  beauty: {
    path: '/assets/resume/beauty-cv.pdf',
    filename: 'Kamala-Saru-Beauty-CV.pdf',
  },
  barista: {
    path: '/assets/resume/barista-cv.pdf',
    filename: 'Kamala-Saru-Barista-CV.pdf',
  },
};

// Hooks
const useMediaQuery = (query: string): boolean | null => {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    updateMatch();
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
};

const useCurrentTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
      if (currentTheme) setTheme(currentTheme);
    };

    updateTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') updateTheme();
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return theme;
};

// Subtle ambient glow - refined for luxury feel
const AmbientGlow = memo(({ theme }: { theme: Theme }) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[150px]"
        style={{
          background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
          opacity: 0.08,
        }}
        animate={{
          scale: [1, 1.15, 1],
          x: ['-50%', '-45%', '-50%'],
          y: ['-50%', '-55%', '-50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ top: '50%', left: '50%' }}
      />
    </div>
  );
});

AmbientGlow.displayName = 'AmbientGlow';

// Luxurious Name Reveal Animation - refined and premium
const LuxuriousNameReveal = memo(({ text, isVisible }: { text: string; isVisible: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current || typeof window === 'undefined') return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      const chars = containerRef.current?.querySelectorAll('.name-char');
      
      if (chars && chars.length > 0) {
        tl.fromTo(chars,
          { 
            y: 100, 
            opacity: 0,
            rotateX: -90,
          },
          { 
            y: 0, 
            opacity: 1,
            rotateX: 0,
            stagger: 0.04,
            duration: 1.2,
          },
          0.2
        );
      }
      
      if (lineRef.current) {
        tl.fromTo(lineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
          0.8
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-6 perspective-1000 overflow-hidden">
        {text.split(' ').map((word, wordIdx) => (
          <span key={wordIdx} className="name-word flex overflow-hidden">
            {word.split('').map((char, charIdx) => (
              <span
                key={`${wordIdx}-${charIdx}`}
                className="name-char inline-block font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[var(--text-primary)] will-change-transform"
                style={{ 
                  lineHeight: '1.1',
                  transformStyle: 'preserve-3d',
                  textShadow: '0 2px 20px rgba(0,0,0,0.1)',
                }}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>
      
      <div 
        ref={lineRef}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-32 md:w-48 origin-center"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
          boxShadow: '0 0 20px var(--accent-glow)',
        }}
      />
    </div>
  );
});

LuxuriousNameReveal.displayName = 'LuxuriousNameReveal';

// Icon component with theme-aware shadow but consistent fill
const ThemedIcon = memo(({ icon, isHovered }: { icon: React.ReactNode; isHovered: boolean }) => {
  return (
    <div 
      className={cn(
        "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border backdrop-blur-sm",
        "bg-white/10 border-white/30 text-white",
        isHovered && "bg-white text-black border-white"
      )}
      style={{
        // FIX #2: Theme-aware shadow using CSS filter drop-shadow with CSS variables
        filter: isHovered 
          ? 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' 
          : 'drop-shadow(0 4px 6px var(--accent-glow))',
      }}
    >
      {icon}
    </div>
  );
});

ThemedIcon.displayName = 'ThemedIcon';

// Enhanced Hero Panel with fully visible background on hover
const HeroPanel = forwardRef<HTMLDivElement, HeroPanelProps>(({
  side, title, subtitle, description, icon, image,
  cvAction, isMobile, prefersReducedMotion, isRevealed,
  mouseX, mouseY
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const bgX = useTransform(mouseX, [-0.5, 0.5], isHovered ? [8, -8] : [0, 0]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], isHovered ? [8, -8] : [0, 0]);
  const springBgX = useSpring(bgX, { stiffness: 150, damping: 30 });
  const springBgY = useSpring(bgY, { stiffness: 150, damping: 30 });

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
    panelRef.current = el;
  }, [ref]);

  const textColorClass = 'text-white';
  const subtitleColorClass = 'text-[var(--accent-primary)]';
  const descColorClass = 'text-white/70';

  return (
    <motion.article
      ref={setRefs}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={cvAction}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cvAction();
        }
      }}
      className={cn(
        "relative flex-1 overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 transition-all duration-700 ease-out cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]",
        isMobile ? "h-1/2 min-h-[50vh]" : "h-full",
        side === 'left' ? "bg-[var(--bg-card)]" : "bg-[var(--bg-page)]"
      )}
      initial={false}
      animate={!prefersReducedMotion && !isMobile ? { flex: isHovered ? 1.15 : 1 } : {}}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* FIX #1: Background Image - fully visible on hover (no brightness reduction) */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ 
          backgroundImage: `url(${image})`,
          x: prefersReducedMotion ? 0 : springBgX,
          y: prefersReducedMotion ? 0 : springBgY,
          scale: isHovered ? 1.05 : 1,
        }}
        initial={{ filter: 'grayscale(100%) brightness(0.35)' }}
        animate={{ 
          // FIX #1: Removed brightness reduction on hover - image is now 100% visible
          filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%) brightness(0.35)'
        }}
        transition={{ duration: 0.8 }}
        aria-hidden="true"
      />
      
      {/* FIX #1: Overlay that fades out on hover to reveal image fully */}
      <motion.div 
        className="absolute inset-0 pointer-events-none bg-gradient-to-br from-black/90 via-black/70 to-black/50"
        animate={{ opacity: isHovered ? 0.3 : 1 }}
        transition={{ duration: 0.5 }}
        aria-hidden="true" 
      />

      <div className="relative z-10 text-center max-w-md px-4">
        
        {/* FIX #2: Icon with theme-aware shadow but consistent white fill */}
        <motion.div
          animate={!prefersReducedMotion ? { y: isHovered ? -4 : 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <ThemedIcon icon={icon} isHovered={isHovered} />
        </motion.div>

        <h2 className={cn(
          "font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 mt-6",
          textColorClass
        )}>
          {title}
        </h2>

        <p className={cn(
          "font-accent italic text-lg md:text-xl mb-4",
          subtitleColorClass
        )}>
          {subtitle}
        </p>

        <p className={cn(
          "font-body text-sm md:text-base leading-relaxed mb-8 max-w-xs mx-auto",
          descColorClass
        )}>
          {description}
        </p>

        <motion.button
          type="button"
          onClick={(e) => { e.stopPropagation(); cvAction(); }}
          className={cn(
            "group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wider overflow-hidden transition-all duration-300",
            "border border-white/50 text-white bg-transparent hover:bg-white hover:text-black",
            "focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]"
          )}
          whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          
          <span className="relative z-10 flex items-center gap-2">
            <Download className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="relative overflow-hidden">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Download CV</span>
              <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0">Get Resume</span>
            </span>
          </span>
        </motion.button>
      </div>

      <motion.div 
        className="absolute bottom-0 h-[2px]"
        style={{ 
          background: 'rgba(255,255,255,0.6)',
          boxShadow: '0 0 10px rgba(255,255,255,0.3)',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        initial={{ width: '0%', opacity: 0 }}
        animate={{ 
          width: isHovered ? '60%' : '0%',
          opacity: isHovered ? 0.8 : 0
        }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.article>
  );
});

HeroPanel.displayName = 'HeroPanel';

// Main Component
const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const prevIsRevealed = useRef(false);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const currentTheme = useCurrentTheme();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)') ?? false;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => { 
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile || prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  }, [isMobile, prefersReducedMotion, mouseX, mouseY]);

  const downloadCV = useCallback((type: 'beauty' | 'barista') => {
    const cv = CV_FILES[type];
    if (!cv?.path) return;
    
    const link = document.createElement('a');
    link.href = cv.path;
    link.download = cv.filename;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !leftCurtainRef.current || !rightCurtainRef.current) return;
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    const leftPanel = leftCurtainRef.current;
    const rightPanel = rightCurtainRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: isMobile ? '+=120%' : '+=150%',
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const newRevealed = self.progress >= 0.25;
            if (newRevealed !== prevIsRevealed.current) {
              setIsRevealed(newRevealed);
              prevIsRevealed.current = newRevealed;
            }
          }
        }
      });

      if (isMobile) {
        tl.to(leftPanel, { yPercent: -100, ease: 'power3.inOut' }, 0)
          .to(rightPanel, { yPercent: 100, ease: 'power3.inOut' }, 0);
      } else {
        tl.to(leftPanel, { xPercent: -110, ease: 'power3.inOut' }, 0)
          .to(rightPanel, { xPercent: 110, ease: 'power3.inOut' }, 0);
      }
    }, container);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-[var(--bg-page)]" 
      id="hero"
      onMouseMove={handleMouseMove}
    >
      <AmbientGlow theme={currentTheme} />

      <div className={cn(
        "absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-1000",
        isRevealed ? "opacity-100" : "opacity-0"
      )}>
        <div className="text-center px-6 max-w-5xl w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase text-[var(--text-muted)] border border-[var(--border-default)] bg-[var(--bg-card)]/50 backdrop-blur-sm">
              Portfolio 2026
            </span>
          </motion.div>

          <div className="mb-6">
            <LuxuriousNameReveal text={SITE_CONFIG.name} isVisible={isRevealed} />
          </div>

          <motion.p 
            className="font-body text-sm md:text-base tracking-[0.25em] uppercase text-[var(--accent-primary)]"
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ textShadow: '0 0 30px var(--accent-glow)' }}
          >
            {SITE_CONFIG.tagline}
          </motion.p>
        </div>
      </div>

      <div className={cn("absolute inset-0 z-20 flex", isMobile ? "flex-col" : "flex-row")}>
        <HeroPanel
          side="left" 
          title="Beauty" 
          subtitle="Clinical Aesthetics" 
          description="Bespoke treatments at Sister Beauty Corner, Butwal."
          icon={<Sparkles className="w-5 h-5" />} 
          image="/assets/hero/beauty.jpg"
          cvAction={() => downloadCV('beauty')} 
          ref={leftCurtainRef} 
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion ?? false} 
          isRevealed={isRevealed}
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <HeroPanel
          side="right" 
          title="Craft" 
          subtitle="Specialty Coffee" 
          description="Training coffee artisans in extraction science."
          icon={<Coffee className="w-5 h-5" />} 
          image="/assets/hero/craft.jpg"
          cvAction={() => downloadCV('barista')} 
          ref={rightCurtainRef} 
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion ?? false} 
          isRevealed={isRevealed}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </div>

      {!prefersReducedMotion && !isRevealed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.3em] font-medium">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-[var(--accent-primary)]" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default memo(Hero);