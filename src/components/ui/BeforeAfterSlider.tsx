import React, { useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  isCardView?: boolean;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after, isCardView = false }) => {
  // Check for missing images
  if (!before || !after) {
    return (
      <div className="w-full h-full bg-neutral-800 animate-pulse flex items-center justify-center text-white/30 text-xs uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth scrubbing
  const xPercent = useMotionValue(50);
  const smoothXPercent = useSpring(xPercent, {
    stiffness: 120,
    damping: 25,
    mass: 0.5
  });

  const clipPath = useTransform(smoothXPercent, (p) => `inset(0 ${100 - p}% 0 0)`);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    xPercent.set(percent);
  }, [xPercent]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging || isCardView) handleMove(e.clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging || isCardView) handleMove(e.touches[0].clientX);
  };

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => {
    setIsDragging(false);
    if (isCardView) xPercent.set(50);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => {
        setIsDragging(false);
        if (isCardView) xPercent.set(50);
      }}
      className={`relative w-full h-full select-none overflow-hidden ${
        isDragging ? 'cursor-col-resize' : 'cursor-ew-resize'
      }`}
    >
      {/* Background: After Image (Base) - Full Color */}
      <div className="absolute inset-0 bg-neutral-900">
        <img 
          src={after} 
          alt="After" 
          className="w-full h-full object-cover"
          style={{ filter: 'none' }}
          draggable={false}
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] uppercase tracking-widest text-white/50 border border-white/10 font-bold z-10">
          After
        </div>
      </div>

      {/* Overlay: Before Image (Clipped) - Full Color (FIXED: Removed grayscale class) */}
      <motion.div 
        style={{ clipPath }}
        className="absolute inset-0 z-10 bg-neutral-900 border-r border-white/20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
      >
        <img 
          src={before} 
          alt="Before" 
          className="w-full h-full object-cover"
          style={{ filter: 'none' }}
          draggable={false}
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] uppercase tracking-widest text-white/50 border border-white/10 font-bold z-10">
          Before
        </div>
      </motion.div>

      {/* Handle Line with Gold Color */}
      <motion.div 
        style={{ left: useTransform(smoothXPercent, (p) => `${p}%`) }}
        className="absolute top-0 bottom-0 w-[2px] bg-[#C9A962] z-20 pointer-events-none shadow-[0_0_10px_rgba(201,169,98,0.5)]"
      >
        {/* Handle Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1a1a1a] border-2 border-[#C9A962] flex items-center justify-center shadow-2xl">
           <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-[#C9A962]" />
             <div className="w-1 h-1 rounded-full bg-[#C9A962]" />
             <div className="w-1 h-1 rounded-full bg-[#C9A962]" />
           </div>
        </div>
      </motion.div>

      {/* Tooltip Overlay for Card View */}
      {isCardView && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-md border border-[#C9A962]/30 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#C9A962] font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Slide to reveal
        </div>
      )}
    </div>
  );
};

export { BeforeAfterSlider };