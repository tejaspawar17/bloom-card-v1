import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadSimple,
  Prohibit,
  CircleNotch,
  FlowerLotus,
  Sparkle,
  CalendarHeart,
  Sticker,
  Image as ImageIcon,
  Smiley,
  Check,
} from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';
import { FLOWERS, POKEMON_CARDS, EMOTE_EMOJIS, OCCASIONS, STICKERS } from '@/data/cardData';
import { showToast } from '@/components/ui/AppleToast';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import GlassSegmentedControl from '@/components/ui/GlassSegmentedControl';
import StampDustParticles from '@/components/ui/StampDustParticles';
import { cn } from '@/lib/utils';

const defaultPolaroid1 = '/assets/polaroid-defaults/image1.png';
const defaultPolaroid2 = '/assets/polaroid-defaults/image2.png';

async function isHeicFile(file) {
  if (!file) return false;
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  if (name.endsWith('.heic') || name.endsWith('.heif') || type === 'image/heic' || type === 'image/heif') {
    return true;
  }
  try {
    const { isHeic } = await import('heic-to');
    return await isHeic(file);
  } catch {
    return false;
  }
}

async function optimizeImageForPolaroid(fileOrBlob, maxDimension = 1200) {
  return new Promise((resolve) => {
    if (!fileOrBlob || typeof window === 'undefined') {
      resolve(fileOrBlob);
      return;
    }
    const img = new Image();
    const tempUrl = URL.createObjectURL(fileOrBlob);
    img.onload = () => {
      URL.revokeObjectURL(tempUrl);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      if (!width || !height || (width <= maxDimension && height <= maxDimension)) {
        resolve(fileOrBlob);
        return;
      }
      let newWidth = width;
      let newHeight = height;
      if (width > height) {
        newHeight = Math.round((height * maxDimension) / width);
        newWidth = maxDimension;
      } else {
        newWidth = Math.round((width * maxDimension) / height);
        newHeight = maxDimension;
      }
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(fileOrBlob);
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(fileOrBlob);
            return;
          }
          const cleanName = (fileOrBlob.name || 'photo').replace(/\.[^/.]+$/, '') + '.jpg';
          resolve(new File([blob], cleanName, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.92
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      resolve(fileOrBlob);
    };
    img.src = tempUrl;
  });
}

/**
 * MobileQuickPickerPopover
 * Unified Docked Segmented Bar + Floating Window for Mobile & Tablet (< 1024px).
 * Front Tabs:
 * - 'frontArtwork': Pick Your Bloom / Pick Your Pokémon
 * - 'occasion': What’s the Occasion?
 * - 'stickers': Decorate with Stickers
 * Back Tabs:
 * - 'polaroid': Back Cover Artwork
 * - 'stamp': Stamp an Emotion
 * - 'stickers': Decorate with Stickers
 */
export default function MobileQuickPickerPopover({ mode, onSelectMode, onClose }) {
  const { state, dispatch } = useCard();
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [activeStampTrigger, setActiveStampTrigger] = useState(null);

  const isPokemonMode = state.cardType === 'pokemon';
  const currentSide = state.activeSide || 'front';
  const isFlipped = currentSide === 'back';

  const sideStickers = useMemo(
    () => (state.stickers || []).filter((s) => (s.side || 'front') === currentSide),
    [state.stickers, currentSide]
  );
  const selectedStickerIdsSet = useMemo(
    () => new Set(sideStickers.map((s) => s.stickerId)),
    [sideStickers]
  );

  const updateScrollEdges = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  };

  // Auto-scroll selected item into center when popover opens or mode changes
  useEffect(() => {
    if (!mode) return;
    const timer = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const activeBtn = el.querySelector('[data-active="true"]');
      if (activeBtn) {
        const scrollTarget = activeBtn.offsetLeft - el.clientWidth / 2 + activeBtn.clientWidth / 2;
        el.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
      }
      updateScrollEdges();
    }, 60);
    return () => clearTimeout(timer);
  }, [mode, state.cardType, currentSide]);

  if (!mode) return null;

  const title =
    mode === 'frontArtwork'
      ? isPokemonMode
        ? 'Pick Your Pokémon'
        : 'Pick Your Bloom'
      : mode === 'occasion'
        ? 'What’s the Occasion?'
        : mode === 'stickers'
          ? 'Decorate with Stickers'
          : mode === 'polaroid'
            ? 'Back Cover Artwork'
            : 'Stamp an Emotion';

  const edgeMask = (() => {
    if (mode === 'polaroid') return undefined;
    const leftStop = canScrollLeft ? 'transparent 0px, black 22px' : 'black 0px, black 22px';
    const rightStop = canScrollRight ? 'black calc(100% - 22px), transparent 100%' : 'black calc(100% - 22px), black 100%';
    return `linear-gradient(to right, ${leftStop}, ${rightStop})`;
  })();

  const handleUploadFile = async (file) => {
    if (!file) return;
    let targetFile = file;
    if (await isHeicFile(file)) {
      setIsConverting(true);
      try {
        const { heicTo } = await import('heic-to');
        const convertedBlob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 });
        const cleanName = (file.name || 'photo').replace(/\.[^/.]+$/, '') + '.jpg';
        targetFile = new File([convertedBlob], cleanName, { type: 'image/jpeg' });
        showToast({
          title: 'iPhone photo converted',
          description: 'Optimized HEIC to JPEG for display & sharing',
          duration: 2800,
        });
      } catch {
        showToast({
          title: 'Could not convert HEIC photo',
          description: 'Please upload a standard JPG or PNG.',
          duration: 3500,
        });
        setIsConverting(false);
        return;
      } finally {
        setIsConverting(false);
      }
    }
    targetFile = await optimizeImageForPolaroid(targetFile, 1200);
    const url = URL.createObjectURL(targetFile);
    dispatch({ type: 'SET_BACK_IMAGE', payload: url });
  };

  const handleStickerClick = (sticker) => {
    const existing = sideStickers.filter((s) => s.stickerId === sticker.id);
    if (existing.length > 0) {
      existing.forEach((s) => {
        dispatch({ type: 'REMOVE_STICKER', payload: s.id });
      });
      return;
    }

    setActiveStampTrigger(`sticker-${sticker.id}-${Date.now()}`);
    const offsetIdx = sideStickers.length;
    const staggerX = 64 + ((offsetIdx * 38) % 120);
    const staggerY = 68 + ((offsetIdx * 32) % 110);

    dispatch({
      type: 'ADD_STICKER',
      payload: {
        id: Date.now().toString() + Math.random().toString(),
        stickerId: sticker.id,
        src: sticker.image,
        name: sticker.name,
        side: currentSide,
        x: staggerX,
        y: staggerY,
        r: Math.random() * 20 - 10,
        rotation: Math.random() * 20 - 10,
        scale: 1,
      },
    });
  };

  const renderFrontArtworkStrip = () => {
    const listData = isPokemonMode
      ? POKEMON_CARDS
      : [...FLOWERS].sort((a, b) => a.name.localeCompare(b.name));
    const selectedId = isPokemonMode ? state.selectedPokemon : state.selectedFlower;
    const actionType = isPokemonMode ? 'SET_SELECTED_POKEMON' : 'SET_SELECTED_FLOWER';

    return listData.map((item) => {
      const isSelected = selectedId === item.id;
      const shortName = item.name.length > 10 ? item.name.substring(0, 9) + '...' : item.name;

      return (
        <button
          key={item.id}
          type="button"
          data-active={isSelected}
          onClick={() => dispatch({ type: actionType, payload: item.id })}
          className="relative shrink-0 snap-center flex flex-col items-center cursor-pointer outline-none active:scale-[0.95] transition-transform duration-150 w-[64px] h-[84px] font-sans"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div
            className={cn(
              'absolute top-0 -left-[3px] w-[70px] h-[84px] rounded-[14px] transition-colors duration-200 pointer-events-none',
              isSelected ? 'bg-[#0088FF]' : 'bg-transparent'
            )}
          />
          <div className="relative mt-[3px] w-[64px] h-[62px] rounded-[11px] overflow-hidden bg-[#1A1A1A] z-10 shadow-sm">
            <img
              src={item.thumb || item.image}
              alt={item.name}
              className="w-full h-full object-cover pointer-events-none"
              loading="lazy"
              draggable={false}
            />
          </div>
          <span
            className={cn(
              'relative mt-[3px] text-[11px] leading-[13px] tracking-[-0.01em] truncate w-[64px] text-center z-10 font-sans',
              isSelected ? 'text-white font-medium' : 'text-[rgba(229,229,234,0.75)] font-normal'
            )}
          >
            {shortName}
          </span>
        </button>
      );
    });
  };

  const renderOccasionStrip = () => {
    return OCCASIONS.map((occ) => {
      const isSelected = state.occasion === occ.label;
      return (
        <motion.button
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          key={occ.id}
          type="button"
          data-active={isSelected}
          onClick={() =>
            dispatch({
              type: 'SET_OCCASION',
              payload: isSelected ? '' : occ.label,
            })
          }
          className={cn(
            'inline-flex items-center justify-center gap-1.5 h-[36px] px-3.5 py-1 rounded-full font-sans text-[12.5px] leading-[16px] tracking-[-0.015em] font-medium transition-all duration-150 cursor-pointer outline-none select-none whitespace-nowrap snap-center',
            isSelected
              ? 'bg-[#0088FF] text-white shadow-sm'
              : 'bg-[rgba(114,114,114,0.14)] text-[rgba(229,229,234,0.78)] hover:bg-[rgba(153,153,153,0.22)] hover:text-white'
          )}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <img
            src={`/assets/emojis/${occ.emoji}.png`}
            alt=""
            className="w-[15px] h-[15px] object-contain shrink-0 pointer-events-none"
          />
          <span>{occ.label}</span>
        </motion.button>
      );
    });
  };

  const renderStickersStrip = () => {
    return STICKERS.map((sticker) => {
      const isSelected = selectedStickerIdsSet.has(sticker.id);
      const shortName = sticker.name.length > 10 ? sticker.name.substring(0, 9) + '…' : sticker.name;
      const isThisStickerActive = activeStampTrigger?.startsWith(`sticker-${sticker.id}`);

      return (
        <div key={sticker.id} className="relative shrink-0 snap-center flex justify-center">
          <StampDustParticles triggerKey={isThisStickerActive ? activeStampTrigger : null} color="#0088FF" />
          <button
            type="button"
            data-active={isSelected}
            onClick={() => handleStickerClick(sticker)}
            className="relative flex flex-col items-center cursor-pointer outline-none active:scale-[0.95] transition-transform duration-150 w-[64px] h-[84px] font-sans"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div
              className={cn(
                'absolute top-0 -left-[3px] w-[70px] h-[84px] rounded-[14px] transition-colors duration-200 pointer-events-none',
                isSelected ? 'bg-[#0088FF]' : 'bg-transparent'
              )}
            />
            <motion.div
              animate={isThisStickerActive ? { scale: [1.18, 0.95, 1], rotate: [0, -7, 7, 0] } : {}}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="relative mt-[3px] w-[64px] h-[62px] rounded-[11px] overflow-hidden bg-[#1A1A1A] z-10 flex items-center justify-center p-1.5 shadow-sm"
            >
              <img
                src={sticker.image}
                alt={sticker.name}
                className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                loading="lazy"
                draggable={false}
              />
              {isSelected && (
                <div className="absolute top-1 right-1 z-20 w-[16px] h-[16px] rounded-full bg-[#0088FF] border border-white/80 flex items-center justify-center shadow-sm pointer-events-none">
                  <Check size={10} weight="bold" className="text-white" />
                </div>
              )}
            </motion.div>
            <span
              className={cn(
                'relative mt-[3px] text-[11px] leading-[13px] tracking-[-0.01em] truncate w-[64px] text-center z-10 font-sans',
                isSelected ? 'text-white font-medium' : 'text-[rgba(229,229,234,0.75)] font-normal'
              )}
            >
              {shortName}
            </span>
          </button>
        </div>
      );
    });
  };

  const renderPolaroidStrip = () => {
    const isCustomUploaded = Boolean(
      state.selectedBackImage &&
      state.selectedBackImage !== 'landscape' &&
      state.selectedBackImage !== 'portrait' &&
      state.selectedBackImage !== 'none'
    );
    const selected =
      state.selectedBackImage === 'landscape'
        ? '0'
        : state.selectedBackImage === 'portrait'
          ? '1'
          : state.selectedBackImage === 'none'
            ? 'none'
            : 'uploaded';

    const items = [
      {
        id: 'uploaded',
        label: isConverting ? 'Wait…' : 'Upload',
        isUploadedCustom: isCustomUploaded,
        onClick: () => {
          if (!isConverting) fileInputRef.current?.click();
        },
      },
      {
        id: '0',
        label: 'Default 1',
        image: defaultPolaroid1,
        onClick: () => dispatch({ type: 'SET_BACK_IMAGE', payload: 'landscape' }),
      },
      {
        id: '1',
        label: 'Default 2',
        image: defaultPolaroid2,
        onClick: () => dispatch({ type: 'SET_BACK_IMAGE', payload: 'portrait' }),
      },
      {
        id: 'none',
        label: 'None',
        onClick: () => dispatch({ type: 'SET_BACK_IMAGE', payload: 'none' }),
      },
    ];

    return items.map((item) => {
      const isSelected = selected === item.id;
      return (
        <button
          key={item.id}
          type="button"
          data-active={isSelected}
          onClick={item.onClick}
          className="relative shrink-0 snap-center flex flex-col items-center cursor-pointer outline-none active:scale-[0.95] transition-transform duration-150 w-[64px] h-[84px] font-sans"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div
            className={cn(
              'absolute top-0 -left-[3px] w-[70px] h-[84px] rounded-[14px] transition-colors duration-200 pointer-events-none',
              isSelected ? 'bg-[#0088FF]' : 'bg-transparent'
            )}
          />
          <div className="relative mt-[3px] w-[64px] h-[62px] rounded-[11px] overflow-hidden bg-[#1A1A1A] z-10 flex items-center justify-center">
            {item.id === 'uploaded' ? (
              isConverting ? (
                <CircleNotch className="w-[24px] h-[24px] text-[#0088FF] animate-spin" weight="bold" />
              ) : item.isUploadedCustom ? (
                <img className="size-full object-cover" src={state.selectedBackImage} alt="Uploaded" />
              ) : (
                <UploadSimple className="w-[24px] h-[24px] text-[#F5F5F5]" weight="bold" />
              )
            ) : item.image ? (
              <img className="size-full object-cover" src={item.image} alt={item.label} />
            ) : (
              <Prohibit className="w-[24px] h-[24px] text-[#F5F5F5]" weight="bold" />
            )}
          </div>
          <span
            className={cn(
              'relative mt-[3px] text-[11px] leading-[13px] tracking-[-0.01em] truncate w-[64px] text-center z-10 font-sans',
              isSelected ? 'text-white font-medium' : 'text-[rgba(229,229,234,0.75)] font-normal'
            )}
          >
            {item.label}
          </span>
        </button>
      );
    });
  };

  const renderStampStrip = () => {
    return EMOTE_EMOJIS.map((emote) => {
      const isSelected = state.stampEmoji === emote.id;
      return (
        <button
          key={emote.id}
          type="button"
          data-active={isSelected}
          onClick={() => dispatch({ type: 'SET_STAMP_EMOJI', payload: emote.id })}
          aria-label={`Mood: ${emote.name}`}
          className="relative shrink-0 snap-center flex flex-col items-center justify-center cursor-pointer outline-none active:scale-[0.92] transition-transform duration-150 w-[52px] h-[68px] font-sans"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div
            className={cn(
              'w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-150',
              isSelected
                ? 'bg-[#0088FF] shadow-[0_2px_10px_rgba(0,136,255,0.45)] scale-105'
                : 'bg-white/[0.07] hover:bg-white/[0.12]'
            )}
          >
            <img
              src={emote.src}
              alt={emote.name}
              className="w-[26px] h-[26px] object-contain drop-shadow-sm pointer-events-none"
              draggable={false}
            />
          </div>
          <span
            className={cn(
              'mt-1 text-[10px] leading-[12px] truncate w-[50px] text-center font-sans',
              isSelected ? 'text-white font-medium' : 'text-[rgba(229,229,234,0.68)]'
            )}
          >
            {emote.name}
          </span>
        </button>
      );
    });
  };

  // Side-aware 3-tab configuration with stable slotKeys so the segmented bar morphs smoothly between Front and Back
  const dockSegments = isFlipped
    ? [
        {
          slotKey: 'slot-0',
          value: 'polaroid',
          label: 'Back Cover Artwork',
          iconKey: 'back-polaroid',
          icon: <ImageIcon size={20} weight="regular" />,
        },
        {
          slotKey: 'slot-1',
          value: 'stamp',
          label: 'Stamp an Emotion',
          iconKey: 'back-stamp',
          icon: <Smiley size={20} weight="regular" />,
        },
        {
          slotKey: 'slot-2',
          value: 'stickers',
          label: 'Decorate with Stickers',
          iconKey: 'shared-stickers',
          icon: <Sticker size={20} weight="regular" />,
        },
      ]
    : [
        {
          slotKey: 'slot-0',
          value: 'frontArtwork',
          label: isPokemonMode ? 'Pick Your Pokémon' : 'Pick Your Bloom',
          iconKey: isPokemonMode ? 'front-pokemon' : 'front-bloom',
          icon: isPokemonMode ? <Sparkle size={20} weight="regular" /> : <FlowerLotus size={20} weight="regular" />,
        },
        {
          slotKey: 'slot-1',
          value: 'occasion',
          label: 'What’s the Occasion?',
          iconKey: 'front-occasion',
          icon: <CalendarHeart size={20} weight="regular" />,
        },
        {
          slotKey: 'slot-2',
          value: 'stickers',
          label: 'Decorate with Stickers',
          iconKey: 'shared-stickers',
          icon: <Sticker size={20} weight="regular" />,
        },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.75 }}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-center select-none z-40"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadFile(file);
          e.target.value = '';
        }}
      />

      {/* 1. Floating Window Above the Segmented Control */}
      <div className="w-[calc(100vw-24px)] max-w-[388px] sm:max-w-[436px] rounded-[20px] bg-[#0E0E10]/95 backdrop-blur-2xl border border-white/[0.14] shadow-[0_18px_48px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Clean Window Header Bar */}
        <div className="flex items-center justify-between h-[44px] px-4 bg-[#1F1F1F] border-b border-white/[0.08]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="text-[15px] font-semibold text-white/85 tracking-[-0.02em] font-sans truncate"
            >
              {title}
            </motion.span>
          </AnimatePresence>

          {/* Right Header Context: Sticker count badge + Front/Back quick side toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {mode === 'stickers' && selectedStickerIdsSet.size > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#0088FF]/20 border border-[#0088FF]/40 text-[#4DA8FF] text-[11px] font-medium leading-[14px] select-none font-sans">
                {selectedStickerIdsSet.size} selected
              </span>
            )}
            <div className="flex items-center p-0.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-[11px] font-medium font-sans">
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'front' })}
                className={cn(
                  'px-2.5 py-0.5 rounded-full transition-colors cursor-pointer',
                  currentSide === 'front' ? 'bg-[#0088FF] text-white' : 'text-white/60 hover:text-white'
                )}
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'back' })}
                className={cn(
                  'px-2.5 py-0.5 rounded-full transition-colors cursor-pointer',
                  currentSide === 'back' ? 'bg-[#0088FF] text-white' : 'text-white/60 hover:text-white'
                )}
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Swipe Content Strip */}
        <div className="px-3.5 py-3 bg-[#0B0B0C]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                ref={scrollRef}
                onScroll={updateScrollEdges}
                style={edgeMask ? { maskImage: edgeMask, WebkitMaskImage: edgeMask } : undefined}
                className={cn(
                  'overflow-x-auto no-scrollbar py-0.5',
                  mode === 'occasion'
                    ? 'grid grid-rows-2 grid-flow-col auto-cols-max gap-2 px-1.5 snap-x snap-mandatory'
                    : mode === 'polaroid'
                      ? 'flex flex-row items-center justify-between px-1.5 gap-3 snap-x snap-mandatory'
                      : 'flex flex-row items-center gap-3 px-1.5 snap-x snap-mandatory'
                )}
              >
                {mode === 'frontArtwork' && renderFrontArtworkStrip()}
                {mode === 'occasion' && renderOccasionStrip()}
                {mode === 'stickers' && renderStickersStrip()}
                {mode === 'polaroid' && renderPolaroidStrip()}
                {mode === 'stamp' && renderStampStrip()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Bottom Segmented Control + Circular Red Cross Button */}
      <div className="flex items-center justify-center gap-2.5 mt-2.5">
        <GlassSegmentedControl
          aria-label="Customize card options"
          layoutId="customize-dock-segmented-bg"
          value={mode}
          onValueChange={(nextMode) => onSelectMode?.(nextMode)}
          segments={dockSegments}
        />

        <LiquidGlassIconButton
          size="md"
          label="Close customize menu"
          aria-label="Close customize menu"
          onClick={onClose}
          icon={<X size={20} weight="bold" className="text-[#FF383C]" />}
          className="!w-[52px] !h-[52px]"
        />
      </div>
    </motion.div>
  );
}
