import React from 'react';
import { useCard } from '@/context/CardContext';
import { DraggableSticker } from '@/components/card/DraggableSticker';
import { Polaroid, CardMessageBox } from '@/components/ui';
import { EmojiStamp } from '@/components/card/EmojiStamp';
import TertiaryLiquidGlassButton from '@/components/ui/TertiaryLiquidGlassButton';
import { STICKERS } from '@/data/cardData';

export function PokemonCardFront({ onOpenEditTitle, isPreview = false }) {
  const { state, pokemonCard } = useCard();

  return (
    <div className={`relative w-full h-full aspect-[688/960] rounded-[16px] ${isPreview ? 'border-none' : 'border border-[#95a0a6]/60'} overflow-hidden shadow-2xl select-none bg-transparent @container`} style={{ containerType: "inline-size" }}>
      {/* Real Pokemon Card Image from Reference (Squirtle with sunglasses) */}
      <img
        src={pokemonCard?.image || '/pokemon/001-003-squirtle.png'}
        alt={pokemonCard?.name || 'Pokemon Card Front'}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Equipped Sticker if selected */}
      {state?.stickers?.filter(s => s.side === 'front').map(sticker => ( <DraggableSticker key={sticker.id} stickerData={sticker} isPreview={isPreview} /> ))}

      {/* Subject Box matching reference: white box with red border and magenta edit pencil */}
        <div 
          onClick={isPreview ? undefined : onOpenEditTitle}
          className={`absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[73.1%] h-[21%] -rotate-[2deg] z-20 group ${isPreview ? '' : 'cursor-pointer hover:scale-[1.02] transition-transform'}`}
        >
          {/* Outer White Box with Shadow (Matches Figma exact structure) */}
            <div className="w-full h-full bg-white p-[1.2cqw] rounded-[4cqw] shadow-[2px_2px_2px_0.5px_rgba(0,0,0,0.25)]">
              {/* Inner Red Border Box */}
              <div className="w-full h-full border-[1.2cqw] border-[#FF0000] rounded-[3cqw] px-[2cqw] flex flex-col justify-center items-center overflow-hidden">
                <p className="font-['Vampiro_One'] text-[6.39cqw] text-center text-black leading-[1.1] whitespace-pre-line tracking-[-0.01em] line-clamp-2 max-w-full overflow-hidden">
                  {state.subject ?? ''}
                </p>
              </div>
            </div>
  
          {/* Edit Button Wrapper */}
          <div className="absolute -bottom-[12px] -right-[12px] z-50 pointer-events-auto flex items-center justify-center">
            {onOpenEditTitle && <TertiaryLiquidGlassButton onClick={onOpenEditTitle} />}
          </div>
              </div>
    </div>
  );
}

export function PokemonCardBack({ onOpenEditMessage, isPreview = false }) {
  const { state, pokemonCard } = useCard();

  const backPhoto = 
    state.selectedBackImage === 'landscape' ? '/assets/polaroid-defaults/image1.png' :
    state.selectedBackImage === 'portrait' ? '/assets/polaroid-defaults/image2.png' :
    state.selectedBackImage === 'none' ? null :
    state.selectedBackImage;

  if (state.pokemonSubtype === 'trainer') {
    return (
      <div className={`relative w-full h-full aspect-[688/960] rounded-[16px] overflow-hidden shadow-2xl select-none bg-transparent @container`} style={{ containerType: "inline-size" }}>
        <img
          src="/assets/pokemon-back/base-card-back.png"
          alt="Pokemon Card Back"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        <EmojiStamp emoji={state.stampEmoji} className="top-[14.1%] left-[38.3%] z-30" />

        {/* Silver Metallic Frame Container (Hidden when 'None' is selected on Trainer Card) */}
        {state.selectedBackImage !== 'none' && (
        <div className="absolute top-[27.92%] left-1/2 -translate-x-1/2 w-[88.08%] h-[68.33%] z-20 shadow-[0.5cqw_0.5cqw_0.2cqw_rgba(0,0,0,0.4)] rounded-[4.6cqw]">
          
          {/* User Photo (z-0, bottom) */}
          <div className="absolute top-[17.38%] left-[4.29%] w-[92.41%] h-[69.82%] overflow-hidden rounded-[4.6cqw] z-0">
            {backPhoto || pokemonCard?.image ? (
              <img src={backPhoto || pokemonCard?.image} className="w-full h-full object-cover" alt="Trainer" />
            ) : (
              <img src="/assets/pokemon-back/trainer-user-image.png" className="w-full h-full object-cover" alt="Trainer Default" />
            )}
          </div>

          {/* Clean Silver Frame (z-10, sits on top of photo) */}
          <img src="/assets/pokemon-back/trainer-card-frame.png" alt="Silver Frame" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10" />

          {/* Name Pill (Top Left, z-20) */}
          <div className="absolute top-[13.5%] left-[4.5%] bg-white border-[0.87cqw] border-[#FF0000] ring-[0.8cqw] ring-white rounded-[2.9cqw] min-w-[48%] px-[4%] h-[10.37%] flex items-center justify-center shadow-[1cqw_1cqw_0.5cqw_rgba(0,0,0,0.4)] z-30 transform -rotate-3">
            <span className="font-['Vampiro_One'] text-[4.65cqw] text-[#000000] leading-none pt-[0.4cqw] tracking-wide text-center truncate max-w-[95%] block">{state.trainerName || state.to || ""}</span>
          </div>

          {/* "HELLO, My name is" Label (Bottom, z-20) */}
          <div className="absolute bottom-[0.5%] left-[0.1%] w-[99.67%] h-[29.57%] z-30">
              <div className="absolute -bottom-[12px] -right-[12px] z-50 pointer-events-auto flex items-center justify-center">
                {onOpenEditMessage && <TertiaryLiquidGlassButton onClick={onOpenEditMessage} />}
              </div>
              <div className="w-full h-full bg-white border-[0.87cqw] border-[#FF0000] ring-[0.8cqw] ring-white rounded-[4cqw] flex flex-col shadow-[1cqw_1cqw_0.5cqw_rgba(0,0,0,0.4)] overflow-hidden">
               <div className="w-full h-[37.11%] bg-[#FF0000] flex items-center justify-center">
                 <span className="font-sans font-semibold text-white text-[5.23cqw]">HELLO, My name is</span>
               </div>
               <div className="flex-1 w-full flex items-center justify-center px-[4.65cqw] bg-white/90 backdrop-blur-sm">
                 <span className="font-sans text-[4.07cqw] text-black whitespace-pre truncate max-w-full block px-[2cqw]">
                     {state.trainerBio || ""}
                   </span>
               </div>
            </div>
            
            
          </div>

          
          {/* Reflection / Glare Layer (z-30, on top of frame and photo) */}
          <img src="/assets/pokemon-back/trainer-card-textures.png" alt="Card Textures" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 opacity-70 mix-blend-hard-light" />
        </div>
        )}

        {state?.stickers?.filter(s => s.side === 'back').map(sticker => ( <DraggableSticker key={sticker.id} stickerData={sticker} isPreview={isPreview} /> ))}
      </div>
    );
  }

  // Base Pokemon Card Back
  return (
    <div className={`relative w-full h-full aspect-[688/960] rounded-[16px] overflow-hidden shadow-2xl select-none bg-transparent @container`} style={{ containerType: "inline-size" }}>
      <img
        src="/assets/pokemon-back/base-card-back.png"
        alt="Pokemon Card Back"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      

      
        
        
        {backPhoto && backPhoto !== 'none' && (
          <div className="absolute top-[14.1%] right-[6.4%] z-10 w-[40.2%] h-[33.2%] drop-shadow-[2px_4px_6px_rgba(0,0,0,0.5)] rounded-[8px] overflow-hidden -rotate-[4.8deg]">
            <Polaroid image={backPhoto} className="w-full h-full !shadow-none" />
            
            {/* Pokeball Card Textures (702:12751) */}
            <div 
              className="absolute inset-0 z-20 opacity-15 grayscale pointer-events-none mix-blend-multiply" 
              style={{ 
                backgroundImage: 'url(/assets/pokemon-back/pokeball-texture.png)', 
                backgroundSize: 'calc(195px * 0.15)',
                backgroundRepeat: 'repeat' 
              }} 
            />
            
            {/* Card Textures Foil (702:12752) */}
            <div 
              className="absolute inset-0 z-20 opacity-15 grayscale pointer-events-none mix-blend-multiply" 
              style={{ 
                backgroundImage: 'url(/assets/pokemon-back/card-foil.png)', 
                backgroundSize: 'cover' 
              }} 
            />
          </div>
        )}


        <EmojiStamp emoji={state.stampEmoji} className="top-[14.1%] left-[38.3%] z-20" />

      <div className="absolute top-[42.7%] left-1/2 -translate-x-1/2 w-[87.8%] h-[52.3%] bg-white rounded-[14px] z-20 shadow-[2px_2px_2px_0.5px_rgba(0,0,0,0.25)] p-[3px] flex flex-col justify-center items-center gap-[10px]">
          <div className="w-full h-full border-[3px] border-[#FF0000] rounded-[12px] bg-white flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="w-full h-[17.9%] bg-[#FF0000] flex items-center justify-center shrink-0">
              <span className="font-sans font-semibold text-[4.4cqw] text-white tracking-wide whitespace-nowrap">HELLO, I wanna say...</span>
            </div>

            {/* Content Body */}
            <div className="flex-1 w-full px-[10.4%] pt-[8.1%] pb-[6.3%] flex flex-col justify-between">
              {/* To Line */}
              <div className="flex items-end w-[67.3%]">
                <span className="font-['Arial_Narrow',Arial,sans-serif] text-[4.07cqw] text-black tracking-tighter mr-[6px] leading-none pb-[2px] shrink-0">To:</span>
                <div className="relative flex-1">
                  <div className="absolute bottom-[2px] w-full border-b-[0.5px] border-black"></div>
                  <span className="relative font-['Syne_Tactile',cursive] text-[4.65cqw] text-black leading-none truncate block">{state.to}</span>
                </div>
              </div>

              {/* Message */}
              <div className="w-full mt-[8%] mb-auto">
                 <p className="font-['Arial',sans-serif] text-[3.49cqw] leading-[4.36cqw] font-normal text-[#000] whitespace-pre-line text-left break-words">
                   {state.message || ""}
                 </p>
              </div>

              {/* From Line */}
              <div className="flex items-end w-[66.9%] ml-auto">
                <span className="font-['Arial_Narrow',Arial,sans-serif] text-[3.49cqw] text-black tracking-tighter mr-[6px] leading-none pb-[2px] shrink-0">From:</span>
                <div className="relative flex-1">
                  <div className="absolute bottom-[2px] w-full border-b-[0.5px] border-black"></div>
                  <span className="relative font-['Syne_Tactile',cursive] text-[4.65cqw] text-black leading-none truncate block">{state.from}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-[12px] -right-[12px] z-50 pointer-events-auto flex items-center justify-center ">
            {onOpenEditMessage && <TertiaryLiquidGlassButton onClick={onOpenEditMessage} />}
          </div>
        </div>

      {state?.stickers?.filter(s => s.side === 'back').map(sticker => ( <DraggableSticker key={sticker.id} stickerData={sticker} isPreview={isPreview} /> ))}
    </div>
  );
}














