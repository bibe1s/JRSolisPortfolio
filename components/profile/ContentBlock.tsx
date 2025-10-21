"use client";

import { useState } from 'react';
import { ContentBlock as ContentBlockType } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Support both old (single image) and new (multiple images) format
  const images = block.image || (block.image ? [block.image] : []);
  const imageLinks = block.imageLink || (block.imageLink ? [block.imageLink] : []);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
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
      <div className="mt-3 relative group">
        {/* Image */}
        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
          {currentLink ? (
            <a 
              href={currentLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img
                src={currentImage}
                alt={block.content || `Image ${activeIndex + 1}`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </a>
          ) : (
            <img
              src={currentImage}
              alt={block.content || `Image ${activeIndex + 1}`}
              className="w-full h-full object-cover"
            />
          )}

          {/* Navigation Arrows - Only show if multiple images */}
          {images.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {activeIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Dots Indicator (if multiple images) */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'bg-blue-500 w-6' 
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
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