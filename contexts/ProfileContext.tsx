// app/components/contexts/ProfileContext.tsx

"use client";
import Cookies from 'js-cookie';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Profile, 
  ContentBlock, 
  TechStackItem, 
  SocialLink, 
  ProfileSection,
  BackgroundConfig,
  PersonalInfo,
  ProfileDisplaySettings,
  ProfileMode,
  LayoutType
} from '@/lib/types';
import { defaultProfile, generateId } from '@/lib/defaultProfile';

// ============================================
// CONTEXT TYPE - All the data and functions
// ============================================

interface ProfileContextType {
  // Current state
  profile: Profile;
  savedProfile: Profile;
  currentMode: ProfileMode;
  hasUnsavedChanges: boolean;
  
  // Mode switching
  setCurrentMode: (mode: ProfileMode) => void;
  
  // Personal Info
updatePersonalInfo: (mode: ProfileMode, updates: Partial<PersonalInfo>) => void;
  
  // Social Links
  addSocialLink: (mode: ProfileMode, link: Omit<SocialLink, 'id' | 'order'>) => void;
  updateSocialLink: (mode: ProfileMode, linkId: string, updates: Partial<SocialLink>) => void;
  deleteSocialLink: (mode: ProfileMode, linkId: string) => void;
  
  // Display Settings
  updateDisplaySettings: (settings: Partial<ProfileDisplaySettings>) => void;
  
  // Sections
  addSection: (mode: ProfileMode, section: Omit<ProfileSection, 'id' | 'order'>, insertAfter?: string) => void;
  updateSection: (mode: ProfileMode, sectionId: string, updates: Partial<ProfileSection>) => void;
  deleteSection: (mode: ProfileMode, sectionId: string) => void;
  reorderSections: (mode: ProfileMode, sectionIds: string[]) => void; 
  
  // Content Blocks
  addContentBlock: (mode: ProfileMode, sectionId: string, block: Omit<ContentBlock, 'id' | 'order'>) => void;
  updateContentBlock: (mode: ProfileMode, sectionId: string, blockId: string, updates: Partial<ContentBlock>) => void;
  deleteContentBlock: (mode: ProfileMode, sectionId: string, blockId: string) => void;
  
  // Tech Stack
  addTechStack: (mode: ProfileMode, sectionId: string, tech: Omit<TechStackItem, 'id' | 'order'>) => void;
  updateTechStack: (mode: ProfileMode, sectionId: string, techId: string, updates: Partial<TechStackItem>) => void;
  deleteTechStack: (mode: ProfileMode, sectionId: string, techId: string) => void;
  
  // Background
  updateBackground: (mode: ProfileMode, config: Partial<BackgroundConfig>) => void;

  // Layout Type 
  updateLayoutType: (mode: ProfileMode, layoutType: LayoutType) => void;
  
  // Save/Cancel system
  saveChanges: () => void;
  
  // Export/Import
  exportProfile: () => string;
  importProfile: (jsonString: string) => void;


}

// ============================================
// CREATE CONTEXT
// ============================================

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function ProfileProvider({ children }: { children: ReactNode }) {
  // Current profile being edited (draft)
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  
  // Last saved profile (for cancel/revert)
  const [savedProfile, setSavedProfile] = useState<Profile>(defaultProfile);
  
  // Current editing mode (web2 or web3)
  const [currentMode, setCurrentMode] = useState<ProfileMode>('web2');
  
  // Check if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  // ============================================
  // AUTO-SWITCH MODE WHEN DISPLAY SETTINGS CHANGE
  // ============================================

  useEffect(() => {
    // Safety check: make sure displaySettings exists
    if (!profile.displaySettings) return;
    
    const { showWeb2, showWeb3 } = profile.displaySettings;
    
    // If current mode is disabled, switch to the enabled one
    if (currentMode === 'web2' && !showWeb2 && showWeb3) {
      setCurrentMode('web3');
    } else if (currentMode === 'web3' && !showWeb3 && showWeb2) {
      setCurrentMode('web2');
    }
  }, [profile.displaySettings?.showWeb2, profile.displaySettings?.showWeb3, currentMode]);
  
  // ============================================
  // LOAD FROM LOCALSTORAGE ON MOUNT
  // ============================================
  
  useEffect(() => {
    // Load profile from API instead of localStorage
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setSavedProfile(data);
      })
      .catch(error => {
        console.error('Failed to load profile:', error);
        // Fallback to default if API fails
        setProfile(defaultProfile);
        setSavedProfile(defaultProfile);
      });
  }, []);
  
  // ============================================
  // PERSONAL INFO
  // ============================================
  
const updatePersonalInfo = (mode: ProfileMode, updates: Partial<PersonalInfo>) => {
  setProfile(prev => ({
    ...prev,
    [mode]: {
      ...prev[mode],
      personal: {
        ...prev[mode].personal,
        ...updates,
      },
    },
  }));
};
  
  // ============================================
  // SOCIAL LINKS
  // ============================================
  
const addSocialLink = (mode: ProfileMode, link: Omit<SocialLink, 'id' | 'order'>) => {
  setProfile(prev => {
    // Safety check - make sure socialLinks exists
    const currentSocialLinks = prev[mode]?.socialLinks || [];
    
    return {
      ...prev,
      [mode]: {
        ...prev[mode],
        socialLinks: [
          ...currentSocialLinks,
          {
            ...link,
            id: generateId('social'),
            order: currentSocialLinks.length,
          },
        ],
      },
    };
  });
};

const updateSocialLink = (mode: ProfileMode, linkId: string, updates: Partial<SocialLink>) => {
  setProfile(prev => ({
    ...prev,
    [mode]: {
      ...prev[mode],
      socialLinks: prev[mode].socialLinks.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      ),
    },
  }));
};

const deleteSocialLink = (mode: ProfileMode, linkId: string) => {
  setProfile(prev => ({
    ...prev,
    [mode]: {
      ...prev[mode],
      socialLinks: prev[mode].socialLinks.filter(link => link.id !== linkId),
    },
  }));
};
  
  // ============================================
  // DISPLAY SETTINGS
  // ============================================
  
  const updateDisplaySettings = (settings: Partial<ProfileDisplaySettings>) => {
    setProfile(prev => ({
      ...prev,
      displaySettings: {
        ...prev.displaySettings,
        ...settings,
      },
    }));
  };
  
  // ============================================
  // SECTIONS
  // ============================================
  
const addSection = (
  mode: ProfileMode, 
  section: Omit<ProfileSection, 'id' | 'order'>,
  insertAfter?: string // ← NEW: Optional section ID to insert after
) => {
  setProfile(prev => {
    const sections = prev[mode].sections;
    
    let insertIndex = 0; // Default: insert at top
    
    if (insertAfter) {
      const afterIndex = sections.findIndex(s => s.id === insertAfter);
      if (afterIndex !== -1) {
        insertIndex = afterIndex + 1;
      }
    }
    
    // Create new section
    const newSection: ProfileSection = {
      ...section,
      id: generateId('section'),
      order: insertIndex,
    };
    
    // Insert section at the correct position
    const updatedSections = [
      ...sections.slice(0, insertIndex),
      newSection,
      ...sections.slice(insertIndex),
    ];
    
    // Reorder all sections
    const reorderedSections = updatedSections.map((s, index) => ({
      ...s,
      order: index,
    }));
    
    return {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: reorderedSections,
      },
    };
  });
};
  
const updateSection = (mode: ProfileMode, sectionId: string, updates: Partial<ProfileSection>) => {
  console.log('✏️ Updating section:', { mode, sectionId, updates });
  
  setProfile(prev => {
    const updatedSections = prev[mode].sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, ...updates };
      }
      return section;
    });
    
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: updatedSections,
      },
    };
    
    console.log('✅ Updated profile:', newProfile);
    return newProfile;
  });
};
  
const deleteSection = (mode: ProfileMode, sectionId: string) => {
  console.log('🗑️ Deleting section:', { mode, sectionId });
  
  setProfile(prev => {
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: prev[mode].sections.filter(section => section.id !== sectionId),
      },
    };
    
    console.log('✅ After delete:', newProfile);
    return newProfile;
  });
};

const reorderSections = (mode: ProfileMode, sectionIds: string[]) => {
  console.log('🔄 Reordering sections');
  console.log('Mode:', mode);
  console.log('Old order:', profile[mode].sections.map(s => ({ id: s.id, name: s.name, order: s.order })));
  console.log('New IDs order:', sectionIds);
  
  setProfile(prev => {
    // Create a map of sections by ID for quick lookup
    const sectionMap = new Map(
      prev[mode].sections.map(section => [section.id, section])
    );
    
    // Reorder sections based on the new order and update order property
    const reorderedSections = sectionIds
      .map(id => sectionMap.get(id))
      .filter((section): section is ProfileSection => section !== undefined)
      .map((section, index) => ({
        ...section,
        order: index,
      }));
    
    console.log('✅ New order:', reorderedSections.map(s => ({ id: s.id, name: s.name, order: s.order })));
    
    return {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: reorderedSections,
      },
    };
  });
};
  
  // ============================================
  // CONTENT BLOCKS
  // ============================================
  
const addContentBlock = (
  mode: ProfileMode, 
  sectionId: string, 
  block: Omit<ContentBlock, 'id' | 'order'>
) => {
  console.log('📝 Adding content block:', { mode, sectionId, block });
  
  setProfile(prev => {
    const updatedSections = prev[mode].sections.map(section => {
      if (section.id === sectionId) {
        // Make sure contentBlocks exists
        const currentBlocks = section.contentBlocks || [];
        
        const newBlock: ContentBlock = {
          ...block,
          id: generateId('block'),
          order: currentBlocks.length,
          // Include image fields if provided
          image: block.image,
          imageLink: block.imageLink,
        };
        
        console.log('✅ Adding new block:', newBlock);
        
        return {
          ...section,
          contentBlocks: [...currentBlocks, newBlock],
        };
      }
      return section;
    });
    
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: updatedSections,
      },
    };
    
    console.log('✅ New profile:', newProfile);
    return newProfile;
  });
};
  
const updateContentBlock = (
  mode: ProfileMode,
  sectionId: string,
  blockId: string,
  updates: Partial<ContentBlock>
) => {
  console.log('✏️ Updating content block:', { mode, sectionId, blockId, updates });
  
  setProfile(prev => {
    const updatedSections = prev[mode].sections.map(section => {
      if (section.id === sectionId && section.contentBlocks) {
        return {
          ...section,
          contentBlocks: section.contentBlocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          ),
        };
      }
      return section;
    });
    
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: updatedSections,
      },
    };
    
    console.log('✅ Updated profile:', newProfile);
    return newProfile;
  });
};
  
const deleteContentBlock = (mode: ProfileMode, sectionId: string, blockId: string) => {
  console.log('🗑️ Deleting content block:', { mode, sectionId, blockId });
  
  setProfile(prev => {
    // Create deep copy
    const updatedSections = prev[mode].sections.map(section => {
      if (section.id === sectionId && section.contentBlocks) {
        return {
          ...section,
          contentBlocks: section.contentBlocks.filter(block => block.id !== blockId),
        };
      }
      return section;
    });
    
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: updatedSections,
      },
    };
    
    console.log('✅ After delete:', newProfile);
    return newProfile;
  });
};
  
  // ============================================
  // TECH STACK
  // ============================================
  
const addTechStack = (
  mode: ProfileMode,
  sectionId: string,
  tech: Omit<TechStackItem, 'id' | 'order'>
) => {
  console.log('🔧 Adding tech:', { mode, sectionId, tech });
  
  setProfile(prev => {
    // Create a deep copy to avoid mutation
    const updatedSections = prev[mode].sections.map(section => {
      if (section.id === sectionId) {
        // Make sure techStack exists
        const currentTechStack = section.techStack || [];
        
        const newTech: TechStackItem = {
          ...tech,
          id: generateId('tech'),
          order: currentTechStack.length,
        };
        
        console.log('✅ Adding new tech:', newTech);
        
        return {
          ...section,
          techStack: [...currentTechStack, newTech],
        };
      }
      return section;
    });
    
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: updatedSections,
      },
    };
    
    console.log('✅ New profile:', newProfile);
    return newProfile;
  });
};
  
const updateTechStack = (
  mode: ProfileMode,
  sectionId: string,
  techId: string,
  updates: Partial<TechStackItem>
) => {
  setProfile(prev => ({
    ...prev,
    [mode]: {
      ...prev[mode], 
      sections: prev[mode].sections.map(section => {
        if (section.id === sectionId && section.techStack) {
          return {
            ...section,
            techStack: section.techStack.map(tech =>
              tech.id === techId ? { ...tech, ...updates } : tech
            ),
          };
        }
        return section;
      }),
    },
  }));
};
  
const deleteTechStack = (mode: ProfileMode, sectionId: string, techId: string) => {
  console.log('🗑️ Deleting tech stack:', { mode, sectionId, techId });
  
  setProfile(prev => {
    // Create deep copy
    const updatedSections = prev[mode].sections.map(section => {
      if (section.id === sectionId && section.techStack) {
        return {
          ...section,
          techStack: section.techStack.filter(tech => tech.id !== techId),
        };
      }
      return section;
    });
    
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        sections: updatedSections,
      },
    };
    
    console.log('✅ After delete:', newProfile);
    return newProfile;
  });
};
  
  // ============================================
  // BACKGROUND
  // ============================================
  
const updateBackground = (mode: ProfileMode, config: Partial<BackgroundConfig>) => {
  console.log('🎨 Updating background:', { mode, config });
  
  setProfile(prev => {
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        background: {
          ...prev[mode].background,
          ...config,
        },
      },
    };
    
    console.log('✅ New background:', newProfile[mode].background);
    return newProfile;
  });
};

// ============================================
// LAYOUT TYPE
// ============================================

const updateLayoutType = (mode: ProfileMode, layoutType: LayoutType) => {
  console.log('🎨 Updating layout type:', { mode, layoutType });
  
  setProfile(prev => {
    const newProfile = {
      ...prev,
      [mode]: {
        ...prev[mode],
        layoutType,
      },
    };
    
    console.log('✅ New layout type:', newProfile[mode].layoutType);
    return newProfile;
  });
};
  
  // ============================================
  // SAVE / CANCEL
  // ============================================
  
const saveChanges = async () => {
  try {
    // Get auth token from cookies (changed from localStorage)
    const token = Cookies.get('auth_token');
    
    if (!token) {
      console.error('No auth token found');
      alert('Please log in again');
      return;
    }

    // Save to API
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });

    if (!response.ok) {
      throw new Error('Failed to save');
    }

    // Update saved state
    setSavedProfile(profile);
    
    console.log('✅ Changes saved to server!');
    alert('✅ Changes saved successfully!');
    
  } catch (error) {
    console.error('❌ Failed to save:', error);
    alert('❌ Failed to save changes. Please try again.');
  }
};

  // ============================================
  // EXPORT / IMPORT
  // ============================================
  
  const exportProfile = (): string => {
    return JSON.stringify(profile, null, 2);
  };
  
  const importProfile = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      setProfile(imported);
      setSavedProfile(imported);
      localStorage.setItem('portfolio-profile', jsonString);
      console.log('✅ Profile imported!');
    } catch (error) {
      console.error('❌ Failed to import profile:', error);
    }
  };
  
  // ============================================
  // PROVIDE CONTEXT VALUE
  // ============================================
  
  const value: ProfileContextType = {
    profile,
    savedProfile,
    currentMode,
    hasUnsavedChanges,
    setCurrentMode,
    updatePersonalInfo,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    updateDisplaySettings,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addContentBlock,
    updateContentBlock,
    deleteContentBlock,
    addTechStack,
    updateTechStack,
    deleteTechStack,
    updateBackground,
    updateLayoutType,
    saveChanges,
    exportProfile,
    importProfile,
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// ============================================
// HOOK TO USE CONTEXT
// ============================================

export function useProfile() {
  const context = useContext(ProfileContext);
  
  if (context === undefined) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  
  return context;
}