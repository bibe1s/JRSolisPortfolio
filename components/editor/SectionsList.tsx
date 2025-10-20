// components/editor/SectionsList.tsx

"use client";

import { useProfile } from '@/contexts/ProfileContext';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { ContentBlockEditor } from '@/components/modals/ContentBlockEditor';
import { TechStackEditor } from '@/components/modals/TechStackEditor';
import { ContentBlockType } from '@/lib/types';

export function SectionsList() {
  const { 
    profile, 
    currentMode, 
    addContentBlock, 
    deleteContentBlock,
    addTechStack,
    deleteTechStack,
    deleteSection 
  } = useProfile();

  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const currentSections = profile[currentMode].sections;

  const handleAddBlock = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setShowAddBlockModal(true);
  };

  const handleAddTech = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setShowAddTechModal(true);
  };

  const handleSaveBlock = (
    type: ContentBlockType, 
    content: string, 
    duration?: string,
    image?: string,
    imageLink?: string
  ) => {
    if (!selectedSectionId) return;

    addContentBlock(currentMode, selectedSectionId, {
      type,
      content,
      duration,
      image,
      imageLink,
    });
  };

  const handleSaveTech = (name: string, iconUrl: string) => {
    if (!selectedSectionId) return;

    addTechStack(currentMode, selectedSectionId, {
      name,
      icon: iconUrl,
    });
  };

  return (
    <div className="space-y-6">
      {currentSections.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No sections yet. They'll appear here!</p>
        </div>
      ) : (
        currentSections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className="border rounded-lg p-4 space-y-3">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{section.name}</h3>
                <button
                  onClick={() => deleteSection(currentMode, section.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Section Type Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {section.type === 'techStack' ? '🔧 Tech Stack / Communities' : '📝 Content'}
                </span>
              </div>

              {/* Content Blocks */}
              {section.type === 'content' && section.contentBlocks && (
                <div className="space-y-2 mt-4">
                  {section.contentBlocks.length === 0 ? (
                    <p className="text-sm text-gray-500">No content blocks yet</p>
                  ) : (
                    section.contentBlocks
                      .sort((a, b) => a.order - b.order)
                      .map((block) => (
                        <div
                          key={block.id}
                          className="p-3 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                {block.type}
                              </span>
                              <p className="text-sm mt-1">{block.content}</p>
                              {block.duration && (
                                <p className="text-xs text-gray-500 mt-1">
                                  📅 {block.duration}
                                </p>
                              )}
                              
                              {/* NEW: Show image preview if exists */}
                              {block.image && (
                                <div className="mt-2">
                                  <div className="w-full aspect-video bg-gray-200 rounded overflow-hidden">
                                    <img
                                      src={block.image}
                                      alt="Block preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  {block.imageLink && (
                                    <p className="text-xs text-blue-600 mt-1">
                                      🔗 Link: {block.imageLink}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => deleteContentBlock(currentMode, section.id, block.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete block"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}

                  {/* Add Block Button */}
                  <button
                    onClick={() => handleAddBlock(section.id)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add Content Block
                  </button>
                </div>
              )}

              {/* Tech Stack */}
              {section.type === 'techStack' && section.techStack && (
                <div className="mt-4 space-y-3">
                  {section.techStack.length === 0 ? (
                    <p className="text-sm text-gray-500">No items yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {section.techStack
                        .sort((a, b) => a.order - b.order)
                        .map((tech) => (
                          <div
                            key={tech.id}
                            className="relative group"
                          >
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                              <img
                                src={tech.icon}
                                alt={tech.name}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                            <p className="text-xs text-center mt-1 text-gray-600">
                              {tech.name}
                            </p>
                            {/* Delete button on hover */}
                            <button
                              onClick={() => deleteTechStack(currentMode, section.id, tech.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              title="Delete"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Add Tech Button */}
                  <button
                    onClick={() => handleAddTech(section.id)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tech/Community
                  </button>
                </div>
              )}
            </div>
          ))
      )}

      {/* Content Block Editor Modal */}
      <ContentBlockEditor
        isOpen={showAddBlockModal}
        onClose={() => {
          setShowAddBlockModal(false);
          setSelectedSectionId(null);
        }}
        onSave={handleSaveBlock}
      />

      {/* Tech Stack Editor Modal */}
      <TechStackEditor
        isOpen={showAddTechModal}
        onClose={() => {
          setShowAddTechModal(false);
          setSelectedSectionId(null);
        }}
        onSave={handleSaveTech}
      />
    </div>
  );
}