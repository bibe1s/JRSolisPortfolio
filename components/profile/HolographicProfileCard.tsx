// app/components/profile/HolographicProfileCard.tsx

"use client";

import { Mail, Phone } from 'lucide-react';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  image?: string;
  showEmail?: boolean;  // NEW
  showPhone?: boolean;  // NEW
}

interface HolographicProfileCardProps {
  personal: PersonalInfo & {
    enable3D?: boolean;
    enableGradient?: boolean;
    borderStyle?: 'gradient' | 'star' | 'electric' | 'pixel' | 'blur' | 'none';
    customBorderColors?: string[];
  };
}

// ... (keep all the utility functions: clamp, round, adjust, easeInOutCubic, hexToRgba)
const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number, precision = 3): number =>
  parseFloat(value.toFixed(precision));

const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.length === 3 ? cleanHex[0] + cleanHex[0] : cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.length === 3 ? cleanHex[1] + cleanHex[1] : cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.length === 3 ? cleanHex[2] + cleanHex[2] : cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ... (keep the GlareHover component - I'll skip it here for brevity but it stays the same)
const GlareHover: React.FC<{
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  width = '320px',
  height = '480px',
  background = '#000',
  borderRadius = '24px',
  borderColor = '#333',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {}
}) => {
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const overlayRef = useRef<HTMLDivElement | null>(null);

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.backgroundPosition = '-100% -100%, 0 0';
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '100% 100%, 0 0';
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    if (playOnce) {
      el.style.transition = 'none';
      el.style.backgroundPosition = '-100% -100%, 0 0';
    } else {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = '-100% -100%, 0 0';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      animateIn();
      setTimeout(animateOut, transitionDuration);
    }, 5000);
    return () => clearInterval(interval);
  }, [transitionDuration]);

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(${glareAngle}deg,
        hsla(0,0%,0%,0) 60%,
        ${rgba} 70%,
        hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-100% -100%, 0 0',
    pointerEvents: 'none'
  };

  return (
    <div
      className={`relative grid place-items-center overflow-hidden border cursor-pointer ${className}`}
      style={{
        width,
        height,
        background,
        borderRadius,
        borderColor,
        ...style
      }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <div ref={overlayRef} style={overlayStyle} />
      {children}
    </div>
  );
};

export function HolographicProfileCard({ personal }: HolographicProfileCardProps) {
  // ... (keep all the refs and state - same as before)
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const electricStrokeRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pixelGridRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  
  const enable3D = personal.enable3D ?? false;
  const enableGradient = personal.enableGradient ?? false;
  const borderStyle = personal.borderStyle || 'gradient';
  const customBorderColors = personal.customBorderColors || [
    'rgba(0, 255, 136, 0.9)',
    'rgba(0, 229, 255, 0.9)',
    'rgba(0, 191, 255, 0.9)',
    'rgba(138, 43, 226, 0.9)',
    'rgba(255, 105, 180, 0.9)',
    'rgba(0, 255, 136, 0.9)'
  ];
  
  const filterId = useMemo(() => `electric-filter-${Math.random().toString(36).substr(2, 9)}`, []);
  const [pixelsReady, setPixelsReady] = useState(false);

  // NEW: Get visibility settings (default to true if not set)
  const showEmail = personal.showEmail !== false;
  const showPhone = personal.showPhone !== false;

  // ... (keep all the handlers and effects - handlePointerMove, handlePointerLeave, useEffects, etc.)
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!enable3D || !wrapRef.current || !cardRef.current) return;

      const card = cardRef.current;
      const wrap = wrapRef.current;
      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });

      if (borderStyle === 'blur' && blurRef.current) {
        blurRef.current.style.transform = `translate3d(0, 0, 0.1px) rotateX(${properties["--rotate-y"]}) rotateY(${properties["--rotate-x"]})`;
      }
    },
    [enable3D, borderStyle]
  );

  const handlePointerLeave = useCallback(
    () => {
      if (!enable3D || !wrapRef.current || !cardRef.current) return;

      const wrap = wrapRef.current;
      const card = cardRef.current;
      const duration = 500;

      const startTime = performance.now();
      const startX = parseFloat(wrap.style.getPropertyValue('--pointer-x') || '50%');
      const startY = parseFloat(wrap.style.getPropertyValue('--pointer-y') || '50%');

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const targetX = card.clientWidth / 2;
        const targetY = card.clientHeight / 2;

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        const percentX = clamp((100 / card.clientWidth) * currentX);
        const percentY = clamp((100 / card.clientHeight) * currentY);

        const centerX = percentX - 50;
        const centerY = percentY - 50;

        const properties = {
          "--pointer-x": `${percentX}%`,
          "--pointer-y": `${percentY}%`,
          "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
          "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
          "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
          "--pointer-from-top": `${percentY / 100}`,
          "--pointer-from-left": `${percentX / 100}`,
          "--rotate-x": `${round(-(centerX / 5))}deg`,
          "--rotate-y": `${round(centerY / 4)}deg`,
        };

        Object.entries(properties).forEach(([property, value]) => {
          wrap.style.setProperty(property, value);
        });

        if (borderStyle === 'blur' && blurRef.current) {
          blurRef.current.style.transform = `translate3d(0, 0, 0.1px) rotateX(${properties["--rotate-y"]}) rotateY(${properties["--rotate-x"]})`;
        }

        if (progress < 1) {
          requestAnimationFrame(animationLoop);
        } else if (blurRef.current && borderStyle === 'blur') {
          blurRef.current.style.transform = 'translate3d(0, 0, 0.1px) rotateX(0deg) rotateY(0deg)';
        }
      };

      requestAnimationFrame(animationLoop);
    },
    [enable3D, borderStyle]
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !enable3D) return;

    wrap.addEventListener('pointermove', handlePointerMove);
    wrap.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      wrap.removeEventListener('pointermove', handlePointerMove);
      wrap.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [enable3D, handlePointerMove, handlePointerLeave]);

  useEffect(() => {
    if (borderStyle !== 'pixel' || !enableGradient) {
      setPixelsReady(false);
      return;
    }

    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = '';
    const gridSize = 4;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel-border-item');
        
        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixel.style.position = 'absolute';
        pixel.style.backgroundColor = '#ff00ff';
        pixel.style.opacity = '0';
        pixel.style.transition = 'opacity 0.3s ease';

        pixelGridEl.appendChild(pixel);
      }
    }

    setPixelsReady(true);

    let animationInterval: NodeJS.Timeout;
    let cycleTimeout: NodeJS.Timeout;
    
    const animatePixels = () => {
      const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixel-border-item');
      let flickerCount = 0;
      const maxFlickers = 20;

      animationInterval = setInterval(() => {
        if (flickerCount >= maxFlickers) {
          clearInterval(animationInterval);
          pixels.forEach((pixel) => {
            pixel.style.opacity = '0';
          });
          cycleTimeout = setTimeout(() => {
            animatePixels();
          }, 3000);
          return;
        }

        pixels.forEach((pixel) => {
          if (Math.random() > 0.7) {
            pixel.style.opacity = Math.random() > 0.5 ? '0.8' : '0';
          }
        });
        flickerCount++;
      }, 100);
    };

    animatePixels();

    return () => {
      clearInterval(animationInterval);
      clearTimeout(cycleTimeout);
    };
  }, [borderStyle, enableGradient]);

  useEffect(() => {
    if (borderStyle !== 'electric' || !enableGradient) return;
    
    const svg = svgRef.current;
    const card = cardRef.current;
    const stroke = electricStrokeRef.current;
    
    if (!svg || !card || !stroke) return;

    const updateElectricAnim = () => {
      const width = Math.max(1, Math.round(card.clientWidth));
      const height = Math.max(1, Math.round(card.clientHeight));

      stroke.style.filter = `url(#${filterId})`;

      const dyAnims = Array.from(svg.querySelectorAll<SVGAnimateElement>('feOffset > animate[attributeName="dy"]'));
      if (dyAnims.length >= 2) {
        dyAnims[0].setAttribute('values', `${height}; 0`);
        dyAnims[1].setAttribute('values', `0; -${height}`);
      }

      const dxAnims = Array.from(svg.querySelectorAll<SVGAnimateElement>('feOffset > animate[attributeName="dx"]'));
      if (dxAnims.length >= 2) {
        dxAnims[0].setAttribute('values', `${width}; 0`);
        dxAnims[1].setAttribute('values', `0; -${width}`);
      }

      const dur = 6;
      [...dyAnims, ...dxAnims].forEach(a => a.setAttribute('dur', `${dur}s`));

      const disp = svg.querySelector('feDisplacementMap');
      if (disp) disp.setAttribute('scale', '30');

      const filterEl = svg.querySelector<SVGFilterElement>(`#${filterId}`);
      if (filterEl) {
        filterEl.setAttribute('x', '-200%');
        filterEl.setAttribute('y', '-200%');
        filterEl.setAttribute('width', '500%');
        filterEl.setAttribute('height', '500%');
      }

      requestAnimationFrame(() => {
        [...dyAnims, ...dxAnims].forEach((a: any) => {
          if (typeof a.beginElement === 'function') {
            try { a.beginElement(); } catch {}
          }
        });
      });
    };

    updateElectricAnim();
    const ro = new ResizeObserver(() => updateElectricAnim());
    ro.observe(card);

    return () => ro.disconnect();
  }, [borderStyle, enableGradient, filterId]);

  const getBorderOverlayClass = () => {
    if (!enableGradient || borderStyle !== 'gradient') return '';
    return 'border-overlay-gradient';
  };

  const renderBlurEffect = () => {
    if (borderStyle !== 'blur' || !enableGradient) return null;
    
    const auraExtend = '-20px';
    
    return (
      <div 
        ref={blurRef}
        className="absolute pointer-events-none"
        style={{ 
          inset: auraExtend,
          zIndex: 0,
          transform: 'translate3d(0, 0, 0.1px)',
          transition: enable3D ? 'none' : 'transform 1s ease',
        }}
      >
        <div
          className="absolute box-border"
          style={{
            inset: '0',
            borderRadius: '32px',
            borderWidth: '8px',
            borderStyle: 'solid',
            borderColor: 'rgba(138, 43, 226, 0.8)',
            filter: 'blur(40px)',
            opacity: 1,
          }}
        />
        <div
          className="absolute box-border"
          style={{
            inset: '0',
            borderRadius: '32px',
            borderWidth: '6px',
            borderStyle: 'solid',
            borderColor: 'rgba(138, 43, 226, 0.9)',
            filter: 'blur(28px)',
            opacity: 0.95,
          }}
        />
        <div
          className="absolute box-border"
          style={{
            inset: '0',
            borderRadius: '32px',
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: 'rgba(138, 43, 226, 1)',
            filter: 'blur(18px)',
            opacity: 1,
          }}
        />
        <div
          className="absolute box-border"
          style={{
            inset: '0',
            borderRadius: '32px',
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: 'rgba(138, 43, 226, 1)',
            filter: 'blur(8px)',
            opacity: 1,
          }}
        />
      </div>
    );
  };

  const renderBorderEffect = () => {
    if (!enableGradient) return null;

    switch (borderStyle) {
      case 'star':
        return (
          <GlareHover
            width="320px"
            height="480px"
            borderRadius="42px"
            glareColor="#ffffff"
            glareOpacity={0}
            glareAngle={-45}
            glareSize={500}
            transitionDuration={650}
            playOnce={false}
            className="absolute inset-0 pointer-events-auto"
            style={{ zIndex: 10 }}
          >
            {personal.image ? (
              <img
                src={personal.image}
                alt={personal.name}
                className="w-full h-full object-cover rounded-3xl"
                style={{ position: 'relative', zIndex: 1 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl">
                <div className="text-9xl font-bold text-gray-600">
                  {personal.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </GlareHover>
        );

      case 'electric':
        const color = '#ff0000';
        const thickness = 20;
        return (
          <>
            <svg
              ref={svgRef}
              className="absolute pointer-events-none"
              style={{ width: 0, height: 0, position: 'absolute', left: '-9999px' }}
              aria-hidden
              focusable="false"
            >
              <defs>
                <filter id={filterId} colorInterpolationFilters="sRGB" x="-200%" y="-200%" width="500%" height="500%">
                  <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
                  <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                    <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                  </feOffset>
                  <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
                  <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                    <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
                  </feOffset>
                  <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise3" seed="2" />
                  <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
                    <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                  </feOffset>
                  <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise4" seed="2" />
                  <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
                    <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
                  </feOffset>
                  <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                  <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
                  <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="combinedNoise"
                    scale="30"
                    xChannelSelector="R"
                    yChannelSelector="B"
                  />
                </filter>
              </defs>
            </svg>
            <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: '24px', zIndex: 10 }}>
              <div
                ref={electricStrokeRef}
                className="absolute inset-0 box-border"
                style={{
                  borderRadius: '24px',
                  borderWidth: thickness,
                  borderStyle: 'solid',
                  borderColor: color,
                }}
              />
              <div
                className="absolute inset-0 box-border"
                style={{
                  borderRadius: '24px',
                  borderWidth: thickness,
                  borderStyle: 'solid',
                  borderColor: hexToRgba(color, 0.6),
                  filter: `blur(${0.5 + thickness * 0.25}px)`,
                  opacity: 0.5,
                }}
              />
              <div
                className="absolute inset-0 box-border"
                style={{
                  borderRadius: '24px',
                  borderWidth: thickness,
                  borderStyle: 'solid',
                  borderColor: color,
                  filter: `blur(${2 + thickness * 0.5}px)`,
                  opacity: 0.5,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: '24px',
                  transform: 'scale(1.08)',
                  filter: 'blur(32px)',
                  opacity: 0.3,
                  zIndex: -1,
                  background: `linear-gradient(-30deg, ${hexToRgba(color, 0.8)}, transparent, ${color})`,
                }}
              />
            </div>
          </>
        );

      case 'pixel':
        return (
          <div 
            ref={pixelGridRef}
            className="absolute inset-0 pointer-events-none" 
            style={{ zIndex: 10 }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center p-8 text-white">
      <style jsx>{`
        .holo-wrapper {
          perspective: 500px;
          transform: translate3d(0, 0, 0.1px);
          touch-action: none;
          position: relative;
          pointer-events: auto !important;
          z-index: 20;
        }

        .holo-card {
          transition: transform 1s ease;
          transform: translate3d(0, 0, 0.1px) rotateX(0deg) rotateY(0deg);
          box-shadow: rgba(0, 0, 0, 0.8) calc((var(--pointer-from-left, 0.5) * 10px) - 3px)
            calc((var(--pointer-from-top, 0.5) * 20px) - 6px) 20px -5px;
          position: relative;
          z-index: 2;
          pointer-events: auto !important;
        }

        .holo-card:hover,
        .holo-card.active {
          transition: none;
          transform: translate3d(0, 0, 0.1px) rotateX(var(--rotate-y, 0deg))
            rotateY(var(--rotate-x, 0deg));
        }

        .holo-shine {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: radial-gradient(
            farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
            hsla(0, 0%, 100%, 0.15) 0%,
            hsla(0, 0%, 100%, 0.05) 30%,
            transparent 60%
          );
          mix-blend-mode: overlay;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .holo-card:hover .holo-shine,
        .holo-card.active .holo-shine {
          opacity: 1;
        }
        
        .border-overlay-gradient::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 3px;
          background: linear-gradient(
            135deg,
            ${customBorderColors.join(', ')}
          );
          background-size: 400% 100%;
          animation: shimmer 8s linear infinite;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 10;
          filter: blur(1px);
        }

        @keyframes shimmer {
          0% {
            background-position: -400% 0;
          }
          100% {
            background-position: 400% 0;
          }
        }
      `}</style>

      <div
        ref={wrapRef}
        className={`holo-wrapper relative mb-6 ${enable3D ? '' : 'cursor-default'}`}
        style={{
          "--pointer-x": "50%",
          "--pointer-y": "50%",
          "--pointer-from-center": "0",
          "--pointer-from-top": "0.5",
          "--pointer-from-left": "0.5",
          "--card-opacity": "0",
          "--rotate-x": "0deg",
          "--rotate-y": "0deg",
          "--background-x": "50%",
          "--background-y": "50%",
        } as React.CSSProperties}
      >
        <div
          ref={cardRef}
          className={`holo-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 ${getBorderOverlayClass()}`}
          style={{
            width: '320px',
            height: '480px',
            border: enableGradient ? 'none' : '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {personal.image ? (
            <img
              src={personal.image}
              alt={personal.name}
              className="w-full h-full object-cover rounded-3xl"
              style={{ position: 'relative', zIndex: 1 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl">
              <div className="text-9xl font-bold text-gray-600">
                {personal.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          {enable3D && <div className="holo-shine" style={{ zIndex: 9 }} />}
          {renderBorderEffect()}
        </div>
        {renderBlurEffect()}
      </div>

      <div className="text-center space-y-4 mt-4">
        <p className="text-sm text-gray-400 uppercase tracking-wider">
          {personal.title}
        </p>
        <h1 className="text-3xl font-bold">{personal.name}</h1>
        
        {/* Contact Info - Only show if visibility is enabled */}
        <div className="space-y-2 pt-2">
          {showEmail && (
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a
                href={`mailto:${personal.email}`}
                className="hover:text-white transition-colors text-sm"
              >
                {personal.email}
              </a>
            </div>
          )}
          
          {showPhone && (
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <a
                href={`tel:${personal.phone}`}
                className="hover:text-white transition-colors text-sm"
              >
                {personal.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}