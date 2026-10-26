import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCard } from '@/context/CardContext';
import { OCCASIONS, FLOWERS, POKEMON_CARDS } from '@/data/cardData';
import FigmaWindow from './ui/FigmaWindow';
import WindowPanel from './ui/WindowPanel';
import OccasionPicker from '@/components/ui/OccasionPicker';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LeftPanel() {
  const { state, dispatch } = useCard();

  const containerRef = React.useRef(null);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);
  const [hasPickedOccasion, setHasPickedOccasion] = React.useState(false);

  const isPokemonMode = state.cardType === 'pokemon';
  const listData = React.useMemo(() => {
    return isPokemonMode
      ? POKEMON_CARDS
      : [...FLOWERS].sort((a, b) => a.name.localeCompare(b.name));
  }, [isPokemonMode]);

  // 4 columns * 2 rows = 8 items max fit without scrolling
  const hasOverflow = listData.length > 8;

  const listTitle = isPokemonMode ? 'Pick Your Pokémon' : 'Pick Your Bloom';
  const selectedItemId = isPokemonMode ? state.selectedPokemon : state.selectedFlower;
  const setActionType = isPokemonMode ? 'SET_SELECTED_POKEMON' : 'SET_SELECTED_FLOWER';

  const handleScroll = React.useCallback(() => {
    if (!hasOverflow) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }
    const vp = containerRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
    if (!vp) return;
    setCanScrollUp(vp.scrollTop > 4);
    setCanScrollDown(vp.scrollTop + vp.clientHeight < vp.scrollHeight - 6);
  }, [hasOverflow]);

  React.useEffect(() => {
    if (!hasOverflow) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }
    const vp = containerRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
    if (!vp) return;
    vp.addEventListener('scroll', handleScroll, { passive: true });
    const timer = setTimeout(handleScroll, 50);
    return () => {
      vp.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [listData, hasOverflow, handleScroll]);

  const scrollMaskImage = React.useMemo(() => {
    if (!hasOverflow) return undefined;
    const topStop = canScrollUp ? 'transparent 0px, black 22px' : 'black 0px, black 22px';
    const bottomStop = canScrollDown ? 'black calc(100% - 26px), transparent 100%' : 'black calc(100% - 26px), black 100%';
    return `linear-gradient(to bottom, ${topStop}, ${bottomStop})`;
  }, [hasOverflow, canScrollUp, canScrollDown]);

  return (
    <FigmaWindow aria-label="Occasion and Item Selector" gapClassName="gap-[20px] xl:gap-[24px] 2xl:gap-[28px]">
      {/* 1. Select Occasion (Figma: no chip forced selected initially until user clicks) */}
      <OccasionPicker 
        value={hasPickedOccasion ? OCCASIONS.find(o => o.id === state.occasion)?.label : null}
        onChange={(label) => {
          setHasPickedOccasion(Boolean(label));
          const occ = OCCASIONS.find(o => o.label === label);
          if (occ) dispatch({ type: 'SET_OCCASION', payload: occ.id });
        }}
      />

      {/* 2. Select Flower / Pokemon (Figma #1166:16778: padding 16px 4px 18px 18px, Grid 328x246) */}
      <WindowPanel
        title={listTitle}
        bodyClassName="pt-[13px] pr-[4px] pb-[15px] pl-[15px] xl:pt-[15px] xl:pr-[4px] xl:pb-[17px] xl:pl-[17px] 2xl:pt-[16px] 2xl:pr-[4px] 2xl:pb-[18px] 2xl:pl-[18px] overflow-hidden"
      >
        <div ref={containerRef} className="relative w-full h-[min(186px,calc(100dvh-410px))] xl:h-[min(229px,calc(100dvh-482px))] 2xl:h-[min(246px,calc(100dvh-510px))]">
          {isPokemonMode ? (
            /* Pokemon Mode: 5 cards in a static 2-row grid */
            <AnimatePresence mode="wait">
              <motion.div
                key="pokemon"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-[268px] xl:w-[305px] 2xl:w-[328px] px-[3px] grid grid-cols-[repeat(4,54px)] xl:grid-cols-[repeat(4,61px)] 2xl:grid-cols-[repeat(4,66px)] justify-between gap-y-[12px] xl:gap-y-[13px] 2xl:gap-y-[14px]"
                role="radiogroup"
                aria-label={listTitle}
              >
                {listData.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  const shortName =
                    item.name.length > 10
                      ? item.name.substring(0, 9) + '...'
                      : item.name;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => dispatch({ type: setActionType, payload: item.id })}
                      className="relative flex flex-col items-center cursor-pointer group outline-none active:scale-[0.96] transition-transform duration-150 ease-out w-[54px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px] font-sans"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
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
                      <div className="relative mt-[2.5px] xl:mt-[3px] w-[54px] h-[54px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden bg-black/40 z-10">
                        <img
                          src={item.thumb || item.image}
                          alt=""
                          className="w-full h-full object-cover"
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      {/* Label (Figma: Inter 400 11/13, y:72, rgba(229,229,234,0.70)) */}
                      <span
                        className={cn(
                          'relative mt-[2.5px] xl:mt-[3px] text-[10px] leading-[12px] xl:text-[10.5px] xl:leading-[12.5px] 2xl:text-[11px] 2xl:leading-[13px] tracking-[0.0055em] truncate w-[54px] xl:w-[61px] 2xl:w-[66px] text-center transition-colors duration-200 z-10 font-sans',
                          isSelected
                            ? 'text-white font-medium'
                            : 'text-[rgba(229,229,234,0.70)] font-normal group-hover:text-[rgba(255,255,255,0.85)]'
                        )}
                        title={item.name}
                      >
                        {shortName}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Flower Mode: ScrollArea with Apple CSS maskImage edge fade & dedicated right scrollbar */
            <ScrollArea
              className="h-full w-full"
              viewportClassName="w-full rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden"
              viewportStyle={scrollMaskImage ? { maskImage: scrollMaskImage, WebkitMaskImage: scrollMaskImage } : undefined}
              hideScrollbar={!hasOverflow}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key="flower"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="w-[268px] xl:w-[305px] 2xl:w-[328px] px-[3px] pb-3 grid grid-cols-[repeat(4,54px)] xl:grid-cols-[repeat(4,61px)] 2xl:grid-cols-[repeat(4,66px)] justify-between gap-y-[12px] xl:gap-y-[13px] 2xl:gap-y-[14px]"
                  role="radiogroup"
                  aria-label={listTitle}
                >
                  {listData.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const shortName =
                      item.name.length > 10
                        ? item.name.substring(0, 9) + '...'
                        : item.name;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => dispatch({ type: setActionType, payload: item.id })}
                        className="relative flex flex-col items-center cursor-pointer group outline-none active:scale-[0.96] transition-transform duration-150 ease-out w-[54px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px] font-sans"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
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
                        <div className="relative mt-[2.5px] xl:mt-[3px] w-[54px] h-[54px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden bg-black/40 z-10">
                          <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-cover"
                            aria-hidden="true"
                            loading="lazy"
                          />
                        </div>

                        {/* Label (Figma: Inter 400 11/13, y:72, rgba(229,229,234,0.70)) */}
                        <span
                          className={cn(
                            'relative mt-[2.5px] xl:mt-[3px] text-[10px] leading-[12px] xl:text-[10.5px] xl:leading-[12.5px] 2xl:text-[11px] 2xl:leading-[13px] tracking-[0.0055em] truncate w-[54px] xl:w-[61px] 2xl:w-[66px] text-center transition-colors duration-200 z-10 font-sans',
                            isSelected
                              ? 'text-white font-medium'
                              : 'text-[rgba(229,229,234,0.70)] font-normal group-hover:text-[rgba(255,255,255,0.85)]'
                          )}
                          title={item.name}
                        >
                          {shortName}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          )}
        </div>
      </WindowPanel>
    </FigmaWindow>
  );
}
