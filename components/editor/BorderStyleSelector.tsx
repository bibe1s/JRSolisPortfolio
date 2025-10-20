// components/editor/BorderStyleSelector.tsx

"use client";

import { useState, useRef, useEffect } from 'react';

interface BorderStyleSelectorProps {
  value: string;
  onChange: (style: 'gradient' | 'star' | 'electric' | 'pixel' | 'blur' | 'none') => void;
}

export function BorderStyleSelector({ value, onChange }: BorderStyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const borderStyles = [
    { id: 'gradient', name: 'Gradient', icon: '🌈', desc: 'Rainbow gradient with pulse' },
    { id: 'star', name: 'Star', icon: '✨', desc: 'Light spots at corners' },
    { id: 'electric', name: 'Electric', icon: '⚡', desc: 'Purple/pink glow' },
    { id: 'pixel', name: 'Pixel', icon: '▪️', desc: 'RGB colored corners' },
    { id: 'blur', name: 'Blur', icon: '💫', desc: 'Soft white blur' },
    { id: 'none', name: 'None', icon: '○', desc: 'Subtle static glow' }
  ];

  const currentStyle = borderStyles.find(s => s.id === value) || borderStyles[0];

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="space-y-2 relative"> {/* Added relative for better absolute positioning */}
      <label className="block text-sm font-medium text-gray-700">
        Border Style
      </label>
      
      {/* Selected Style Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentStyle.icon}</span>
          <div className="text-left">
            <div className="font-medium text-gray-900">{currentStyle.name}</div>
            <div className="text-xs text-gray-500">{currentStyle.desc}</div>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full max-w-md mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {borderStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => {
                onChange(style.id as any);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                value === style.id ? 'bg-blue-100' : ''
              }`}
            >
              <span className="text-2xl">{style.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{style.name}</div>
                <div className="text-xs text-gray-500">{style.desc}</div>
              </div>
              {value === style.id && (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}