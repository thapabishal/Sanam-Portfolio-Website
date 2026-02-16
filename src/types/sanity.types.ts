export interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
  };
}

export interface PortfolioItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  category: 'bridal' | 'editorial' | 'sfx' | 'glam' | 'avantgarde';
  beforeImage?: SanityImage;
  afterImage?: SanityImage;
  description: string;
  duration?: string;
  featured: boolean;
  publishedAt: string;
  techniques?: string[];
}

export interface Service {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  serviceType: 'beautician' | 'training' | 'consultation' | 'workshop';
  icon?: string;
  shortDescription: string;
  fullDescription?: any[];
  duration?: string;
  pricing?: {
    type: 'fixed' | 'range' | 'quote';
    displayText: string;
    amount?: number;
    currency?: string;
  };
  features?: Array<{
    feature: string;
    description?: string;
  }>;
  featured: boolean;
  available: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  clientRole: string;
  clientPhoto?: SanityImage;
  quote: string;
  rating: number;
  serviceType: string;
  theme: 'beautician' | 'barista' | 'neutral';
  videoTestimonialUrl?: string;
  metrics?: {
    wasteReduction?: string;
    salesIncrease?: string;
    customMetric?: string;
  };
}

export interface TrainingModule {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  category: string;
  shortDescription: string;
  fullDescription?: any[];
  icon?: SanityImage;
  duration?: {
    hours: number;
    displayText: string;
  };
  learningOutcomes?: Array<{
    outcome: string;
    description?: string;
  }>;
  curriculum?: Array<{
    topic: string;
    subtopics?: string[];
    duration?: string;
    practicalExercise: boolean;
  }>;
  pricing?: {
    individual?: number;
    group?: any;
    currency: string;
    displayText?: string;
  };
  certification: boolean;
  featured: boolean;
  available: boolean;
}

export interface TimelineEvent {
  _id: string;
  title: string;
  year: number;
  month?: string;
  category: string;
  description: string;
  fullStory?: any[];
  image?: SanityImage;
  relatedTo: 'beautician' | 'training' | 'both' | 'general';
  icon?: string;
  link?: {
    url: string;
    text?: string;
  };
  metrics?: {
    number?: string;
    label?: string;
  };
  featured: boolean;
  visible: boolean;
}