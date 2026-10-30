import React, { useState } from 'react';
import { useCard } from '@/context/CardContext';
import { DraggableSticker } from '@/components/card/DraggableSticker';
import { FlowerInfoPill } from '@/components/card/FlowerInfoPill';
import TertiaryLiquidGlassButton from '@/components/ui/TertiaryLiquidGlassButton';
import { EmojiStamp } from '@/components/card/EmojiStamp';
import { PolaroidFrame } from '@/components/card/PolaroidFrame';
import { FlowerNameBadge, FlowerUsecaseBadge, Polaroid, Stamp, CardSubjectBox, CardMessageBox } from '@/components/ui';

export function MetallicCardFront({ onOpenEditTitle, onOpenQuickPicker, isPreview = false }) {
  const { state, flower } = useCard();

  return (
    <div 
      onClick={!isPreview && onOpenQuickPicker ? () => onOpenQuickPicker('frontArtwork') : undefined}
      className={`relative w-full h-full aspect-[688/960] rounded-[16px] overflow-hidden shadow-2xl select-none bg-transparent @container ${!isPreview && onOpenQuickPicker ? 'cursor-pointer lg:cursor-default' : ''}`} 
      style={{ containerType: "inline-size" }}
    >
      {/* Background artwork */}
      <img
        src={flower?.image || '/assets/flower-illustrations/flower_1.png'}
        alt="Metallic Card Flower"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      <FlowerInfoPill variant="front" />

      {/* Metallic Sheen Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(200,200,200,0) 40%, rgba(255,255,255,0.6) 70%, rgba(0,0,0,0.3) 100%)'
        }}
      />

      {/* Silver Frame Overlay */}
      <img 
        src="/assets/polaroid-defaults/metallic_frame.png" 
        alt="" 
        className="absolute inset-0 w-full h-full pointer-events-none z-20" 
      />

      {state?.stickers?.filter(s => s.side === 'front').map(sticker => ( <DraggableSticker key={sticker.id} stickerData={sticker} isPreview={isPreview} /> ))} 

      {/* Subject Box */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-[4.5%] inset-x-0 mx-auto w-[86%] aspect-[738/474] z-30"
      >
        <CardSubjectBox variant="metallic" onClick={onOpenEditTitle} isPreview={isPreview} className="w-full h-full" />
      </div>
    </div>
  );
}

export function MetallicCardBack({ onOpenEditMessage, onOpenQuickPicker, isPreview = false }) {
  const { state, flower, dispatch } = useCard();
  const [isEditing, setIsEditing] = useState(false);

  const getBackImageSrc = () => {
    if (state.selectedBackImage === 'none') return null;
    if (state.selectedBackImage === 'portrait') return '/assets/polaroid-defaults/image2.png';
    if (state.selectedBackImage === 'landscape') return '/assets/polaroid-defaults/image1.png';
    return state.selectedBackImage;
  };
  const backImageSrc = getBackImageSrc();

  return (
    <div className={`relative w-full h-full aspect-[688/960] rounded-[16px] ${isPreview ? 'border-none' : 'border border-[#95a0a6]/60'} overflow-hidden shadow-2xl select-none bg-transparent @container`} style={{ containerType: "inline-size" }}>
      <img
        src="/assets/bloom/metallic_back.png"
        alt="Metallic Card Back"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      <FlowerInfoPill variant="back" />

      <div className="absolute inset-0 pointer-events-none translate-y-[clamp(10px,2.8%,15px)] z-10">
        {state.selectedBackImage && state.selectedBackImage !== 'none' && backImageSrc && (
          <PolaroidFrame 
            imageSrc={backImageSrc} 
            onClick={!isPreview && onOpenQuickPicker ? () => onOpenQuickPicker('polaroid') : undefined}
          />
        )}
        <EmojiStamp 
          emoji={state.stampEmoji} 
          className="inset-x-0 mx-auto top-[clamp(118px,38.4cqw,146px)]" 
          onClick={!isPreview && onOpenQuickPicker ? () => onOpenQuickPicker('stamp') : undefined}
        />
      </div>

      {/* Labels added as real text for crisp rendering */}
      <div className="absolute z-30 top-[54.5%] left-[17%] font-['Instrument_Serif',serif] text-[4.44cqw] leading-[5.33cqw] antialiased text-[#141413] font-normal tracking-wide" style={{ WebkitTextStroke: '0.2px currentColor' }}>To:</div>
      <div className="absolute z-30 bottom-[13.3%] left-[39.25%] font-['Instrument_Serif',serif] text-[4.44cqw] leading-[5.33cqw] antialiased text-[#141413] font-normal tracking-wide" style={{ WebkitTextStroke: '0.2px currentColor' }}>From:</div>

      <div 
        className={`absolute z-30 top-[54.0%] left-[24%] font-['Syne_Tactile',cursive] text-[4.44cqw] leading-[5.33cqw] text-[#141413] tracking-normal rounded px-1 -ml-1 outline-none min-w-[50px] truncate max-w-[55%] block antialiased ${isPreview ? '' : 'cursor-pointer'}`}
        onClick={() => !isPreview && onOpenEditMessage?.()}
        style={{ WebkitTextStroke: '0.2px currentColor' }}
      >
        {state.to}
      </div>

      <div 
        className={`absolute z-30 top-[60.5%] left-[16%] right-[16%] font-['Source_Serif_4','Source_Serif_Pro',serif] text-[3.33cqw] leading-[4.17cqw] text-[#141413] font-normal tracking-normal text-left rounded p-1 -ml-1 outline-none min-w-[50px] min-h-[20px] break-words whitespace-pre-wrap antialiased ${isPreview ? '' : 'cursor-pointer hover:bg-black/5'}`}
        onClick={() => !isPreview && onOpenEditMessage?.()}
        style={{ WebkitTextStroke: '0.2px currentColor' }}
      >
        {state.message}
      </div>

      <div 
        className={`absolute z-30 bottom-[13.5%] left-[50.25%] font-['Syne_Tactile',cursive] text-[4.44cqw] leading-[5.33cqw] text-[#141413] tracking-normal rounded px-1 -ml-1 outline-none min-w-[50px] truncate max-w-[40%] block antialiased ${isPreview ? '' : 'cursor-pointer'}`}
        onClick={() => !isPreview && onOpenEditMessage?.()}
        style={{ WebkitTextStroke: '0.2px currentColor' }}
      >
        {state.from}
      </div>

      <div className="absolute z-50 pointer-events-auto bottom-[6%] right-[6%]">
        {onOpenEditMessage && <TertiaryLiquidGlassButton onClick={onOpenEditMessage} isEditing={isEditing} />}
      </div>

      {/* Equipped Sticker on back */}
      {state?.stickers?.filter(s => s.side === 'back').map(sticker => ( <DraggableSticker key={sticker.id} stickerData={sticker} isPreview={isPreview} /> ))}
      
    </div>
  );
}
