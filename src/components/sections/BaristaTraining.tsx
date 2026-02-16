'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TrainingHero from './barista/TrainingHero';
import TrainingCurriculum from './barista/TrainingCurriculum';
import DemoVideos from './barista/DemoVideos';
import FormSheet from '../ui/FormSheet';
import TrainingInquiryForm from '../forms/TrainingInquiryForm';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

const BaristaTraining: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Theme is managed centrally by ThemeProvider - no blocking code needed

  return (
    <section 
      id="training" 
      className="relative bg-[var(--bg-page)] transition-colors duration-500 overflow-hidden"
    >
      <TrainingHero />
      <TrainingCurriculum />
      <DemoVideos />
      
      {/* CTA SECTION - Consistent with site design */}
      <div className="relative py-20 lg:py-28 px-6 md:px-12">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent-primary)]/5 blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-[var(--bg-card)] border border-[var(--border-default)] rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden transition-colors duration-500 text-center"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" />

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
                Begin Your Journey
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl text-[var(--text-primary)] mb-4 leading-tight"
            >
              Master the <span className="italic text-[var(--accent-primary)]">Craft</span>
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[var(--text-secondary)] text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
            >
              Professional training for cafes and corporate teams. Customized programs from foundation to mastery.
            </motion.p>
            
            {/* Buttons - Consistent with Hero/Contact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Primary Button */}
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsBookingOpen(true)}
                className="group relative w-full sm:w-auto px-8 py-4 bg-[var(--accent-primary)] text-[var(--bg-page)] font-bold uppercase tracking-[0.15em] text-xs rounded-full overflow-hidden shadow-lg hover:shadow-[var(--accent-primary)]/30 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Session</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
              
              {/* Secondary Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                className="group w-full sm:w-auto px-8 py-4 border border-[var(--border-default)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] font-bold uppercase tracking-[0.15em] text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Explore Curriculum</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-6 border-t border-[var(--border-default)] flex flex-wrap items-center justify-center gap-6 text-[var(--text-muted)] text-xs uppercase tracking-wider"
            >
              {['Certified', 'Hands-on', 'Industry Proven'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <FormSheet
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Start Your Training Journey"
        subtitle="Tell us about your team and goals"
      >
        <div className="max-w-lg mx-auto">
          <TrainingInquiryForm onSuccess={() => setTimeout(() => setIsBookingOpen(false), 2000)} />
        </div>
      </FormSheet>
    </section>
  );
};

export default BaristaTraining;