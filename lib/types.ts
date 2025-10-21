// app/component/lib/types.ts

// Basic types for content blocks, profile modes, and social platforms
export type ContentBlockType = 'title' | 'context';
export type ProfileMode = 'web2' | 'web3';

export type LayoutType = 'default' | 'left-side' | 'right-side';

// Define all supported background types, expanded to match BackgroundSelector.tsx
export type BackgroundType = 
  | 'none'
  | 'particles'
  | 'liquid-ether'
  | 'prism'
  | 'dark-veil'
  | 'light-rays'
  | 'aurora'
  | 'plasma'
  | 'gradient-blinds'
  | 'prismatic-burst'
  | 'galaxy'
  | 'faulty-terminal'
  | 'ripple-grid'
  | 'threads'
  | 'irisdescence'
  | 'orb'
  | 'liquid-chrome'
  | 'balatro'
  | 'letter-glitch';

export type SocialPlatform = 
  | 'linkedin' 
  | 'github' 
  | 'email' 
  | 'website' 
  | 'twitter' 
  | 'facebook' 
  | 'instagram' 
  | 'youtube' 
  | 'tiktok' 
  | 'behance' 
  | 'dribbble'
  | 'medium';

// Interface for individual images in a gallery
export interface GalleryImage {
  id: string;                    // Unique ID for the image
  url: string;                   // Image URL or Base64 string
  link?: string;                 // Optional clickable link
  isBase64?: boolean;            // Flag to identify Base64 images
}


// Interface for individual content blocks (e.g., titles, descriptions)
export interface ContentBlock {
  id: string;                    // Unique ID for the block
  type: ContentBlockType;        // Type of content: 'title' or 'context'
  content: string;               // Text content of the block
  duration?: string;             // Optional duration (e.g., "2023 - 2024")
  image?: string[];                // Optional image URL (landscape orientation recommended)
  imageLink?: string[];            // Optional link when image is clicked
  order: number;                 // Sorting order
  enableGlassEffect?: boolean;   // Glass effect for this block
}

// Interface for tech stack items (e.g., React, TypeScript)
export interface TechStackItem {
  id: string;                    // Unique ID for the tech item
  name: string;                  // Name of the tech (e.g., "React")
  icon: string;                  // URL to the tech's icon
  link?: string;                 // Optional link when tech icon is clicked
  order: number;                 // Sorting order
}

// Interface for social media links
export interface SocialLink {
  id: string;                    // Unique ID for the link
  platform: SocialPlatform;      // Social platform (e.g., "linkedin")
  url: string;                   // Full URL to the profile
  order: number;                 // Sorting order
}

// Interface for personal information
export interface PersonalInfo {
  name: string;                  // User's name
  title: string;                 // User's title (e.g., "Frontend Developer")
  email: string;                 // User's email
  phone: string;                 // User's phone number
  image: string;                 // URL to profile image
  imageIs3D: boolean;            // Enable/disable 3D effect for image
  enable3D?: boolean;            // Toggle for 3D tilt effect
  enableGradient?: boolean;      // Toggle for animated gradient border
  borderStyle?: 'none' | 'gradient' | 'star' | 'electric' | 'pixel' | 'blur'; // Border style
  showEmail?: boolean;           // NEW: Toggle email visibility (default: true)
  showPhone?: boolean;           // NEW: Toggle phone visibility (default: true)
}

// Interface for background configuration, supporting color customization
// Note: Ensure defaultProfile.ts initializes hue and colors to avoid TypeScript errors
export interface BackgroundConfig {
  type: BackgroundType;          // Background type (e.g., "liquid-chrome", "orb")
  color?: string;                // Hex color for single-color backgrounds (e.g., Particles, RippleGrid)
  hue?: number;                  // Hue value (0-360) for hue-based backgrounds (e.g., Orb, Galaxy)
  colors?: string[];             // Array of hex colors for multi-color backgrounds (e.g., Balatro, GradientBlinds)
  speed?: number;                // Animation speed (0-100)
  density?: number;              // Particle/grid density (0-100)
  interactive?: boolean;         // Enable/disable mouse interaction
  customOptions?: Record<string, any>; // Extra settings for unprovided backgrounds
}

// Interface for profile sections (e.g., Tech Stack, Past Projects)
export interface ProfileSection {
  id: string;                    // Unique ID for the section
  name: string;                  // Section name
  type: 'content' | 'techStack'; // Section type
  contentBlocks?: ContentBlock[]; // Content blocks for 'content' type
  techStack?: TechStackItem[];   // Tech stack items for 'techStack' type
  order: number;                 // Sorting order
  enableGlassEffect?: boolean;   // Glass effect for the section
}

// Interface for display settings (Web2/Web3 toggles)
export interface ProfileDisplaySettings {
  showWeb2: boolean;             // Show Web2 profile?
  showWeb3: boolean;             // Show Web3 profile?
  defaultView: ProfileMode;      // Default view mode
}

// Main profile interface, combining all data
export interface Profile {
  id: string;                    // Unique profile ID
  displaySettings: ProfileDisplaySettings; // Display settings
  web2: {
    personal: PersonalInfo;      // Web2 personal info
    socialLinks: SocialLink[];   // Web2 social links
    sections: ProfileSection[];  // Web2 content sections
    background: BackgroundConfig; // Web2 background config
    layoutType: LayoutType;         // Web2 layout type
  };
  web3: {
    personal: PersonalInfo;      // Web3 personal info
    socialLinks: SocialLink[];   // Web3 social links
    sections: ProfileSection[];  // Web3 content sections
    background: BackgroundConfig; // Web3 background config
    layoutType: LayoutType;         // Web3 layout type
  };
  theme: {
    accentColor: string;         // Main color for buttons, etc.
    textColor: string;           // Text color
  };
}

// Interface for editor state (for save/cancel system)
export interface SectionState {
  id: string;                    // Section identifier
  name: string;                  // Section name
  hasUnsavedChanges: boolean;    // Has unsaved changes?
  lastSavedAt: Date | null;      // When was it last saved?
}

export interface EditorState {
  currentMode: ProfileMode;      // Currently editing web2 or web3?
  isEditing: boolean;            // In edit mode?
  hasUnsavedChanges: boolean;    // Any unsaved changes?
  sections: {
    personalInfo: SectionState;
    socialLinks: SectionState;
    displaySettings: SectionState;
    web2Content: SectionState;
    web3Content: SectionState;
    background: SectionState;
  };
}