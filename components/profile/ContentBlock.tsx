"use client";

import { useState } from 'react';
import { ContentBlock as ContentBlockType } from '@/lib/types';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ImageLightbox } from './ImageLightbox';

interface ContentBlockProps {
  block: ContentBlockType;
  sectionGlassEffect?: boolean;
}

export function ContentBlock({ 
  block, 
  sectionGlassEffect = false
}: ContentBlockProps) {
  const shouldApplyGlass = block.enableGlassEffect ?? sectionGlassEffect;
  const glassClasses = shouldApplyGlass 
    ? 'backdrop-blur-md bg-black/50 p-4 rounded-lg' 
    : '';

  // Get images and links arrays (ensure they're arrays)
  const images = block.image || [];
  const imageLinks = block.imageLink || [];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🖼️ Image clicked! Opening lightbox...');
    setLightboxOpen(true);
  };

  // Render text content
  const renderText = () => {
    if (!block.content) return null;

    if (block.type === 'title') {
      return (
        <h2 className="text-2xl font-bold text-white mb-2">
          {block.content}
          {block.duration && (
            <span className="text-lg text-gray-400 ml-2">
              ({block.duration})
            </span>
          )}
        </h2>
      );
    }

    return (
      <p className="text-lg text-gray-300">
        {block.content}
        {block.duration && (
          <span className="text-sm text-gray-400 ml-2">
            • {block.duration}
          </span>
        )}
      </p>
    );
  };

  // Render carousel
  const renderCarousel = () => {
    if (images.length === 0) return null;

    const currentImage = images[activeIndex];
    const currentLink = imageLinks[activeIndex];

    return (
      <>
        <div className="mt-3 relative group">
          {/* Image - Added pointer-events-auto and z-index */}
          <div 
            className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer pointer-events-auto z-10"
            onClick={handleImageClick}
            style={{ pointerEvents: 'auto' }}
          >
            <img
              src={currentImage}
              alt={block.content || `Image ${activeIndex + 1}`}
              className="w-full h-full object-cover transition-transform hover:scale-105 pointer-events-auto"
              style={{ pointerEvents: 'auto' }}
            />

            {/* Expand Icon Overlay */}
            <div className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Maximize2 className="w-5 h-5" />
            </div>

            {/* Navigation Arrows - Only show if multiple images */}
            {images.length > 1 && (
              <>
                {/* Left Arrow - Smaller clickable area */}
                <div className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-start pl-2 z-20 pointer-events-auto">
                  <button
                    onClick={handlePrevious}
                    className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all pointer-events-auto"
                    style={{ pointerEvents: 'auto' }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>

                {/* Right Arrow - Smaller clickable area */}
                <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-end pr-2 z-20 pointer-events-auto">
                  <button
                    onClick={handleNext}
                    className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all pointer-events-auto"
                    style={{ pointerEvents: 'auto' }}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full z-10 pointer-events-none">
                  {activeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Dots Indicator (if multiple images) */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-2 pointer-events-auto">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all pointer-events-auto ${
                    index === activeIndex 
                      ? 'bg-blue-500 w-6' 
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <ImageLightbox
            images={images}
            imageLinks={imageLinks}
            initialIndex={activeIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </>
    );
  };

  return (
    <div className={`mb-3 ${glassClasses}`}>
      {/* Text Content */}
      {renderText()}

      {/* Image Carousel */}
      {renderCarousel()}
    </div>
  );
}