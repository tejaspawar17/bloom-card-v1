import React from 'react';
import clsx from 'clsx';

/**
 * FlowerUsecaseBadge Component
 * Matches Figma component: Flower Usecase - Liquid Glass - Text (649:11048)
 */
export default function FlowerUsecaseBadge({
  text,
  className = '',
}) {
  return (
    <div
      className={clsx(
        'flower-liquid-pill px-4 py-1.5 rounded-full text-xs font-medium text-white/95 text-center truncate select-none shadow-md',
        className
      )}
      title={text}
    >
      {text}
    </div>
  );
}
