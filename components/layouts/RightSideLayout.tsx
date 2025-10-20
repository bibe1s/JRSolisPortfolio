// app/components/layouts/RightSideLayout.tsx

"use client";

import { Profile, ProfileMode } from '@/lib/types';
import { HolographicProfileCard } from '@/components/profile/HolographicProfileCard';
import { SocialLinks } from '@/components/profile/SocialLinks';
import { ContentBlock } from '@/components/profile/ContentBlock';
import { TechStackSection } from '@/components/profile/TechStackSection';
import { BackgroundWrapper } from '@/components/backgrounds/BackgroundWrapper';

interface RightSideLayoutProps {
  profile: Profile;
  currentMode: ProfileMode;
}

export function RightSideLayout({ profile, currentMode }: RightSideLayoutProps) {
  const currentData = profile[currentMode];
  const currentSections = currentData.sections;
  const currentBackground = currentData.background;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Profile Header - Only visible on mobile */}
      <div className="lg:hidden w-full bg-black flex flex-col justify-center z-10">
        <HolographicProfileCard personal={currentData.personal} />
        <SocialLinks links={currentData.socialLinks} />
      </div>

      {/* Content Panel - Shows second on mobile, left on desktop (WITH BACKGROUND THEME) */}
      <div className="flex-1 relative min-h-screen lg:order-1">
        <BackgroundWrapper config={currentBackground}>
          <div className="min-h-screen overflow-y-auto">
            <div className="max-w-4xl mx-auto py-8 lg:py-12 px-4 lg:px-8">
              {/* Sections */}
              <div className="space-y-8">
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
                        <div className={`mb-8 ${
                          section.enableGlassEffect 
                            ? 'backdrop-blur-md bg-black/50 p-6 rounded-lg' 
                            : ''
                        }`}>
                          <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">
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
        </BackgroundWrapper>
      </div>

      {/* Profile Panel - Hidden on mobile, sticky sidebar on desktop */}
      <div className="hidden lg:flex w-full lg:w-1/3 bg-black flex-col justify-center lg:order-2 lg:sticky lg:top-0 lg:h-screen z-10">
        <HolographicProfileCard personal={currentData.personal} />
        <SocialLinks links={currentData.socialLinks} />
      </div>
    </div>
  );
}