import React from 'react';
import clsx from 'clsx';

/**
 * Polaroid Component
 * Matches Figma component sets: Pollaroid (1138:393, 1138:394, 1138:417)
 * Dimensions: 138px x 159px, border: 0.78px solid #D6D6D6, background: #FFFFFF
 */
export default function Polaroid({
  image,
  label = '',
  className = '',
}) {
  return (
    <div
      className={clsx(
        'polaroid-frame w-full h-full p-2 flex flex-col items-center justify-start bg-white shadow-lg select-none',
        className
      )}
    >
      <div className="w-full aspect-square bg-neutral-900 overflow-hidden flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={label || 'Polaroid Image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl text-neutral-600">📸</span>
        )}
      </div>
      {label && (
        <span className="text-[10px] font-medium text-neutral-600 mt-1 truncate max-w-full text-center">
          {label}
        </span>
      )}
    </div>
  );
}
