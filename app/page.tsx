// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Profile, ProfileMode } from '@/lib/types';
import { defaultProfile } from '@/lib/defaultProfile';
import { HolographicProfileCard } from '@/components/profile/HolographicProfileCard';
import { SocialLinks } from '@/components/profile/SocialLinks';
import { ContentBlock } from '@/components/profile/ContentBlock';
import { TechStackSection } from '@/components/profile/TechStackSection';
import { BackgroundWrapper } from '@/components/backgrounds/BackgroundWrapper';
import { LeftSideLayout } from '@/components/layouts/LeftSideLayout';
import { RightSideLayout } from '@/components/layouts/RightSideLayout';

export default function PreviewPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [currentMode, setCurrentMode] = useState<ProfileMode>('web2');
  const [isLoading, setIsLoading] = useState(true);

  // ✅ NEW: Load profile from API instead of localStorage
  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      setProfile(data);

      // Auto-switch mode if current mode is disabled
      const { showWeb2, showWeb3, defaultView } = data.displaySettings;
      let modeToUse = defaultView || 'web2';

      // If default view is disabled, use the enabled one
      if (modeToUse === 'web2' && !showWeb2 && showWeb3) {
        modeToUse = 'web3';
      } else if (modeToUse === 'web3' && !showWeb3 && showWeb2) {
        modeToUse = 'web2';
      }

      setCurrentMode(modeToUse);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setProfile(defaultProfile);
      setIsLoading(false);
    }
  };

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // ✅ NEW: Listen for profile updates (when you save in editor)
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('🔄 Profile updated, refreshing from API...');
      loadProfile();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  // ✅ NEW: Auto-refresh every 10 seconds (for other devices)
  useEffect(() => {

  // Only auto-refresh on desktop (screen width > 768px)
  if (window.innerWidth < 768) {
    return; // Skip auto-refresh on mobile
  }

  const interval = setInterval(() => {
    loadProfile();
  }, 30000); // 30 seconds - less frequent
  
  return () => clearInterval(interval);
}, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Get current sections based on mode
  const currentSections = profile[currentMode].sections;

  // Check if we should show mode toggle
  const showToggle = profile.displaySettings.showWeb2 && profile.displaySettings.showWeb3;

  // Get current background
  const currentBackground = profile[currentMode].background;

  // Get current layout type
  const currentLayout = profile[currentMode].layoutType || 'default';

  // Render based on layout type
  const renderLayout = () => {
    switch (currentLayout) {
      case 'left-side':
        return <LeftSideLayout profile={profile} currentMode={currentMode} />;
      
      case 'right-side':
        return <RightSideLayout profile={profile} currentMode={currentMode} />;
      
      case 'default':
      default:
        return (
          <div className="min-h-screen text-white">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto py-8">
              {/* Profile Card */}
              <HolographicProfileCard personal={profile[currentMode].personal} />

              {/* Social Links */}
              <SocialLinks links={profile[currentMode].socialLinks} />

              {/* Divider */}
              <div className="border-t border-gray-800 my-8"></div>

              {/* Sections */}
              <div className="px-8 space-y-8">
                {currentSections
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div key={section.id}>
                      {section.type === 'techStack' && section.techStack ? (
                        <TechStackSection
                          title={section.name}
                          items={section.techStack}
                          enableGlassEffect={section.enableGlassEffect} 
                        />
                      ) : section.type === 'content' && section.contentBlocks ? (
                        <div className={
                            section.enableGlassEffect 
                              ? 'backdrop-blur-md bg-black/50 p-6 rounded-lg' 
                              : ''
                          }>
                          <h2 className="text-2xl font-bold text-white mb-4">
                            {section.name}
                          </h2>
                          <div className="space-y-3">
                            {section.contentBlocks
                              .sort((a, b) => a.order - b.order)
                              .map((block) => (
                                <ContentBlock 
                                  key={block.id} 
                                  block={block} 
                                  sectionGlassEffect={section.enableGlassEffect}
                                />
                              ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <BackgroundWrapper config={currentBackground}>
      {/* Mode Toggle (if both modes enabled) */}
      {showToggle && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setCurrentMode('web2')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              currentMode === 'web2'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Web2
          </button>
          <button
            onClick={() => setCurrentMode('web3')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              currentMode === 'web3'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Web3
          </button>
        </div>
      )}

      {/* Render the appropriate layout */}
      {renderLayout()}
    </BackgroundWrapper>
  );
}