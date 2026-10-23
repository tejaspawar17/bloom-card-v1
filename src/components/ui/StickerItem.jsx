import React from 'react';
import clsx from 'clsx';

/**
 * StickerItem Component
 * Matches Figma component sets: Stickers (1089:12987) & Sticker Icon Button (1124:1903)
 */
export default function StickerItem({
  name,
  image,
  isSelected = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className={clsx(
        'flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer group bg-black/40 outline-none select-none',
        isSelected
          ? 'border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)] bg-blue-900/30 scale-105'
          : 'border-white/10 hover:border-white/25 hover:bg-white/5 hover:scale-105',
        className
      )}
    >
      <img
        src={image}
        alt={name}
        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
      />
      <span className="text-[10px] font-medium text-neutral-300 mt-1 truncate w-full text-center">
        {name}
      </span>
    </button>
  );
}
