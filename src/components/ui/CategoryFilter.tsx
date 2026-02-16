'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Category {
  value: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: any) => void;
}

export function CategoryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {categories.map((cat) => (
        <motion.button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-medium uppercase tracking-wider transition-all duration-300 border',
            activeCategory === cat.value
              ? 'bg-[var(--color-beautician-primary)] text-[#1A1512] border-[var(--color-beautician-primary)] shadow-lg'
              : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-beautician-primary)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}

export default CategoryFilter;