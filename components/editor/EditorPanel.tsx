// components/editor/EditorPanel.tsx
"use client";

import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { ModeToggle } from './ModeToggle';
import { PersonalInfoEditor } from './PersonalInfoEditor';
import { SocialLinksEditor } from './SocialLinksEditor';
import { ProfileDisplaySettings } from './ProfileDisplaySettings';
import { DraggableSectionsList } from './DraggableSectionsList';
import { BackgroundSelector } from '@/components/modals/BackgroundSelector';
import { SaveCancelBar } from './SaveCancelBar';
import { LogoutButton } from './LogoutButton';
import { Palette, ExternalLink } from 'lucide-react';
import { LayoutSelector } from '@/components/modals/LayoutSelector';
import { Layout } from 'lucide-react';

export function EditorPanel() {
  const { profile, currentMode, updateBackground, updateLayoutType } = useProfile();
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);

  const handleSaveBackground = (
    type: any,
    color: string,
    speed: number,
    density: number,
    interactive: boolean
  ) => {
    updateBackground(currentMode, {
      type,
      color,
      speed,
      density,
      interactive,
    });
  };

  const handleSelectLayout = (layoutType: any) => {
  updateLayoutType(currentMode, layoutType);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b bg-white">
        <ModeToggle />
        
        <div className="flex gap-2">
          <button
            onClick={() => window.open('/', '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Preview
          </button>

          <button
            onClick={() => setShowLayoutModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Change Layout">
            <Layout className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={() => setShowBackgroundModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Change Background"
          >
            <Palette className="w-5 h-5 text-gray-600" />
          </button>

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
        <PersonalInfoEditor />
        
        <div className="border-t pt-8">
          <SocialLinksEditor />
        </div>
        
        <div className="border-t pt-8">
          <ProfileDisplaySettings />
        </div>

        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold mb-4">Content Sections</h2>
          <DraggableSectionsList />
        </div>
      </div>

      {/* Fixed Save/Cancel Bar */}
      <SaveCancelBar />

      {/* Background Selector Modal */}
      <BackgroundSelector
        isOpen={showBackgroundModal} 
        onClose={() => setShowBackgroundModal(false)}
        onSave={handleSaveBackground}
        currentConfig={profile[currentMode].background}
      />

      {/* Layout Selector Modal - ADD THIS */}
      <LayoutSelector
        isOpen={showLayoutModal}
        onClose={() => setShowLayoutModal(false)}
        onSelect={handleSelectLayout}
        currentLayout={profile[currentMode].layoutType}
      />

    </div>
  );
}