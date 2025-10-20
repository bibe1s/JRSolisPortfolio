// app/editor/page.tsx
"use client";

import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { HolographicProfileCard } from '@/components/profile/HolographicProfileCard';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorPage() {
  const { profile, currentMode } = useProfile();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [renderKey, setRenderKey] = useState(0);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/editor/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Force re-render whenever profile changes
  useEffect(() => {
    setRenderKey(prev => prev + 1);
    console.log('🔄 Profile updated, re-rendering preview...');
  }, [profile, currentMode]);
  
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render editor if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  // Safety check
  if (!profile || !profile[currentMode] || !profile[currentMode].personal) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const currentPersonal = profile[currentMode].personal;

  return (
    <div className="flex h-screen">
      {/* Left Side - Live Profile Card Preview */}
      <div className="flex w-1/3 bg-black overflow-y-auto items-center justify-center">
        <HolographicProfileCard 
          key={`profile-card-${renderKey}`}
          personal={currentPersonal} 
        />
      </div>

      {/* Right Side - Editor Panel */}
      <div className="w-2/3 bg-white">
        <EditorPanel />
      </div>
    </div>
  );
}