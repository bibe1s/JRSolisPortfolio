//component/lib/defaultProfile.ts

import { Profile } from './types';

// ============================================
// DEFAULT PROFILE - Starting template
// ============================================

export const defaultProfile: Profile = {
  id: 'default-profile',
  
  // Display Settings
  displaySettings: {
    showWeb2: true,
    showWeb3: true,
    defaultView: 'web2',
  },
  
  // Web2 Content (Real You - Professional)
  web2: {
    // Personal info for Web2
    personal: {
      name: 'Your Real Name',
      title: 'Frontend Developer',
      email: 'your.real@example.com',
      phone: '+63 XXX-XXX-XXXX',
      image: '',
      imageIs3D: true,
      borderStyle: 'gradient',
    },
    
    // Social Links for Web2
    socialLinks: [],
    
    // Sections for Web2
    sections: [
      {
        id: 'web2-section-1',
        name: 'Tech Stack',
        type: 'techStack',
        techStack: [],
        order: 0,
      },
      {
        id: 'web2-section-2',
        name: 'Past Projects',
        type: 'content',
        contentBlocks: [
          {
            id: 'web2-block-1',
            type: 'title',
            content: 'Project Title',
            order: 0,
          },
          {
            id: 'web2-block-2',
            type: 'context',
            content: 'Brief description of your project',
            duration: '2024',
            order: 1,
          },
        ],
        order: 1,
      },
      {
        id: 'web2-section-3',
        name: 'Educational Attainment',
        type: 'content',
        contentBlocks: [
          {
            id: 'web2-block-3',
            type: 'title',
            content: 'School Name',
            order: 0,
          },
          {
            id: 'web2-block-4',
            type: 'context',
            content: 'Degree / Course',
            duration: '2020 - 2024',
            order: 1,
          },
        ],
        order: 2,
      },
    ],
    
    // ✅ Background for Web2
    background: {
      type: 'none',
      color: '#ffffff',
      speed: 50,
      density: 50,
      interactive: false,
    },
    layoutType: 'default',
  },
  
  // Web3 Content (Your Persona)
  web3: {
    // Personal info for Web3
    personal: {
      name: 'YourName.eth',
      title: 'Community Ambassador',
      email: 'your.web3@example.com',
      phone: '',
      image: '',
      imageIs3D: false,
    },
    
    // Social Links for Web3
    socialLinks: [],
    
    // Sections for Web3
    sections: [
      {
        id: 'web3-section-1',
        name: 'Communities',
        type: 'techStack',
        techStack: [],
        order: 0,
      },
      {
        id: 'web3-section-2',
        name: 'Web3 Footprints',
        type: 'content',
        contentBlocks: [
          {
            id: 'web3-block-1',
            type: 'title',
            content: 'Community Ambassador',
            order: 0,
          },
          {
            id: 'web3-block-2',
            type: 'context',
            content: 'Role description and contributions',
            duration: '2024',
            order: 1,
          },
        ],
        order: 1,
      },
    ],
    
    // ✅ Background for Web3
    background: {
      type: 'none',
      color: '#000000',
      speed: 50,
      density: 50,
      interactive: false,
    },
    layoutType: 'default',
  },
  
  // Theme Settings (just colors, no background here anymore)
  theme: {
    accentColor: '#3b82f6',
    textColor: '#000000',
  },
};

// ============================================
// HELPER: Create empty profile
// ============================================

export function createEmptyProfile(): Profile {
  return {
    ...defaultProfile,
    id: `profile-${Date.now()}`,
    web2: {
      personal: {
        name: '',
        title: '',
        email: '',
        phone: '',
        image: '',
        imageIs3D: true,
      },
      socialLinks: [],
      sections: [],
      background: {
        type: 'none',
        color: '#ffffff',
        speed: 50,
        density: 50,
        interactive: false,
      },
      layoutType: 'default',
    },
    web3: {
      personal: {
        name: '',
        title: '',
        email: '',
        phone: '',
        image: '',
        imageIs3D: false,
      },
      socialLinks: [],
      sections: [],
      background: {
        type: 'none',
        color: '#000000',
        speed: 50,
        density: 50,
        interactive: false,
      },
      layoutType: 'default',
    },
  };
}

// ============================================
// HELPER: Generate unique IDs
// ============================================

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}