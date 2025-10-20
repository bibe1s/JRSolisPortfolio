// //app/preview/page.tsx

// "use client";

// import { useEffect, useState } from 'react';
// import { Profile, ProfileMode } from '@/lib/types';
// import { defaultProfile } from '@/lib/defaultProfile';
// import { HolographicProfileCard } from '@/components/profile/HolographicProfileCard';
// import { SocialLinks } from '@/components/profile/SocialLinks';
// import { ContentBlock } from '@/components/profile/ContentBlock';
// import { TechStackSection } from '@/components/profile/TechStackSection';
// import { BackgroundWrapper } from '@/components/backgrounds/BackgroundWrapper';

// export default function PreviewPage() {
//   const [profile, setProfile] = useState<Profile>(defaultProfile);
//   const [currentMode, setCurrentMode] = useState<ProfileMode>('web2');

//   // Load profile from localStorage
//   useEffect(() => {
//     const loadProfile = () => {
//       const saved = localStorage.getItem('portfolio-profile');
//       if (saved) {
//         try {
//           const parsed = JSON.parse(saved);
//           setProfile(parsed);
//           setCurrentMode(parsed.displaySettings.defaultView || 'web2');
//         } catch (error) {
//           console.error('Failed to load profile:', error);
//         }
//       }
//     };

//     // Initial load
//     loadProfile();

//     // Listen for storage changes (when editor saves)
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === 'portfolio-profile' && e.newValue) {
//         try {
//           const parsed = JSON.parse(e.newValue);
//           setProfile(parsed);
//         } catch (error) {
//           console.error('Failed to parse profile:', error);
//         }
//       }
//     };

//     // ALSO listen for custom event (for same-tab updates)
//     const handleCustomUpdate = () => {
//       loadProfile();
//     };

//     window.addEventListener('storage', handleStorageChange);
//     window.addEventListener('profile-updated', handleCustomUpdate);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('profile-updated', handleCustomUpdate);
//     };
//   }, []);

//   // Get current sections based on mode
//   const currentSections = profile[currentMode].sections;

//   // Check if we should show mode toggle
//   const showToggle = profile.displaySettings.showWeb2 && profile.displaySettings.showWeb3;

//   // Get current background
//   const currentBackground = profile[currentMode].background;

//   return (
//     <BackgroundWrapper config={currentBackground}>
//       <div className="min-h-screen text-white">
//         {/* Mode Toggle (if both modes enabled) */}
//         {showToggle && (
//           <div className="fixed top-4 right-4 z-50 flex gap-2">
//             <button
//               onClick={() => setCurrentMode('web2')}
//               className={`px-6 py-2 rounded-lg font-medium transition-all ${
//                 currentMode === 'web2'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
//               }`}
//             >
//               Web2
//             </button>
//             <button
//               onClick={() => setCurrentMode('web3')}
//               className={`px-6 py-2 rounded-lg font-medium transition-all ${
//                 currentMode === 'web3'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
//               }`}
//             >
//               Web3
//             </button>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="max-w-4xl mx-auto py-8">
//           {/* Profile Card - NOW WITH HOLOGRAPHIC EFFECT */}
//           <HolographicProfileCard personal={profile[currentMode].personal} />

//           {/* Social Links */}
//           <SocialLinks links={profile[currentMode].socialLinks} />

//           {/* Divider */}
//           <div className="border-t border-gray-800 my-8"></div>

//           {/* Sections */}
//           <div className="px-8 space-y-8">
//             {currentSections
//               .slice()
//               .sort((a, b) => a.order - b.order)
//               .map((section) => (
//                 <div key={section.id}>
//                   {section.type === 'techStack' && section.techStack ? (
//                     <TechStackSection
//                       title={section.name}
//                       items={section.techStack}
//                     />
//                   ) : section.type === 'content' && section.contentBlocks ? (
//                     <div>
//                       <h2 className="text-2xl font-bold text-white mb-4">
//                         {section.name}
//                       </h2>
//                       <div className="space-y-3">
//                         {section.contentBlocks
//                           .sort((a, b) => a.order - b.order)
//                           .map((block) => (
//                             <ContentBlock key={block.id} block={block} />
//                           ))}
//                       </div>
//                     </div>
//                   ) : null}
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </BackgroundWrapper>
//   );
// }