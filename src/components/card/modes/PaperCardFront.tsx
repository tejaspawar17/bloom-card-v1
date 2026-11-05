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
    <div 
      onContextMenu={(e) => e.preventDefault()} 
      className="relative bg-[#E5E1D6] shadow-2xl aspect-[688/960] w-full h-full rounded-none overflow-hidden select-none no-callout @container" 
      style={{ 
        containerType: "inline-size",
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* Authentic Textured Paper Front Base */}
      <img
        src="/assets/bloom/paper_front.png"
        alt="Paper Card Front"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none no-callout"
        style={{
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        draggable={false}
        decoding="async"
        loading="eager"
      />
      <div 
        onClick={!isPreview && onOpenQuickPicker ? () => onOpenQuickPicker('frontArtwork') : undefined}
        className={`absolute inset-[clamp(10px,3.3cqw,12px)] overflow-hidden rounded-none ${!isPreview && onOpenQuickPicker ? 'cursor-pointer lg:cursor-default' : ''}`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {/* Isolated Pure-Opacity Crossfade Artwork Container (180ms) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden isolate"
          style={{ 
            isolation: 'isolate', 
            contain: 'paint layout',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <AnimatePresence initial={false}>
            <motion.img 
              key={selectedFlower.image}
              src={selectedFlower.image} 
              alt={selectedFlower.name} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none no-callout" 
              style={{
                transform: 'translate3d(0, 0, 0)',
                WebkitTransform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
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

      {/* Anchored Title Pill Layer with Transform Containment */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 overflow-visible isolate"
        style={{
          isolation: 'isolate',
          contain: 'layout paint',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <FlowerInfoPill variant="front" />
      </div>

      {state?.stickers?.filter(s => s.side === 'front').map(sticker => (
        <DraggableSticker key={sticker.id} stickerData={sticker} isPreview={isPreview} />
      ))}
    </div>
  );
}
