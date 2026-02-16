import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Next.js uses process.env with NEXT_PUBLIC_ prefix for client-side
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export function getImageUrl(source: any, width: number, height?: number, quality: number = 80): string {
  let img = urlFor(source).width(width).quality(quality).auto('format');
  if (height) {
    img = img.height(height).fit('crop');
  }
  return img.url();
}

export async function sanityFetch<T>(query: string, params: Record<string, any> = {}): Promise<T> {
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw error;
  }
}