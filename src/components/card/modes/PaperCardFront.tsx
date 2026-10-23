import React from 'react';
import { PostageStampNote } from '@/components/bloom/overlays/PostageStampNote';
import { FlowerInfoPill } from '@/components/card/FlowerInfoPill';
import { DraggableSticker } from '@/components/card/DraggableSticker';
import { useCard } from '@/context/CardContext';

export function PaperCardFront({ state, flower, onOpenEditTitle, isPreview = false }: any) {
  const selectedFlower = flower || { name: 'Blue Hydrangea', image: '/assets/flower-illustrations/hydrangea.png' };

  return (
    <div className="relative bg-white p-[10px] xl:p-[12px] shadow-2xl aspect-[688/960] w-full h-full rounded-none select-none @container">
      <FlowerInfoPill variant="front" />
      <div className="relative w-full h-full overflow-hidden rounded-none">
        <img src={selectedFlower.image} 
          alt={selectedFlower.name} 
          className="w-full h-full object-cover" 
        />

        {state?.stickers?.filter(s => s.side === 'front').map(sticker => (
          <DraggableSticker key={sticker.id} stickerData={sticker} />
        ))}

        {/* Bottom Stamp Overlay (Figma: y=300 inside 456px inner image -> 18px from bottom of flower image, minus 6px built-in PNG shadow margin = 12px) */}
        <div className="absolute bottom-[7px] xl:bottom-[10px] inset-x-0 flex justify-center z-20">
          <PostageStampNote 
            message={state?.subject || 'Happy Birthday!!'} 
            recipient={state?.to || 'Aayush'} 
            onEdit={onOpenEditTitle} 
            isPreview={isPreview}
          />
        </div>
      </div>
    </div>
  );
}
