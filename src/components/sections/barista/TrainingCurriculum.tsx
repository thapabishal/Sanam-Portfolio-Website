'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Clock, 
  Users, 
  Award, 
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const CURRICULUM_MODULES = [
  {
    id: 'foundation',
    title: 'Foundation Skills',
    description: 'Master the essentials of espresso preparation, grinding, and machine operation.',
    topics: ['Espresso Extraction', 'Grind Calibration', 'Equipment Basics', 'Workflow Setup'],
    duration: '8 hours',
    color: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 'intermediate',
    title: 'Milk & Texture',
    description: 'Perfect your milk steaming technique and learn the science of microfoam.',
    topics: ['Milk Chemistry', 'Temperature Control', 'Texturing Techniques', 'Basic Pouring'],
    duration: '6 hours',
    color: 'from-sky-500/20 to-blue-500/20'
  },
  {
    id: 'advanced',
    title: 'Latte Art',
    description: 'Develop artistic pouring skills from basic patterns to complex designs.',
    topics: ['Pattern Fundamentals', 'Free Pour Control', 'Advanced Patterns', 'Composition'],
    duration: '6 hours',
    color: 'from-violet-500/20 to-purple-500/20'
  },
  {
    id: 'mastery',
    title: 'Sensory & Operations',
    description: 'Refine your palate and master the operational aspects of cafe service.',
    topics: ['Cupping Protocols', 'Flavor Profiling', 'Quality Control', 'Service Excellence'],
    duration: '4 hours',
    color: 'from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20'
  }
];

const TrainingCurriculum: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const link = document.createElement('a');
      link.href = '/assets/syllabus/syllabus.pdf';
      link.download = 'Kamala-Barista-Syllabus.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsComplete(true);
      setTimeout(() => {
        setIsComplete(false);
        setIsDownloading(false);
      }, 3000);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="training-curriculum"
      className="py-32 lg:py-40 bg-[var(--bg-card)] relative overflow-hidden transition-colors duration-700"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent-primary)]/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px w-12 bg-[var(--accent-primary)]/50" />
              <span className="text-[var(--accent-primary)] font-accent italic text-lg">Your Path Forward</span>
            </motion.div>
            
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[var(--text-primary)] mb-8 leading-[1.05] transition-colors duration-700">
              Craft Your{' '}
              <span className="italic text-[var(--accent-primary)] relative">
                Expertise
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-primary)] to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
            </h2>
            
            <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed mb-10 transition-colors duration-700 max-w-xl">
              Every expert was once a beginner. Our structured curriculum guides you 
              through a transformative journey—from your first espresso to mastering 
              the craft.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {[
                { icon: Clock, value: '24+', label: 'Hours' },
                { icon: Users, value: '1:4', label: 'Ratio' },
                { icon: Award, value: 'SCA', label: 'Aligned' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="group cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center mb-3 group-hover:bg-[var(--accent-primary)]/20 transition-colors">
                    <stat.icon className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <p className="text-3xl font-display text-[var(--text-primary)] mb-1">{stat.value}</p>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-[0.15em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Download Button */}
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading || isComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                group relative w-full sm:w-auto
                px-10 py-6 rounded-full
                overflow-hidden
                font-bold uppercase tracking-[0.15em] text-xs
                transition-all duration-500
                ${isComplete 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[var(--accent-primary)] text-[var(--bg-page)] hover:shadow-[0_20px_50px_-12px_rgba(201,168,124,0.4)]'
                }
                disabled:cursor-not-allowed
              `}
              aria-label="Download complete training curriculum PDF"
            >
              {/* Background Animation */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)]"
                initial={{ x: '-100%' }}
                whileHover={!isComplete && !isDownloading ? { x: 0 } : {}}
                transition={{ duration: 0.4 }}
              />
              
              {/* Ripple Effect Container */}
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,var(--bg-page)_1px,transparent_1px)] bg-[length:4px_4px] transition-opacity" />
              </span>

              <span className="relative z-10 flex items-center justify-center gap-3">
                {isComplete ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Downloaded
                  </>
                ) : isDownloading ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-[var(--bg-page)]/30 border-t-[var(--bg-page)] rounded-full"
                    />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Download Curriculum
                    <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-4 text-xs text-[var(--text-muted)] flex items-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              PDF includes detailed syllabus, learning outcomes, and certification path
            </motion.p>
          </motion.div>

          {/* Right Content - Module Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-4"
          >
            {CURRICULUM_MODULES.map((module, index) => (
              <motion.div
                key={module.id}
                variants={itemVariants}
                whileHover={{ x: 10, scale: 1.02 }}
                className={`
                  group relative p-6 rounded-2xl
                  bg-[var(--bg-page)]/50 backdrop-blur-sm
                  border border-[var(--border-default)]
                  hover:border-[var(--accent-primary)]/30
                  transition-all duration-500
                  cursor-pointer
                  overflow-hidden
                `}
              >
                {/* Hover Gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${module.color} opacity-0 
                  group-hover:opacity-100 transition-opacity duration-500
                `} />
                
                <div className="relative z-10 flex items-center gap-5">
                  <span className="text-3xl font-display text-[var(--accent-primary)]/30 group-hover:text-[var(--accent-primary)] transition-colors duration-500 w-12">
                    0{index + 1}
                  </span>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display text-xl text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {module.title}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider group-hover:text-[var(--accent-primary)] transition-colors">
                        {module.duration}
                      </span>
                    </div>
                    
                    <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                      {module.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, i) => (
                        <span 
                          key={i}
                          className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-1 rounded border border-[var(--border-default)] group-hover:border-[var(--accent-primary)]/20 group-hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrainingCurriculum;