// components/borders/BorderWrapper.tsx
"use client";

import { ReactNode } from 'react';
import ElectricBorder from './ElectricBorder';
import StarBorder from './StarBorder';
import PixelTransition from './PixelTransition';
import ShapeBlur from './ShapeBlur';

interface BorderWrapperProps {
  borderStyle: 'gradient' | 'star' | 'electric' | 'pixel' | 'blur' | 'none';
  enabled: boolean;
  children: ReactNode;
}

export function BorderWrapper({ borderStyle, enabled, children }: BorderWrapperProps) {
  // If border is disabled or set to none/gradient, return children without wrapper
  if (!enabled || borderStyle === 'none' || borderStyle === 'gradient') {
    return <>{children}</>;
  }

  // Apply the selected border wrapper
  switch (borderStyle) {
    case 'star':
      return (
        <StarBorder
          as="div"
          color="white"
          speed="6s"
          thickness={1}
          className=""
          style={{ borderRadius: '24px', padding: 0 }}
        >
          {children}
        </StarBorder>
      );

    case 'electric':
      return (
        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.5}
          thickness={2}
          style={{ borderRadius: '24px' }}
        >
          {children}
        </ElectricBorder>
      );

    case 'pixel':
      return (
        <PixelTransition
          firstContent={children}
          secondContent={children}
          gridSize={12}
          pixelColor="#ffffff"
          animationStepDuration={0.4}
          style={{ borderRadius: '24px', width: '320px', height: '480px' }}
        />
      );

    case 'blur':
      return (
        <div style={{ position: 'relative', width: '320px', height: '480px' }}>
          <ShapeBlur
            variation={0}
            pixelRatioProp={typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1}
            shapeSize={1.2}
            roundness={0.4}
            borderSize={0.05}
            circleSize={0.5}
            circleEdge={1}
          />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {children}
          </div>
        </div>
      );

    default:
      return <>{children}</>;
  }
}