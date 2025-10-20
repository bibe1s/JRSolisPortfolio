// components/profile/ContentBlock.tsx

"use client";

import { ContentBlock as ContentBlockType } from '@/lib/types';

interface ContentBlockProps {
  block: ContentBlockType;
  sectionGlassEffect?: boolean; // Renamed for clarity
}

export function ContentBlock({ block, sectionGlassEffect = false }: ContentBlockProps) {
  // ✅ FIXED: Use block's own enableGlassEffect if defined, otherwise use section's
  const shouldApplyGlass = block.enableGlassEffect ?? sectionGlassEffect;
  
  const glassClasses = shouldApplyGlass 
    ? 'backdrop-blur-md bg-black/50 p-4 rounded-lg' 
    : '';

  if (block.type === 'title') {
    return (
      <div className={`mb-4 ${glassClasses}`}>
        <h2 className="text-2xl font-bold text-white mb-2">
          {block.content}
          {block.duration && (
            <span className="text-lg text-gray-400 ml-2">
              ({block.duration})
            </span>
          )}
        </h2>
        
        {/* Render image if exists */}
        {block.image && (
          <div className="mt-3">
            {block.imageLink ? (
              <a 
                href={block.imageLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={block.image}
                  alt={block.content}
                  className="w-full aspect-video object-cover rounded-lg hover:opacity-90 transition-opacity"
                />
              </a>
            ) : (
              <img
                src={block.image}
                alt={block.content}
                className="w-full aspect-video object-cover rounded-lg"
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // type === 'context'
  return (
    <div className={`text-gray-300 mb-3 ${glassClasses}`}>
      <p className="text-lg">
        {block.content}
        {block.duration && (
          <span className="text-sm text-gray-400 ml-2">
            • {block.duration}
          </span>
        )}
      </p>
      
      {/* Render image if exists */}
      {block.image && (
        <div className="mt-3">
          {block.imageLink ? (
            <a 
              href={block.imageLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={block.image}
                alt={block.content}
                className="w-full aspect-video object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
          ) : (
            <img
              src={block.image}
              alt={block.content}
              className="w-full aspect-video object-cover rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
}