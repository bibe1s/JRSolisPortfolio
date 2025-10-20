// app/components/editor/SocialLinksEditor.tsx

"use client";

import { useProfile } from '@/contexts/ProfileContext';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { SocialLinkEditor } from '@/components/modals/SocialLinkEditor';
import { SocialPlatform } from '@/lib/types';

export function SocialLinksEditor() {
  const { profile, currentMode, addSocialLink, deleteSocialLink } = useProfile();
  const [showAddModal, setShowAddModal] = useState(false);

  // Get social links for current mode
const socialLinks = profile[currentMode]?.socialLinks || [];

  const handleAddLink = (platform: SocialPlatform, url: string) => {
    addSocialLink(currentMode, { platform, url });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Social Links</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
          {currentMode === 'web2' ? '👔 Professional' : '🎭 Community'}
        </span>
      </div>

      {/* Current Links */}
      <div className="space-y-2">
        {socialLinks.length === 0 ? (
          <p className="text-sm text-gray-500">
            No social links yet for {currentMode === 'web2' ? 'Web2' : 'Web3'}
          </p>
        ) : (
          socialLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <p className="font-medium capitalize">{link.platform}</p>
                <p className="text-sm text-gray-500 truncate">{link.url}</p>
              </div>
              <button
                onClick={() => deleteSocialLink(currentMode, link.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Delete"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <Plus className="w-4 h-4" />
        Add Social Link
      </button>

      {/* Modal */}
      <SocialLinkEditor
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddLink}
      />
    </div>
  );
}