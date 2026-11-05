import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div onContextMenu={(e) => e.preventDefault()} className="relative bg-white shadow-2xl aspect-[688/960] w-full h-full rounded-none overflow-hidden select-none no-callout @container" style={{ containerType: "inline-size" }}>
      <div 
        onClick={!isPreview && onOpenQuickPicker ? () => onOpenQuickPicker('frontArtwork') : undefined}
        className={`absolute inset-[clamp(10px,3.3cqw,12px)] overflow-hidden rounded-none ${!isPreview && onOpenQuickPicker ? 'cursor-pointer lg:cursor-default' : ''}`}
      >
        {/* Optical Blur-Dissolve Artwork Container (Apple quintic preset) */}
        <div 
          className="relative w-full h-full overflow-hidden isolate [contain:paint]"
          style={{ isolation: 'isolate', contain: 'paint' }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img 
              key={selectedFlower.image}
              src={selectedFlower.image} 
              alt={selectedFlower.name} 
              initial={{ opacity: 0, filter: 'blur(8px)', scale: 1.03 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(6px)', scale: 0.985 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none no-callout" 
              draggable={false}
              decoding="async"
              loading="eager"
            />
          </AnimatePresence>
        </div>

        {/* Bottom Stamp Overlay (Coordinates 100% UNTOUCHED) */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-[clamp(7px,2.7cqw,10px)] inset-x-0 flex justify-center z-20 antialiased"
          style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
        >
          <PostageStampNote 
            message={state?.subject ?? ''} 
            recipient={state?.to || 'Aayush'} 
            onEdit={onOpenEditTitle} 
            isPreview={isPreview}
          />
        </div>
      </div>

      <FlowerInfoPill variant="front" />

      {state?.stickers?.filter(s => s.side === 'front').map(sticker => (
        <DraggableSticker key={sticker.id} stickerData={sticker} isPreview={isPreview} />
      ))}
    </div>
  );
}
