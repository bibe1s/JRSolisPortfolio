"use client";

import { BackgroundConfig } from '@/lib/types';
import { ParticlesBackground } from './ParticlesBackground';

// Import all ReactBits backgrounds
import LiquidEther from '@/components/backgrounds/LiquidEther';
import Prism from '@/components/backgrounds/Prism';
import DarkVeil from '@/components/backgrounds/DarkVeil';
import LightRays from '@/components/backgrounds/LightRays';
import Aurora from '@/components/backgrounds/Aurora';
import Plasma from '@/components/backgrounds/Plasma';
import Particles from '@/components/backgrounds/Particles';
import GradientBlinds from '@/components/backgrounds/GradientBlinds';
import Galaxy from '@/components/backgrounds/Galaxy';
import FaultyTerminal from '@/components/backgrounds/FaultyTerminal';
import RippleGrid from '@/components/backgrounds/RippleGrid';
import Threads from '@/components/backgrounds/Threads';
import Irisdescence from '@/components/backgrounds/Irisdescence';
import PrismaticBurst from '@/components/backgrounds/PrismaticBurst';
import Orb from '@/components/backgrounds/Orb';
import LetterGlitch from '@/components/backgrounds/LetterGlitch';
import LiquidChrome from '@/components/backgrounds/LiquidChrome';
import Balatro from '@/components/backgrounds/Balatro';
import './BackgroundWrapper.css';

interface BackgroundWrapperProps {
  config: BackgroundConfig;
  children: React.ReactNode;
  scoped?: boolean;
}

const backgroundComponents: Record<string, React.ComponentType<any>> = {
  'liquid-ether': LiquidEther,
  'prism': Prism,
  'dark-veil': DarkVeil,
  'light-rays': LightRays,
  'aurora': Aurora,
  'plasma': Plasma,
  'particles': Particles,
  'gradient-blinds': GradientBlinds,
  'galaxy': Galaxy,
  'faulty-terminal': FaultyTerminal,
  'ripple-grid': RippleGrid,
  'threads': Threads,
  'irisdescence': Irisdescence,
  'prismatic-burst': PrismaticBurst,
  'orb': Orb,
  'letter-glitch': LetterGlitch,
  'liquid-chrome': LiquidChrome,
  'balatro': Balatro,
};

export function BackgroundWrapper({ config, children, scoped = false }: BackgroundWrapperProps) {
  const BackgroundComponent = config.type ? backgroundComponents[config.type] : null;

  // Different positioning and sizing for scoped vs full-screen
  const backgroundPositionClass = scoped ? 'absolute' : 'fixed';
  const wrapperClass = scoped ? 'relative w-full' : 'relative w-full min-h-screen';

  return (
    <div className={wrapperClass}>
      {/* Background Layer */}
      {config.type !== 'none' && (
        <div className={`${backgroundPositionClass} inset-0 z-0`}>
          {config.type === 'particles' && (
            <ParticlesBackground
              color={config.color || '#'}
              speed={config.speed || 50}
              density={config.density || 50}
              interactive={config.interactive || true}
            />
          )}
          
          {BackgroundComponent && config.type !== 'particles' && (
            <BackgroundComponent />
          )}
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10 pointer-events-none">
        <div className="content-wrapper">{children}</div>
      </div>
    </div>
  );
}