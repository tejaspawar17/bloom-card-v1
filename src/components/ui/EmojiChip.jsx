import React from 'react';
import clsx from 'clsx';

/**
 * EmojiChip Component
 * Matches Figma component set: Emoji Chip (in Window - Select Emoji 1140:2166)
 */
export default function EmojiChip({
  emoji,
  isSelected = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-[300ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer outline-none select-none hig-focus active:scale-[0.93]',
        isSelected
          ? 'bg-blue-600/40 border border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-110'
          : 'bg-white/5 hover:bg-white/10 border border-white/5',
        className
      )}
    >
      {emoji}
    </button>
  );
}
