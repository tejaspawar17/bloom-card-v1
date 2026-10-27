import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import { useCard } from '@/context/CardContext';
import { EMOTE_EMOJIS, STICKERS } from '@/data/cardData';
import FigmaWindow from './ui/FigmaWindow';
import WindowSelectBackImage from './WindowSelectBackImage';
import WindowPanel from './ui/WindowPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import StampDustParticles from './ui/StampDustParticles';

export default function RightPanel({ className = '' }) {
  const { state, dispatch } = useCard();

  const stickerContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [activeStampTrigger, setActiveStampTrigger] = useState(null);

  const hasOverflow = STICKERS.length > 4;

  const handleStickerScroll = useCallback(() => {
    const vp = stickerContainerRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
    if (!vp) return;
    setCanScrollUp(vp.scrollTop > 4);
    setCanScrollDown(vp.scrollTop + vp.clientHeight < vp.scrollHeight - 6);
  }, []);

  useEffect(() => {
    const vp = stickerContainerRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
    if (!vp) return;
    vp.addEventListener('scroll', handleStickerScroll, { passive: true });
    const timer = setTimeout(handleStickerScroll, 50);
    return () => {
      vp.removeEventListener('scroll', handleStickerScroll);
      clearTimeout(timer);
    };
  }, [handleStickerScroll]);

  const scrollMaskImage = React.useMemo(() => {
    if (!hasOverflow) return undefined;
    const topStop = canScrollUp ? 'transparent 0px, black 22px' : 'black 0px, black 22px';
    const bottomStop = canScrollDown ? 'black calc(100% - 26px), transparent 100%' : 'black calc(100% - 26px), black 100%';
    return `linear-gradient(to bottom, ${topStop}, ${bottomStop})`;
  }, [hasOverflow, canScrollUp, canScrollDown]);

  const handleEmoteClick = (emoteId) => {
    setActiveStampTrigger(`emote-${emoteId}-${Date.now()}`);
    dispatch({ type: 'SET_STAMP_EMOJI', payload: emoteId });
    if (state.activeSide !== 'back') {
      dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'back' });
    }
  };

  const handleStickerClick = (sticker) => {
    setSelectedSticker(sticker.id);
    setActiveStampTrigger(`sticker-${sticker.id}-${Date.now()}`);
    dispatch({ 
      type: 'ADD_STICKER', 
      payload: { 
        id: Date.now().toString() + Math.random().toString(), 
        stickerId: sticker.id, 
        side: state.activeSide, 
        x: 100, 
        y: 100, 
        r: (Math.random() * 20 - 10) 
      } 
    });
  };

  return (
    <FigmaWindow aria-label="Card Decoration Selector" className={className} gapClassName="gap-[10px] xl:gap-[12px] 2xl:gap-[14px]">
        
        {/* 1. Upload / Select Image for the Back */}
        <div className="h-fit">
          <WindowSelectBackImage />
        </div>
  
        {/* 2. Choose Mood (Emoji Selector) matching Figma #1140:2166 */}
        <div className="h-fit">
          <WindowPanel
            title="Stamp an Emotion"
            bodyClassName="pt-[13px] px-[15px] pb-[15px] xl:pt-[15px] xl:px-[17px] xl:pb-[17px] 2xl:pt-[16px] 2xl:px-[18px] 2xl:pb-[18px]"
          >
            <div className="flex flex-col gap-[5px] xl:gap-[6px] w-[268px] xl:w-[305px] 2xl:w-[328px] mx-auto">
              {/* Row 1 (First 8 Emojis) */}
              <div className="flex flex-row justify-between items-center w-full">
                {EMOTE_EMOJIS.slice(0, 8).map((emote) => {
                  const isEmoteActive = activeStampTrigger?.startsWith(`emote-${emote.id}`);
                  return (
                    <div key={emote.id} className="relative">
                      <StampDustParticles triggerKey={isEmoteActive ? activeStampTrigger : null} color="#0088FF" />
                      <motion.button
                        whileTap={{ scale: 0.88, y: 1 }}
                        transition={{ type: "spring", stiffness: 450, damping: 20 }}
                        type="button"
                        role="listitem"
                        aria-label={"Mood: " + emote.name}
                        onClick={() => handleEmoteClick(emote.id)}
                        className={clsx(
                          "w-[28px] h-[28px] xl:w-[32px] xl:h-[32px] 2xl:w-[34px] 2xl:h-[34px] flex items-center justify-center rounded-full outline-none cursor-pointer select-none border-0 shadow-none transition-colors duration-150",
                          state.stampEmoji === emote.id
                            ? "bg-[#0088FF]"
                            : "bg-[rgba(114,114,114,0.08)] hover:bg-[rgba(153,153,153,0.15)]"
                        )}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <motion.img 
                          src={emote.src} 
                          alt={emote.name} 
                          className="w-[16px] h-[16px] xl:w-[18px] xl:h-[18px] 2xl:w-[20px] 2xl:h-[20px] object-contain drop-shadow-sm pointer-events-none" 
                          draggable={false}
                          animate={isEmoteActive ? { scale: [1.25, 0.95, 1], rotate: [0, -6, 6, 0] } : {}}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        />
                      </motion.button>
                    </div>
                  );
                })}
              </div>
              {/* Row 2 (Next 8 Emojis) */}
              <div className="flex flex-row justify-between items-center w-full">
                {EMOTE_EMOJIS.slice(8, 16).map((emote) => {
                  const isEmoteActive = activeStampTrigger?.startsWith(`emote-${emote.id}`);
                  return (
                    <div key={emote.id} className="relative">
                      <StampDustParticles triggerKey={isEmoteActive ? activeStampTrigger : null} color="#0088FF" />
                      <motion.button
                        whileTap={{ scale: 0.88, y: 1 }}
                        transition={{ type: "spring", stiffness: 450, damping: 20 }}
                        type="button"
                        role="listitem"
                        aria-label={"Mood: " + emote.name}
                        onClick={() => handleEmoteClick(emote.id)}
                        className={clsx(
                          "w-[28px] h-[28px] xl:w-[32px] xl:h-[32px] 2xl:w-[34px] 2xl:h-[34px] flex items-center justify-center rounded-full outline-none cursor-pointer select-none border-0 shadow-none transition-colors duration-150",
                          state.stampEmoji === emote.id
                            ? "bg-[#0088FF]"
                            : "bg-[rgba(114,114,114,0.08)] hover:bg-[rgba(153,153,153,0.15)]"
                        )}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <motion.img 
                          src={emote.src} 
                          alt={emote.name} 
                          className="w-[16px] h-[16px] xl:w-[18px] xl:h-[18px] 2xl:w-[20px] 2xl:h-[20px] object-contain drop-shadow-sm pointer-events-none" 
                          draggable={false}
                          animate={isEmoteActive ? { scale: [1.25, 0.95, 1], rotate: [0, -6, 6, 0] } : {}}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        />
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </div>
          </WindowPanel>
        </div>

        {/* 3. Decorate with Stickers — Matching Figma #1155:14884 (padding 16px 4px 18px 18px, Grid 328x146) */}
        <div className="h-fit">
          <WindowPanel 
            title="Add Stickers" 
            bodyClassName="pt-[13px] pr-[4px] pb-[15px] pl-[15px] xl:pt-[15px] xl:pr-[4px] xl:pb-[17px] xl:pl-[17px] 2xl:pt-[16px] 2xl:pr-[4px] 2xl:pb-[18px] 2xl:pl-[18px] overflow-hidden"
          >
            <div ref={stickerContainerRef} className="relative w-full h-[min(115px,calc(100dvh-455px))] xl:h-[min(131px,calc(100dvh-580px))] 2xl:h-[min(144px,calc(100dvh-610px))]">
              <ScrollArea
                className="h-full w-full"
                viewportClassName="w-full rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden"
                viewportStyle={scrollMaskImage ? { maskImage: scrollMaskImage, WebkitMaskImage: scrollMaskImage } : undefined}
                hideScrollbar={!hasOverflow}
              >
                <div
                  className="w-[268px] xl:w-[305px] 2xl:w-[328px] px-[3px] pb-3 grid grid-cols-[repeat(4,54px)] xl:grid-cols-[repeat(4,61px)] 2xl:grid-cols-[repeat(4,66px)] justify-between gap-y-[12px] xl:gap-y-[13px] 2xl:gap-y-[14px]"
                  role="list"
                  aria-label="Stickers Selector"
                >
                  {STICKERS.map((sticker) => {
                    const isSelected = selectedSticker === sticker.id;
                    const isStickerActive = activeStampTrigger?.startsWith(`sticker-${sticker.id}`);
                    const shortName =
                      sticker.name.length > 10
                        ? sticker.name.substring(0, 9) + '...'
                        : sticker.name;

                    return (
                      <div key={sticker.id} className="relative flex flex-col items-center">
                        <StampDustParticles triggerKey={isStickerActive ? activeStampTrigger : null} color="#FFD60A" />
                        <motion.button
                          type="button"
                          role="listitem"
                          aria-label={"Sticker: " + sticker.name}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 450, damping: 22 }}
                          onClick={() => handleStickerClick(sticker)}
                          className="relative flex flex-col items-center cursor-pointer group outline-none w-[54px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px] font-sans"
                          style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                          {/* Selection BG (Figma: 72x90, x:-3, r:15, #0088FF, hover rgba(153,153,153,0.15)) */}
                          <div
                            className={cn(
                              'absolute top-0 -left-[2.5px] xl:-left-[3px] w-[59px] h-[74px] xl:w-[67px] xl:h-[84px] 2xl:w-[72px] 2xl:h-[90px] rounded-[13px] xl:rounded-[14px] 2xl:rounded-[15px] transition-colors duration-200 pointer-events-none',
                              isSelected
                                ? 'bg-[#0088FF]'
                                : 'bg-transparent group-hover:bg-[rgba(153,153,153,0.15)]'
                            )}
                          />

                          {/* Image Thumbnail (Figma: 66x66, y:3, r:12) with tactile spring bounce */}
                          <motion.div 
                            animate={isStickerActive ? { scale: [1.1, 0.96, 1] } : {}}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="relative mt-[2.5px] xl:mt-[3px] w-[54px] h-[54px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden bg-black/40 z-10 flex items-center justify-center p-1"
                          >
                            <img
                              src={sticker.image}
                              alt=""
                              className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                              aria-hidden="true"
                              loading="lazy"
                              draggable={false}
                            />
                          </motion.div>

                          {/* Label (Figma: Inter Regular 10, y:72, w:66) */}
                          <div className="relative mt-1 z-10 w-[54px] xl:w-[61px] 2xl:w-[66px] text-center">
                            <span
                              className={cn('text-[10px] xl:text-[11px] 2xl:text-[12px] leading-[12px] font-normal truncate block text-center transition-colors duration-200', isSelected ? 'text-[#FFFFFF]' : 'text-[rgba(229,229,234,0.70)] group-hover:text-[rgba(255,255,255,0.85)]')}
                              title={sticker.name}
                            >
                              {shortName}
                            </span>
                          </div>
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </WindowPanel>
        </div>

    </FigmaWindow>
  );
}
