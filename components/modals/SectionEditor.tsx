// app/components/modals/SectionEditor.tsx

"use client";

import { useState } from 'react';
import { Modal } from './Modal';

interface SectionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  currentName: string;
}

export function SectionEditor({ isOpen, onClose, onSave, currentName }: SectionEditorProps) {
  const [name, setName] = useState(currentName);

  // Update local state when currentName changes
  useState(() => {
    setName(currentName);
  });

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Section Name" maxWidth="sm">
      <div className="p-6 space-y-6">
        {/* Section Name Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Section Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Past Projects, Work Experience"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update
          </button>
        </div>
      </div>
    </Modal>
  );
}