import React from 'react';
import Head from 'next/head';
import { Metadata } from '@/lib/seo/metadata';

interface SeoHeadProps {
    metadata: Metadata;
}

/**
 * Renders document head elements using next/head.
 * Accepts Next.js Metadata object structure for compatibility.
 * 
 * Usage:
 * <SeoHead metadata={constructMetadata({ title: "Page Title" })} />
 * 
 * Note: next/head is not fully supported in App Router. 
 * Ideally, migrating to the Metadata API (export const metadata = ...) is recommended.
 */
export const SeoHead: React.FC<SeoHeadProps> = ({ metadata }) => {
    const title = typeof metadata.title === 'string' ? metadata.title : metadata.title?.default;
    const description = metadata.description;
    const canonical = metadata.alternates?.canonical;

    const ogUrl = metadata.openGraph?.url || canonical || '';
    const ogTitle = metadata.openGraph?.title || title;
    const ogDescription = metadata.openGraph?.description || description;
    const ogImages = metadata.openGraph?.images || [];

    return (
        <Head>
            {/* Basic Metadata */}
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {metadata.keywords && <meta name="keywords" content={metadata.keywords.join(', ')} />}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph */}
            {ogTitle && <meta property="og:title" content={ogTitle} />}
            {ogDescription && <meta property="og:description" content={ogDescription} />}
            {ogUrl && <meta property="og:url" content={ogUrl} />}
            <meta property="og:type" content={metadata.openGraph?.type || 'website'} />
            {metadata.openGraph?.siteName && <meta property="og:site_name" content={metadata.openGraph.siteName} />}

            {ogImages.map((img, index) => (
                <meta key={index} property="og:image" content={img.url} />
            ))}

            {/* Twitter Card */}
            <meta name="twitter:card" content={metadata.twitter?.card || 'summary_large_image'} />
            <meta name="twitter:title" content={metadata.twitter?.title || title} />
            <meta name="twitter:description" content={metadata.twitter?.description || description} />
            {metadata.twitter?.creator && <meta name="twitter:creator" content={metadata.twitter?.creator} />}
            {metadata.twitter?.images && Array.isArray(metadata.twitter.images)
                ? metadata.twitter.images.map((img, i) => <meta key={i} name="twitter:image" content={img} />)
                : metadata.twitter?.images && <meta name="twitter:image" content={metadata.twitter.images as string} />
            }

            {/* Robots */}
            {metadata.robots && typeof metadata.robots === 'object' && (
                <meta
                    name="robots"
                    content={`${metadata.robots.index === false ? 'noindex' : 'index'}, ${metadata.robots.follow === false ? 'nofollow' : 'follow'}`}
                />
            )}
        </Head>
    );
};
