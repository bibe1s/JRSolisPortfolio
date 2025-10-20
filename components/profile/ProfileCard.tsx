"use client";

import { PersonalInfo } from '@/lib/types';
import { Mail, Phone } from 'lucide-react';

interface ProfileCardProps {
  personal: PersonalInfo;
}

export function ProfileCard({ personal }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center p-8 text-white">
      {/* Profile Image Container */}
      <div className="relative mb-6">
        {personal.image ? (
          <div 
            className="w-48 h-48 rounded-2xl overflow-hidden bg-gray-800 transition-transform duration-300 hover:scale-105"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <img
              src={personal.image}
              alt={personal.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          // Placeholder when no image
          <div className="w-48 h-48 rounded-2xl bg-gray-800 flex items-center justify-center">
            <div className="text-6xl font-bold text-gray-600">
              {personal.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="text-center mb-2">
        <p className="text-sm text-gray-400 uppercase tracking-wider">
          {personal.title}
        </p>
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        {personal.name}
      </h1>

      {/* Contact Info */}
      <div className="space-y-3 w-full max-w-sm">
        {/* Email */}
        <div className="flex items-center gap-3 text-gray-300">
          <Mail className="w-5 h-5 flex-shrink-0" />
          <a 
            href={`mailto:${personal.email}`}
            className="hover:text-white transition-colors truncate"
          >
            {personal.email}
          </a>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 text-gray-300">
          <Phone className="w-5 h-5 flex-shrink-0" />
          <a 
            href={`tel:${personal.phone}`}
            className="hover:text-white transition-colors"
          >
            {personal.phone}
          </a>
        </div>
      </div>
    </div>
  );
}