import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadSimple, Prohibit, CircleNotch } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';
import { FLOWERS, POKEMON_CARDS, EMOTE_EMOJIS } from '@/data/cardData';
import { showToast } from '@/components/ui/AppleToast';
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
 * Contextual horizontal swipe carousel (matching Reference Image 4) for Mobile & Tablet (< 1024px).
 * Modes:
 * - 'frontArtwork': Select Flower for the Card / Select Pokémon for the Card
 * - 'polaroid': Select Back Cover Artwork
 * - 'stamp': Stamp an Emotion
 */
export default function MobileQuickPickerPopover({ mode, onClose }) {
  const { state, dispatch } = useCard();
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isConverting, setIsConverting] = useState(false);

  const isPokemonMode = state.cardType === 'pokemon';

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
  }, [mode, state.cardType]);

  if (!mode) return null;

  const title =
    mode === 'frontArtwork'
      ? isPokemonMode
        ? 'Select Pokémon for the Card'
        : 'Select Flower for the Card'
      : mode === 'polaroid'
        ? 'Select Polaroid Photo'
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

  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          key={`quick-picker-${mode}`}
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.75 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[340px] sm:max-w-[380px] rounded-[20px] bg-[#0E0E10]/95 backdrop-blur-2xl border border-white/[0.14] shadow-[0_18px_48px_rgba(0,0,0,0.85)] overflow-hidden select-none z-40"
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

          {/* Header Bar matching Reference Image 4 */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#1C1C1E] border-b border-white/[0.08]">
            <span className="text-[14.5px] font-semibold text-white/90 tracking-[-0.02em] font-sans">
              {title}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close picker"
              className="w-[26px] h-[26px] rounded-full bg-white/10 active:bg-white/20 flex items-center justify-center text-white/80 cursor-pointer transition-colors"
            >
              <X size={14} weight="bold" className="text-[#FF383C]" />
            </button>
          </div>

          {/* Horizontal Swipe Carousel Strip */}
          <div className="px-3 py-2.5 bg-[#0B0B0C]">
            <div
              ref={scrollRef}
              onScroll={updateScrollEdges}
              style={edgeMask ? { maskImage: edgeMask, WebkitMaskImage: edgeMask } : undefined}
              className={cn(
                'flex flex-row items-center overflow-x-auto snap-x snap-mandatory no-scrollbar py-0.5',
                mode === 'polaroid' ? 'justify-between px-1 gap-2' : 'gap-2.5 px-2'
              )}
            >
              {mode === 'frontArtwork' && renderFrontArtworkStrip()}
              {mode === 'polaroid' && renderPolaroidStrip()}
              {mode === 'stamp' && renderStampStrip()}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
