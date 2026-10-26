import React from 'react';
import clsx from 'clsx';

/**
 * WindowPanel Component
 * Matches Figma components (3-tier responsive scale: base x0.82, xl x0.93, 2xl x1.00):
 * - Window - Select Occasion (1087:12631)
 * - Window - Select Back Image (1127:1738)
 * - Window - Select Emoji (1140:2166)
 * - Windows - Sticker Selection - With scroll bar (1155:14883)
 * - Windows - Flower Selection - With scroll bar (1166:16778)
 */
export default function WindowPanel({
  title,
  headerAction = null,
  children,
  className = '',
  bodyClassName = 'pt-[13px] px-[15px] pb-[15px] xl:pt-[15px] xl:px-[17px] xl:pb-[17px] 2xl:pt-[16px] 2xl:px-[18px] 2xl:pb-[18px]',
  maxHeight = null,
}) {
  return (
    <div className={clsx('figma-inner-panel flex flex-col rounded-[18px] xl:rounded-[19px] 2xl:rounded-[20px]', className)}>
      {/* Title Section (Figma: padding 18px 8px 16px 18px, h=56px, Inter 600 17/22, white/0.85) */}
      <div className="figma-panel-header pt-[15px] pr-[7px] pb-[13px] pl-[15px] xl:pt-[17px] xl:pr-[8px] xl:pb-[15px] xl:pl-[17px] 2xl:pt-[18px] 2xl:pr-[8px] 2xl:pb-[16px] 2xl:pl-[18px] flex items-center justify-between">
        <h3 className="text-[rgba(255,255,255,0.85)] font-medium text-[14.5px] leading-[19px] xl:text-[15px] xl:leading-[20px] 2xl:text-[16px] 2xl:leading-[21px] tracking-[-0.022em] select-none font-sans">
          {title}
        </h3>
        {headerAction && (
          <div className="flex-shrink-0">{headerAction}</div>
        )}
      </div>

      {/* Content Area Slot */}
      <div 
        className={clsx('flex-1 overflow-hidden', bodyClassName)}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
