import React from 'react';
import FigmaWindow from './ui/FigmaWindow';
import WindowSelectBackImage from './WindowSelectBackImage';
import StampEmotionPicker from '@/components/studio/StampEmotionPicker';
import StickersGrid from '@/components/studio/StickersGrid';

export default function RightPanel({ className = '' }) {
  return (
    <FigmaWindow aria-label="Card Decoration Selector" className={className} gapClassName="gap-[10px] xl:gap-[12px] 2xl:gap-[14px]">
      {/* 1. Upload / Select Image for the Back */}
      <div className="h-fit">
        <WindowSelectBackImage />
      </div>

      {/* 2. Choose Mood (Emoji Selector) matching Figma #1140:2166 */}
      <div className="h-fit">
        <StampEmotionPicker title="Stamp an Emotion" />
      </div>

      {/* 3. Decorate with Stickers — Matching Figma #1155:14884 */}
      <div className="h-fit">
        <StickersGrid title="Add Stickers" />
      </div>
    </FigmaWindow>
  );
}
