"use client";

import { useState } from 'react';
import { Modal } from './Modal';
import { SocialPlatform } from '@/lib/types';
import { SOCIAL_PLATFORMS, formatSocialUrl } from '@/lib/socialPlatforms';
import * as LucideIcons from 'lucide-react';

interface SocialLinkEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (platform: SocialPlatform, url: string) => void;
}

export function SocialLinkEditor({ isOpen, onClose, onSave }: SocialLinkEditorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [url, setUrl] = useState('');

  const handleSave = () => {
    if (!selectedPlatform || !url.trim()) return;

    const formattedUrl = formatSocialUrl(selectedPlatform, url);
    onSave(selectedPlatform, formattedUrl);

    // Reset and close
    setSelectedPlatform(null);
    setUrl('');
    onClose();
  };

  const handlePlatformSelect = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setUrl('');
  };

  const selectedConfig = selectedPlatform
    ? SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform)
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Social Link" maxWidth="md">
      <div className="p-6 space-y-6">
        {/* Platform Selection */}
        {!selectedPlatform ? (
          <div>
            <label className="block text-sm font-medium mb-3">
              Choose Platform:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SOCIAL_PLATFORMS.map((platform) => {
                const IconComponent = (LucideIcons as any)[platform.icon];
                return (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform.id)}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <span className="font-medium">{platform.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Selected Platform */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                {(() => {
                  const IconComponent = (LucideIcons as any)[selectedConfig?.icon || ''];
                  return IconComponent ? <IconComponent className="w-5 h-5 text-blue-600" /> : null;
                })()}
                <span className="font-medium">{selectedConfig?.name}</span>
              </div>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Profile URL *
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={selectedConfig?.placeholder}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {selectedConfig?.urlPrefix && (
                <p className="text-xs text-gray-500 mt-1">
                  Will be saved as: {selectedConfig.urlPrefix}
                  {url || '...'}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!url.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Link
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}