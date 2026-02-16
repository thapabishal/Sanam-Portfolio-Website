import { useState, useEffect } from 'react';
import { sanityFetch } from '@/lib/sanity';

interface UseSanityOptions<T> {
  query: string;
  params?: Record<string, any>;
  initialData?: T;
}

interface UseSanityResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSanity<T>({ query, params, initialData }: UseSanityOptions<T>): UseSanityResult<T> {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await sanityFetch<T>(query, params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Predefined queries for common data
export const queries = {
  portfolio: `*[_type == "portfolioItem"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    beforeImage { asset, alt, hotspot },
    afterImage { asset, alt, hotspot },
    description,
    duration,
    featured,
    publishedAt
  }`,
  
  services: `*[_type == "service" && available == true] | order(order asc) {
    _id,
    title,
    slug,
    serviceType,
    icon,
    shortDescription,
    fullDescription,
    duration,
    pricing {
      type,
      displayText,
      amount,
      currency
    },
    features[] { feature, description },
    featured,
    ctaText,
    ctaLink
  }`,
  
  testimonials: `*[_type == "testimonial"] | order(featured desc, _createdAt desc) {
    _id,
    name,
    role,
    quote,
    rating,
    theme,
    "imageUrl": image.asset->url,
    image { alt },
    featured
  }`,
  
  trainingModules: `*[_type == "trainingModule" && available == true] | order(order asc) {
    _id,
    title,
    slug,
    level,
    category,
    shortDescription,
    fullDescription,
    icon { asset, alt },
    duration { hours, displayText },
    learningOutcomes[] { outcome, description },
    curriculum[] { topic, subtopics, duration, practicalExercise },
    pricing {
      individual,
      group,
      currency,
      displayText
    },
    certification,
    featured
  }`,
  
  timeline: `*[_type == "timelineEvent" && visible == true] | order(year asc, month asc) {
    _id,
    title,
    year,
    month,
    category,
    description,
    fullStory,
    image { asset, alt, caption },
    relatedTo,
    icon,
    link { url, text },
    metrics { number, label },
    featured
  }`,
  
  siteSettings: `*[_type == "siteSettings"][0] {
    siteTitle,
    ownerName,
    tagline,
    contact {
      email,
      phone,
      location { city, state, country, displayText }
    },
    social { instagram, facebook, linkedin, youtube, tiktok },
    hero {
      beauticianImage { asset, alt },
      baristaImage { asset, alt },
      leftText,
      rightText
    }
  }`
};