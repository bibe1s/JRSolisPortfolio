// app/components/editor/DraggableSectionsList.tsx

"use client";

import { useProfile } from '@/contexts/ProfileContext';
import { Plus, Trash2, X, GripVertical, Edit, Image as ImageIcon, Droplets } from 'lucide-react';
import { useState } from 'react';
import { ContentBlockEditor } from '@/components/modals/ContentBlockEditor';
import { TechStackEditor } from '@/components/modals/TechStackEditor';
import { SectionEditor } from '@/components/modals/SectionEditor';
import { AddSectionModal } from '@/components/modals/AddSectionModal';
import { TechStackItemEditor } from '@/components/editor/TechStackItemEditor';
import { ContentBlockType } from '@/lib/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


// Draggable Section Component
function DraggableSection({ section, mode }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const {
    addContentBlock,
    deleteContentBlock,
    updateContentBlock,
    addTechStack,
    deleteTechStack,
    deleteSection,
    updateSection,
    updateTechStack,
  } = useProfile();

  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [showEditBlockModal, setShowEditBlockModal] = useState(false);
  const [editingTech, setEditingTech] = useState<any>(null);
  const [showEditTechModal, setShowEditTechModal] = useState(false);

  const handleSaveSectionName = (name: string) => {
    updateSection(mode, section.id, { name });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // ✅ UPDATED: Include image and imageLink parameters
  const handleSaveBlock = (
    type: ContentBlockType, 
    content: string, 
    duration?: string,
    image?: string,
    imageLink?: string
  ) => {
    if (editingBlock) {
      // Update existing block
      updateContentBlock(mode, section.id, editingBlock.id, {
        type,
        content,
        duration,
        image,
        imageLink,
      });
    } else {
      // Add new block
      addContentBlock(mode, section.id, { 
        type, 
        content, 
        duration,
        image,
        imageLink,
      });
    }
  };

  const handleEditTech = (tech: any) => {
    setEditingTech(tech);
    setShowEditTechModal(true);
  };

  const handleDeleteTech = () => {
    if (editingTech) {
      deleteTechStack(mode, section.id, editingTech.id);
      setEditingTech(null);
      setShowEditTechModal(false);
    }
  };

  const handleCloseEditTech = () => {
    setEditingTech(null);const handleEditTech = (tech: any) => {
  setEditingTech(tech);
  setShowEditTechModal(true);
};

const handleDeleteTech = () => {
  if (editingTech) {
    deleteTechStack(mode, section.id, editingTech.id);
    setEditingTech(null);
    setShowEditTechModal(false);
  }
};

const handleCloseEditTech = () => {
  setEditingTech(null);
  setShowEditTechModal(false);
};
    setShowEditTechModal(false);
  };

  const handleEditBlock = (block: any) => {
    setEditingBlock(block);
    setShowEditBlockModal(true);
  };

  const handleDeleteBlock = () => {
    if (editingBlock) {
      deleteContentBlock(mode, section.id, editingBlock.id);
      setEditingBlock(null);
      setShowEditBlockModal(false);
    }
  };

  const handleCloseEditBlock = () => {
    setEditingBlock(null);
    setShowEditBlockModal(false);
  };

const handleSaveTech = (name: string, iconUrl: string, link?: string) => {
  if (editingTech) {
    // Update existing tech item
    updateTechStack(mode, section.id, editingTech.id, {
      name,
      icon: iconUrl,
      link,
    });
  } else {
    // Add new tech item
    addTechStack(mode, section.id, { name, icon: iconUrl, link });
  }
};

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="border rounded-lg p-4 space-y-3 bg-white"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            suppressHydrationWarning
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </button>

          {/* Section Name */}
          <h3 className="font-semibold text-lg flex-1">{section.name}</h3>

          {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Glass Effect Toggle */}
              <button
                onClick={() => updateSection(mode, section.id, { 
                  enableGlassEffect: !section.enableGlassEffect 
                })}
                className={`p-2 rounded transition-colors ${
                  section.enableGlassEffect 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title={section.enableGlassEffect ? 'Disable glass effect' : 'Enable glass effect'}
              >
                <Droplets className="w-4 h-4" />
              </button>
              
              {/* Edit Section Name */}
              <button
                onClick={() => setShowEditSectionModal(true)}
                className="p-2 hover:bg-gray-100 rounded"
                title="Edit section"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Delete Section */}
              <button
                onClick={() => deleteSection(mode, section.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Delete section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
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
                .sort((a: any, b: any) => a.order - b.order)
                .map((block: any) => (
                  <div
                    key={block.id}
                    onClick={() => handleEditBlock(block)}
                    className="p-3 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {block.type}
                          </span>
                          {/* ✅ NEW: Image indicator icon */}
                          {block.image && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              Photo
                            </span>
                          )}
                          {/* ✅ NEW: Glass effect indicator */}
                          {block.enableGlassEffect && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Droplets className="w-3 h-3" />
                              Glass
                            </span>
                          )}

                        </div>
                        <p className="text-sm mt-1">{block.content}</p>
                        {block.duration && (
                          <p className="text-xs text-gray-500 mt-1">
                            📅 {block.duration}
                          </p>
                        )}
                        {/* ✅ NEW: Show image link if exists */}
                        {block.imageLink && (
                          <p className="text-xs text-blue-600 mt-1">
                            🔗 Link: {block.imageLink.length > 40 ? block.imageLink.substring(0, 40) + '...' : block.imageLink}
                          </p>
                        )}
                      </div>

        <div className="flex items-center gap-1">
          {/* ✅ NEW: Glass effect toggle for block */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateContentBlock(mode, section.id, block.id, {
                enableGlassEffect: !block.enableGlassEffect
              });
            }}
            className={`p-1 rounded transition-colors ${
              block.enableGlassEffect 
                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                : 'hover:bg-gray-100 text-gray-400'
            }`}
            title={block.enableGlassEffect ? 'Disable glass effect' : 'Enable glass effect'}
          >
            <Droplets className="w-3 h-3" />
          </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening edit modal
                          deleteContentBlock(mode, section.id, block.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete block"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                ))
            )}

            {/* Add Block Button */}
            <button
              onClick={() => setShowAddBlockModal(true)}
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
          .sort((a: any, b: any) => a.order - b.order)
          .map((tech: any) => (
            <div key={tech.id} className="relative group">
              {/* Clickable tech icon - opens edit modal */}
              <div
                onClick={() => handleEditTech(tech)}
                className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              >
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Name and link indicator */}
              <div className="text-center mt-1 w-16">
                <p className="text-xs text-gray-600 truncate" title={tech.name}>
                  {tech.name}
                </p>
                {tech.link && (
                  <p className="text-xs text-blue-600">🔗</p>
                )}
              </div>
              
              {/* Delete button - stops propagation to prevent edit modal */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this item?')) {
                    deleteTechStack(mode, section.id, tech.id);
                  }
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
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
              onClick={() => setShowAddTechModal(true)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Plus className="w-4 h-4" />
              Add Tech/Community
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ContentBlockEditor
        isOpen={showAddBlockModal}
        onClose={() => setShowAddBlockModal(false)}
        onSave={handleSaveBlock}
      />

      <TechStackEditor
        isOpen={showAddTechModal}
        onClose={() => setShowAddTechModal(false)}
        onSave={handleSaveTech}
      />

      <SectionEditor
        isOpen={showEditSectionModal}
        onClose={() => setShowEditSectionModal(false)}
        onSave={handleSaveSectionName}
        currentName={section.name}
      />

      {/* ✅ UPDATED: Pass image fields to edit modal */}
      <ContentBlockEditor
        isOpen={showEditBlockModal}
        onClose={handleCloseEditBlock}
        onSave={handleSaveBlock}
        onDelete={handleDeleteBlock}
        initialData={editingBlock ? {
          type: editingBlock.type,
          content: editingBlock.content,
          duration: editingBlock.duration,
          image: editingBlock.image,
          imageLink: editingBlock.imageLink,
        } : undefined}
      />

            {/* Edit Tech Modal */}
      <TechStackItemEditor
        isOpen={showEditTechModal}
        onClose={handleCloseEditTech}
        onSave={handleSaveTech}
        onDelete={handleDeleteTech}
        initialData={editingTech ? {
          name: editingTech.name,
          icon: editingTech.icon,
          link: editingTech.link,
        } : undefined}
      />
    </>
  );
}

// Main Component
export function DraggableSectionsList() {
  const { profile, currentMode, reorderSections, addSection } = useProfile();
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  const currentSections = profile[currentMode].sections;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentSections.findIndex((s) => s.id === active.id);
      const newIndex = currentSections.findIndex((s) => s.id === over.id);

      // Get the new order of section IDs
      const reorderedIds = arrayMove(
        currentSections.map(s => s.id),
        oldIndex,
        newIndex
      );

      // Update sections with new order
      reorderSections(currentMode, reorderedIds);
    }
  };

  const handleAddSection = (name: string, type: 'content' | 'techStack', insertAfter?: string) => {
    addSection(
      currentMode,
      {
        name,
        type,
        contentBlocks: type === 'content' ? [] : undefined,
        techStack: type === 'techStack' ? [] : undefined,
      },
      insertAfter
    );
  };

  if (currentSections.length === 0) {
    return (
      <>
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-xl mb-2">📝</p>
          <p className="text-gray-500 mb-4">No sections yet!</p>
          <button 
            onClick={() => setShowAddSectionModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create Your First Section
          </button>
        </div>

        <AddSectionModal
          isOpen={showAddSectionModal}
          onClose={() => setShowAddSectionModal(false)}
          onSave={handleAddSection}
          existingSections={currentSections}
        />
      </>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={currentSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {/* Add Section Button at Top */}
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="w-full py-3 mb-4 border-2 border-dashed border-blue-400 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-blue-600 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Section at Top
          </button>

          <div className="space-y-4">
            {currentSections
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <DraggableSection
                  key={section.id}
                  section={section}
                  mode={currentMode}
                />
              ))}
          </div>

          {/* Add Section Button at Bottom */}
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="w-full py-3 mt-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Section at Bottom
          </button>
        </SortableContext>
      </DndContext>

      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onSave={handleAddSection}
        existingSections={currentSections}
      />
    </>
  );
}