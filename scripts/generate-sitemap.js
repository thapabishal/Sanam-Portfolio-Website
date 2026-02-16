import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Basic sitemap generator script
// Run with: node scripts/generate-sitemap.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = 'https://kamalasaru.com.np'; 
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const staticPaths = [
    '/',
    // Add other routes here if you add pages
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths
        .map((url) => {
            return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
        })
        .join('\n')}
</urlset>`;

try {
    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR);
    }
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    console.log('✅ sitemap.xml generated successfully in public/');
} catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
}
