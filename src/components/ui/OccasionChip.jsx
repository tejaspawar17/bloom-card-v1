import React from 'react';
import { cn } from '@/lib/utils';

/**
 * OccasionChip / OccasionBadge Component
 * Matches Figma component: Occasion Chip (#1081:1657)
 * 
 * Figma Dev Mode specs:
 * - Layout: row, padding 7px 12px, gap 4px, hug-contents
 * - Border-radius: 1000px (full pill)
 * - Default fill: rgba(114, 114, 114, 0.08)
 * - Active fill: rgba(37, 99, 235, 0.35) with border #3b82f6
 * - Hover fill: rgba(44, 46, 45, 0.95)
 * - Text: Inter 13px/18px, letter-spacing -0.0177em
 * - Text color default: rgba(229, 229, 234, 0.7)
 * - Text color active: #FFFFFF
 */
export default function OccasionChip({
  emoji,
  label,
  isSelected = false,
  onClick,
}) {
  return (
    <button
      type="button"
      role="button"
      aria-pressed={isSelected}
      aria-label={label}
      onClick={onClick}
      className="occasion-chip"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span aria-hidden="true">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

