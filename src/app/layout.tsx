import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import dynamic from 'next/dynamic';
import Footer from '@/components/shared/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

// CRITICAL FIX: Disable SSR for Navigation to prevent hydration mismatch
const Navigation = dynamic(() => import('@/components/shared/Navigation'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Kamala Saru | Makeup Artist & Barista Trainer',
  description: 'Professional Makeup Artist and Barista Trainer in Butwal, Nepal. Specialized in bridal makeup, skincare, and professional coffee brewing courses.',
  keywords: ['makeup artist', 'barista trainer', 'bridal makeup', 'Nepal', 'Butwal', 'coffee training'],
  authors: [{ name: 'Kamala Saru' }],
  openGraph: {
    title: 'Kamala Saru | Makeup Artist & Barista Trainer',
    description: 'Professional Makeup Artist and Barista Trainer in Butwal, Nepal',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body antialiased">
        <ThemeProvider>
          <SmoothScrollProvider>
            <Navigation />
            <main className="relative">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}