// app/components/editor/ModeToggle.tsx

"use client";

import { useProfile } from '@/contexts/ProfileContext';

export function ModeToggle() {
  const { currentMode, setCurrentMode } = useProfile();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setCurrentMode('web2')}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          currentMode === 'web2'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Web2
      </button>
      <button
        onClick={() => setCurrentMode('web3')}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          currentMode === 'web3'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Web3
      </button>
    </div>
  );
}