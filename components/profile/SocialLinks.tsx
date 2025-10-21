// app/components/profile/SocialLinks.tsx

"use client";

import { SocialLink as SocialLinkType } from '@/lib/types';
import { getPlatformConfig } from '@/lib/socialPlatforms';
import { 
  Linkedin, 
  Github, 
  Mail, 
  Globe, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Video,
  Palette,
  Dribbble,
  BookOpen, 
} from 'lucide-react';

interface SocialLinksProps {
  links: SocialLinkType[];
}

const iconMap = {
  Linkedin,
  Github,
  Mail,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Video,
  Palette,
  Dribbble,
  BookOpen,
};

export function SocialLinks({ links }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex justify-center gap-4">
      {links.map((link) => {
        const config = getPlatformConfig(link.platform);
        if (!config) return null;

        const IconComponent = iconMap[config.icon as keyof typeof iconMap];
        if (!IconComponent) return null;

        return (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110" title={config.name}>
            <IconComponent className="w-5 h-5 text-white" />
          </a>
        );
      })}
    </div>
  );
}