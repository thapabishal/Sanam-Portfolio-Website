'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useSanity } from '@/hooks/useSanity';
import { Play, X, Volume2, VolumeX, Maximize2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoVideo {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100,
      duration: 0.5,
    },
  },
};

// Separate component to isolate hover state and prevent parent re-renders
const VideoCard: React.FC<{
  video: DemoVideo;
  index: number;
  onSelect: (video: DemoVideo) => void;
}> = ({ video, index, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse tracking for parallax - HOOKS CALLED AT TOP LEVEL ONLY
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  // Pre-computed transforms - NEVER inside event handlers
  const rotateX = useTransform(y, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-2deg", "2deg"]);
  const thumbnailX = useTransform(x, [-0.5, 0.5], [-6, 6]);
  const thumbnailY = useTransform(y, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const handleClick = useCallback(() => {
    onSelect(video);
  }, [onSelect, video]);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformPerspective: 1000,
      }}
      className={cn(
        "relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group",
        "border transition-all duration-500 ease-out",
        isHovered 
          ? "border-[var(--accent-primary)]/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] z-10 scale-[1.02]" 
          : "border-[var(--border-default)] shadow-lg",
        "bg-[var(--bg-elevated)]"
      )}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${video.title}`}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Thumbnail with Parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={{
          x: isHovered ? thumbnailX : 0,
          y: isHovered ? thumbnailY : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", damping: 20 }}
      >
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-page)]" />
        )}
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-[var(--accent-primary)]/0 group-hover:bg-[var(--accent-primary)]/5 transition-colors duration-500" />

      {/* Play Button with Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-[var(--accent-primary)] blur-xl transition-opacity duration-500",
              isHovered ? "opacity-40" : "opacity-0"
            )}
          />
          
          {/* Button Circle */}
          <div className={cn(
            "relative w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center transition-all duration-500 border-2 backdrop-blur-sm",
            isHovered 
              ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]" 
              : "bg-white/10 border-white/30"
          )}>
            <Play className={cn(
              "w-6 h-6 ml-0.5 transition-all duration-300",
              isHovered ? "text-[var(--bg-page)] fill-[var(--bg-page)]" : "text-white fill-white"
            )} />
          </div>

          {/* Ripple Rings */}
          {isHovered && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border border-[var(--accent-primary)]/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-[var(--accent-primary)]/20"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              />
            </>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <motion.div
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {video.category && (
            <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-[10px] uppercase tracking-wider mb-2 border border-white/10">
              {video.category}
            </span>
          )}
          
          {/* Title with Gradient Underline */}
          <div className="relative inline-block mb-1">
            <h3 className={cn(
              "font-display text-lg md:text-xl text-white transition-colors duration-300",
              isHovered && "text-[var(--accent-primary)]"
            )}>
              {video.title}
            </h3>
            <motion.div
              className="absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-[var(--accent-primary)] to-transparent"
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {video.description && (
            <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Separate modal component to prevent unnecessary re-renders
const VideoModal: React.FC<{
  video: DemoVideo;
  isMuted: boolean;
  onToggleMute: () => void;
  onClose: () => void;
}> = ({ video, isMuted, onToggleMute, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.1 }}
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 border border-white/20 hover:border-[var(--accent-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        aria-label="Close video"
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Video Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[var(--bg-elevated)] z-10"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-[var(--accent-primary)] animate-spin" />
                <span className="text-[var(--text-secondary)] text-sm">Loading video...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <video
          ref={videoRef}
          src={video.videoUrl}
          autoPlay
          playsInline
          controls
          className="w-full h-full object-contain"
          onLoadedData={handleLoaded}
          onError={handleLoaded}
        />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between pointer-events-none">
          <div className="flex-1 min-w-0 mr-4 pointer-events-auto">
            <h3 id="video-modal-title" className="text-white font-display text-lg md:text-xl truncate">
              {video.title}
            </h3>
            <p className="text-white/60 text-sm mt-1">{video.category}</p>
          </div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={onToggleMute}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              aria-label="Enter fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main component
const DemoVideos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<DemoVideo | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const { data: videos, loading, error } = useSanity<DemoVideo[]>({
    query: `*[_type == "demoVideo"] | order(order asc) {
      _id,
      title,
      description,
      category,
      "videoUrl": videoFile.asset->url,
      "thumbnailUrl": thumbnail.asset->url
    }`,
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedVideo]);

  const handleSelectVideo = useCallback((video: DemoVideo) => {
    setSelectedVideo(video);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  if (loading) {
    return (
      <section id="demo-videos" className="py-24 lg:py-32 bg-[var(--bg-card)] relative overflow-hidden transition-colors duration-700">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="h-px w-12 bg-[var(--accent-primary)]/30 animate-pulse" />
              <div className="h-8 w-48 bg-[var(--bg-elevated)] rounded animate-pulse" />
              <div className="h-12 w-72 bg-[var(--bg-elevated)] rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/10] bg-[var(--bg-elevated)] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('DemoVideos error:', error);
    return null;
  }

  if (!videos || videos.length === 0) return null;

  return (
    <section id="demo-videos" className="py-24 lg:py-32 bg-[var(--bg-card)] relative overflow-hidden transition-colors duration-700">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-secondary)]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-[var(--accent-primary)]/50" />
              <span className="text-[var(--accent-primary)] font-accent italic text-lg">Visual Learning</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-[var(--text-primary)]">
              Technique <span className="italic text-[var(--accent-primary)]">Demos</span>
            </h2>
          </div>
          <p className="text-[var(--text-secondary)] max-w-md text-sm leading-relaxed md:text-right">
            High-definition instructional clips highlighting core mechanical movements and sensory techniques.
          </p>
        </motion.div>

        {/* Video Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {videos.map((video, index) => (
            <VideoCard
              key={video._id}
              video={video}
              index={index}
              onSelect={handleSelectVideo}
            />
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence mode="wait">
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default DemoVideos;