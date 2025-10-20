//app/components/modals/ContentBlockEditor.tsx

"use client";

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ContentBlockType } from '@/lib/types';
import { Link as LinkIcon } from 'lucide-react';

interface ContentBlockEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: ContentBlockType, content: string, duration?: string, image?: string, imageLink?: string) => void;
  onDelete?: () => void; // Optional delete function
  initialData?: { // Initial data for editing
    type: ContentBlockType;
    content: string;
    duration?: string;
    image?: string;
    imageLink?: string;
  };
}

export function ContentBlockEditor({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  initialData 
}: ContentBlockEditorProps) {
  const [type, setType] = useState<ContentBlockType>('title');
  const [content, setContent] = useState('');
  const [hasDuration, setHasDuration] = useState(false);
  const [duration, setDuration] = useState('');
  
  // NEW: Image fields
  const [hasImage, setHasImage] = useState(false);
  const [image, setImage] = useState('');
  const [imageLink, setImageLink] = useState('');

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setContent(initialData.content);
      setHasDuration(!!initialData.duration);
      setDuration(initialData.duration || '');
      
      // Load image data
      setHasImage(!!initialData.image);
      setImage(initialData.image || '');
      setImageLink(initialData.imageLink || '');
    } else {
      // Reset when adding new
      setType('title');
      setContent('');
      setHasDuration(false);
      setDuration('');
      setHasImage(false);
      setImage('');
      setImageLink('');
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!content.trim()) return;

    onSave(
      type,
      content,
      hasDuration && duration.trim() ? duration : undefined,
      hasImage && image.trim() ? image : undefined,
      hasImage && imageLink.trim() ? imageLink : undefined
    );

    handleClose();
  };

  const handleClose = () => {
    // Reset on close only if not editing
    if (!initialData) {
      setType('title');
      setContent('');
      setHasDuration(false);
      setDuration('');
      setHasImage(false);
      setImage('');
      setImageLink('');
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this block?')) {
      onDelete();
      handleClose();
    }
  };

  const isEditing = !!initialData;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={isEditing ? "Edit Content Block" : "Add Content Block"} 
      maxWidth="md"
    >
      <div className="p-6 space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Choose what type:
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setType('title')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                type === 'title'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Title
              <p className="text-xs text-gray-500 mt-1">Large heading (H1)</p>
            </button>
            <button
              onClick={() => setType('context')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                type === 'context'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Context
              <p className="text-xs text-gray-500 mt-1">Description text (H3)</p>
            </button>
          </div>
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {type === 'title' ? 'Title Text *' : 'Description *'}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === 'title'
                ? 'e.g., Past Projects, Educational Attainment'
                : 'e.g., Brief description of your project or role'
            }
            rows={type === 'title' ? 2 : 4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            {type === 'title' 
              ? 'This will appear as a large heading'
              : 'This will appear as descriptive text below the title'
            }
          </p>
        </div>

        {/* Duration Toggle */}
        <div className="flex items-start gap-3 p-4 border rounded-lg">
          <input
            type="checkbox"
            id="hasDuration"
            checked={hasDuration}
            onChange={(e) => setHasDuration(e.target.checked)}
            className="w-4 h-4 mt-1"
          />
          <div className="flex-1">
            <p className="font-medium">
              Add Duration
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Add a date or time period (e.g., "2023 - 2024", "Jan 2024")
            </p>
          </div>
        </div>

        {/* Duration Input (conditional) */}
        {hasDuration && (
          <div className="ml-7">
            <label className="block text-sm font-medium mb-2">
              Duration / Date
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2023 - 2024, Jan 2024, Present"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* NEW: Photo Toggle */}
        <div className="flex items-start gap-3 p-4 border rounded-lg">
          <input
            type="checkbox"
            id="hasImage"
            checked={hasImage}
            onChange={(e) => setHasImage(e.target.checked)}
            className="w-4 h-4 mt-1"
          />
          <div className="flex-1">
            <p className="font-medium">
              Add Photo
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Add an image to this content block (landscape orientation recommended)
            </p>
          </div>
        </div>

        {/* NEW: Image Inputs (conditional) */}
        {hasImage && (
          <div className="ml-7 space-y-4">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    const url = prompt('Paste image URL:');
                    if (url) setImage(url);
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                  title="Paste URL"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Direct link to the image (recommended: landscape orientation)
              </p>
            </div>

            {/* Image Link (optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Link URL (Optional)
              </label>
              <input
                type="text"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                placeholder="https://example.com (optional - makes image clickable)"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                If provided, clicking the image will redirect to this URL
              </p>
            </div>

            {/* Image Preview */}
            {image && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                <div className="w-full aspect-video bg-gray-200 rounded overflow-hidden">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.alt = 'Failed to load image';
                      e.currentTarget.className = 'w-full h-full flex items-center justify-center text-red-500';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          {type === 'title' ? (
            <h2 className="text-2xl font-bold">
              {content || 'Your title here'}
              {hasDuration && duration && (
                <span className="text-lg text-gray-500 ml-2">
                  ({duration})
                </span>
              )}
            </h2>
          ) : (
            <p className="text-gray-700">
              {content || 'Your description here'}
              {hasDuration && duration && (
                <span className="text-sm text-gray-500 ml-2">
                  • {duration}
                </span>
              )}
            </p>
          )}
          
          {/* Show image in preview if added */}
          {hasImage && image && (
            <div className="mt-3">
              <div className="w-full aspect-video bg-gray-200 rounded overflow-hidden">
                <img
                  src={image}
                  alt="Content preview"
                  className="w-full h-full object-cover"
                />
              </div>
              {imageLink && (
                <p className="text-xs text-blue-600 mt-1">
                  🔗 Clickable link: {imageLink}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-between pt-4 border-t">
          {/* Delete button (only when editing) */}
          {isEditing && onDelete && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          )}
          
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim() || (hasImage && !image.trim())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Update' : 'Add Block'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}