import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowClockwise, ArrowLeft, Sparkle, Camera, Smiley } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';

import { PokemonCardFront, PokemonCardBack } from './PokemonCard';
import { MetallicCardFront, MetallicCardBack } from './MetallicCard';
import { PaperCardBack } from './PaperCard';
import { PaperCardFront } from '@/components/card/modes/PaperCardFront';

import LiquidGlassButton from '@/components/ui/LiquidGlassButton';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import GlassSegmentedControl from '@/components/ui/GlassSegmentedControl';
import VerticalCardSelector from '@/components/ui/VerticalCardSelector';
import MobileQuickPickerPopover from '@/components/MobileQuickPickerPopover';

export default function CardViewer({ onConfirm, onOpenEditTitle, onOpenEditMessage, onOpenCustomize }) {
  const { state, dispatch, flower } = useCard();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [quickPickerMode, setQuickPickerMode] = useState(null);
  // Mouse tracking for Pokemon TCG style tilt in preview
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Magic Spin Decoy State
  const [spinDegrees, setSpinDegrees] = useState(0);
  const [visualCardType, setVisualCardType] = useState(state.cardType);

  useEffect(() => {
    if (state.cardType !== visualCardType) {
      setIsSwapping(true); // Apple Shrink!
      setTimeout(() => {
        setVisualCardType(state.cardType); // Instant swap while tiny
      }, 160);
      setTimeout(() => {
        setIsSwapping(false); // Spring back up!
      }, 270);
    }
  }, [state.cardType, visualCardType]);

  // ESC key to close fullscreen preview
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Device Orientation (Gyroscope / Accelerometer 3D Tilt for Mobile)
  useEffect(() => {
    if (!isFullscreen) return;

    let rafId = null;
    let baseGamma = null;
    let baseBeta = null;
    let lastX = 0;
    let lastY = 0;

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;

      // Calibrate to user's natural holding posture on first sensor reading
      if (baseGamma === null || baseBeta === null) {
        baseGamma = e.gamma;
        baseBeta = e.beta;
      }

      // Sliding-window calibration so reversing tilt direction has zero deadzone
      const maxTiltDeg = 14;
      if (e.gamma - baseGamma > maxTiltDeg) baseGamma = e.gamma - maxTiltDeg;
      if (e.gamma - baseGamma < -maxTiltDeg) baseGamma = e.gamma + maxTiltDeg;
      if (e.beta - baseBeta > maxTiltDeg) baseBeta = e.beta - maxTiltDeg;
      if (e.beta - baseBeta < -maxTiltDeg) baseBeta = e.beta + maxTiltDeg;

      const deltaGamma = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, e.gamma - baseGamma));
      const deltaBeta = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, e.beta - baseBeta));

      const nextX = deltaGamma / maxTiltDeg;
      const nextY = deltaBeta / maxTiltDeg;

      if (Math.abs(nextX - lastX) < 0.002 && Math.abs(nextY - lastY) < 0.002) return;
      lastX = nextX;
      lastY = nextY;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setMousePos({ x: lastX, y: lastY });
        });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isFullscreen]);

  const requestGyroPermission = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
  };

  const handleOpenFullscreen = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(true));
    } else {
      setIsFullscreen(true);
    }
  };

  const isFlipped = state.activeSide === 'back';

  // Option A: Auto-fading contextual micro-hint pills on first view of Front & first flip to Back (Mobile/Tablet only)
  const [showFrontHint, setShowFrontHint] = useState(true);
  const [showBackHint, setShowBackHint] = useState(false);
  const hasShownBackHintRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFrontHint(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  // Smoothly transition Customize Dock tabs when flipping sides & trigger 1-time Back hint
  useEffect(() => {
    setQuickPickerMode((prev) => {
      if (!prev) return null;
      if (isFlipped) {
        if (prev === 'occasion') return 'polaroid';
        if (prev === 'frontArtwork') return 'stamp';
        return prev;
      } else {
        if (prev === 'polaroid') return 'occasion';
        if (prev === 'stamp') return 'frontArtwork';
        return prev;
      }
    });

    // Only show back micro-hints if Customize popover is not currently open
    if (isFlipped && !hasShownBackHintRef.current) {
      hasShownBackHintRef.current = true;
      if (!quickPickerMode) {
        setShowBackHint(true);
        const timer = setTimeout(() => setShowBackHint(false), 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [isFlipped, quickPickerMode]);

  const handleOpenQuickPicker = (mode) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return;
    setShowFrontHint(false);
    setShowBackHint(false);
    setQuickPickerMode((prev) => (prev === mode ? null : mode));
  };

  const handlePreviewMouseMove = (e) => {
    if (!isFullscreen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handlePreviewTouchMove = (e) => {
    if (!isFullscreen || !e.touches || e.touches.length === 0) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(-0.6, Math.min(0.6, (touch.clientX - rect.left) / rect.width - 0.5));
    const y = Math.max(-0.6, Math.min(0.6, (touch.clientY - rect.top) / rect.height - 0.5));
    setMousePos({ x, y });
  };

  const handlePreviewMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const renderFront = (preview = false) => {
    return (
      <div className="w-full h-full relative">
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'pokemon' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'pokemon' ? 'auto' : 'none'
          }}
        >
          <PokemonCardFront 
            onOpenEditTitle={preview ? null : onOpenEditTitle} 
            onOpenQuickPicker={preview ? null : handleOpenQuickPicker}
            isPreview={preview} 
          />
        </div>
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'metallic' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'metallic' ? 'auto' : 'none'
          }}
        >
          <MetallicCardFront 
            onOpenEditTitle={preview ? null : onOpenEditTitle} 
            onOpenQuickPicker={preview ? null : handleOpenQuickPicker}
            isPreview={preview} 
          />
        </div>
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'paper' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'paper' ? 'auto' : 'none'
          }}
        >
          <PaperCardFront 
            state={state} 
            flower={flower} 
            onOpenEditTitle={preview ? null : onOpenEditTitle} 
            onOpenQuickPicker={preview ? null : handleOpenQuickPicker}
            isPreview={preview} 
          />
        </div>
      </div>
    );
  };

  const renderBack = (preview = false) => {
    return (
      <div className="w-full h-full relative">
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'pokemon' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'pokemon' ? 'auto' : 'none'
          }}
        >
          <PokemonCardBack 
            onOpenEditMessage={preview ? null : onOpenEditMessage} 
            onOpenQuickPicker={preview ? null : handleOpenQuickPicker}
            isPreview={preview} 
          />
        </div>
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'metallic' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'metallic' ? 'auto' : 'none'
          }}
        >
          <MetallicCardBack 
            onOpenEditMessage={preview ? null : onOpenEditMessage} 
            onOpenQuickPicker={preview ? null : handleOpenQuickPicker}
            isPreview={preview} 
          />
        </div>
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'paper' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'paper' ? 'auto' : 'none'
          }}
        >
          <PaperCardBack 
            onOpenEditMessage={preview ? null : onOpenEditMessage} 
            onOpenQuickPicker={preview ? null : handleOpenQuickPicker}
            isPreview={preview} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center select-none" role="region" aria-label="Card Studio Viewer">
      {/* 1. Top Switcher: Segmented Control (Glass) */}
      <div className="mt-1.5 mb-2 sm:mt-2.5 sm:mb-2.5 lg:mt-0 lg:mb-1.5 xl:mb-2 flex justify-center relative z-30">
        <GlassSegmentedControl 
          value={state.cardType}
          onValueChange={(val) => dispatch({ type: 'SET_CARD_TYPE', payload: val })}
          segments={[
              {
                value: "pokemon",
                label: "Pokemon Card",
                image: "/assets/ui/segmented-pokemon.svg"
              },
              {
                value: "metallic",
                label: "Metal Card",
                image: "/assets/ui/segmented-metal.svg"
              },
              {
                value: "paper",
                label: "Flower Card",
                image: "/assets/ui/segmented-flower.svg"
              }
            ]}
        />
      </div>

      {/* Main Center Stage */}
      <div className="relative flex items-start justify-center mb-1.5 xl:mb-2 w-[min(300px,80vw,calc((100svh-284px)*688/960))] sm:w-[min(340px,75vw,calc((100svh-264px)*688/960))] lg:w-[min(280px,calc((100dvh-192px)*688/960))] xl:w-[min(360px,calc((100dvh-228px)*688/960))] 2xl:w-[min(380px,calc((100dvh-240px)*688/960))] mx-auto">
        {/* Mobile Ambient Aura Glow behind Card to eliminate empty dead space */}
        <div 
          className="absolute -inset-6 z-0 rounded-[40px] blur-[36px] pointer-events-none opacity-50 flex lg:hidden"
          style={{
            background: "radial-gradient(ellipse at center, rgba(134, 183, 90, 0.45) 0%, rgba(113, 157, 83, 0.22) 45%, rgba(79, 121, 62, 0.08) 75%, transparent 100%)"
          }}
        />

        {/* Mobile/Tablet: Left Vertical Switcher positioned cleanly outside the card boundary so it never collides with stickers or card artwork */}
        {state.cardType === 'pokemon' && (
          <div className="absolute top-1/2 -translate-y-1/2 -left-[54px] z-30 flex lg:hidden shadow-xl">
            <VerticalCardSelector
              value={state.pokemonSubtype === 'trainer' ? 'trainer' : 'base'}
              onValueChange={(val) => {
                dispatch({ type: "SET_POKEMON_SUBTYPE", payload: val });
                dispatch({ type: "SET_ACTIVE_SIDE", payload: "back" });
              }}
              segments={[
                {
                  value: "base",
                  label: "Pokemon Card",
                  image: "/assets/ui/segmented-vertical-pokemon.svg"
                },
                {
                  value: "trainer",
                  label: "Trainer Card",
                  image: "/assets/ui/segmented-vertical-trainer.svg"
                }
              ]}
              className=""
            />
          </div>
        )}

        {/* 2. Left Vertical Switcher (type="pill") - Desktop Only */}
        <div className={`absolute top-1/2 -translate-y-1/2 right-full mr-[10px] xl:mr-[16px] z-20 hidden lg:flex justify-end transition-opacity duration-300 ${state.cardType === 'pokemon' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <VerticalCardSelector
              value={state.pokemonSubtype === 'trainer' ? 'trainer' : 'base'}
              onValueChange={(val) => {
                dispatch({ type: "SET_POKEMON_SUBTYPE", payload: val });
                dispatch({ type: "SET_ACTIVE_SIDE", payload: "back" });
              }}
              segments={[
                {
                  value: "base",
                  label: "Pokemon Card",
                  image: "/assets/ui/segmented-vertical-pokemon.svg"
                },
                {
                  value: "trainer",
                  label: "Trainer Card",
                  image: "/assets/ui/segmented-vertical-trainer.svg"
                }
              ]}
            />
        </div>

        {/* 3. Interactive Card */}
        <div className="perspective-container relative w-full h-full aspect-[688/960]">
          <motion.div 
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d', willChange: 'auto' }}
              animate={{ 
                rotateY: (isFlipped ? 180 : 0) + spinDegrees,
                scale: isSwapping ? 0.88 : 1
              }} 
              initial={false} transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.9 }}
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
            >
              <div className={`absolute inset-0 ${isFlipped ? "pointer-events-none z-0" : "pointer-events-auto z-10"}`} style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: isAnimating ? "rotateY(0deg) translateZ(1px)" : "rotateY(0deg)" }}>
                {renderFront()}
              </div>
              <div className={`absolute inset-0 ${isFlipped ? "pointer-events-auto z-10" : "pointer-events-none z-0"}`} style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: isAnimating ? "rotateY(180deg) translateZ(1px)" : "rotateY(180deg)" }}>
                {renderBack()}
              </div>
            </motion.div>

          {/* Option A: Auto-fading Contextual Micro-Hint Pills (Mobile/Tablet only) */}
          <AnimatePresence>
            {!isFlipped && showFrontHint && !isAnimating && (
              <motion.div
                key="front-tap-hint"
                initial={{ opacity: 0, y: 6, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden pointer-events-none absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 h-[28px] px-3 rounded-full bg-black/75 backdrop-blur-xl border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.65)] inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Sparkle size={14} weight="regular" className="text-white shrink-0" />
                <span className="text-[12px] leading-none font-medium text-white tracking-[-0.01em] font-sans">
                  Tap artwork to swap
                </span>
              </motion.div>
            )}

            {isFlipped && showBackHint && !isAnimating && (
              <motion.div
                key="back-tap-hints"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden pointer-events-none absolute inset-0 z-40"
              >
                {/* Polaroid / Photo Hint Pill - Only show if back cover image is not "none" */}
                {state.selectedBackImage && state.selectedBackImage !== 'none' && (
                  <div className={clsx(
                    "absolute h-[26px] px-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/25 shadow-[0_6px_20px_rgba(0,0,0,0.65)] inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
                    state.cardType === 'pokemon' && state.pokemonSubtype === 'trainer'
                      ? "top-[56%] left-1/2 -translate-x-1/2"
                      : "top-[25%] right-[9%]"
                  )}>
                    <Camera size={13} weight="regular" className="text-white shrink-0" />
                    <span className="text-[11px] leading-none font-medium text-white tracking-[-0.01em] font-sans">
                      Tap photo
                    </span>
                  </div>
                )}

                {/* Stamp Hint Pill */}
                <div className={clsx(
                  "absolute h-[26px] px-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/25 shadow-[0_6px_20px_rgba(0,0,0,0.65)] inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
                  state.cardType === 'pokemon' && state.pokemonSubtype === 'trainer'
                    ? "top-[35%] left-1/2 -translate-x-1/2"
                    : "top-[41%] left-1/2 -translate-x-1/2"
                )}>
                  <Smiley size={13} weight="regular" className="text-white shrink-0" />
                  <span className="text-[11px] leading-none font-medium text-white tracking-[-0.01em] font-sans">
                    Tap stamp
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Right Controls (Floating Action Buttons type="circle") - Desktop Only */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-full ml-[10px] xl:ml-[16px] flex-col items-start gap-[8px] xl:gap-[12px] z-20">
          <LiquidGlassIconButton
            aria-label="Fullscreen Preview"
            onClick={handleOpenFullscreen}
            icon={<Eye weight="regular" />}
          />

          <LiquidGlassIconButton
            aria-label="Flip card"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch({ type: 'TOGGLE_SIDE' }); }}
            icon={<ArrowClockwise weight="regular" />}
          />
        </div>
      </div>

      {/* Mobile/Tablet Bottom Dock: Either Contextual Quick Picker OR Tier 1 & 2 Controls */}
      {quickPickerMode && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          onClick={() => setQuickPickerMode(null)}
          aria-hidden="true"
        />
      )}

      <div className="relative flex flex-col items-center w-full lg:hidden">
        <AnimatePresence>
          {quickPickerMode && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex justify-center z-40">
              <MobileQuickPickerPopover
                mode={quickPickerMode}
                onSelectMode={(nextMode) => setQuickPickerMode(nextMode)}
                onClose={() => setQuickPickerMode(null)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Mobile/Tablet Controls: Tier 1 Actions (Eye, Customize, Flip) */}
        <div className={`flex items-center justify-center gap-2.5 sm:gap-3 mt-1.5 sm:mt-2.5 w-full max-w-[min(300px,80vw,calc((100svh-284px)*688/960))] sm:max-w-[min(340px,75vw,calc((100svh-264px)*688/960))] transition-opacity duration-200 ${quickPickerMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <LiquidGlassIconButton
            label="Fullscreen Preview"
            aria-label="Fullscreen Preview"
            onClick={handleOpenFullscreen}
            icon={<Eye size={20} weight="bold" />}
            size="md"
            className="!w-[44px] !h-[44px]"
          />

          <button
            type="button"
            onClick={() => handleOpenQuickPicker(isFlipped ? 'polaroid' : 'occasion')}
            className="dark-liquid-glass-pill flex-1 h-[44px] px-5 text-[#FFFFFF] hover:text-[#FFFFFF] text-[15px] font-medium tracking-[-0.01em] cursor-pointer shadow-[0_3px_12px_rgba(0,0,0,0.3)] transition-transform active:scale-[0.98] font-sans"
          >
            Customize
          </button>

          <LiquidGlassIconButton
            label="Flip card"
            aria-label="Flip card"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch({ type: 'TOGGLE_SIDE' }); }}
            icon={<ArrowClockwise size={20} weight="bold" />}
            size="md"
            className="!w-[44px] !h-[44px]"
          />
        </div>

        {/* Mobile/Tablet Controls: Tier 2 Action (Confirm CTA) */}
        <div className={`flex items-center justify-center mt-2 sm:mt-2.5 w-full max-w-[min(300px,80vw,calc((100svh-284px)*688/960))] sm:max-w-[min(340px,75vw,calc((100svh-264px)*688/960))] transition-opacity duration-200 ${quickPickerMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <LiquidGlassButton
            variant="primary"
            size="md"
            className="w-full !h-[48px] !text-[16px] font-medium tracking-[-0.01em] shadow-[0_4px_16px_rgba(0,136,255,0.3)] font-sans"
            onClick={onConfirm}
          >
            Confirm
          </LiquidGlassButton>
        </div>
      </div>

      {/* Desktop 'Confirm' Button Component */}
      <div className="hidden lg:flex items-center justify-center mt-1 xl:mt-1.5 relative">
        <LiquidGlassButton variant="primary" size="lg" className="h-[42px] xl:h-[48px] px-5 xl:px-6 text-[15px] xl:text-[17px]" onClick={onConfirm}>
          Confirm
        </LiquidGlassButton>
      </div>

      {/* Fullscreen Overlay with Pokemon TCG style interactive 3D scaling */}
      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center cursor-pointer overflow-hidden select-none" 
          onClick={() => setIsFullscreen(false)}
          onMouseMove={handlePreviewMouseMove}
          onMouseLeave={handlePreviewMouseLeave}
          onTouchMove={handlePreviewTouchMove}
        >
          {/* Card & Closer Flanking Controls Container */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Card Row (with desktop flanking controls) */}
            <div className="relative flex items-center justify-center">
            {/* Desktop Back Button (Left - anchored closer to card) */}
            <div 
              className="hidden lg:flex absolute right-full mr-5 xl:mr-8 top-1/2 -translate-y-1/2 z-50 items-center justify-center" 
              onClick={e => e.stopPropagation()}
            >
              <LiquidGlassIconButton
                aria-label="Exit Preview"
                onClick={() => setIsFullscreen(false)}
                icon={<ArrowLeft weight="regular" className="text-[#FF383C]" />}
              />
            </div>

            {/* Card (Slightly larger, dynamic viewport safe) */}
            <div 
              className="perspective-container relative w-[min(300px,80vw,calc((100svh-130px)*688/960))] sm:w-[min(340px,75vw,calc((100dvh-110px)*688/960))] lg:w-[min(340px,calc((100dvh-110px)*688/960))] xl:w-[min(380px,calc((100dvh-120px)*688/960))] 2xl:w-[min(405px,calc((100dvh-130px)*688/960))] aspect-[688/960] touch-none" 
              style={{ perspective: '1200px' }}
              onClick={e => e.stopPropagation()}
              onTouchMove={handlePreviewTouchMove}
            >
              <motion.div 
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d', willChange: 'auto' }}
                  animate={{ 
                      rotateY: (isFlipped ? 180 : 0) + (mousePos.x * 28) + spinDegrees, // Tilt horizontally based on gyro/mouse
                      rotateX: -(mousePos.y * 28), // Tilt vertically based on gyro/mouse
                      scale: isSwapping ? 0.98 : 1.02, // Apple bounce
                      y: 0
                    }} 
                  initial={{ scale: 1, rotateY: isFlipped ? 180 : 0, rotateX: 0, y: 0 }} 
                  transition={{
                    rotateY: { type: "spring", stiffness: 650, damping: 22, mass: 0.42 },
                    rotateX: { type: "spring", stiffness: 650, damping: 22, mass: 0.42 },
                    scale: { type: "spring", stiffness: 320, damping: 26, mass: 0.9 }
                  }}
                  onAnimationStart={() => setIsAnimating(true)}
                  onAnimationComplete={() => setIsAnimating(false)}
                >
                  {/* Dynamic Lighting Glare matching the tilt (Pokemon TCG effect) */}
                  <div 
                    className="absolute inset-0 z-50 pointer-events-none rounded-[12px] mix-blend-overlay opacity-50"
                    style={{
                      background: `radial-gradient(circle at ${mousePos.x * 100 + 50}% ${mousePos.y * 100 + 50}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
                      transform: 'translateZ(2px)' // Keep glare slightly above card surface
                    }}
                  />

                  <div className={`absolute inset-0 ${isFlipped ? "pointer-events-none z-0" : "pointer-events-auto z-10"}`} style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: isAnimating ? "rotateY(0deg) translateZ(1px)" : "rotateY(0deg)" }}>{renderFront(true)}</div>
                  <div className={`absolute inset-0 ${isFlipped ? "pointer-events-auto z-10" : "pointer-events-none z-0"}`} style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: isAnimating ? "rotateY(180deg) translateZ(1px)" : "rotateY(180deg)" }}>{renderBack(true)}</div>
                </motion.div>
            </div>

            {/* Desktop Flip Button (Right - anchored closer to card) */}
            <div 
              className="hidden lg:flex absolute left-full ml-5 xl:ml-8 top-1/2 -translate-y-1/2 z-50 items-center justify-center" 
              onClick={e => e.stopPropagation()}
            >
              <LiquidGlassIconButton
                aria-label="Flip card"
                onClick={() => {
                  setMousePos({ x: 0, y: 0 });
                  dispatch({ type: 'TOGGLE_SIDE' });
                }}
                icon={<ArrowClockwise weight="regular" />}
              />
            </div>
            </div>

            {/* Mobile Controls: Same level DIRECTLY beneath card (Back on Left, Flip in Center) */}
            <div 
              className="flex lg:hidden relative w-full max-w-[min(300px,80vw,calc((100svh-248px)*688/960))] sm:max-w-[min(340px,75vw,calc((100svh-248px)*688/960))] mt-4 sm:mt-5 h-[44px] items-center z-50 select-none"
              onClick={e => e.stopPropagation()}
            >
              {/* Back Button (Red Arrow, Left-aligned to Card) */}
              <div className="absolute left-0 top-0">
                <LiquidGlassIconButton
                  size="md"
                  aria-label="Exit Preview"
                  onClick={() => setIsFullscreen(false)}
                  icon={<ArrowLeft size={20} weight="bold" className="text-[#FF383C]" />}
                  className="!w-[44px] !h-[44px] shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Flip Button (White Icon, Dead Center beneath Card) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0">
                <LiquidGlassIconButton
                  size="md"
                  aria-label="Flip card"
                  onClick={() => {
                    setMousePos({ x: 0, y: 0 });
                    dispatch({ type: 'TOGGLE_SIDE' });
                  }}
                  icon={<ArrowClockwise size={20} weight="bold" className="text-white" />}
                  className="!w-[44px] !h-[44px] shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>


        </div>,
        document.body
      )}
    </div>
  );
}
