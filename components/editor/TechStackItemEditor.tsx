// app/components/editor/TechStackItemEditor.tsx// app/components/modals/TechStackItemEditor.tsx

"use client";

import { useState, useEffect } from 'react';
import { Modal } from '@/components/modals/Modal';
import { Link as LinkIcon } from 'lucide-react';

interface TechStackItemEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, iconUrl: string, link?: string) => void;
  onDelete: () => void;
  initialData?: {
    name: string;
    icon: string;
    link?: string;
  };
}

export function TechStackItemEditor({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  initialData 
}: TechStackItemEditorProps) {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [link, setLink] = useState('');

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIconUrl(initialData.icon);
      setLink(initialData.link || '');
    } else {
      // Reset when adding new
      setName('');
      setIconUrl('');
      setLink('');
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!name.trim() || !iconUrl.trim()) return;

    onSave(name, iconUrl, link.trim() || undefined);
    handleClose();
  };

  const handleClose = () => {
    // Only reset if not editing
    if (!initialData) {
      setName('');
      setIconUrl('');
      setLink('');
    }
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this tech/community item?')) {
      onDelete();
      handleClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Edit Tech/Community" 
      maxWidth="md"
    >
      <div className="p-6 space-y-6">
        {/* Icon Preview */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
            {iconUrl ? (
              <img
                src={iconUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-4xl text-gray-400">?</span>
            )}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., React, TypeScript, Discord"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            The name of the technology or community
          </p>
        </div>

        {/* Icon URL Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Icon URL *
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => {
                const url = prompt('Paste icon URL:');
                if (url) setIconUrl(url);
              }}
              className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              title="Paste URL"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Direct link to the icon image (PNG, SVG, or JPG)
          </p>
        </div>

        {/* Link URL Input (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Link URL (Optional)
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com (makes icon clickable)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            If provided, clicking the icon will redirect to this URL in preview
          </p>
        </div>

        {/* Tips */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">💡 Tips:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Click the icon in the editor to edit it</li>
            <li>• Use the X button to quickly delete</li>
            <li>• Add links to make icons clickable in preview</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-between pt-4 border-t">
          {/* Delete button (only when editing) */}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !iconUrl.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}