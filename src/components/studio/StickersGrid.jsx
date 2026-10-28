import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCard } from '@/context/CardContext';
import { STICKERS } from '@/data/cardData';
import WindowPanel from '@/components/ui/WindowPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import StampDustParticles from '@/components/ui/StampDustParticles';

export default function StickersGrid({ 
  title = "Decorate with Stickers", 
  heightClassName, 
  className = "",
  bare = false,
  isMobile = false,
}) {
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

  const scrollMaskImage = useMemo(() => {
    if (!hasOverflow) return undefined;
    const topStop = canScrollUp ? 'transparent 0px, black 22px' : 'black 0px, black 22px';
    const bottomStop = canScrollDown ? 'black calc(100% - 26px), transparent 100%' : 'black calc(100% - 26px), black 100%';
    return `linear-gradient(to bottom, ${topStop}, ${bottomStop})`;
  }, [hasOverflow, canScrollUp, canScrollDown]);

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

  const defaultHeight = heightClassName || 'h-[min(115px,calc(100dvh-455px))] xl:h-[min(131px,calc(100dvh-580px))] 2xl:h-[min(144px,calc(100dvh-610px))]';

  const scrollContent = (
    <div ref={stickerContainerRef} className={cn("relative w-full", defaultHeight)}>
      <ScrollArea
        className="h-full w-full"
        viewportClassName="w-full rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden"
        viewportStyle={scrollMaskImage ? { maskImage: scrollMaskImage, WebkitMaskImage: scrollMaskImage } : undefined}
        hideScrollbar={!hasOverflow}
      >
        <div
          className={cn(
            "mx-auto px-[3px] pb-3 grid justify-between",
            isMobile
              ? "w-full max-w-[360px] grid-cols-4 gap-y-[14px] gap-x-[10px]"
              : "w-full max-w-[328px] grid-cols-[repeat(4,54px)] sm:grid-cols-[repeat(4,60px)] xl:grid-cols-[repeat(4,61px)] 2xl:grid-cols-[repeat(4,66px)] gap-y-[12px] xl:gap-y-[13px] 2xl:gap-y-[14px]"
          )}
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
                  className={cn(
                    "relative flex flex-col items-center cursor-pointer group outline-none font-sans",
                    isMobile
                      ? "w-[72px] h-[94px]"
                      : "w-[54px] sm:w-[60px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px]"
                  )}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <div
                    className={cn(
                      'absolute top-0 pointer-events-none transition-colors duration-200',
                      isMobile
                        ? 'w-[76px] h-[94px] -left-[2px] rounded-[15px]'
                        : '-left-[2.5px] xl:-left-[3px] w-[59px] sm:w-[65px] h-[74px] xl:w-[67px] xl:h-[84px] 2xl:w-[72px] 2xl:h-[90px] rounded-[13px] xl:rounded-[14px] 2xl:rounded-[15px]',
                      isSelected
                        ? 'bg-[#0088FF]'
                        : 'bg-transparent group-hover:bg-[rgba(153,153,153,0.15)]'
                    )}
                  />

                  <motion.div 
                    animate={isStickerActive ? { scale: [1.1, 0.96, 1] } : {}}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={cn(
                      "relative overflow-hidden bg-black/40 z-10 flex items-center justify-center p-1.5",
                      isMobile
                        ? "mt-[2px] w-[70px] h-[70px] rounded-[13px]"
                        : "mt-[2.5px] xl:mt-[3px] w-[54px] sm:w-[58px] h-[54px] sm:h-[58px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px]"
                    )}
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

                  <div className={cn(
                    "relative z-10 text-center",
                    isMobile ? "mt-1 w-[70px]" : "mt-1 w-[54px] sm:w-[60px] xl:w-[61px] 2xl:w-[66px]"
                  )}>
                    <span
                      className={cn(
                        'leading-[13px] font-normal truncate block text-center transition-colors duration-200',
                        isMobile ? 'text-[11.5px]' : 'text-[10px] xl:text-[11px] 2xl:text-[12px]',
                        isSelected ? 'text-[#FFFFFF]' : 'text-[rgba(229,229,234,0.70)] group-hover:text-[rgba(255,255,255,0.85)]'
                      )}
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
  );

  if (bare) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-[14px] font-semibold text-white tracking-tight mb-2.5 px-0.5">
          {title}
        </div>
        {scrollContent}
      </div>
    );
  }

  return (
    <div className={cn("h-fit w-full", className)}>
      <WindowPanel 
        title={title} 
        bodyClassName="pt-[13px] pr-[4px] pb-[15px] pl-[15px] xl:pt-[15px] xl:pr-[4px] xl:pb-[17px] xl:pl-[17px] 2xl:pt-[16px] 2xl:pr-[4px] 2xl:pb-[18px] 2xl:pl-[18px] overflow-hidden"
      >
        {scrollContent}
      </WindowPanel>
    </div>
  );
}
