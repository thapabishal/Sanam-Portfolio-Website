import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

// Environment variables (must be set in .env.local and Vercel dashboard)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-16'

// Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // use CDN for faster reads
  perspective: 'published',
  token: process.env.SANITY_TOKEN, // optional, only if dataset is private
})

// Image URL builder
const builder = createImageUrlBuilder(client)

export const urlFor = (source: any) => builder.image(source)

export const getImageUrl = (
  source: any,
  width: number,
  height?: number,
  quality: number = 80
): string => {
  let img = urlFor(source).width(width).quality(quality).auto('format')
  if (height) {
    img = img.height(height).fit('crop')
  }
  return img.url()
}

// Safe fetch wrapper
export async function sanityFetch<T>(
  query: string,
  params: Record<string, any> = {}
): Promise<T> {
  try {
    return await client.fetch<T>(query, params)
  } catch (error) {
    console.error('Sanity fetch error:', error)
    throw error
  }
}
