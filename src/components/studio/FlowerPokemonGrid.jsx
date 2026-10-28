import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCard } from '@/context/CardContext';
import { FLOWERS, POKEMON_CARDS } from '@/data/cardData';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FlowerPokemonGrid({ heightClassName, className = '', isMobile = false }) {
  const { state, dispatch } = useCard();
  const containerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const isPokemonMode = state.cardType === 'pokemon';
  const listData = useMemo(() => {
    return isPokemonMode
      ? POKEMON_CARDS
      : [...FLOWERS].sort((a, b) => a.name.localeCompare(b.name));
  }, [isPokemonMode]);

  const hasOverflow = listData.length > 8;
  const listTitle = isPokemonMode ? 'Pick Your Pokémon' : 'Pick Your Bloom';
  const selectedItemId = isPokemonMode ? state.selectedPokemon : state.selectedFlower;
  const setActionType = isPokemonMode ? 'SET_SELECTED_POKEMON' : 'SET_SELECTED_FLOWER';

  const handleScroll = useCallback(() => {
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

  useEffect(() => {
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

  const scrollMaskImage = useMemo(() => {
    if (!hasOverflow) return undefined;
    const topStop = canScrollUp ? 'transparent 0px, black 22px' : 'black 0px, black 22px';
    const bottomStop = canScrollDown ? 'black calc(100% - 26px), transparent 100%' : 'black calc(100% - 26px), black 100%';
    return `linear-gradient(to bottom, ${topStop}, ${bottomStop})`;
  }, [hasOverflow, canScrollUp, canScrollDown]);

  const defaultHeight = heightClassName || (
    isMobile 
      ? 'h-[220px]' 
      : 'h-[min(186px,calc(100dvh-410px))] xl:h-[min(229px,calc(100dvh-482px))] 2xl:h-[min(246px,calc(100dvh-510px))]'
  );

  return (
    <div ref={containerRef} className={cn("relative w-full", defaultHeight, className)}>
      <ScrollArea
        className="h-full w-full"
        viewportClassName="w-full rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden"
        viewportStyle={scrollMaskImage ? { maskImage: scrollMaskImage, WebkitMaskImage: scrollMaskImage } : undefined}
        hideScrollbar={!hasOverflow}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isPokemonMode ? (
            <motion.div
              key="pokemon"
              initial={{ opacity: 0, filter: 'blur(5px)', y: 4 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(4px)', y: -3 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "mx-auto px-[3px] grid justify-between",
                isMobile
                  ? "w-full max-w-[360px] grid-cols-4 gap-y-[14px] gap-x-[10px]"
                  : "w-[268px] xl:w-[305px] 2xl:w-[328px] grid-cols-[repeat(4,54px)] xl:grid-cols-[repeat(4,61px)] 2xl:grid-cols-[repeat(4,66px)] gap-y-[12px] xl:gap-y-[13px] 2xl:gap-y-[14px]"
              )}
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
                    className={cn(
                      "relative flex flex-col items-center cursor-pointer group outline-none active:scale-[0.96] transition-transform duration-150 ease-out font-sans",
                      isMobile
                        ? "w-[72px] h-[92px]"
                        : "w-[54px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px]"
                    )}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <div
                      className={cn(
                        'absolute top-0 pointer-events-none transition-colors duration-200',
                        isMobile
                          ? 'w-[76px] h-[92px] -left-[2px] rounded-[15px]'
                          : '-left-[2.5px] xl:-left-[3px] w-[59px] h-[74px] xl:w-[67px] xl:h-[84px] 2xl:w-[72px] 2xl:h-[90px] rounded-[13px] xl:rounded-[14px] 2xl:rounded-[15px]',
                        isSelected
                          ? 'bg-[#0088FF]'
                          : 'bg-transparent group-hover:bg-[rgba(153,153,153,0.15)]'
                      )}
                    />
                    <div className={cn(
                      "relative overflow-hidden bg-black/40 z-10",
                      isMobile
                        ? "mt-[2px] w-[66px] h-[66px] rounded-[13px]"
                        : "mt-[2.5px] xl:mt-[3px] w-[54px] h-[54px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px]"
                    )}>
                      <img
                        src={item.thumb || item.image}
                        alt=""
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <span
                      className={cn(
                        'relative transition-colors duration-200 z-10 font-sans truncate text-center',
                        isMobile
                          ? 'mt-1 text-[11.5px] leading-[14px] w-[70px]'
                          : 'mt-[2.5px] xl:mt-[3px] text-[10px] leading-[12px] xl:text-[10.5px] xl:leading-[12.5px] 2xl:text-[11px] 2xl:leading-[13px] tracking-[0.0055em] w-[54px] xl:w-[61px] 2xl:w-[66px]',
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
          ) : (
            <motion.div
              key="flower"
              initial={{ opacity: 0, filter: 'blur(5px)', y: 4 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(4px)', y: -3 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "mx-auto px-[3px] grid justify-between",
                isMobile
                  ? "w-full max-w-[360px] grid-cols-4 gap-y-[14px] gap-x-[10px]"
                  : "w-[268px] xl:w-[305px] 2xl:w-[328px] grid-cols-[repeat(4,54px)] xl:grid-cols-[repeat(4,61px)] 2xl:grid-cols-[repeat(4,66px)] gap-y-[12px] xl:gap-y-[13px] 2xl:gap-y-[14px]"
              )}
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
                    className={cn(
                      "relative flex flex-col items-center cursor-pointer group outline-none active:scale-[0.96] transition-transform duration-150 ease-out font-sans",
                      isMobile
                        ? "w-[72px] h-[92px]"
                        : "w-[54px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px]"
                    )}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <div
                      className={cn(
                        'absolute top-0 pointer-events-none transition-colors duration-200',
                        isMobile
                          ? 'w-[76px] h-[92px] -left-[2px] rounded-[15px]'
                          : '-left-[2.5px] xl:-left-[3px] w-[59px] h-[74px] xl:w-[67px] xl:h-[84px] 2xl:w-[72px] 2xl:h-[90px] rounded-[13px] xl:rounded-[14px] 2xl:rounded-[15px]',
                        isSelected
                          ? 'bg-[#0088FF]'
                          : 'bg-transparent group-hover:bg-[rgba(153,153,153,0.15)]'
                      )}
                    />
                    <div className={cn(
                      "relative overflow-hidden bg-[#1A1A1A] z-10",
                      isMobile
                        ? "mt-[2px] w-[66px] h-[66px] rounded-[13px]"
                        : "mt-[2.5px] xl:mt-[3px] w-[54px] h-[54px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px]"
                    )}>
                      <img
                        src={item.thumb || item.image}
                        alt=""
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <span
                      className={cn(
                        'relative transition-colors duration-200 z-10 font-sans truncate text-center',
                        isMobile
                          ? 'mt-1 text-[11.5px] leading-[14px] w-[70px]'
                          : 'mt-[2.5px] xl:mt-[3px] text-[10px] leading-[12px] xl:text-[10.5px] xl:leading-[12.5px] 2xl:text-[11px] 2xl:leading-[13px] tracking-[0.0055em] w-[54px] xl:w-[61px] 2xl:w-[66px]',
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
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
