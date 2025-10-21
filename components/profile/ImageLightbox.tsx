// app/components/profile/ImageLightbox.tsx

"use client";

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ImageLightboxProps {
  images: string[];
  imageLinks?: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ 
  images, 
  imageLinks = [],
  initialIndex, 
  isOpen, 
  onClose 
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (isOpen && images.length > 1) {
      document.addEventListener('keydown', handleKeyNav);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyNav);
    };
  }, [isOpen, currentIndex, images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentLink = imageLinks[currentIndex];

  if (!isOpen || !mounted) return null;

  const lightboxContent = (
    <div 
      className="fixed inset-0 bg-black/95 flex items-center justify-center"
      style={{ 
        zIndex: 99999,
        pointerEvents: 'auto'
      }}
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        style={{ 
          zIndex: 100001,
          pointerEvents: 'auto'
        }}
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      {images.length > 1 && (
        <div 
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm"
          style={{ zIndex: 100000 }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* External Link Button */}
      {currentLink && (
        <a
          href={currentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 text-sm font-medium"
          style={{ 
            zIndex: 100001,
            pointerEvents: 'auto'
          }}
        >
          <ExternalLink className="w-4 h-4" />
          Open Link
        </a>
      )}

      {/* Navigation Buttons - Only if multiple images */}
      {images.length > 1 && (
        <>
          {/* Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm"
            style={{ 
              zIndex: 100001,
              pointerEvents: 'auto'
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm"
            style={{ 
              zIndex: 100001,
              pointerEvents: 'auto'
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div 
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        style={{ zIndex: 100000 }}
      >
        <img
          src={images[currentIndex]}
          alt={`Full screen view ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Thumbnail Strip - Only if multiple images */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-3 rounded-full backdrop-blur-sm max-w-[90vw] overflow-x-auto"
          style={{ 
            zIndex: 100000,
            pointerEvents: 'auto'
          }}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                idx === currentIndex 
                  ? 'border-blue-500 scale-110' 
                  : 'border-white/30 hover:border-white/60 opacity-60 hover:opacity-100'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div 
        className="absolute bottom-4 right-4 text-white/60 text-xs bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm hidden md:block"
        style={{ zIndex: 100000 }}
      >
        {images.length > 1 ? 'Arrow keys to navigate • ' : ''}ESC to close
      </div>
    </div>
  );

  // Use portal to render at document body level
  return createPortal(lightboxContent, document.body);
}