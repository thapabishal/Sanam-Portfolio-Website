import Hero from '@/components/sections/Hero';
import Introduction from '@/components/sections/Introduction';
import Philosophy from '@/components/sections/Philosophy';
import { BeauticianPortfolio } from '@/components/sections/BeauticianPortfolio';
import BaristaTraining from '@/components/sections/BaristaTraining';
import { Timeline } from '@/components/sections/Timeline';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kamala Saru | Makeup Artist & Barista Trainer',
  description: 'Professional Makeup Artist and Barista Trainer in Butwal, Nepal. Specialized in bridal makeup, skincare, and professional coffee brewing courses.',
};

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <Philosophy />
      <BeauticianPortfolio />
      <BaristaTraining />
      <Timeline />
      <Testimonials />
      <Contact />
    </>
  );
}