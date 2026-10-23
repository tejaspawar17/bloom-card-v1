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
      {/* Figma #1155:15736 Window Background: 402x646 around 364px panels -> 19px X / 20px Y padding, r=40px, blur=10px */}
      <div className="absolute -inset-x-[15px] -inset-y-[16px] xl:-inset-x-[17px] xl:-inset-y-[18px] 2xl:-inset-x-[19px] 2xl:-inset-y-[20px] z-0 rounded-[34px] xl:rounded-[38px] 2xl:rounded-[40px] blur-[10px] shadow-[0px_40px_40px_10px_rgba(40,40,40,0.2)] pointer-events-none figma-aura-gradient">
      </div>
      
      {/* Dark Film Overlay (Figma fill rgba(0, 0, 0, 0.5)) */}
      <div className="absolute -inset-x-[15px] -inset-y-[16px] xl:-inset-x-[17px] xl:-inset-y-[18px] 2xl:-inset-x-[19px] 2xl:-inset-y-[20px] bg-black/50 z-0 pointer-events-none rounded-[34px] xl:rounded-[38px] 2xl:rounded-[40px] blur-[10px]"></div>
      
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
