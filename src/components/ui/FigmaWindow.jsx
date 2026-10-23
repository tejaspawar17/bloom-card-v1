import React from 'react';
import clsx from 'clsx';

export default function FigmaWindow({
  children,
  className = '',
  fullHeight = false,
  gapClassName = 'gap-[10px] xl:gap-[12px] 2xl:gap-[14px]',
  ...rest
}) {
  return (
    <aside
      className={clsx(
        'relative w-[298px] xl:w-[340px] 2xl:w-[364px] flex-shrink-0 select-none',
        fullHeight ? 'h-full' : 'h-fit',
        className
      )}
      {...rest}
    >
      {/* Outer Aura Glow around Window Panels */}
      <div className="absolute -inset-[8px] xl:-inset-[10px] 2xl:-inset-[12px] z-0 rounded-[26px] xl:rounded-[30px] 2xl:rounded-[32px] blur-[9px] shadow-[0px_30px_30px_8px_rgba(40,40,40,0.2)] pointer-events-none figma-aura-gradient">
      </div>
      
      {/* Dark Film Overlay (Figma fill rgba(0, 0, 0, 0.5)) */}
      <div className="absolute -inset-[8px] xl:-inset-[10px] 2xl:-inset-[12px] bg-black/50 z-0 pointer-events-none rounded-[26px] xl:rounded-[30px] 2xl:rounded-[32px] blur-[9px]"></div>
      
      {/* Content wrapper matching Left/Right Menu Section */}
      <div className={clsx(
        'w-full p-0 flex flex-col overflow-visible relative z-10',
        fullHeight ? 'h-full justify-between gap-[10px] xl:gap-[12px] 2xl:gap-[14px]' : ['h-fit', gapClassName]
      )}>
        {children}
      </div>
    </aside>
  );
}
