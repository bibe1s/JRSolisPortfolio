// components/editor/LogoutButton.tsx
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      setIsLoggingOut(true);
      await logout();
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition disabled:opacity-50"
      title="Logout"
    >
      {isLoggingOut ? (
        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <LogOut className="w-5 h-5" />
      )}
    </button>
  );
}