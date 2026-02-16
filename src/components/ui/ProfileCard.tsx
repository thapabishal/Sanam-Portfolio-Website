/**
 * ProfileCard Component
 * 
 * An interactive 3D tilt card with dynamic lighting, glow effects, and smooth physics.
 * Features reduced motion support for accessibility and proper cleanup to prevent memory leaks.
 */

'use client';

import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { cn } from '../../lib/utils';

// ============================================================================
// Configuration Constants
// ============================================================================

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
  DEFAULT_TAU: 0.16,
  INITIAL_TAU: 0.6,
  SETTLE_THRESHOLD: 0.6,
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

const round = (v: number, precision = 3): number => {
  const p = Math.pow(10, precision);
  return Math.round(v * p) / p;
};

const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number): number =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface ProfileCardProps {
  avatarUrl?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  hideFooter?: boolean;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

interface TiltEngine {
  setImmediate: (x: number, y: number) => void;
  setTarget: (x: number, y: number) => void;
  toCenter: (shellWidth: number, shellHeight: number) => void;
  beginInitial: (durationMs: number) => void;
  getCurrent: () => { x: number; y: number; tx: number; ty: number };
  cancel: () => void;
}

// ============================================================================
// Component Implementation
// ============================================================================

export const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
  behindGlowEnabled = true,
  behindGlowColor = 'rgba(201, 168, 124, 0.4)',
  behindGlowSize = '70%',
  className = '',
  enableTilt = true,
  hideFooter = false,
  miniAvatarUrl,
  name = 'Kamal Saru',
  title = 'Creative Artisan',
  handle = 'kamalsaru',
  status = 'Active Now',
  contactText = 'Get in Touch',
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Disable tilt if user prefers reduced motion
  const shouldEnableTilt = enableTilt && !prefersReducedMotion;

  // Initialize Tilt Engine
  const tiltEngine = useMemo<TiltEngine | null>(() => {
    if (!shouldEnableTilt || typeof window === 'undefined') return null;
    
    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number): void => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;
      
      const percentX = clamp((100 / width) * x, 0, 100);
      const percentY = clamp((100 / height) * y, 0, 100);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      // Set CSS custom properties for GPU-accelerated transforms
      wrap.style.setProperty('--pointer-x', `${percentX}%`);
      wrap.style.setProperty('--pointer-y', `${percentY}%`);
      wrap.style.setProperty('--background-x', `${adjust(percentX, 0, 100, 35, 65)}%`);
      wrap.style.setProperty('--background-y', `${adjust(percentY, 0, 100, 35, 65)}%`);
      wrap.style.setProperty('--rotate-x', `${round(-(centerX / 6))}deg`);
      wrap.style.setProperty('--rotate-y', `${round(centerY / 5)}deg`);
      wrap.style.setProperty('--card-opacity', '1');
    };

    const step = (ts: number): void => {
      if (!running) return;
      
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      
      const tau = ts < initialUntil ? ANIMATION_CONFIG.INITIAL_TAU : ANIMATION_CONFIG.DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);
      
      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;
      
      setVarsFromXY(currentX, currentY);
      
      const stillFar = 
        Math.abs(targetX - currentX) > 0.05 || 
        Math.abs(targetY - currentY) > 0.05;
      
      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = (): void => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number): void {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      
      setTarget(x: number, y: number): void {
        targetX = x;
        targetY = y;
        start();
      },
      
      toCenter(shellWidth: number, shellHeight: number): void {
        this.setTarget(shellWidth / 2, shellHeight / 2);
      },
      
      beginInitial(durationMs: number): void {
        initialUntil = performance.now() + durationMs;
        start();
      },
      
      getCurrent(): { x: number; y: number; tx: number; ty: number } {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      
      cancel(): void {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        running = false;
        lastTs = 0;
      }
    };
  }, [shouldEnableTilt]);

  // Event Handlers
  const handlePointerMove = useCallback((e: PointerEvent) => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    
    const rect = shell.getBoundingClientRect();
    tiltEngine.setTarget(e.clientX - rect.left, e.clientY - rect.top);
  }, [tiltEngine]);

  const handlePointerEnter = useCallback((e: PointerEvent) => {
    const shell = shellRef.current;
    if (!shell) return;
    
    shell.classList.add('entering');
    
    if (enterTimerRef.current) {
      window.clearTimeout(enterTimerRef.current);
    }
    
    enterTimerRef.current = window.setTimeout(() => {
      shell.classList.remove('entering');
    }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);
    
    handlePointerMove(e);
  }, [handlePointerMove]);

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    
    const { width, height } = shell.getBoundingClientRect();
    tiltEngine.toCenter(width, height);
    
    // Check when card settles and stop RAF
    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      
      if (Math.hypot(tx - x, ty - y) < ANIMATION_CONFIG.SETTLE_THRESHOLD) {
        if (leaveRafRef.current) {
          cancelAnimationFrame(leaveRafRef.current);
          leaveRafRef.current = null;
        }
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  // Setup effect
  useEffect(() => {
    setIsMounted(true);
    
    if (!shouldEnableTilt || !tiltEngine) return;
    
    const shell = shellRef.current;
    if (!shell) return;

    // Add event listeners
    shell.addEventListener('pointerenter', handlePointerEnter);
    shell.addEventListener('pointermove', handlePointerMove);
    shell.addEventListener('pointerleave', handlePointerLeave);

    // Initialize position
    const { width, height } = shell.getBoundingClientRect();
    tiltEngine.setImmediate(width / 2, height / 2);
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    // Cleanup function
    return () => {
      shell.removeEventListener('pointerenter', handlePointerEnter);
      shell.removeEventListener('pointermove', handlePointerMove);
      shell.removeEventListener('pointerleave', handlePointerLeave);
      
      // Clear all timers and RAFs
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
      
      if (leaveRafRef.current) {
        cancelAnimationFrame(leaveRafRef.current);
        leaveRafRef.current = null;
      }
      
      tiltEngine.cancel();
    };
  }, [shouldEnableTilt, tiltEngine, handlePointerEnter, handlePointerMove, handlePointerLeave]);

  const cardRadius = '28px';

  // CSS Variables for styling
  const wrapperStyle: React.CSSProperties = {
    perspective: '1500px',
    transform: 'translate3d(0, 0, 0.1px)',
    ['--behind-glow-color' as string]: behindGlowColor,
    ['--behind-glow-size' as string]: behindGlowSize,
  };

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!isMounted) {
    return (
      <div className={cn("relative touch-none group", className)} style={wrapperStyle}>
        <div className="relative z-[1]">
          <section
            className="grid relative overflow-hidden"
            style={{
              width: '100%',
              aspectRatio: '0.72',
              borderRadius: cardRadius,
              background: 'linear-gradient(165deg, #1A1512 0%, #3E2723 100%)',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cn("relative touch-none group", className)}
      style={wrapperStyle}
    >
      {behindGlowEnabled && (
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), var(--behind-glow-color) 0%, transparent var(--behind-glow-size))",
            filter: 'blur(80px) saturate(1.5)',
            opacity: 'var(--card-opacity, 0)',
          }}
        />
      )}
      
      <div ref={shellRef} className="relative z-[1]">
        <section
          className="grid relative overflow-hidden transition-transform duration-100 ease-out will-change-transform"
          style={{
            width: '100%',
            aspectRatio: '0.72',
            borderRadius: cardRadius,
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8)',
            transform: prefersReducedMotion 
              ? 'none' 
              : 'rotateX(var(--rotate-y, 0deg)) rotateY(var(--rotate-x, 0deg)) translateZ(0)',
            background: 'linear-gradient(165deg, #1A1512 0%, #3E2723 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Dynamic lighting overlay */}
          <div 
            className="absolute inset-0 z-[3] mix-blend-color-dodge opacity-20 pointer-events-none" 
            style={{
              background: "radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(201,168,124,0.4) 0%, transparent 80%)",
              borderRadius: cardRadius,
            }} 
          />
          
          <div className="relative z-[2] flex flex-col h-full overflow-hidden">
            {/* Main Avatar Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={avatarUrl} 
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-105 group-hover:scale-105" 
              alt={name}
              style={{ maskImage: 'linear-gradient(to top, black 82%, transparent)' }}
              loading="eager"
            />
            
            {/* Content Overlay */}
            <div className="mt-auto p-10 relative z-[10]">
              {showUserInfo && (
                <div className="flex items-center justify-between bg-black/50 backdrop-blur-3xl border border-white/5 p-4 rounded-2xl shadow-2xl transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={miniAvatarUrl || avatarUrl} 
                      className="w-11 h-11 rounded-full object-cover border border-white/10" 
                      alt="avatar" 
                    />
                    <div>
                      <p className="text-white text-xs font-bold tracking-tight">@{handle}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-1.5 h-1.5 bg-beautician-primary rounded-full animate-pulse shadow-[0_0_8px_#C9A87C]" />
                        <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-bold">{status}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={onContactClick} 
                    className="bg-white/10 hover:bg-beautician-primary text-white text-[10px] font-bold px-5 py-2.5 rounded-lg transition-all border border-white/10 uppercase tracking-widest active:scale-95"
                    type="button"
                  >
                    {contactText}
                  </button>
                </div>
              )}
              
              {/* Footer - Only shown if hideFooter is false */}
              {!hideFooter && (
                <div className="mt-10 text-center">
                  <h3 className="font-display text-5xl text-white mb-3 leading-none drop-shadow-lg">{name}</h3>
                  <div className="w-14 h-px bg-beautician-primary mx-auto mb-4 opacity-60" />
                  <p className="font-body text-[11px] uppercase tracking-[0.6em] text-beautician-primary font-bold opacity-90">
                    {title}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

ProfileCard.displayName = 'ProfileCard';

export default React.memo(ProfileCard);