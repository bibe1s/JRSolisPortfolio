// app/components/editor/SaveCancelBar.tsx

"use client";

import { useProfile } from '@/contexts/ProfileContext';
import { Save, X } from 'lucide-react';

export function SaveCancelBar() {
  const { hasUnsavedChanges, saveChanges, discardChanges } = useProfile();

  if (!hasUnsavedChanges) {
    return null;
  }

  const handleSave = () => {
    console.log('💾 Saving changes...');
    saveChanges();
    
    // Trigger custom event for any listeners (like preview page)
    window.dispatchEvent(new CustomEvent('profile-saved', {
      detail: { timestamp: Date.now() }
    }));
    
    console.log('✅ Changes saved and broadcasted!');
  };

  const handleDiscard = () => {
    console.log('↩️ Discarding changes...');
    discardChanges();
  };

  return (
    <div className="fixed bottom-0 right-0 left-1/3 bg-yellow-50 border-t-2 border-yellow-400 p-4 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-gray-700">
          You have unsaved changes
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleDiscard}
          className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}