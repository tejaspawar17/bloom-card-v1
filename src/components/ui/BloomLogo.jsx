import React from 'react';
import clsx from 'clsx';

/**
 * BloomLogo Component
 * Matches Figma component: Bloom (1155:13413)
 * Exact gradient:
 * linear-gradient(180deg, #132013 0%, #4F793E 13%, #719D53 42%, #86B75A 60%, #CFC531 78%, #ADD9AD 94%, #7CE0DC 100%)
 */
export default function BloomLogo({
  version = 'ver. 1.1',
  size = 'md',
  onClick,
  className = '',
}) {
  const sizeMap = {
    sm: {
      wrapper: 'px-5 py-2 rounded-full',
      inner: 'px-2.5 py-0.5 rounded-full',
      brand: 'text-xl',
      ver: 'text-[10px]',
    },
    md: {
      wrapper: 'px-8 py-3 rounded-full',
      inner: 'px-3.5 py-1 rounded-full',
      brand: 'text-2xl',
      ver: 'text-xs',
    },
    lg: {
      wrapper: 'px-10 py-4 rounded-full',
      inner: 'px-4 py-1.5 rounded-full',
      brand: 'text-3xl',
      ver: 'text-sm',
    },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={clsx(
        'relative inline-flex items-center justify-center select-none shadow-lg transition-transform',
        onClick && 'cursor-pointer hover:scale-105 active:scale-95',
        s.wrapper,
        className
      )}
      style={{
        background: 'linear-gradient(180deg, #132013 0%, #4F793E 13%, #719D53 42%, #86B75A 60%, #CFC531 78%, #ADD9AD 94%, #7CE0DC 100%)',
        boxShadow: '0px 20px 40px rgba(40, 40, 40, 0.4), inset 0px 2px 4px rgba(255, 255, 255, 0.4)',
      }}
    >
      <div className={clsx('flex items-baseline gap-1.5 bg-black/80 backdrop-blur-md border border-white/20', s.inner)}>
        <span className={clsx('font-instrument-serif italic tracking-tight text-white', s.brand)}>
          Bloom
        </span>
        <span className={clsx('font-instrument-sans text-neutral-300 uppercase tracking-wider', s.ver)}>
          {version}
        </span>
      </div>
    </div>
  );
}
