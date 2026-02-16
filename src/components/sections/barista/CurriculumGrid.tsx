'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  Droplets, 
  Thermometer, 
  Bean, 
  Award, 
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface CurriculumItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced';
  icon: React.ReactNode;
  accent: string;
}

const CURRICULUM_ITEMS: CurriculumItem[] = [
  {
    id: '01',
    title: 'The Green Bean',
    subtitle: 'Origins & Processing',
    description: 'Journey from seed to cup. Master varietals, processing methods, and origin characteristics that define flavor.',
    duration: '4 Hours',
    level: 'Foundation',
    icon: <Bean className="w-6 h-6" />,
    accent: 'emerald'
  },
  {
    id: '02',
    title: 'Extraction Science',
    subtitle: 'The Perfect Shot',
    description: 'Precision espresso techniques. TDS, extraction yields, grind calibration, and pressure profiling mastery.',
    duration: '6 Hours',
    level: 'Foundation',
    icon: <Coffee className="w-6 h-6" />,
    accent: 'amber'
  },
  {
    id: '03',
    title: 'Milk Chemistry',
    subtitle: 'Texture & Temperature',
    description: 'Transform milk into silk. Microfoam physics, protein chemistry, and temperature precision for flawless pours.',
    duration: '4 Hours',
    level: 'Intermediate',
    icon: <Droplets className="w-6 h-6" />,
    accent: 'sky'
  },
  {
    id: '04',
    title: 'Sensory Analysis',
    subtitle: 'Cupping & Calibration',
    description: 'Develop professional palate. Cupping protocols, defect detection, and flavor wheel navigation.',
    duration: '3 Hours',
    level: 'Intermediate',
    icon: <Thermometer className="w-6 h-6" />,
    accent: 'rose'
  },
  {
    id: '05',
    title: 'Latte Art Mastery',
    subtitle: 'Pouring Techniques',
    description: 'From hearts to complex patterns. Milk flow control, jug positioning, and artistic free-pour techniques.',
    duration: '4 Hours',
    level: 'Advanced',
    icon: <Award className="w-6 h-6" />,
    accent: 'violet'
  },
  {
    id: '06',
    title: 'Cafe Operations',
    subtitle: 'Workflow & Service',
    description: 'Master the rhythm of service. Workflow optimization, equipment care, and customer experience design.',
    duration: '3 Hours',
    level: 'Advanced',
    icon: <Clock className="w-6 h-6" />,
    accent: 'gold'
  }
];

const accentColors: Record<string, { bg: string; text: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'group-hover:shadow-amber-500/20' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', glow: 'group-hover:shadow-sky-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', glow: 'group-hover:shadow-rose-500/20' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', glow: 'group-hover:shadow-violet-500/20' },
  gold: { bg: 'bg-[var(--accent-primary)]/10', text: 'text-[var(--accent-primary)]', glow: 'group-hover:shadow-[var(--accent-primary)]/20' }
};

const CurriculumCard: React.FC<{ 
  item: CurriculumItem; 
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}> = ({ item, index, hoveredId, setHoveredId }) => {
  const isHovered = hoveredId === item.id;
  const isDimmed = hoveredId !== null && !isHovered;
  const accent = accentColors[item.accent];
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 10,
      y: (e.clientY - rect.top - rect.height / 2) / 10
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setHoveredId(null);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseEnter={() => setHoveredId(item.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative group cursor-pointer
        transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isDimmed ? 'opacity-40 scale-[0.98] blur-[1px]' : 'opacity-100 scale-100 blur-0'}
      `}
    >
      <motion.div
        animate={{ 
          x: isHovered ? mousePosition.x : 0,
          y: isHovered ? mousePosition.y : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className={`
          relative h-full
          bg-[var(--bg-card)]/80 backdrop-blur-sm
          border border-[var(--border-default)]
          rounded-3xl p-8
          overflow-hidden
          transition-all duration-500
          ${isHovered 
            ? `border-[var(--accent-primary)]/30 shadow-2xl ${accent.glow} scale-[1.02]` 
            : 'hover:border-[var(--border-hover)]'
          }
        `}
      >
        {/* Animated Gradient Background */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${accent.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
          initial={false}
          animate={{ opacity: isHovered ? 0.5 : 0 }}
        />
        
        {/* Spotlight Effect */}
        <motion.div
          className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x * 2 + 50}% ${mousePosition.y * 2 + 50}%, rgba(201,168,124,0.15), transparent 40%)`
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header with Icon */}
          <div className="flex items-start justify-between mb-6">
            <motion.div 
              animate={{ 
                x: isHovered ? mousePosition.x * 0.5 : 0,
                y: isHovered ? mousePosition.y * 0.5 : 0,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className={`
                w-14 h-14 rounded-2xl 
                ${accent.bg} 
                border border-[var(--accent-primary)]/20
                flex items-center justify-center
                ${accent.text}
                transition-all duration-500
                group-hover:border-[var(--accent-primary)]/40
                group-hover:shadow-lg
              `}
            >
              {item.icon}
            </motion.div>
            
            <span className="text-[var(--text-muted)]/30 font-display text-6xl font-bold leading-none select-none">
              {item.id}
            </span>
          </div>

          {/* Level Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12 + 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className={`
              px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em]
              ${accent.bg} ${accent.text} border border-[var(--accent-primary)]/20
            `}>
              {item.level}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock className="w-3 h-3" />
              {item.duration}
            </span>
          </motion.div>

          {/* Title with Underline Animation */}
          <div className="relative mb-3 overflow-hidden">
            <h3 className="font-display text-2xl text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-500">
              {item.title}
            </h3>
            <motion.div 
              className="absolute bottom-0 left-0 h-[1px] bg-[var(--accent-primary)]"
              initial={{ width: 0 }}
              animate={{ width: isHovered ? '100%' : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <p className={`text-sm ${accent.text} font-medium mb-4 tracking-wide`}>
            {item.subtitle}
          </p>

          {/* Description */}
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-3 mb-6">
            {item.description}
          </p>

          {/* CTA Link */}
          <motion.div 
            className="flex items-center gap-2 text-[var(--accent-primary)] text-sm font-medium"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="relative">
              Explore Module
              <span className="absolute -bottom-0.5 left-0 w-full h-px bg-[var(--accent-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </span>
            <ArrowUpRight className={`
              w-4 h-4 transition-transform duration-300
              ${isHovered ? 'translate-x-1 -translate-y-1' : ''}
            `} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CurriculumGrid: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="py-32 lg:py-40 bg-[var(--bg-page)] relative overflow-hidden transition-colors duration-700"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--accent-primary)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--accent-primary)]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              The Journey
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-[var(--text-primary)] mb-6 leading-[1.1] transition-colors duration-700"
          >
            Six Modules to{' '}
            <span className="italic text-[var(--accent-primary)] relative inline-block">
              Mastery
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[var(--accent-primary)]/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed transition-colors duration-700"
          >
            From bean to cup, each module builds upon the last, crafting a comprehensive 
            foundation for professional excellence.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CURRICULUM_ITEMS.map((item, index) => (
            <CurriculumCard
              key={item.id}
              item={item}
              index={index}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>

        {/* Bottom Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-12 text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-display text-[var(--accent-primary)]">24+</span>
              <span className="text-sm uppercase tracking-[0.2em]">Hours</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-[var(--border-default)]" />
            <div className="flex items-center gap-3">
              <span className="text-4xl font-display text-[var(--accent-primary)]">6</span>
              <span className="text-sm uppercase tracking-[0.2em]">Modules</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-[var(--border-default)]" />
            <div className="flex items-center gap-3">
              <span className="text-4xl font-display text-[var(--accent-primary)]">SCA</span>
              <span className="text-sm uppercase tracking-[0.2em]">Certified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurriculumGrid;