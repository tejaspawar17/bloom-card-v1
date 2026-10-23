import React from 'react';
import clsx from 'clsx';

/**
 * Global SVG Optical Refraction Filter
 * Adds physical light bending to backdrop-filters using feDisplacementMap
 */
export function LiquidGlassFilter() {
  return (
    <svg className="sr-only h-0 w-0 absolute pointer-events-none" aria-hidden="true">
      <defs>
        <filter id="ios27-liquid-glass" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Optical Edge Rim / Fresnel Specular reflection wrapper
 */
export function iOS27FresnelRim({ className, children, roundedClass = "rounded-full" }) {
  return (
    <div className={clsx(`absolute inset-0 pointer-events-none overflow-hidden ${roundedClass}`, className)}>
      <div 
        className={`absolute inset-0 ${roundedClass} z-10 pointer-events-none p-[1.2px]`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.3) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </div>
  );
}

/**
 * Nested Liquid Glass Container (Pill or Rounded)
 */
export function LiquidGlassContainer({ 
  type = 'pill', 
  direction = 'row', 
  className, 
  children, 
  ...rest 
}) {
  const isVertical = direction === 'col';
  
  return (
    <div 
      className={clsx(
        "glass-container",
        type === 'pill' ? 'rounded-full' : 'rounded-[20px]',
        "relative flex items-center border border-white/[0.16]",
        isVertical ? "flex-col p-[6px] gap-[10px]" : "flex-row h-[56px] px-[7px] gap-[10px]",
        className
      )}
      style={{
        background: 'linear-gradient(180deg, rgba(46,50,46,0.72) 0%, rgba(22,25,22,0.82) 100%)',
        backdropFilter: 'url(#ios27-liquid-glass) blur(20px) saturate(190%)',
        WebkitBackdropFilter: 'url(#ios27-liquid-glass) blur(20px) saturate(190%)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6), inset 0 1.5px 2px rgba(255,255,255,0.32), inset 0 -1.5px 3px rgba(0,0,0,0.55)'
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Nested Liquid Glass Button (Circle or Rounded)
 */
export function LiquidGlassButton({ 
  type = 'circle', 
  isActive = false, 
  onClick,
  className,
  children,
  ...rest
}) {
  const activeClass = "border-[2.5px] border-[#3898FF] shadow-[0_0_16px_rgba(56,152,255,0.65),inset_0_2px_4px_rgba(255,255,255,0.85),inset_0_-3px_6px_rgba(29,78,216,0.6)] after:absolute after:top-[2px] after:left-[6px] after:right-[6px] after:h-[40%] after:rounded-full after:bg-gradient-to-b after:from-white/55 after:to-transparent after:pointer-events-none";
  const inactiveClass = "bg-black/45 hover:bg-white/10 border border-white/10 text-white/80";

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "glass-button hig-focus relative flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden outline-none active:scale-95",
        type === 'circle' ? 'rounded-full' : 'rounded-[16px]',
        isActive ? activeClass : inactiveClass,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Standalone Action Button with Dark Glass Lens (Floating Eye/Flip buttons)
 */
export function LiquidGlassActionButton({ 
  onClick,
  className,
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95 outline-none border border-white/20 after:absolute after:top-[2px] after:left-[6px] after:right-[6px] after:h-[40%] after:rounded-full after:bg-gradient-to-b after:from-white/55 after:to-transparent after:pointer-events-none overflow-hidden",
        className
      )}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'url(#ios27-liquid-glass) blur(16px) saturate(190%)',
        WebkitBackdropFilter: 'url(#ios27-liquid-glass) blur(16px) saturate(190%)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.45), inset 0 1.5px 2px rgba(255,255,255,0.28), inset 0 -1px 2px rgba(0,0,0,0.45)'
      }}
      {...rest}
    >
      <iOS27FresnelRim />
      <div className="relative z-10 flex items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
        {children}
      </div>
    </button>
  );
}
