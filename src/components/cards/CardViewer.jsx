import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Eye, ArrowClockwise, ArrowLeft } from '@phosphor-icons/react';
import clsx from 'clsx';
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

  const handlePreviewMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    // Normalized coordinates from -1 to 1
    const x = (e.clientX / innerWidth) * 2 - 1;
    const y = (e.clientY / innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const handlePreviewMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const isFlipped = state.activeSide === 'back';

  // Front Rendering depending on cardType
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
          <PaperCardFront onOpenEditTitle={preview ? null : onOpenEditTitle} isPreview={preview} />
        </div>
      </div>
    );
  };

  // Back Rendering depending on cardType
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
    <div className="flex flex-col items-center select-none w-full" role="region" aria-label="Card Studio Viewer">
      {/* 1. Top Switcher: Segmented Control (Glass) */}
      <div className="mb-2 xl:mb-2.5 flex justify-center relative z-30">
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
      <div className="relative flex items-start justify-center mb-1.5 xl:mb-2 w-[min(280px,calc((100dvh-200px)*688/960))] sm:w-[min(310px,calc((100dvh-200px)*688/960))] xl:w-[min(360px,calc((100dvh-228px)*688/960))] 2xl:w-[min(380px,calc((100dvh-240px)*688/960))] mx-auto">
        {/* 2. Left Vertical Switcher (Desktop only) */}
        <div className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 right-full mr-[10px] xl:mr-[16px] z-20 justify-end transition-opacity duration-300 ${state.cardType === 'pokemon' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
            initial={false} 
            transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.9 }}
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

        {/* 4. Right Controls (Desktop only) */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-full ml-[10px] xl:ml-[16px] flex-col items-start gap-[8px] xl:gap-[12px] z-20">
          <LiquidGlassIconButton
            aria-label="Fullscreen Preview"
            onClick={() => setIsFullscreen(true)}
            icon={<Eye weight="regular" />}
          />

          <LiquidGlassIconButton
            aria-label="Flip card"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch({ type: 'TOGGLE_SIDE' }); }}
            icon={<ArrowClockwise weight="regular" />}
          />
        </div>
      </div>

      {/* 5. Desktop 'Confirm' Button */}
      <div className="hidden lg:flex items-center justify-center mt-1 xl:mt-1.5 relative">
        <LiquidGlassButton variant="primary" size="lg" className="h-[42px] xl:h-[48px] px-5 xl:px-6 text-[15px] xl:text-[17px]" onClick={onConfirm}>
          Confirm
        </LiquidGlassButton>
      </div>

      {/* 6. Mobile Actions Bar (< 1024px) matching Screen 1 from Figma */}
      <div className="flex lg:hidden flex-col items-center w-full max-w-[340px] mt-2 px-2 z-20">
        {/* Mobile Sub-selector (Base vs Trainer for Pokemon) */}
        {state.cardType === 'pokemon' && (
          <div className="flex items-center justify-center gap-1.5 mb-2.5 bg-black/50 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "SET_POKEMON_SUBTYPE", payload: "base" });
                dispatch({ type: "SET_ACTIVE_SIDE", payload: "back" });
              }}
              className={clsx(
                "px-3 py-1 rounded-full text-[11px] font-medium transition-all outline-none",
                state.pokemonSubtype !== 'trainer' ? "bg-white/20 text-white shadow-sm" : "text-white/50 hover:text-white/80"
              )}
            >
              Base Card
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "SET_POKEMON_SUBTYPE", payload: "trainer" });
                dispatch({ type: "SET_ACTIVE_SIDE", payload: "back" });
              }}
              className={clsx(
                "px-3 py-1 rounded-full text-[11px] font-medium transition-all outline-none",
                state.pokemonSubtype === 'trainer' ? "bg-white/20 text-white shadow-sm" : "text-white/50 hover:text-white/80"
              )}
            >
              Trainer Card
            </button>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between w-full gap-2.5">
          {/* Left Action Buttons: Preview & Flip */}
          <div className="flex items-center gap-2">
            <LiquidGlassIconButton
              aria-label="Fullscreen Preview"
              onClick={() => setIsFullscreen(true)}
              icon={<Eye weight="regular" />}
            />
            <LiquidGlassIconButton
              aria-label="Flip card"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch({ type: 'TOGGLE_SIDE' }); }}
              icon={<ArrowClockwise weight="regular" />}
            />
          </div>

          {/* Right Action Buttons: Customize & Confirm */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={onOpenCustomize}
              className="flex items-center justify-center px-4 h-[40px] rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 text-[13.5px] font-medium text-white border border-white/12 transition-all outline-none shadow-sm backdrop-blur-md"
            >
              Customize
            </button>

            <LiquidGlassButton variant="primary" size="md" className="h-[40px] px-5 text-[14px] font-medium" onClick={onConfirm}>
              Confirm
            </LiquidGlassButton>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay with Pokemon TCG style interactive 3D scaling */}
      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center cursor-pointer overflow-hidden select-none" 
          onClick={() => setIsFullscreen(false)}
          onMouseMove={handlePreviewMouseMove}
          onMouseLeave={handlePreviewMouseLeave}
        >
          {/* Card & Closer Flanking Controls Container */}
          <div className="relative flex items-center justify-center">
            {/* Back Button (Left - anchored closer to card) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-full mr-5 z-20">
              <LiquidGlassIconButton
                aria-label="Exit Fullscreen Preview"
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                icon={<ArrowLeft weight="bold" />}
              />
            </div>

            {/* Enlarged 3D Card Stage with Dynamic Depth & Tilt */}
            <div 
              className="perspective-container relative w-[320px] sm:w-[420px] md:w-[480px] lg:w-[500px] aspect-[688/960]"
              onClick={(e) => e.stopPropagation()} 
            >
              <motion.div 
                className="w-full h-full relative"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: `perspective(1000px) rotateX(${mousePos.y * -14}deg) rotateY(${mousePos.x * 14 + (isFlipped ? 180 : 0) + spinDegrees}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
                animate={{ 
                  scale: isSwapping ? 0.88 : 1
                }} 
                initial={false} 
                transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.9 }}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                <div 
                  className={`absolute inset-0 ${isFlipped ? "pointer-events-none z-0" : "pointer-events-auto z-10"}`} 
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  {renderFront(true)}
                </div>
                <div 
                  className={`absolute inset-0 ${isFlipped ? "pointer-events-auto z-10" : "pointer-events-none z-0"}`} 
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  {renderBack(true)}
                </div>
              </motion.div>
            </div>

            {/* Flip Button (Right - anchored closer to card) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-5 z-20">
              <LiquidGlassIconButton
                aria-label="Flip card in fullscreen"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  dispatch({ type: 'TOGGLE_SIDE' }); 
                }}
                icon={<ArrowClockwise weight="regular" />}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
