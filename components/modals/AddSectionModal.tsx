"use client";

import { useState } from 'react';
import { Modal } from './Modal';
import { ProfileSection } from '@/lib/types';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, type: 'content' | 'techStack', insertAfter?: string) => void;
  existingSections: ProfileSection[];
}

export function AddSectionModal({ 
  isOpen, 
  onClose, 
  onSave,
  existingSections 
}: AddSectionModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'content' | 'techStack'>('content');
  const [position, setPosition] = useState<'top' | 'bottom' | string>('top');

  const handleSave = () => {
    if (!name.trim()) return;

    // Determine insertAfter based on position
    let insertAfter: string | undefined;
    
    if (position === 'top') {
      insertAfter = undefined; // Will insert at position 0
    } else if (position === 'bottom') {
      insertAfter = existingSections[existingSections.length - 1]?.id;
    } else {
      insertAfter = position; // It's a section ID
    }

    onSave(name, type, insertAfter);
    
    // Reset
    setName('');
    setType('content');
    setPosition('top');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setType('content');
    setPosition('top');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Section" maxWidth="md">
      <div className="p-6 space-y-6">
        {/* Section Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Section Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Work Experience, Certifications"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Section Type */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Section Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType('content')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                type === 'content'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-semibold">Content</div>
              <div className="text-xs text-gray-500 mt-1">
                Text blocks with titles and descriptions
              </div>
            </button>

            <button
              onClick={() => setType('techStack')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                type === 'techStack'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">🔧</div>
              <div className="font-semibold">Tech / Icons</div>
              <div className="text-xs text-gray-500 mt-1">
                Circular icons for tech stack or communities
              </div>
            </button>
          </div>
        </div>

        {/* Insert Position */}
        {existingSections.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Insert Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="top">At the top (first)</option>
              {existingSections.map((section) => (
                <option key={section.id} value={section.id}>
                  After "{section.name}"
                </option>
              ))}
              <option value="bottom">At the bottom (last)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Default: At the top
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Section
          </button>
        </div>
      </div>
    </Modal>
  );
}