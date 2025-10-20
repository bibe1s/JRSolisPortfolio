// components/modals/LayoutSelector.tsx

"use client";

import { X, Check } from 'lucide-react';
import { LayoutType } from '@/lib/types';

interface LayoutOption {
  id: LayoutType;
  name: string;
  description: string;
  preview: string;
}

interface LayoutSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (layoutType: LayoutType) => void;
  currentLayout: LayoutType;
}

const layouts: LayoutOption[] = [
  {
    id: 'default',
    name: 'Default View',
    description: 'Centered profile card with content below',
    preview: '/layout-previews/default.png'
  },
  {
    id: 'left-side',
    name: 'Left Side View',
    description: 'Profile on left, content on right',
    preview: '/layout-previews/left-side.png'
  },
  {
    id: 'right-side',
    name: 'Right Side View',
    description: 'Content on left, profile on right',
    preview: '/layout-previews/right-side.png'
  },
];

export function LayoutSelector({ isOpen, onClose, onSelect, currentLayout }: LayoutSelectorProps) {
  if (!isOpen) return null;

  const handleSelect = (layoutType: LayoutType) => {
    onSelect(layoutType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Layout</h2>
            <p className="text-sm text-gray-500 mt-1">Select how your profile should be displayed</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Layout Options */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {layouts.map((layout) => {
              const isActive = currentLayout === layout.id;
              
              return (
                <button
                  key={layout.id}
                  onClick={() => handleSelect(layout.id)}
                  className={`group relative rounded-xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? 'ring-4 ring-blue-500 shadow-lg scale-105'
                      : 'hover:scale-105 hover:shadow-xl ring-2 ring-gray-200'
                  }`}
                >
                  {/* Preview Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                    <img
                      src={layout.preview}
                      alt={layout.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-size="20" dy=".3em"%3E' + layout.name + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    
                    {/* Active Checkmark */}
                    {isActive && (
                      <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-2">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Layout Info */}
                  <div className="p-4 bg-white border-t">
                    <h3 className={`text-lg font-semibold mb-1 ${
                      isActive ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {layout.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {layout.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          Click any layout to apply it instantly
        </div>
      </div>
    </div>
  );
}