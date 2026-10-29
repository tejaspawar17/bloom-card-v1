import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Eye, ArrowClockwise, ArrowLeft } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';

import { PokemonCardFront, PokemonCardBack } from './PokemonCard';
import { MetallicCardFront, MetallicCardBack } from './MetallicCard';
import { PaperCardBack } from './PaperCard';
import { PaperCardFront } from '@/components/card/modes/PaperCardFront';

import LiquidGlassButton from '@/components/ui/LiquidGlassButton';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import GlassSegmentedControl from '@/components/ui/GlassSegmentedControl';
import VerticalCardSelector from '@/components/ui/VerticalCardSelector';

export default function CardViewer({ onConfirm, onOpenEditTitle, onOpenEditMessage, onOpenCustomize }) {
  const { state, dispatch, flower } = useCard();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
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

    let animId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma: left-to-right tilt [-30deg, 30deg]
      const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
      // beta: front-to-back tilt centered at natural 45deg holding angle
      const clampedBeta = Math.max(-30, Math.min(30, e.beta - 45));

      targetX = (clampedGamma / 30) * 0.75;
      targetY = (clampedBeta / 30) * 0.75;
    };

    const smoothLoop = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      setMousePos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(smoothLoop);
    };

    animId = requestAnimationFrame(smoothLoop);
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isFullscreen]);

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
          <PokemonCardFront onOpenEditTitle={preview ? null : onOpenEditTitle} isPreview={preview} />
        </div>
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'metallic' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'metallic' ? 'auto' : 'none'
          }}
        >
          <MetallicCardFront onOpenEditTitle={preview ? null : onOpenEditTitle} isPreview={preview} />
        </div>
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'paper' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'paper' ? 'auto' : 'none'
          }}
        >
          <PaperCardFront state={state} flower={flower} onOpenEditTitle={preview ? null : onOpenEditTitle} isPreview={preview} />
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
          <PokemonCardBack onOpenEditMessage={preview ? null : onOpenEditMessage} isPreview={preview} />
        </div>
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'metallic' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'metallic' ? 'auto' : 'none'
          }}
        >
          <MetallicCardBack onOpenEditMessage={preview ? null : onOpenEditMessage} isPreview={preview} />
        </div>
        <div 
          className="absolute inset-0"
          style={{ 
            visibility: visualCardType === 'paper' ? 'visible' : 'hidden',
            pointerEvents: visualCardType === 'paper' ? 'auto' : 'none'
          }}
        >
          <PaperCardBack onOpenEditMessage={preview ? null : onOpenEditMessage} isPreview={preview} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center select-none" role="region" aria-label="Card Studio Viewer">
      {/* 1. Top Switcher: Segmented Control (Glass) */}
      <div className="mt-3.5 mb-2.5 sm:mt-2.5 sm:mb-2.5 lg:mt-0 lg:mb-1.5 xl:mb-2 flex justify-center relative z-30">
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
      <div className="relative flex items-start justify-center mb-1.5 xl:mb-2 w-[min(300px,80vw,calc((100svh-248px)*688/960))] sm:w-[min(340px,75vw,calc((100svh-248px)*688/960))] lg:w-[min(280px,calc((100dvh-192px)*688/960))] xl:w-[min(360px,calc((100dvh-228px)*688/960))] 2xl:w-[min(380px,calc((100dvh-240px)*688/960))] mx-auto">
        {/* Mobile Ambient Aura Glow behind Card to eliminate empty dead space */}
        <div 
          className="absolute -inset-6 z-0 rounded-[40px] blur-[36px] pointer-events-none opacity-50 flex lg:hidden"
          style={{
            background: "radial-gradient(ellipse at center, rgba(134, 183, 90, 0.45) 0%, rgba(113, 157, 83, 0.22) 45%, rgba(79, 121, 62, 0.08) 75%, transparent 100%)"
          }}
        />

        {/* Mobile/Tablet: Left Vertical Switcher overlay (Centered vertically on card's left margin) */}
        {state.cardType === 'pokemon' && (
          <div className="absolute top-1/2 -translate-y-1/2 left-2.5 z-30 flex lg:hidden shadow-xl">
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

      {/* Mobile/Tablet Controls: Tier 1 Actions (Eye, Customize, Flip) */}
      <div className="flex lg:hidden items-center justify-center gap-3 mt-2.5 sm:mt-3 w-full max-w-[min(300px,80vw,calc((100svh-248px)*688/960))] sm:max-w-[min(340px,75vw,calc((100svh-248px)*688/960))]">
        <LiquidGlassIconButton
          aria-label="Fullscreen Preview"
          onClick={handleOpenFullscreen}
          icon={<Eye size={26} weight="bold" />}
          size="lg"
          className="!w-[52px] !h-[52px]"
        />

        <button
          type="button"
          onClick={onOpenCustomize}
          className="dark-liquid-glass-pill flex-1 h-[52px] px-6 text-[#FFFFFF] hover:text-[#FFFFFF] text-[17px] font-semibold cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-transform active:scale-[0.98]"
        >
          Customize
        </button>

        <LiquidGlassIconButton
          aria-label="Flip card"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch({ type: 'TOGGLE_SIDE' }); }}
          icon={<ArrowClockwise size={26} weight="bold" />}
          size="lg"
          className="!w-[52px] !h-[52px]"
        />
      </div>

      {/* Mobile/Tablet Controls: Tier 2 Action (Confirm CTA) */}
      <div className="flex lg:hidden items-center justify-center mt-2.5 w-full max-w-[min(300px,80vw,calc((100svh-248px)*688/960))] sm:max-w-[min(340px,75vw,calc((100svh-248px)*688/960))]">
        <LiquidGlassButton
          variant="primary"
          size="lg"
          className="w-full h-[52px] text-[17px] font-semibold shadow-[0_4px_20px_rgba(0,136,255,0.35)]"
          onClick={onConfirm}
        >
          Confirm
        </LiquidGlassButton>
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
                      rotateY: (isFlipped ? 180 : 0) + (mousePos.x * 25) + spinDegrees, // Tilt horizontally based on mouse
                      rotateX: -(mousePos.y * 25), // Tilt vertically based on mouse
                      scale: isSwapping ? 0.98 : 1.02, // Apple bounce
                      y: 0
                    }} 
                  initial={{ scale: 1, rotateY: isFlipped ? 180 : 0, rotateX: 0, y: 0 }} 
                  transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.9 }}
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
              className="flex lg:hidden relative w-full max-w-[min(300px,80vw,calc((100svh-248px)*688/960))] sm:max-w-[min(340px,75vw,calc((100svh-248px)*688/960))] mt-5 h-[52px] items-center z-50 select-none"
              onClick={e => e.stopPropagation()}
            >
              {/* Back Button (Red Arrow, Left-aligned to Card) */}
              <div className="absolute left-0 top-0">
                <LiquidGlassIconButton
                  size="lg"
                  aria-label="Exit Preview"
                  onClick={() => setIsFullscreen(false)}
                  icon={<ArrowLeft size={24} weight="bold" className="text-[#FF383C]" />}
                  className="!w-[52px] !h-[52px] shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Flip Button (White Icon, Dead Center beneath Card) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0">
                <LiquidGlassIconButton
                  size="lg"
                  aria-label="Flip card"
                  onClick={() => {
                    setMousePos({ x: 0, y: 0 });
                    dispatch({ type: 'TOGGLE_SIDE' });
                  }}
                  icon={<ArrowClockwise size={24} weight="bold" className="text-white" />}
                  className="!w-[52px] !h-[52px] shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
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
