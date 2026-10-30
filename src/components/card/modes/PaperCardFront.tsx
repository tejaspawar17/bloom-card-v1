import React from 'react';
import { PostageStampNote } from '@/components/bloom/overlays/PostageStampNote';
import { FlowerInfoPill } from '@/components/card/FlowerInfoPill';
import { DraggableSticker } from '@/components/card/DraggableSticker';
import { useCard } from '@/context/CardContext';

export function PaperCardFront({ state: propState, flower: propFlower, onOpenEditTitle, onOpenQuickPicker, isPreview = false }: any) {
  const cardContext = useCard();
  const state = propState || cardContext?.state;
  const flower = propFlower || cardContext?.flower;
  const selectedFlower = flower || { name: 'Blue Hydrangea', image: '/assets/flower-illustrations/hydrangea.png' };

  return (
    <div className="relative bg-white p-[clamp(10px,3.3cqw,12px)] shadow-2xl aspect-[688/960] w-full h-full rounded-none overflow-hidden select-none @container" style={{ containerType: "inline-size" }}>
      <FlowerInfoPill variant="front" />
      <div 
        onClick={!isPreview && onOpenQuickPicker ? () => onOpenQuickPicker('frontArtwork') : undefined}
        className={`relative w-full h-full overflow-hidden rounded-none ${!isPreview && onOpenQuickPicker ? 'cursor-pointer lg:cursor-default' : ''}`}
      >
        <img src={selectedFlower.image} 
          alt={selectedFlower.name} 
          className="w-full h-full object-cover" 
        />

        {/* Bottom Stamp Overlay (Figma: y=300 inside 456px inner image -> 18px from bottom of flower image, minus 6px built-in PNG shadow margin = 12px) */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-[clamp(7px,2.7cqw,10px)] inset-x-0 flex justify-center z-20"
        >
          <PostageStampNote 
            message={state?.subject ?? ''} 
            recipient={state?.to || 'Aayush'} 
            onEdit={onOpenEditTitle} 
            isPreview={isPreview}
          />
        </div>
      </div>

      {state?.stickers?.filter(s => s.side === 'front').map(sticker => (
        <DraggableSticker key={sticker.id} stickerData={sticker} isPreview={isPreview} />
      ))}
    </div>
  );
}
