import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCard } from '@/context/CardContext';
import { FlowerInfoPill } from '@/components/card/FlowerInfoPill';
import { EmojiStamp } from '@/components/card/EmojiStamp';
import { PolaroidFrame } from '@/components/card/PolaroidFrame';
import TertiaryLiquidGlassButton from '@/components/ui/TertiaryLiquidGlassButton';
import { Check, ArrowsClockwise, X } from '@phosphor-icons/react';
import { STICKERS } from '@/data/cardData';
import { DraggableSticker } from '@/components/card/DraggableSticker';

export function PaperCardBack({ onOpenEditMessage, isPreview = false }) {
  const { state, dispatch } = useCard();
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    const timeFormatted = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setCurrentDate(dateFormatted);
    setCurrentTime(timeFormatted);
  }, []);

  const getBackImageSrc = () => {
    if (state.selectedBackImage === 'none') return null;
    if (state.selectedBackImage === 'portrait') return '/assets/polaroid-defaults/image2.png';
    if (state.selectedBackImage === 'landscape') return '/assets/polaroid-defaults/image1.png';
    return state.selectedBackImage;
  };

  const backImageSrc = getBackImageSrc();

  return (
    <div className="relative w-full h-full aspect-[688/960] rounded-none overflow-hidden shadow-2xl select-none bg-[#E5E1D6] @container" style={{ containerType: "inline-size" }}>
      <FlowerInfoPill variant="back" />
      <img
        src="/assets/bloom/paper_back_blank_labels.png"
        alt="Paper Card Back"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {state.selectedBackImage && state.selectedBackImage !== 'none' && (
        <div className="absolute inset-0 pointer-events-none translate-y-[clamp(10px,2.8%,15px)] z-10">
          <PolaroidFrame imageSrc={backImageSrc} />
          <EmojiStamp emoji={state.stampEmoji} className="left-[42%] top-[clamp(118px,38.4cqw,146px)]" />
        </div>
      )}      
      
      
        {/* Labels added as real text for crisp rendering */}
        <div className="absolute z-30 top-[50.8%] left-[23.5%] font-['Instrument_Serif',serif] text-[4.44cqw] leading-[5.33cqw] antialiased text-[#141413] font-normal tracking-wide" style={{ WebkitTextStroke: '0.2px currentColor' }}>To:</div>
        <div className="absolute z-30 bottom-[13.9%] left-[44%] font-['Instrument_Serif',serif] text-[4.44cqw] leading-[5.33cqw] antialiased text-[#141413] font-normal tracking-wide" style={{ WebkitTextStroke: '0.2px currentColor' }}>From:</div>
        <div className="absolute z-30 bottom-[4.3%] left-[4%] font-['Instrument_Serif',serif] text-[4.2cqw] leading-[5.2cqw] antialiased text-[#141413] font-normal tracking-wide" style={{ WebkitTextStroke: '0.2px currentColor' }}>Date :</div>
        <div className="absolute z-30 bottom-[4.3%] left-[53%] font-['Instrument_Serif',serif] text-[4.2cqw] leading-[5.2cqw] antialiased text-[#141413] font-normal tracking-wide" style={{ WebkitTextStroke: '0.2px currentColor' }}>Time :</div>

        <div 
        className={"absolute z-30 top-[50.8%] left-[30.8%] font-['Syne_Tactile',cursive] text-[4.44cqw] leading-[5.33cqw] text-[#141413] tracking-normal rounded px-1 -ml-1 outline-none min-w-[50px] min-h-[20px] truncate max-w-[55%] block antialiased " + (isEditing ? 'ring-1 ring-black/10 cursor-text' : (isPreview ? '' : 'cursor-pointer'))}
        onClick={() => !isPreview && !isEditing && onOpenEditMessage?.()}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => dispatch({ type: 'SET_TO', payload: e.currentTarget.textContent })}
          style={{ WebkitTextStroke: '0.2px currentColor' }}
      >
        {state.to}
      </div>

      <div 
        className={"absolute z-30 top-[58%] left-[22.8%] right-[12.8%] font-['Source_Serif_4','Source_Serif_Pro',serif] text-[3.33cqw] leading-[4.17cqw] text-[#141413] font-normal tracking-normal text-left rounded p-1 -ml-1 outline-none min-w-[50px] min-h-[20px] break-words whitespace-pre-wrap antialiased " + (isEditing ? 'bg-black/5 ring-1 ring-black/10 cursor-text' : (isPreview ? '' : 'cursor-pointer hover:bg-black/5'))}
        onClick={() => !isPreview && !isEditing && onOpenEditMessage?.()}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => dispatch({ type: 'SET_MESSAGE', payload: e.currentTarget.textContent })}
          style={{ WebkitTextStroke: '0.2px currentColor' }}
      >
        {state.message}
      </div>

      <div 
        className={"absolute z-30 bottom-[13.9%] left-[56.2%] font-['Syne_Tactile',cursive] text-[4.44cqw] leading-[5.33cqw] text-[#141413] tracking-normal rounded px-1 -ml-1 outline-none min-w-[50px] min-h-[20px] truncate max-w-[40%] block antialiased " + (isEditing ? 'ring-1 ring-black/10 cursor-text' : (isPreview ? '' : 'cursor-pointer'))}
        onClick={() => !isPreview && !isEditing && onOpenEditMessage?.()}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => dispatch({ type: 'SET_FROM', payload: e.currentTarget.textContent })}
          style={{ WebkitTextStroke: '0.2px currentColor' }}
      >
        {state.from}
      </div>

      <div className={`absolute z-30 bottom-[4.3%] left-[13.2%] font-['Instrument_Serif',serif] text-[4.2cqw] leading-[5.2cqw] antialiased text-[#141413] font-normal tracking-wide rounded px-1 -ml-1 text-left w-auto whitespace-nowrap ${isPreview ? '' : 'cursor-pointer'}`}
         onClick={() => !isPreview && !isEditing && onOpenEditMessage?.()} style={{ WebkitTextStroke: '0.2px currentColor' }}>
        {state.date || currentDate}
      </div>

      <div className={`absolute z-30 bottom-[4.3%] left-[62.8%] font-['Instrument_Serif',serif] text-[4.2cqw] leading-[5.2cqw] antialiased text-[#141413] font-normal tracking-wide rounded px-1 -ml-1 text-left w-auto whitespace-nowrap ${isPreview ? '' : 'cursor-pointer'}`}
         onClick={() => !isPreview && !isEditing && onOpenEditMessage?.()} style={{ WebkitTextStroke: '0.2px currentColor' }}>
        {state.time || currentTime}
      </div>

      <div className="absolute z-50 pointer-events-auto bottom-[9.5%] right-[2.5%]">
        {onOpenEditMessage && <TertiaryLiquidGlassButton onClick={onOpenEditMessage} isEditing={isEditing} />}
      </div>

      {state?.stickers?.filter(s => s.side === 'back').map(sticker => (
        <DraggableSticker key={sticker.id} stickerData={sticker} />
      ))}
    </div>
  );
}


