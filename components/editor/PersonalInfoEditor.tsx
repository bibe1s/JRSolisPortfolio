"use client";

import { useState, useRef } from 'react'; // ← useRef imported here
import Cookies from 'js-cookie';
import { useProfile } from '@/contexts/ProfileContext';
import { BorderStyleSelector } from './BorderStyleSelector';
import { Upload } from 'lucide-react';

export function PersonalInfoEditor() {
  const { profile, currentMode, updatePersonalInfo } = useProfile();
  const personal = profile[currentMode].personal;
  
  // ✅ NEW: Track upload state
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  
  // ✅ NEW: Create a "remote control" for the hidden file input
  // Think of this as: const fileInputRemote = remember a file input element
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // ✅ NEW: Function to upload profile image to Cloudinary
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setIsUploadingProfile(true);

    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        alert('Please log in again');
        return;
      }

      // Upload to Cloudinary via API
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to upload: ${error.error}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Profile image uploaded to Cloudinary:', data.imageUrl);
      
      // Update profile with Cloudinary URL (not Base64!)
      updatePersonalInfo(currentMode, { image: data.imageUrl });

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploadingProfile(false);
      // Reset file input so you can upload the same file again if needed
      if (profileFileInputRef.current) {
        profileFileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
          {currentMode === 'web2' ? '👔 Web2 (Real You)' : '🎭 Web3 (Persona)'}
        </span>
      </div>

      {/* ✅ UPDATED: Profile Image with Upload Button */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Profile Photo
        </label>
        <div className="flex items-center gap-4">
          {/* Image Preview */}
          {personal.image ? (
            <img
              src={personal.image}
              alt="Profile"
              className="w-20 h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 space-y-2">
            {/* ✅ HIDDEN FILE INPUT - This is the actual <input type="file"> */}
            {/* We hide it and trigger it with the button below */}
            <input
              ref={profileFileInputRef}  // ← "Remote control" connected here
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="hidden"  // ← Hidden from view
            />
            
            {/* ✅ VISIBLE UPLOAD BUTTON - Triggers the hidden input */}
            <button
              onClick={() => profileFileInputRef.current?.click()} // ← Use remote to click hidden input
              disabled={isUploadingProfile}
              className="w-full px-3 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploadingProfile ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Uploading to Cloudinary...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Image
                </>
              )}
            </button>
            
            {/* ✅ ALTERNATIVE: Paste URL directly */}
            <input
              type="text"
              value={personal.image || ''}
              onChange={(e) => updatePersonalInfo(currentMode, { image: e.target.value })}
              placeholder="Or paste image URL here"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            
            <p className="text-xs text-gray-500">
              {currentMode === 'web2' 
                ? 'Upload your real photo or paste URL'
                : 'Upload avatar/PFP or paste URL'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Rest of the form (unchanged) */}
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {currentMode === 'web2' ? 'Full Name *' : 'Display Name / Pseudonym *'}
        </label>
        <input
          type="text"
          value={personal.name}
          onChange={(e) => updatePersonalInfo(currentMode, { name: e.target.value })}
          placeholder={currentMode === 'web2' ? 'John Doe' : 'CryptoNinja.eth'}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Title / Role *
        </label>
        <input
          type="text"
          value={personal.title}
          onChange={(e) => updatePersonalInfo(currentMode, { title: e.target.value })}
          placeholder={currentMode === 'web2' ? 'Frontend Developer' : 'Community Ambassador'}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">
            Email Address *
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={personal.showEmail !== false}
              onChange={(e) => updatePersonalInfo(currentMode, { showEmail: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-600">Show on profile</span>
          </label>
        </div>
        <input
          type="email"
          value={personal.email}
          onChange={(e) => updatePersonalInfo(currentMode, { email: e.target.value })}
          placeholder="your@example.com"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {personal.showEmail === false && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Email will be hidden from your profile
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">
            Contact Number {currentMode === 'web3' && '(Optional)'}
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={personal.showPhone !== false}
              onChange={(e) => updatePersonalInfo(currentMode, { showPhone: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-600">Show on profile</span>
          </label>
        </div>
        <input
          type="tel"
          value={personal.phone}
          onChange={(e) => updatePersonalInfo(currentMode, { phone: e.target.value })}
          placeholder="+63 XXX-XXX-XXXX"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {personal.showPhone === false && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Phone number will be hidden from your profile
          </p>
        )}
      </div>

      {/* Visual Effects */}
      <div className="border-t pt-4 space-y-3">
        <p className="text-sm font-medium text-gray-700">Visual Effects</p>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={personal.enable3D || false}
            onChange={(e) => updatePersonalInfo(currentMode, { enable3D: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Enable 3D image effect (hover animation)
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={personal.enableGradient || false}
            onChange={(e) => updatePersonalInfo(currentMode, { enableGradient: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Enable border animation
          </span>
        </label>

        {personal.enableGradient && (
          <BorderStyleSelector
            value={personal.borderStyle || 'gradient'}
            onChange={(style) => updatePersonalInfo(currentMode, { borderStyle: style })}
          />
        )}
      </div>
    </div>
  );
}