"use client";

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Modal } from './Modal';
import { ContentBlockType } from '@/lib/types';
import { Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentBlockEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: ContentBlockType, content: string, duration?: string, images?: string[], imageLinks?: string[]) => void;
  onDelete?: () => void;
  initialData?: {
    type: ContentBlockType;
    content: string;
    duration?: string;
    images?: string[];
    imageLinks?: string[];
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
  
  const [hasImages, setHasImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setContent(initialData.content);
      setHasDuration(!!initialData.duration);
      setDuration(initialData.duration || '');
      setHasImages(!!(initialData.images && initialData.images.length > 0));
      setImages(initialData.images || []);
      setImageLinks(initialData.imageLinks || []);
      setPreviewIndex(0);
    } else {
      setType('title');
      setContent('');
      setHasDuration(false);
      setDuration('');
      setHasImages(false);
      setImages([]);
      setImageLinks([]);
      setPreviewIndex(0);
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!content.trim() && images.length === 0) {
      alert('Please add either text or at least one image');
      return;
    }

    onSave(
      type,
      content,
      hasDuration && duration.trim() ? duration : undefined,
      hasImages && images.length > 0 ? images : undefined,
      hasImages && imageLinks.length > 0 ? imageLinks : undefined
    );

    handleClose();
  };

  const handleClose = () => {
    if (!initialData) {
      setType('title');
      setContent('');
      setHasDuration(false);
      setDuration('');
      setHasImages(false);
      setImages([]);
      setImageLinks([]);
      setPreviewIndex(0);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this block?')) {
      onDelete();
      handleClose();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    // Validate all files first
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validTypes.includes(file.type)) {
        alert(`${file.name}: Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.`);
        return;
      }
      if (file.size > maxSize) {
        alert(`${file.name}: File too large. Maximum size is 5MB.`);
        return;
      }
    }

    setIsUploading(true);

    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        alert('Please log in again');
        setIsUploading(false);
        return;
      }

      const uploadedUrls: string[] = [];

      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const text = await response.text();

        if (!response.ok) {
          const error = text.includes('{') ? JSON.parse(text).error : text;
          alert(`Failed to upload ${file.name}: ${error}`);
          continue;
        }

        const data = JSON.parse(text);
        uploadedUrls.push(data.imageUrl);
        console.log('✅ Uploaded:', file.name);
      }

      // Add to images array
      setImages(prev => [...prev, ...uploadedUrls]);
      // Add empty links for new images
      setImageLinks(prev => [...prev, ...new Array(uploadedUrls.length).fill('')]);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload. Check console.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageLinks(prev => prev.filter((_, i) => i !== index));
    if (previewIndex >= images.length - 1) {
      setPreviewIndex(Math.max(0, images.length - 2));
    }
  };

  const handleUpdateLink = (index: number, link: string) => {
    setImageLinks(prev => {
      const newLinks = [...prev];
      newLinks[index] = link;
      return newLinks;
    });
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
            {type === 'title' ? 'Title Text (Optional)' : 'Description (Optional)'}
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
            Leave empty if you want images only
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
            <p className="font-medium">Add Duration</p>
            <p className="text-xs text-gray-500 mt-1">
              Add a date or time period (e.g., "2023 - 2024", "Jan 2024")
            </p>
          </div>
        </div>

        {/* Duration Input */}
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

        {/* Photo Toggle */}
        <div className="flex items-start gap-3 p-4 border rounded-lg">
          <input
            type="checkbox"
            id="hasImages"
            checked={hasImages}
            onChange={(e) => setHasImages(e.target.checked)}
            className="w-4 h-4 mt-1"
          />
          <div className="flex-1">
            <p className="font-medium">Add Photos</p>
            <p className="text-xs text-gray-500 mt-1">
              Upload multiple images (landscape recommended, max 5MB each)
            </p>
          </div>
        </div>

        {/* Image Upload Section */}
        {hasImages && (
          <div className="ml-7 space-y-4">
            {/* Upload Button */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Images ({images.length} uploaded)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm font-medium text-gray-600">
                      Click to upload images
                    </p>
                    <p className="text-xs text-gray-500">
                      Select multiple files • JPEG, PNG, GIF, WebP (max 5MB each)
                    </p>
                  </>
                )}
              </button>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Uploaded Images ({images.length})
                </label>
                
                {/* Preview with Navigation */}
                <div className="relative group">
                  <div className="w-full aspect-video bg-gray-200 rounded overflow-hidden">
                    <img
                      src={images[previewIndex]}
                      alt={`Preview ${previewIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Navigation - only show if multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setPreviewIndex(p => p > 0 ? p - 1 : images.length - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setPreviewIndex(p => p < images.length - 1 ? p + 1 : 0)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {previewIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail List */}
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-video rounded overflow-hidden cursor-pointer border-2 ${
                        idx === previewIndex ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      onClick={() => setPreviewIndex(idx)}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Link for Current Image */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Link for Image {previewIndex + 1} (Optional)
                  </label>
                  <input
                    type="text"
                    value={imageLinks[previewIndex] || ''}
                    onChange={(e) => handleUpdateLink(previewIndex, e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If provided, clicking this image will redirect to this URL
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          
          {content && (
            type === 'title' ? (
              <h2 className="text-2xl font-bold">
                {content}
                {hasDuration && duration && (
                  <span className="text-lg text-gray-500 ml-2">({duration})</span>
                )}
              </h2>
            ) : (
              <p className="text-gray-700">
                {content}
                {hasDuration && duration && (
                  <span className="text-sm text-gray-500 ml-2">• {duration}</span>
                )}
              </p>
            )
          )}
          
          {images.length > 0 && (
            <div className={content ? "mt-3" : ""}>
              <p className="text-xs text-gray-500 mb-2">
                {images.length} image{images.length > 1 ? 's' : ''} will appear as a carousel
              </p>
            </div>
          )}

          {!content && images.length === 0 && (
            <p className="text-gray-400 italic">Add text or upload images to see preview</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-between pt-4 border-t">
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
              disabled={!content.trim() && images.length === 0}
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