'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const TrainingHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const scrollToContent = () => {
    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div ref={containerRef} className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center bg-[var(--bg-page)] transition-colors duration-700">
      {/* Animated Background */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-page)] via-[var(--bg-card)] to-[var(--bg-page)] transition-colors duration-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,124,0.15),transparent_70%)]" />
        
        {/* Floating ambient orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[var(--accent-primary)]/10 blur-3xl transition-colors duration-700"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 30}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}

        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,168,124,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,124,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] transition-colors duration-700" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6 inline-block">
          <span className="font-accent italic text-xl md:text-2xl text-[var(--accent-primary)] tracking-wide transition-colors duration-700">
            The Art of Extraction
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-[var(--text-primary)] mb-8 tracking-tight leading-[1.1] transition-colors duration-700"
        >
          Professional <br />
          <span className="italic text-[var(--accent-primary)] relative transition-colors duration-700">
            Barista
            <motion.span 
              className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
          </span> Training
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-body text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 transition-colors duration-700"
        >
          Bridging the gap between casual brewing and sensory mastery. 
          Intensive curriculum designed for professionals seeking perfection.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          {[ 
            { value: '04', label: 'Modules' },
            { value: '12+', label: 'Hours' },
            { value: 'SCA', label: 'Certified' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <span className="font-display text-3xl md:text-4xl text-[var(--accent-primary)] transition-colors duration-700">{stat.value}</span>
              <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-1 transition-colors duration-700">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-300 group"
      >
        <span className="text-xs uppercase tracking-widest font-medium transition-colors duration-700">Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-colors duration-300"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg-page)] to-transparent z-10 pointer-events-none transition-colors duration-700" />
    </div>
  );
};

export default TrainingHero;