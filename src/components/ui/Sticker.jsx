import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

/**
 * Sticker Component
 * Wrapper component referencing downloaded sticker images with sizing props.
 * 
 * @param {Object} props
 * @param {string} props.src - The path to the sticker image
 * @param {string} props.alt - Alt text for the sticker
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg', 'xl'
 * @param {boolean} props.isSelected - Whether the sticker is selected
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 */
export default function Sticker({
  src,
  alt = 'Sticker',
  size = 'md',
  isSelected = false,
  onClick,
  className,
  ...props
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={alt}
      className={cn(
        'relative inline-flex flex-col items-center justify-center p-2 rounded-xl transition-all outline-none select-none group',
        // Background and border styles
        'bg-black/40 border',
        isSelected
          ? 'border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)] bg-blue-900/30 scale-105'
          : 'border-white/10 hover:border-white/25 hover:bg-white/5 hover:scale-105',
        // Cursor
        onClick ? 'cursor-pointer' : 'cursor-default',
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'object-contain transition-transform group-hover:scale-110',
          sizeClasses[size]
        )}
        draggable={false}
      />
      {/* Optional: we could add a badge or label here if needed */}
    </button>
  );
}
