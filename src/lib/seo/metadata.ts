import { siteConfig } from './site-config';


export interface Metadata {
    title?: string | { default: string; template: string; absolute: string };
    description?: string;
    applicationName?: string;
    authors?: { name: string; url?: string }[];
    generator?: string;
    keywords?: string[];
    referrer?: string;
    themeColor?: string;
    colorScheme?: string;
    viewport?: string;
    creator?: string;
    publisher?: string;
    robots?: string | { index: boolean; follow: boolean; googleBot?: string | { index: boolean; follow: boolean } };
    alternates?: {
        canonical?: string;
        languages?: Record<string, string>;
    };
    icons?: {
        icon?: string | string[];
        shortcut?: string;
        apple?: string;
        other?: { rel: string; url: string }[];
    };
    openGraph?: {
        title?: string;
        description?: string;
        url?: string;
        siteName?: string;
        images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
        locale?: string;
        type?: string;
    };
    twitter?: {
        card?: 'summary' | 'summary_large_image' | 'app' | 'player';
        title?: string;
        description?: string;
        site?: string;
        creator?: string;
        images?: string | string[];
    };
    metadataBase?: URL;
}

interface MetadataProps {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
    canonicalUrl?: string;
    type?: 'website' | 'article' | 'profile';
    publishedTime?: string;
    authors?: string[];
}

/**
 * Metadata factory function compatible with Next.js 13+ App Router
 * Use this to generate the metadata object for pages.
 */
export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    icons = '/favicon.ico',
    noIndex = false,
    canonicalUrl,
    type = 'website',
    // publishedTime, // Unused currently
    authors,
}: MetadataProps = {}): Metadata {
    return {
        title,
        description,
        authors: authors ? authors.map(name => ({ name })) : [{ name: 'Kamala Saru' }],
        openGraph: {
            title,
            description,
            type,
            url: canonicalUrl || siteConfig.url,
            images: [
                {
                    url: image,
                    alt: title,
                },
            ],
            siteName: siteConfig.name,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@kamalasaru',
        },
        icons: {
            icon: icons,
        },
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: canonicalUrl || siteConfig.url,
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}
