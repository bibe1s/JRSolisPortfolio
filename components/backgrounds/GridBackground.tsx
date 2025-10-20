"use client";

import { useEffect, useRef } from 'react';

interface GridBackgroundProps {
  color?: string;
  speed?: number;
  density?: number;
  interactive?: boolean;
}

export function GridBackground({
  color = '#3b82f6',
  speed = 50,
  density = 50,
  interactive = false,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Grid settings based on density (20-100px spacing)
    const gridSpacing = 100 - (density / 100) * 80 + 20;
    const speedMultiplier = (speed / 100) * 2;

    let offset = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move grid
      offset += speedMultiplier * 0.5;
      if (offset > gridSpacing) offset = 0;

      // Parse color and create gradient
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 59, g: 130, b: 246 };
      };

      const rgb = hexToRgb(color);

      // Draw vertical lines
      for (let x = -gridSpacing + offset; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        
        // Interactive: Lines pulse near mouse
        let alpha = 0.2;
        if (interactive) {
          const distance = Math.abs(mouseX - x);
          if (distance < 200) {
            alpha = 0.2 + (1 - distance / 200) * 0.6;
          }
        }
        
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = -gridSpacing + offset; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        
        // Interactive: Lines pulse near mouse
        let alpha = 0.2;
        if (interactive) {
          const distance = Math.abs(mouseY - y);
          if (distance < 200) {
            alpha = 0.2 + (1 - distance / 200) * 0.6;
          }
        }
        
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed, density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    />
  );
}