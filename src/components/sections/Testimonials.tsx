'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useSanity } from '@/hooks/useSanity';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Play, 
  X, 
  Volume2, 
  VolumeX,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SanityTestimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  imageUrl?: string;
  image?: { alt?: string };
  rating?: number;
  theme?: 'beautician' | 'barista' | 'neutral';
  featured?: boolean;
  videoUrl?: string; // This will be populated from videoFile.asset->url
}

const fallbackImages = [
  '/assets/testimonials/client-1.jpg',
  '/assets/testimonials/client-2.jpg',
  '/assets/testimonials/client-3.jpg',
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<SanityTestimonial | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // UPDATED QUERY: Fetches video file URL from Sanity asset store
  const { data: testimonials, loading, error } = useSanity<SanityTestimonial[]>({
    query: `*[_type == "testimonial"] | order(featured desc, _createdAt desc) {
      _id,
      name,
      role,
      quote,
      rating,
      theme,
      "imageUrl": image.asset->url,
      image { alt },
      "videoUrl": videoFile.asset->url
    }`,
  });

  // Split testimonials: items with videoUrl go to video section, others to text carousel
  const textTestimonials = testimonials?.filter(t => !t.videoUrl) || [];
  const videoTestimonials = testimonials?.filter(t => t.videoUrl) || [];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      const cardWidth = 320;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (textTestimonials.length > 0) {
        setActiveIndex(Math.min(newIndex, textTestimonials.length - 1));
      }
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [textTestimonials.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <TestimonialsSkeleton />;
  
  if (error || (!textTestimonials.length && !videoTestimonials.length)) {
    return (
      <section ref={sectionRef} id="testimonials" className="relative py-24 lg:py-32 bg-[var(--bg-page)] min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6">
          <Quote className="w-12 h-12 text-[var(--accent-primary)]/30 mx-auto mb-4" />
          <h3 className="font-display text-2xl text-[var(--text-primary)] mb-2">
            {error ? 'Unable to Load Stories' : 'No Testimonials Yet'}
          </h3>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            {error ? error.message : 'Stories will appear here once added to Sanity.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      id="testimonials" 
      className="relative py-24 lg:py-32 bg-[var(--bg-page)] overflow-hidden transition-colors duration-700"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-primary)]/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[var(--accent-secondary)]/5 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--accent-primary)]/50" />
            <span className="text-[var(--accent-primary)] font-accent italic text-lg tracking-wide">Voices from the Journey</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--accent-primary)]/50" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] mb-6 tracking-tight">
            Words of <span className="italic text-[var(--accent-primary)]">Trust</span>
          </h2>
          
          <p className="font-body text-[var(--text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
            Authentic stories of transformation from those who have experienced the craft.
          </p>
        </motion.div>

        {/* Text Testimonials - Compact Cards */}
        {textTestimonials.length > 0 && (
          <div className="relative mb-32">
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-300 hidden md:flex items-center justify-center shadow-lg backdrop-blur-sm -translate-x-6"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              )}
              
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-300 hidden md:flex items-center justify-center shadow-lg backdrop-blur-sm translate-x-6"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <div 
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {textTestimonials.map((testimonial, index) => (
                <CompactTestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  index={index}
                  isHovered={hoveredId === testimonial._id}
                  isDimmed={hoveredId !== null && hoveredId !== testimonial._id}
                  onHover={() => setHoveredId(testimonial._id)}
                  onLeave={() => setHoveredId(null)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              {textTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollRef.current?.scrollTo({ left: index * 340, behavior: 'smooth' })}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === activeIndex 
                      ? "w-8 bg-[var(--accent-primary)]" 
                      : "w-1.5 bg-[var(--text-muted)]/20 hover:bg-[var(--text-muted)]/40"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video Testimonials Section */}
        {videoTestimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--accent-primary)]/30" />
              <h3 className="font-display text-2xl md:text-3xl text-[var(--text-primary)]">
                Video <span className="italic text-[var(--accent-primary)]">Stories</span>
              </h3>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--accent-primary)]/30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTestimonials.map((testimonial, index) => (
                <VideoTestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  index={index}
                  onPlay={() => setSelectedVideo(testimonial)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal 
            testimonial={selectedVideo} 
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onClose={() => setSelectedVideo(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// Compact Card Component - Preserved Exactly
function CompactTestimonialCard({ 
  testimonial, 
  index, 
  isHovered, 
  isDimmed, 
  onHover, 
  onLeave 
}: {
  testimonial: SanityTestimonial;
  index: number;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    onLeave();
  };

  const imageSrc = (!imageError && testimonial.imageUrl) 
    ? testimonial.imageUrl 
    : fallbackImages[index % fallbackImages.length];

  const rating = testimonial.rating || 5;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isDimmed ? 0.3 : 1, 
        y: 0,
        scale: isHovered ? 1.05 : isDimmed ? 0.92 : 1,
      }}
      transition={{ 
        opacity: { duration: 0.4 },
        y: { duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
        scale: { type: "spring", stiffness: 400, damping: 30 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={cn(
        "relative flex-shrink-0 w-[280px] sm:w-[300px] snap-center",
        "bg-[var(--bg-card)] rounded-3xl overflow-hidden",
        "border transition-all duration-500 ease-out cursor-pointer",
        "flex flex-col items-center text-center p-6",
        isHovered 
          ? "border-[var(--accent-primary)]/40 shadow-[0_25px_80px_-20px_rgba(201,168,124,0.4)] z-20 h-auto min-h-[380px]" 
          : "border-[var(--border-default)] h-[280px]",
        isDimmed && "blur-[2px]"
      )}
    >
      {/* Quote Icon */}
      <motion.div 
        animate={{ 
          scale: isHovered ? 1.2 : 1,
          y: isHovered ? -5 : 0
        }}
        className={cn(
          "absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
          isHovered ? "bg-[var(--accent-primary)]" : "bg-[var(--accent-primary)]/20"
        )}
      >
        <Quote className={cn(
          "w-4 h-4 transition-colors duration-300",
          isHovered ? "text-white fill-white" : "text-[var(--accent-primary)]"
        )} />
      </motion.div>

      {/* Avatar */}
      <motion.div 
        className="relative mb-4"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className={cn(
          "w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-500",
          isHovered ? "border-[var(--accent-primary)] shadow-[0_0_30px_rgba(201,168,124,0.3)]" : "border-[var(--border-default)]"
        )}>
          <img
            src={imageSrc}
            alt={testimonial.image?.alt || `${testimonial.name} portrait`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
        
        {isHovered && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            className="absolute inset-0 rounded-full border border-[var(--accent-primary)]/30"
            style={{ animation: 'spin 8s linear infinite' }}
          />
        )}
      </motion.div>

      {/* Name */}
      <div className="relative mb-3">
        <h4 className={cn(
          "font-display text-xl transition-colors duration-300",
          isHovered ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
        )}>
          {testimonial.name}
        </h4>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
        />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: isHovered && i < rating ? 1.3 : 1,
              y: isHovered && i < rating ? -2 : 0
            }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 400 }}
          >
            <Star 
              className={cn(
                "w-4 h-4 transition-all duration-300",
                i < rating 
                  ? "text-[var(--accent-primary)] fill-[var(--accent-primary)]" 
                  : "text-[var(--text-muted)]"
              )}
            />
          </motion.div>
        ))}
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden w-full"
          >
            <p className="text-[var(--accent-primary)] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              {testimonial.role}
            </p>
            <p className="text-[var(--text-primary)] text-sm leading-relaxed italic font-light">
              "{testimonial.quote}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10 -z-10 blur-xl"
          />
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// Video Card Component - Preserved Exactly
function VideoTestimonialCard({ 
  testimonial, 
  index, 
  onPlay 
}: {
  testimonial: SanityTestimonial;
  index: number;
  onPlay: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = (!imageError && testimonial.imageUrl) 
    ? testimonial.imageUrl 
    : fallbackImages[index % fallbackImages.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onPlay}
      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--accent-primary)]/30 transition-all duration-500 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(201,168,124,0.3)]"
    >
      <img
        src={imageSrc}
        alt={testimonial.image?.alt || `${testimonial.name} video thumbnail`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={() => setImageError(true)}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:border-[var(--accent-primary)] transition-all duration-300"
        >
          <Play className="w-6 h-6 text-white fill-white ml-1" />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h4 className="font-display text-white text-lg mb-1 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
          {testimonial.name}
        </h4>
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
          {testimonial.role}
        </p>
      </div>

      <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
        Watch Story
      </div>
    </motion.div>
  );
}

// Video Modal - Preserved Exactly (works with Sanity file URLs)
function VideoModal({ 
  testimonial, 
  isMuted, 
  onToggleMute, 
  onClose 
}: {
  testimonial: SanityTestimonial;
  isMuted: boolean;
  onToggleMute: () => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
      >
        <X className="w-6 h-6" />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {testimonial.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={testimonial.videoUrl}
              autoPlay
              playsInline
              controls
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-display text-xl">{testimonial.name}</h3>
                  <p className="text-white/70 text-sm">{testimonial.role}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={onToggleMute}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => videoRef.current?.requestFullscreen()}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <p>Video not available</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function TestimonialsSkeleton() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--bg-page)] min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
        <span className="text-[var(--text-muted)] text-sm uppercase tracking-widest">Loading Stories...</span>
      </div>
    </section>
  );
}

export default Testimonials;