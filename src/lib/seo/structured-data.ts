import { siteConfig } from './site-config';

export function generatePersonJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Kamala Saru',
        url: siteConfig.url,
        image: `${siteConfig.url}/assets/profilecard/profilecard.jpg`,
        jobTitle: ['Makeup Artist', 'Barista Trainer'],
        worksFor: [
            {
                '@type': 'Organization',
                name: 'Sister Beauty Corner',
            },
            {
                '@type': 'Organization',
                name: 'Cocina Mitho Chha',
                url: 'https://cocinamithochha.com', // Example, update if needed
            }
        ],
        sameAs: [
            siteConfig.links.instagramBeautician,
            siteConfig.links.instagramPersonal,
            siteConfig.links.tiktok,
            siteConfig.links.facebook,
        ],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Butwal',
            addressCountry: 'NP',
        },
    };
}

export function generateLocalBusinessJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness', // or BeautySalon
        name: 'Sister Beauty Corner',
        image: `${siteConfig.url}/assets/logo.png`, // Update path
        url: siteConfig.url,
        telephone: siteConfig.contact.phone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Traffic Chowk',
            addressLocality: 'Butwal',
            postalCode: '32907',
            addressCountry: 'NP',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 27.700769, // Update coords
            longitude: 83.448787,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
                opens: '10:00',
                closes: '18:00',
            },
        ],
        priceRange: '$$',
    };
}

export function generateTrainingJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'Kamala Saru Barista Training',
        description: 'Professional barista training courses including espresso mastery, latte art, and brewing methods.',
        url: `${siteConfig.url}/#training`,
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Barista Courses',
            itemListElement: [
                {
                    '@type': 'Course',
                    name: 'Foundation Barista Skills',
                    description: 'Learn the basics of espresso extraction and milk steaming.',
                },
                {
                    '@type': 'Course',
                    name: 'Latte Art Mastery',
                    description: 'Advanced pouring techniques for professional presentation.',
                },
            ],
        },
    };
}

export function generateBreadcrumbJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteConfig.url,
            },
        ],
    };
}
