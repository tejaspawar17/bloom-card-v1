import React from 'react';
import clsx from 'clsx';

/**
 * Stamp Component
 * Matches Figma component: Stamp (661:11846)
 * White circular stamp with emoji and drop shadow
 */
export default function Stamp({
  emoji = 'pleading-face',
  size = 'md',
  className = '',
}) {
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const imgSizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={clsx(
        'rounded-full bg-white flex items-center justify-center select-none border border-neutral-100',
        'shadow-[2px_2px_2px_0.5px_rgba(0,0,0,0.25)]',
        sizeMap[size] || sizeMap.md,
        className
      )}
    >
      {emoji ? (
        <img 
          src={`/assets/emojis/${emoji}.png`}
          alt="emoji"
          className={clsx("object-contain drop-shadow-sm", imgSizeMap[size] || imgSizeMap.md)}
          draggable={false}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : null}
    </div>
  );
}
