import React from 'react';
import clsx from 'clsx';

/**
 * FlowerNameBadge Component
 * Matches Figma component: Flower Name - Liquid Glass - Text (649:11041)
 */
export default function FlowerNameBadge({
  name,
  className = '',
}) {
  return (
    <div
      className={clsx(
        'flower-liquid-pill px-3.5 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap select-none shadow-md',
        className
      )}
    >
      {name}
    </div>
  );
}
