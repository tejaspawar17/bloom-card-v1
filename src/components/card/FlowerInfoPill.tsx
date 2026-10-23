import React from 'react';
import clsx from 'clsx';
import { useCard } from '@/context/CardContext';

export function FlowerInfoPill({ variant }: { variant?: 'front' | 'back' }) {
  const { state, flower } = useCard() as any;
  
  if (state.cardType === 'pokemon') return null;

  // Use the passed variant or fallback to activeSide for backward compatibility
  const side = variant || state.activeSide;
  const text = side === 'front' ? flower?.name : flower?.meaning;

  return (
    <>
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id={`bloom-liquid-glass-${side}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.08" numOctaves="1" result="noise" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blurred" />
          <feDisplacementMap in="blurred" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div 
        title={text}
        className={clsx(
          "absolute top-[clamp(20px,5.2%,28px)] inset-x-0 mx-auto flex items-center justify-center select-none overflow-hidden z-50 pointer-events-auto transition-all duration-200 ease-out",
          side === 'back' 
            ? "w-[clamp(240px,80%,304px)] max-w-[90%] h-[clamp(19px,5.8cqw,22px)] rounded-[62.5rem]" 
            : "w-fit min-w-[86px] px-[clamp(10px,3.5cqw,16px)] h-[clamp(19px,5.8cqw,22px)] rounded-[62.5rem]"
        )}
      >
        <div
          className="absolute inset-0 rounded-[62.5rem]"
          style={{
            backdropFilter: `url(#bloom-liquid-glass-${side}) blur(12px) saturate(160%) brightness(1.2)`,
            WebkitBackdropFilter: 'blur(12px) saturate(160%) brightness(1.2)',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.70) 0%, rgba(240, 240, 240, 0.50) 50%, rgba(250, 250, 250, 0.60) 100%)',
          }}
        />
        
        <div
          className="absolute inset-0 rounded-[62.5rem] pointer-events-none"
          style={{
            boxShadow: [
              'inset 0 1px 0.5px 0 rgba(255, 255, 255, 0.95)',
              'inset 0 -1px 0.5px 0 rgba(255, 255, 255, 0.45)',
              'inset 0 4px 8px -2px rgba(255, 255, 255, 0.55)',
              'inset 0 -3px 6px -2px rgba(24, 24, 24, 0.22)',
              '1.25px 0 0 -0.75px #D0D0D0',
              '-1.25px 0 0 -0.75px #D0D0D0',
              '0 0 0 0.5px rgba(232, 232, 232, 0.8)',
              '0 6px 14px 0 rgba(0, 0, 0, 0.12)'
            ].join(', '),
          }}
        />

        <span className="relative z-10 font-['Instrument_Serif','Playfair_Display','Times_New_Roman',serif] text-[#1A1A1A] text-[clamp(12px,4cqw,15px)] leading-[clamp(15px,5cqw,20px)] font-normal tracking-wide px-2.5 truncate text-center antialiased w-full" style={{ textShadow: "0 1px 4px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.6)", WebkitTextStroke: "0.2px currentColor" }}>
          {text}
        </span>
      </div>
    </>
  );
}


