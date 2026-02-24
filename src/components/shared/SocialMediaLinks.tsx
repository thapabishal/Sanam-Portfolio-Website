'use client';

import React from 'react';
import { Facebook, Instagram, Music2, MessageCircle, Briefcase } from 'lucide-react';
import Dock from '@/components/ui/Dock';
import type { DockItemData } from '@/components/ui/Dock';

const SocialMediaLinks: React.FC = () => {
  const socialItems: DockItemData[] = [
    {
      icon: <Facebook size={20} className="social-icon-base group-hover:text-[#1877F2]" />,
      label: 'Facebook',
      onClick: () => window.open('https://www.facebook.com/makeupwith.sanam', '_blank'),
      className: 'social-dock-item hover:border-[#1877F2]/50 hover:shadow-[0_8px_20px_rgba(24,119,242,0.25)]'
    },
    {
      icon: <Instagram size={20} className="social-icon-base group-hover:text-[var(--color-beautician-primary)]" />,
      label: 'Personal Instagram',
      onClick: () => window.open('https://www.instagram.com/sanam_saru/?hl=en', '_blank'),
      className: 'social-dock-item hover:border-[var(--color-beautician-primary)]/50 hover:shadow-[0_8px_20px_rgba(201,168,124,0.3)]'
    },

    {
      icon: <Instagram size={20} className="social-icon-base group-hover:text-[#E1306C]" />,  // Instagram pink for work
      label: 'Work Instagram',  // Short label for dock
      onClick: () => window.open('https://www.instagram.com/sis_tersbeautycorner/?hl=en', '_blank'), // Replace with your work IG URL
      className: 'social-dock-item hover:border-[var(--color-beautician-primary)]/50 hover:shadow-[0_8px_20px_rgba(201,168,124,0.3)]'
    },
    {
      icon: <Music2 size={20} className="social-icon-base group-hover:text-[#FE2C55]" />,
      label: 'TikTok',
      onClick: () => window.open('https://www.tiktok.com/@san_aam', '_blank'),
      className: 'social-dock-item hover:border-[#FE2C55]/50 hover:shadow-[0_8px_20px_rgba(254,44,85,0.25)]'
    },
    {
      icon: <MessageCircle size={20} className="social-icon-base group-hover:text-[#25D366]" />,
      label: 'WhatsApp',
      onClick: () => window.open('https://wa.me/qr/N5RYHGQDGDKWI1'),
      className: 'social-dock-item hover:border-[#25D366]/50 hover:shadow-[0_8px_20px_rgba(37,211,102,0.25)]'
    }
  ];

  return (
    <div className="relative inline-block">
      <Dock 
        items={socialItems}
        panelHeight={75}  // Slightly increased for 5 items
        baseItemSize={50}
        magnification={70}
        distance={150}
        className="shadow-2xl"
      />
    </div>
  );
};

export default SocialMediaLinks;
