// components/borders/StarBorder.tsx

import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';
  
  return (
    <>
      <style jsx>{`
        @keyframes star-movement-bottom {
          0% { transform: translate(0%, 0%); opacity: 1; }
          100% { transform: translate(-100%, 0%); opacity: 0; }
        }

        @keyframes star-movement-top {
          0% { transform: translate(0%, 0%); opacity: 1; }
          100% { transform: translate(100%, 0%); opacity: 0; }
        }

        .star-bottom {
          animation: star-movement-bottom linear infinite alternate;
        }

        .star-top {
          animation: star-movement-top linear infinite alternate;
        }
      `}</style>
      
      <Component
        className={`relative inline-block overflow-hidden rounded-[24px] ${className}`}
        {...(rest as any)}
        style={{
          padding: `${thickness}px 0`,
          ...(rest as any).style
        }}
      >
        <div
          className="star-bottom absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full z-0"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 10%)`,
            animationDuration: speed
          }}
        />
        <div
          className="star-top absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full z-0"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 10%)`,
            animationDuration: speed
          }}
        />
        <div className="relative z-10">
          {children}
        </div>
      </Component>
    </>
  );
};

export default StarBorder;