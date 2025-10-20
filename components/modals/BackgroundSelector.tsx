// app/components/modals/BackgroundSelector.tsx

import { X, Check } from 'lucide-react';

interface BackgroundOption {
  id: string;
  name: string;
  image: string;
  category: 'OGL' | 'THREE' | 'OTHER';
}

interface BackgroundSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: any, color: string, speed: number, density: number, interactive: boolean) => void;
  currentConfig: any;
}

const backgrounds: BackgroundOption[] = [
  { id: 'liquid-ether', name: 'Liquid Ether', image: '/background-previews/liquid-ether.png', category: 'THREE' },
  { id: 'prism', name: 'Prism', image: '/background-previews/prism.png', category: 'OGL' },
  { id: 'dark-veil', name: 'Dark Veil', image: '/background-previews/dark-veil.png', category: 'OGL' },
  { id: 'light-rays', name: 'Light Rays', image: '/background-previews/light-rays.png', category: 'OGL' },
  { id: 'aurora', name: 'Aurora', image: '/background-previews/aurora.png', category: 'OGL' },
  { id: 'plasma', name: 'Plasma', image: '/background-previews/plasma.png', category: 'OGL' },
  { id: 'particles', name: 'Particles', image: '/background-previews/particles.png', category: 'OGL' },
  { id: 'gradient-blinds', name: 'Gradient Blinds', image: '/background-previews/gradient-blinds.png', category: 'OGL' },
  { id: 'prismatic-burst', name: 'Prismatic Burst', image: '/background-previews/prismatic-burst.png', category: 'OGL' },
  { id: 'galaxy', name: 'Galaxy', image: '/background-previews/galaxy.png', category: 'OGL' },
  { id: 'faulty-terminal', name: 'Faulty Terminal', image: '/background-previews/faulty-terminal.png', category: 'OGL' },
  { id: 'ripple-grid', name: 'Ripple Grid', image: '/background-previews/ripple-grid.png', category: 'OGL' },
  { id: 'threads', name: 'Threads', image: '/background-previews/threads.png', category: 'OGL' },
  { id: 'irisdescence', name: 'Iridescence', image: '/background-previews/irisdescence.png', category: 'OGL' },
  { id: 'orb', name: 'Orb', image: '/background-previews/orb.png', category: 'OGL' },
  { id: 'liquid-chrome', name: 'Liquid Chrome', image: '/background-previews/liquid-chrome.png', category: 'OGL' },
  { id: 'balatro', name: 'Balatro', image: '/background-previews/balatro.png', category: 'OGL' },
  { id: 'letter-glitch', name: 'Letter Glitch', image: '/background-previews/letter-glitch.png', category: 'OTHER' },
];

export function BackgroundSelector({ isOpen, onClose, onSave, currentConfig }: BackgroundSelectorProps) {
  if (!isOpen) return null;

  const handleSelect = (backgroundId: string) => {
    onSave(
      backgroundId,
      currentConfig?.color || '#3b82f6',
      currentConfig?.speed || 50,
      currentConfig?.density || 50,
      currentConfig?.interactive ?? true
    );
    onClose();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'OGL': return 'bg-purple-100 text-purple-700';
      case 'THREE': return 'bg-blue-100 text-blue-700';
      case 'OTHER': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Background</h2>
            <p className="text-sm text-gray-500 mt-1">Select a background for your portfolio</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Background Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {backgrounds.map((bg) => {
              const isActive = currentConfig?.type === bg.id;
              
              return (
                <button
                  key={bg.id}
                  onClick={() => handleSelect(bg.id)}
                  className={`group relative rounded-xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? 'ring-4 ring-blue-500 shadow-lg scale-105'
                      : 'hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  {/* Image Container */}
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img
                      src={bg.image}
                      alt={bg.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    
                    {/* Active Checkmark */}
                    {isActive && (
                      <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(bg.category)}`}>
                        {bg.category}
                      </span>
                    </div>
                  </div>

                  {/* Background Name */}
                  <div className="p-3 bg-white">
                    <h3 className={`text-sm font-semibold text-center ${
                      isActive ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {bg.name}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          Click any background to apply it instantly
        </div>
      </div>
    </div>
  );
}