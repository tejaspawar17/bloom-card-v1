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

export default function RightPanel({ className = '' }) {
  const { state, dispatch } = useCard();

  const stickerContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [selectedSticker, setSelectedSticker] = useState(null);

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

  return (
    <FigmaWindow aria-label="Card Decoration Selector" className={className} gapClassName="gap-[10px] xl:gap-[12px] 2xl:gap-[14px]">
        
        {/* 1. Upload / Select Image for the Back */}
        <div className="h-fit">
          <WindowSelectBackImage />
        </div>
  
        {/* 2. Choose Mood (Emoji Selector) matching Figma #1140:2166 */}
        <div className="h-fit">
          <WindowPanel
            title="What do you want to emote"
            bodyClassName="pt-[13px] px-[15px] pb-[15px] xl:pt-[15px] xl:px-[17px] xl:pb-[17px] 2xl:pt-[16px] 2xl:px-[18px] 2xl:pb-[18px]"
          >
            <div className="flex flex-col gap-[5px] xl:gap-[6px] w-[268px] xl:w-[305px] 2xl:w-[328px] mx-auto">
              {/* Row 1 (First 8 Emojis) */}
              <div className="flex flex-row justify-between items-center w-full">
                {EMOTE_EMOJIS.slice(0, 8).map((emote) => (
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    key={emote.id}
                    type="button"
                    role="listitem"
                    aria-label={"Mood: " + emote.name}
                    onClick={() => dispatch({ type: "SET_STAMP_EMOJI", payload: emote.id })}
                    className={clsx(
                      "w-[28px] h-[28px] xl:w-[32px] xl:h-[32px] 2xl:w-[34px] 2xl:h-[34px] flex items-center justify-center rounded-full outline-none cursor-pointer select-none border-0 shadow-none transition-colors duration-150",
                      state.stampEmoji === emote.id
                        ? "bg-[#0088FF]"
                        : "bg-[rgba(114,114,114,0.08)] hover:bg-[rgba(153,153,153,0.15)]"
                    )}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <img src={emote.src} alt={emote.name} className="w-[16px] h-[16px] xl:w-[18px] xl:h-[18px] 2xl:w-[20px] 2xl:h-[20px] object-contain drop-shadow-sm pointer-events-none" draggable={false} />
                  </motion.button>
                ))}
              </div>
              {/* Row 2 (Next 8 Emojis) */}
              <div className="flex flex-row justify-between items-center w-full">
                {EMOTE_EMOJIS.slice(8, 16).map((emote) => (
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    key={emote.id}
                    type="button"
                    role="listitem"
                    aria-label={"Mood: " + emote.name}
                    onClick={() => dispatch({ type: "SET_STAMP_EMOJI", payload: emote.id })}
                    className={clsx(
                      "w-[28px] h-[28px] xl:w-[32px] xl:h-[32px] 2xl:w-[34px] 2xl:h-[34px] flex items-center justify-center rounded-full outline-none cursor-pointer select-none border-0 shadow-none transition-colors duration-150",
                      state.stampEmoji === emote.id
                        ? "bg-[#0088FF]"
                        : "bg-[rgba(114,114,114,0.08)] hover:bg-[rgba(153,153,153,0.15)]"
                    )}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <img src={emote.src} alt={emote.name} className="w-[16px] h-[16px] xl:w-[18px] xl:h-[18px] 2xl:w-[20px] 2xl:h-[20px] object-contain drop-shadow-sm pointer-events-none" draggable={false} />
                  </motion.button>
                ))}
              </div>
            </div>
          </WindowPanel>
        </div>

        {/* 3. Decorate with Stickers — Matching Figma #1155:14884 (padding 16px 4px 18px 18px, Grid 328x146) */}
        <div className="h-fit">
          <WindowPanel 
            title="Decorate with Stickers" 
            bodyClassName="pt-[13px] pr-[4px] pb-[15px] pl-[15px] xl:pt-[15px] xl:pr-[4px] xl:pb-[17px] xl:pl-[17px] 2xl:pt-[16px] 2xl:pr-[4px] 2xl:pb-[18px] 2xl:pl-[18px] overflow-hidden"
          >
            <div ref={stickerContainerRef} className="relative w-full h-[115px] xl:h-[131px] 2xl:h-[144px]">
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
                    const shortName =
                      sticker.name.length > 10
                        ? sticker.name.substring(0, 9) + '...'
                        : sticker.name;

                    return (
                      <button
                        key={sticker.id}
                        type="button"
                        role="listitem"
                        aria-label={"Sticker: " + sticker.name}
                        onClick={() => {
                          setSelectedSticker(sticker.id);
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
                        }}
                        className="relative flex flex-col items-center cursor-pointer group outline-none active:scale-[0.96] transition-transform duration-150 ease-out w-[54px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px] font-sans"
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

                        {/* Image Thumbnail (Figma: 66x66, y:3, r:12) */}
                        <div className="relative mt-[2.5px] xl:mt-[3px] w-[54px] h-[54px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden bg-black/40 z-10 flex items-center justify-center p-1">
                          <img
                            src={sticker.image}
                            alt=""
                            className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                            aria-hidden="true"
                            loading="lazy"
                            draggable={false}
                          />
                        </div>

                        {/* Label (Figma: Inter 400 11/13, y:72, rgba(229,229,234,0.70)) */}
                        <span
                          className={cn(
                            'relative mt-[2.5px] xl:mt-[3px] text-[10px] leading-[12px] xl:text-[10.5px] xl:leading-[12.5px] 2xl:text-[11px] 2xl:leading-[13px] tracking-[0.0055em] truncate w-[54px] xl:w-[61px] 2xl:w-[66px] text-center transition-colors duration-200 z-10 font-sans',
                            isSelected
                              ? 'text-white font-medium'
                              : 'text-[rgba(229,229,234,0.70)] font-normal group-hover:text-white/85'
                          )}
                          title={sticker.name}
                        >
                          {shortName}
                        </span>
                      </button>
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
