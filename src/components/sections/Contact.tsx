'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Instagram, 
  Facebook, 
  MessageCircle,
  Clock,
  Sparkles,
  Coffee,
  ArrowRight,
  Copy,
  Check,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ContactForm from '@/components/forms/ContactForm';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Elegant animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'beautician' | 'barista' | 'default'>('default');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Sync theme with global state (subtle inspiration from Footer)
  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') as 'beautician' | 'barista' | 'default';
      if (theme) setCurrentTheme(theme);
    };
    updateTheme();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') updateTheme();
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const contactInfo = {
    name: "Kamala Saru",
    title: "Dual Craft Artisan",
    subtitle: "Makeup Artist & Barista Trainer",
    email: "sanam@kamalasaru.com.np",
    phone: "+977-9821407395",
    location: "Tilottama-11, Butwal, Nepal",
    availability: "Open for Bookings & Training",
    studio: "Sister's Beauty Corner and Training Centre"
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative py-32 md:py-40 bg-[var(--bg-page)] overflow-hidden transition-colors duration-700"
    >
      {/* Minimalist ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ duration: 2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[var(--accent-primary)]/10 to-transparent blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header - Final Chapter Narrative */}
        <div className="text-center mb-20 md:mb-28">
          <motion.span 
            custom={0}
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-[var(--accent-primary)] font-accent italic text-lg md:text-xl block mb-4 tracking-wide"
          >
            The Invitation
          </motion.span>
          
          <motion.h2 
            custom={0.1}
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-[var(--text-primary)] mb-6 leading-[0.9] tracking-tight"
          >
            Begin Your{' '}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">
              Journey
            </span>
          </motion.h2>
          
          <motion.p 
            custom={0.2}
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto font-accent italic leading-relaxed"
          >
            Whether you're dreaming of the perfect bridal look or eager to master latte art, 
            I'd love to hear your story.
          </motion.p>
        </div>

        {/* Two Column Layout - Asymmetric Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Contact Info (4/12) */}
          <motion.div 
            className="lg:col-span-5 space-y-10"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Profile Essence */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-lg">
                  {currentTheme === 'barista' ? <Coffee className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[var(--text-primary)]">{contactInfo.name}</h3>
                  <p className="text-[var(--text-muted)] text-sm font-accent italic">{contactInfo.subtitle}</p>
                </div>
              </div>

              {/* RESTORED: Premium Availability Badge */}
              <AvailabilityBadge text={contactInfo.availability} />
            </motion.div>

            {/* Fine Line Divider */}
            <motion.div variants={fadeInUp} className="h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />

            {/* Contact Details - Minimalist List */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <ContactLink 
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={contactInfo.email}
                href={`mailto:${contactInfo.email}`}
                onCopy={() => handleCopy(contactInfo.email, 'email')}
                copied={copiedField === 'email'}
              />
              
              <ContactLink 
                icon={<Phone className="w-5 h-5" />}
                label="Phone"
                value={contactInfo.phone}
                href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`}
                onCopy={() => handleCopy(contactInfo.phone, 'phone')}
                copied={copiedField === 'phone'}
              />
              
              <ContactLink 
                icon={<MapPin className="w-5 h-5" />}
                label="Studio"
                value={contactInfo.location}
                subtitle={contactInfo.studio}
                href="https://maps.app.goo.gl/v1PJh4jCBUG1b9xe6"
              />
            </motion.div>

            {/* Fine Line Divider */}
            <motion.div variants={fadeInUp} className="h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />

            {/* Social Links - Minimalist Row */}
            <motion.div variants={fadeInUp}>
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] mb-5 font-medium">Connect</p>
              <div className="flex gap-4">
                <SocialIcon href="https://www.instagram.com/sanam_saru/?hl=en" icon={<Instagram className="w-5 h-5" />} label="Personal" />
                <SocialIcon href="https://www.instagram.com/sis_tersbeautycorner/?hl=en" icon={<Instagram className="w-5 h-5" />} label="Work" />
                <SocialIcon href="https://www.facebook.com/makeupwith.sanam" icon={<Facebook className="w-5 h-5" />} label="Facebook" />
                <SocialIcon href="https://www.tiktok.com/@san_aam" icon={<TikTokIcon className="w-5 h-5" />} label="TikTok" />
                <SocialIcon href="https://wa.me/qr/N5RYHGQDGDKWI1" icon={<MessageCircle className="w-5 h-5" />} label="WhatsApp" />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Form (7/12) */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative bg-[var(--bg-card)]/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[var(--border-default)]/50 h-full">
              {/* Subtle gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent rounded-t-3xl" />
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <SuccessState onReset={() => setIsSubmitted(false)} />
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-10 flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-2xl text-[var(--text-primary)] mb-1">Send a Message</h3>
                        <p className="text-[var(--text-muted)] text-sm">I'll respond within 24 hours</p>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--accent-primary)]"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                    
                    <ContactForm theme="neutral" onSuccess={() => setIsSubmitted(true)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// RESTORED: Premium Availability Badge with Breathing Animation
function AvailabilityBadge({ text }: { text: string }) {
  return (
    <motion.div 
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 relative overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent"
        animate={{ 
          x: ['0%', '100%', '0%'],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.span 
        className="w-2 h-2 rounded-full bg-[var(--accent-primary)] relative z-10"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <Clock className="w-4 h-4 text-[var(--accent-primary)] relative z-10" />
      <span className="text-[var(--accent-primary)] text-sm font-medium relative z-10 tracking-wide">{text}</span>
      
      {/* Outer pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[var(--accent-primary)]/30"
        animate={{ 
          scale: [1, 1.4],
          opacity: [0.5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
}

// Minimalist Contact Link with Underline Reveal
interface ContactLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  subtitle?: string;
  onCopy?: () => void;
  copied?: boolean;
}

function ContactLink({ icon, label, value, href, subtitle, onCopy, copied }: ContactLinkProps) {
  return (
    <div className="group">
      <a href={href} className="block">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
            {icon}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.15em] mb-1">{label}</p>
            <div className="relative inline-block">
              <p className="text-[var(--text-primary)] text-lg font-display group-hover:text-[var(--accent-primary)] transition-colors duration-300 relative">
                {value}
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] group-hover:w-full transition-all duration-500 ease-out" />
              </p>
              {onCopy && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCopy(); }}
                  className="ml-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                  title="Copy to clipboard"
                >
                  <AnimatePresence mode="wait">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </AnimatePresence>
                </button>
              )}
            </div>
            {subtitle && <p className="text-[var(--text-muted)] text-sm mt-1 font-accent italic">{subtitle}</p>}
          </div>
          <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </a>
    </div>
  );
}

// Minimalist Social Icon with Elegant Hover
function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -4, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 border border-transparent hover:border-[var(--accent-primary)]/20 transition-all duration-300"
    >
      {icon}
    </motion.a>
  );
}

// Elegant Success State
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full min-h-[400px] flex flex-col items-center justify-center text-center py-12"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mb-8 shadow-xl shadow-[var(--accent-primary)]/20"
      >
        <Send className="w-10 h-10 text-white" />
      </motion.div>
      
      <h3 className="font-display text-3xl text-[var(--text-primary)] mb-3">Message Sent</h3>
      <p className="text-[var(--text-muted)] max-w-md mb-10 font-accent italic">
        Thank you for reaching out. I'll be in touch within 24 hours.
      </p>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        className="px-8 py-3 rounded-full border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all duration-300 text-sm tracking-wide"
      >
        Send Another
      </motion.button>
    </motion.div>
  );
}

export default Contact;
