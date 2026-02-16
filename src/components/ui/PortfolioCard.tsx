'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getImageUrl } from '@/lib/sanity';
import type { PortfolioItem } from '@/types/sanity.types';

interface PortfolioCardProps {
  item: PortfolioItem;
  index: number;
  onClick: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, index, onClick }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onClick={onClick}
      className="group cursor-pointer w-[70vw] md:w-[40vw] lg:w-[35vw] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-card border border-theme theme-transition">
        {item.afterImage && (
          <img
            src={getImageUrl(item.afterImage, 800, 600, 80)}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
            loading="lazy"
          />
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-page/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="flex items-center gap-2 text-primary border border-accent/30 bg-page/80 backdrop-blur-sm px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 theme-transition">
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Explore</span>
            <ArrowUpRight size={16} className="text-accent" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-page/90 backdrop-blur-sm border border-theme rounded-full theme-transition">
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold theme-transition">
            {item.duration}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 mb-3">
        <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] uppercase tracking-widest font-bold rounded-full theme-transition">
          {item.category}
        </span>
      </div>
      
      <h3 className="font-display text-3xl md:text-4xl text-primary group-hover:text-accent transition-colors duration-300 leading-tight theme-transition">
        {item.title}
      </h3>
      
      <p className="mt-2 text-secondary text-sm line-clamp-2 max-w-md theme-transition">
        {item.description}
      </p>
    </motion.article>
  );
};

export default PortfolioCard;