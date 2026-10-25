import React from 'react';
import clsx from 'clsx';

/**
 * BloomLogo Component
 * Matches Navbar & Figma typography exactly:
 * - Brand: font-serif italic text-white tracking-[-0.05em] leading-none (Instrument Serif)
 * - Version: font-sans text-white tracking-[-0.05em] leading-none (Inter / SF Pro)
 * - Aura Glow: radial-gradient identical to the Navbar BloomTab
 */
export default function BloomLogo({
  version = 'Ver. 1.1',
  size = 'md',
  onClick,
  className = '',
}) {
  const sizeMap = {
    sm: {
      glow: 'w-[124px] h-[50px] -inset-x-2 -inset-y-1.5 blur-[12px]',
      pill: 'w-[102px] h-[40px]',
      brand: 'text-[21px]',
      ver: 'text-[12px]',
      gap: 'gap-[2px]',
    },
    md: {
      glow: 'w-[146px] h-[64px] -inset-x-3 -inset-y-2 blur-[14px]',
      pill: 'w-[124px] h-[48px]',
      brand: 'text-[25px]',
      ver: 'text-[13.5px]',
      gap: 'gap-[3px]',
    },
    lg: {
      glow: 'w-[188px] h-[78px] -inset-x-4 -inset-y-2.5 blur-[18px]',
      pill: 'w-[156px] h-[58px]',
      brand: 'text-[32px]',
      ver: 'text-[15.5px]',
      gap: 'gap-[4px]',
    },
    xl: {
      glow: 'w-[220px] h-[92px] -inset-x-5 -inset-y-3 blur-[22px]',
      pill: 'w-[184px] h-[68px]',
      brand: 'text-[38px]',
      ver: 'text-[18px]',
      gap: 'gap-[5px]',
    },
  };

  const s = sizeMap[size] || sizeMap.md;

  const GLASS_SHADOW = "0px 8px 15px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px 0.5px rgba(166, 166, 166, 0.25), inset 0px 40px 30px -40px rgba(230, 230, 230, 0.06), inset 0px -40px 10px -40px rgba(26, 26, 26, 0.8)";

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={clsx(
        'relative inline-flex items-center justify-center select-none',
        onClick && 'cursor-pointer hover:scale-105 active:scale-95 transition-transform',
        className
      )}
    >
      {/* Exact Navbar Aura Blob: Radial green glow calibrated to Figma Menu */}
      <div 
        aria-hidden="true"
        className={clsx(
          'absolute z-0 rounded-[500px] pointer-events-none opacity-90',
          s.glow
        )}
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(134, 183, 90, 0.95) 0%, rgba(113, 157, 83, 0.70) 45%, rgba(79, 121, 62, 0.40) 75%, transparent 100%)' 
        }} 
      />

      {/* The Dark Liquid Glass Capsule */}
      <div
        className={clsx(
          'relative z-10 rounded-[1000px] flex items-center justify-center',
          s.pill
        )}
        style={{
          background: 'rgba(14, 14, 14, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: GLASS_SHADOW,
        }}
      >
        <div className={clsx('flex flex-row items-baseline', s.gap)}>
          <span className={clsx('font-serif italic tracking-[-0.05em] text-white leading-none', s.brand)}>
            Bloom
          </span>
          <span className={clsx('font-sans tracking-[-0.05em] text-white/90 leading-none', s.ver)}>
            {version}
          </span>
        </div>
      </div>
    </div>
  );
}
