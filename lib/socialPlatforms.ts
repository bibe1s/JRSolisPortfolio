//component/lib/socialPlatforms.ts

import { SocialPlatform } from './types';

// ============================================
// SOCIAL PLATFORM CONFIGURATIONS
// ============================================

export interface SocialPlatformConfig {
  id: SocialPlatform;
  name: string;
  icon: string; // Lucide icon name
  placeholder: string; // Placeholder text for URL input
  urlPrefix?: string; // Auto-prepend this to URLs
  baseUrl?: string; // Base URL for the platform
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'Linkedin',
    placeholder: 'linkedin.com/in/your-profile',
    urlPrefix: 'https://linkedin.com/in/',
    baseUrl: 'https://linkedin.com',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'Github',
    placeholder: 'github.com/your-username',
    urlPrefix: 'https://github.com/',
    baseUrl: 'https://github.com',
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'Mail',
    placeholder: 'your.email@example.com',
    urlPrefix: 'mailto:',
  },
  {
    id: 'website',
    name: 'Website',
    icon: 'Globe',
    placeholder: 'yourwebsite.com',
    urlPrefix: 'https://',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: 'Twitter',
    placeholder: 'twitter.com/your-handle',
    urlPrefix: 'https://twitter.com/',
    baseUrl: 'https://twitter.com',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'Facebook',
    placeholder: 'facebook.com/your-profile',
    urlPrefix: 'https://facebook.com/',
    baseUrl: 'https://facebook.com',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'Instagram',
    placeholder: 'instagram.com/your-handle',
    urlPrefix: 'https://instagram.com/',
    baseUrl: 'https://instagram.com',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'Youtube',
    placeholder: 'youtube.com/@your-channel',
    urlPrefix: 'https://youtube.com/@',
    baseUrl: 'https://youtube.com',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'Video',
    placeholder: 'tiktok.com/@your-handle',
    urlPrefix: 'https://tiktok.com/@',
    baseUrl: 'https://tiktok.com',
  },
  {
    id: 'behance',
    name: 'Behance',
    icon: 'Palette',
    placeholder: 'behance.net/your-profile',
    urlPrefix: 'https://behance.net/',
    baseUrl: 'https://behance.net',
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    icon: 'Dribbble',
    placeholder: 'dribbble.com/your-profile',
    urlPrefix: 'https://dribbble.com/',
    baseUrl: 'https://dribbble.com',
  },
  {
    id: 'medium',
    name: 'Medium',
    icon: 'BookOpen',
    placeholder: 'medium.com/@your-handle',
    urlPrefix: 'https://medium.com/@',
    baseUrl: 'https://medium.com',
  },
];

// ============================================
// HELPER: Get platform config by ID
// ============================================

export function getPlatformConfig(platformId: SocialPlatform): SocialPlatformConfig | undefined {
  return SOCIAL_PLATFORMS.find(p => p.id === platformId);
}

// ============================================
// HELPER: Format URL with prefix
// ============================================

export function formatSocialUrl(platform: SocialPlatform, input: string): string {
  const config = getPlatformConfig(platform);
  
  if (!config) return input;
  
  // If it's an email and doesn't have mailto:
  if (platform === 'email' && !input.startsWith('mailto:')) {
    return `mailto:${input}`;
  }
  
  // If it already has http:// or https://, return as is
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }
  
  // If it has the base URL already, add https://
  if (config.baseUrl && input.includes(config.baseUrl.replace('https://', ''))) {
    return `https://${input}`;
  }
  
  // Otherwise, add the prefix
  return `${config.urlPrefix || ''}${input}`;
}

// Example usage:
// formatSocialUrl('github', 'username') → "https://github.com/username"
// formatSocialUrl('email', 'test@example.com') → "mailto:test@example.com"