import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowClockwise } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';

import { PokemonCardFront, PokemonCardBack } from './PokemonCard';
import { MetallicCardFront, MetallicCardBack } from './MetallicCard';
import { PaperCardBack } from './PaperCard';
import { PaperCardFront } from '@/components/card/modes/PaperCardFront';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import ShaderButton from '@/components/ui/ShaderButton';
import AnimatedAILoaderFX from '@/components/ui/AnimatedAILoaderFX';

const SHOWER_PARTICLES = [
  // Top sector
  { id: 1, x: -35, y: -270, rotate: -25, size: 34, delay: 0 },
  { id: 2, x: 50, y: -245, rotate: 20, size: 22, delay: 0.03 },
  { id: 3, x: 0, y: -185, rotate: -10, size: 16, delay: 0.05 },
  // Top-Right sector
  { id: 4, x: 200, y: -210, rotate: 35, size: 32, delay: 0.02 },
  { id: 5, x: 240, y: -135, rotate: -20, size: 24, delay: 0.04 },
  { id: 6, x: 160, y: -105, rotate: 15, size: 16, delay: 0.06 },
  // Right sector
  { id: 7, x: 260, y: 15, rotate: 40, size: 34, delay: 0.01 },
  { id: 8, x: 220, y: 95, rotate: -30, size: 22, delay: 0.03 },
  // Bottom-Right sector
  { id: 9, x: 195, y: 220, rotate: 25, size: 28, delay: 0.04 },
  { id: 10, x: 140, y: 165, rotate: -15, size: 16, delay: 0.07 },
  // Bottom sector
  { id: 11, x: 15, y: 275, rotate: -35, size: 34, delay: 0.02 },
  { id: 12, x: -55, y: 240, rotate: 15, size: 22, delay: 0.05 },
  // Bottom-Left sector
  { id: 13, x: -200, y: 210, rotate: -25, size: 30, delay: 0.03 },
  { id: 14, x: -145, y: 155, rotate: 30, size: 16, delay: 0.06 },
  // Left sector
  { id: 15, x: -260, y: -10, rotate: -40, size: 32, delay: 0.01 },
  // Top-Left sector
  { id: 16, x: -205, y: -200, rotate: 30, size: 26, delay: 0.04 },
];

export default function CardRevealPreview({ onCraftOwn }) {
  const { state, flower } = useCard();
  const [revealStage, setRevealStage] = useState('idle'); // 'idle' | 'charging' | 'slamming' | 'revealed'
  const [isShockwave, setIsShockwave] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isHeroSeal, setIsHeroSeal] = useState(false);
  const [isShower, setIsShower] = useState(false);
  const isRevealed = revealStage === 'revealed';
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const stampSrc = state.stampEmoji 
    ? `/assets/emojis/${state.stampEmoji}.png`
    : '/assets/emojis/pleading-face.png';

  const handleReveal = () => {
    if (revealStage !== 'idle') return;
    setRevealStage('charging');

    // Phase 1: Tension Shake & Charging (650ms)
    setTimeout(() => {
      setRevealStage('slamming');
      setIsFlashing(true);
      // Step A: Hero Wax Seal pops in sharp 4K focus front-and-center
      setIsHeroSeal(true);

      // Light flash dissipates in 380ms
      setTimeout(() => setIsFlashing(false), 380);

      // Step B: At 270ms, Hero Seal shatters into organic floating shower
      setTimeout(() => {
        setIsHeroSeal(false);
        setIsShower(true);
        setTimeout(() => setIsShower(false), 1400);
      }, 270);

      // Step C: At 320ms, card slams down and shockwave ring fires
      setTimeout(() => {
        setIsShockwave(true);
        setTimeout(() => setIsShockwave(false), 600);
      }, 320);

      // Enter interactive revealed state
      setTimeout(() => {
        setRevealStage('revealed');
      }, 700);
    }, 650);
  };

  const handleReplay = () => {
    setIsFlipped(false);
    setIsShockwave(false);
    setIsFlashing(false);
    setIsHeroSeal(false);
    setIsShower(false);
    setMousePos({ x: 0, y: 0 });
    setRevealStage('idle');
  };

  const handleToggleFlip = () => {
    setMousePos({ x: 0, y: 0 });
    setIsFlipped(prev => !prev);
  };

  const handleMouseMove = (e) => {
    if (!isRevealed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Keyboard shortcut: Spacebar / Enter triggers reveal or flip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (!isRevealed) {
          handleReveal();
        } else {
          handleToggleFlip();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, isFlipped]);

  const renderMysteryPackCover = () => (
    <div 
      className={`w-full h-full relative overflow-hidden flex flex-col items-center justify-between p-6 select-none ${
        state.cardType === 'paper' ? 'rounded-none' : 'rounded-[16px]'
      }`}
      style={{
        background: 'radial-gradient(140% 125% at 50% 12%, #0e110f 0%, #070908 45%, #030403 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.14), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.95), inset 0 0 80px rgba(0, 0, 0, 0.9), 0 20px 48px rgba(0, 0, 0, 0.85)',
      }}
    >
      {/* Ultra-Fine Isotropic Micro-Grain Texture (Sandblasted Matte / Archival Cardstock feel - zero streaks) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.09] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fineGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fineGrain)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Diffuse Satin Light Glaze (Soft light absorption, zero fake gloss) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 30%, transparent 60%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Outer Blind-Debossed Tactile Frame */}
      <div 
        className="absolute inset-3 border border-white/[0.07] pointer-events-none rounded-[10px]"
        style={{
          boxShadow: 'inset 0 1px 1.5px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      />

      {/* Inner Fine Hairline Frame */}
      <div className="absolute inset-4.5 border border-white/[0.03] pointer-events-none rounded-[8px]" />

      {/* Top Header: Blind-Debossed Hot-Foil Stamp */}
      <div className="relative z-10 flex flex-col items-center pt-2">
        <span 
          className="font-serif italic text-[35px] leading-none text-[#eceee9] tracking-[-0.04em] select-none"
          style={{
            textShadow: '0 -1px 1px rgba(0, 0, 0, 0.95), 0 1.5px 1.5px rgba(255, 255, 255, 0.20), 0 3px 6px rgba(0, 0, 0, 0.7)',
          }}
        >
          Bloom
        </span>
        <span 
          className="font-sans font-semibold text-[9.5px] uppercase tracking-[0.28em] text-[#8e948c] leading-none mt-2 select-none"
          style={{
            textShadow: '0 -1px 0.5px rgba(0, 0, 0, 0.9), 0 1px 0.5px rgba(255, 255, 255, 0.12)',
          }}
        >
          Special Edition
        </span>
      </div>

      {/* Center Radiant AnimatedAILoaderFX Orb + ShaderButton ("Reveal") */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto">
        <AnimatedAILoaderFX 
          size={210} 
          animationDuration={revealStage === 'charging' ? 1.2 : 6.5}
        >
          <ShaderButton
            type="button"
            showArrow={false}
            size="md"
            className="shadow-[0_12px_28px_rgba(0,0,0,0.6)] active:scale-95 transition-transform font-medium tracking-tight z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleReveal();
            }}
          >
            {revealStage === 'charging' ? 'Opening...' : 'Reveal'}
          </ShaderButton>
        </AnimatedAILoaderFX>
      </div>

      {/* Bottom Debossed Limited Edition Stamp */}
      <div className="relative z-10 flex flex-col items-center pb-2">
        <div 
          className="w-10 h-[1px] bg-white/10 mb-2.5" 
          style={{
            boxShadow: '0 1px 0 rgba(255, 255, 255, 0.05), 0 -1px 0 rgba(0, 0, 0, 0.6)',
          }}
        />
        <span 
          className="font-sans text-[10px] font-semibold tracking-[0.26em] text-[#8e948c] uppercase select-none"
          style={{
            textShadow: '0 -1px 0.5px rgba(0, 0, 0, 0.9), 0 1px 0.5px rgba(255, 255, 255, 0.12)',
          }}
        >
          № 001 // SECURE REVEAL
        </span>
      </div>
    </div>
  );

  const renderFront = () => (
    <div className="w-full h-full relative">
      <div 
        className="absolute inset-0"
        style={{ 
          visibility: state.cardType === 'pokemon' ? 'visible' : 'hidden',
          pointerEvents: state.cardType === 'pokemon' ? 'auto' : 'none'
        }}
      >
        <PokemonCardFront onOpenEditTitle={null} isPreview={true} />
      </div>
      <div 
        className="absolute inset-0"
        style={{ 
          visibility: state.cardType === 'metallic' ? 'visible' : 'hidden',
          pointerEvents: state.cardType === 'metallic' ? 'auto' : 'none'
        }}
      >
        <MetallicCardFront onOpenEditTitle={null} isPreview={true} />
      </div>
      <div 
        className="absolute inset-0"
        style={{ 
          visibility: state.cardType === 'paper' ? 'visible' : 'hidden',
          pointerEvents: state.cardType === 'paper' ? 'auto' : 'none'
        }}
      >
        <PaperCardFront state={state} flower={flower} onOpenEditTitle={null} isPreview={true} />
      </div>
    </div>
  );

  const renderBack = () => (
    <div className="w-full h-full relative">
      <div 
        className="absolute inset-0"
        style={{ 
          visibility: state.cardType === 'pokemon' ? 'visible' : 'hidden',
          pointerEvents: state.cardType === 'pokemon' ? 'auto' : 'none'
        }}
      >
        <PokemonCardBack onOpenEditMessage={null} isPreview={true} />
      </div>
      <div 
        className="absolute inset-0"
        style={{ 
          visibility: state.cardType === 'metallic' ? 'visible' : 'hidden',
          pointerEvents: state.cardType === 'metallic' ? 'auto' : 'none'
        }}
      >
        <MetallicCardBack onOpenEditMessage={null} isPreview={true} />
      </div>
      <div 
        className="absolute inset-0"
        style={{ 
          visibility: state.cardType === 'paper' ? 'visible' : 'hidden',
          pointerEvents: state.cardType === 'paper' ? 'auto' : 'none'
        }}
      >
        <PaperCardBack onOpenEditMessage={null} isPreview={true} />
      </div>
    </div>
  );

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center select-none py-2 sm:py-3 z-10 relative">
      {/* 3D Card Stage */}
      <div 
        className="relative flex flex-col items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Stage Wrapper (holds card, shockwave, and side dock) */}
        <div className="relative">
          {/* Landing Shockwave Ring (Behind card, triggers on slam) */}
          <AnimatePresence>
            {isShockwave && (
              <motion.div
                key="shockwave"
                initial={{ scale: 0.95, opacity: 0.9 }}
                animate={{ scale: 1.65, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className={`absolute inset-0 z-0 pointer-events-none border-2 border-white/60 ${
                  state.cardType === 'paper' ? 'rounded-none' : 'rounded-[20px]'
                }`}
                style={{
                  boxShadow: '0 0 50px rgba(124, 224, 220, 0.75), inset 0 0 25px rgba(124, 224, 220, 0.4)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Solution 2 Step A: Hero Wax Stamp Seal Pop (Focal point front & center: 0ms to 270ms) */}
          <AnimatePresence>
            {isHeroSeal && (
              <motion.div
                key="hero-seal"
                initial={{ scale: 0.15, opacity: 0, rotate: -15 }}
                animate={{ scale: [0.15, 1.15, 1.0], opacity: 1, rotate: 0 }}
                exit={{ scale: 1.45, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
              >
                <div className="relative w-[96px] h-[96px] flex items-center justify-center filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)] drop-shadow-[0_0_24px_rgba(11,101,255,0.65)]">
                  {/* Royal Blue 16-Point Postal Starburst Stamp */}
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-full h-full overflow-visible pointer-events-none"
                  >
                    <polygon 
                      points="50.0,0.5 57.7,11.3 68.9,4.3 71.9,17.2 85.0,15.0 82.8,28.1 95.7,31.1 88.7,42.3 99.5,50.0 88.7,57.7 95.7,68.9 82.8,71.9 85.0,85.0 71.9,82.8 68.9,95.7 57.7,88.7 50.0,99.5 42.3,88.7 31.1,95.7 28.1,82.8 15.0,85.0 17.2,71.9 4.3,68.9 11.3,57.7 0.5,50.0 11.3,42.3 4.3,31.1 17.2,28.1 15.0,15.0 28.1,17.2 31.1,4.3 42.3,11.3" 
                      fill="#0B65FF"
                      stroke="#5C9DFF"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* Big Hero 3D Emoji in Sharp 4K focus */}
                  <img 
                    src={stampSrc} 
                    alt="hero stamp" 
                    className="absolute w-14 h-14 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none"
                    draggable={false}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Solution 2 Step B: The Shatter Shower (16 floaty organic stamp emojis drifting outward) */}
          <AnimatePresence>
            {isShower && (
              <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                {SHOWER_PARTICLES.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
                    animate={{ 
                      x: p.x, 
                      y: p.y, 
                      scale: [0.2, 1.2, 0.7], 
                      opacity: [1, 1, 0.85, 0],
                      rotate: p.rotate 
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 1.35, 
                      ease: [0.16, 1, 0.3, 1], 
                      delay: p.delay,
                      times: [0, 0.25, 0.75, 1]
                    }}
                    style={{ width: `${p.size}px`, height: `${p.size}px` }}
                    className="absolute flex items-center justify-center pointer-events-none"
                  >
                    <img 
                      src={stampSrc} 
                      alt="seal petal" 
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                      draggable={false}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Light Flare (In front of card during mid-air 3D spin) */}
          <AnimatePresence>
            {isFlashing && (
              <motion.div
                key="flash"
                initial={{ opacity: 0.95, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute inset-0 z-40 pointer-events-none rounded-full bg-white/90 blur-2xl"
              />
            )}
          </AnimatePresence>

          <div 
            className="perspective-container relative h-[min(460px,56vh)] aspect-[688/960] w-auto"
            style={{ perspective: '1200px' }}
          >
            {/* Card Presentation Container (Pure 3D without flattening filter) */}
            <motion.div
              className="w-full h-full relative cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              animate={
                revealStage === 'idle'
                  ? {
                      y: [0, -8, 0],
                      scale: 1,
                      rotateY: 180,
                      rotateX: 0,
                    }
                  : revealStage === 'charging'
                  ? {
                      scale: 0.92,
                      y: 4,
                      rotateY: 180,
                      rotateX: 0,
                      x: [-2, 2, -4, 4, -8, 8, -6, 6, -3, 3, 0],
                      rotateZ: [-1, 1, -2, 2, -1.5, 1.5, 0],
                      boxShadow: '0 0 50px 6px rgba(124, 224, 220, 0.5), 0 0 80px 15px rgba(79, 121, 62, 0.35)',
                    }
                  : revealStage === 'slamming'
                  ? {
                      rotateY: [180, 0],
                      scale: [0.92, 1.30, 1.0],
                      y: [4, -20, 0],
                      x: 0,
                      rotateZ: 0,
                      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    }
                  : {
                      scale: 1,
                      y: 0,
                      rotateY: (isFlipped ? 180 : 0) + (mousePos.x * 20),
                      rotateX: -(mousePos.y * 20),
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    }
              }
              transition={
                revealStage === 'idle'
                  ? {
                      y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                      rotateY: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      scale: { duration: 0.4, ease: 'easeOut' },
                    }
                  : revealStage === 'charging'
                  ? {
                      duration: 0.65,
                      ease: 'easeInOut',
                    }
                  : revealStage === 'slamming'
                  ? {
                      rotateY: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
                      scale: { 
                        times: [0, 0.6, 1], 
                        duration: 0.65, 
                        ease: ['easeOut', [0.16, 1, 0.3, 1]] 
                      },
                      y: { times: [0, 0.6, 1], duration: 0.65 },
                    }
                  : {
                      scale: { type: 'spring', stiffness: 280, damping: 24 },
                      rotateY: { type: 'spring', stiffness: 320, damping: 26 },
                      rotateX: { type: 'spring', stiffness: 320, damping: 26 },
                    }
              }
              onClick={() => {
                if (revealStage === 'idle') {
                  handleReveal();
                } else if (revealStage === 'revealed') {
                  handleToggleFlip();
                }
              }}
            >
              {/* Front Card Face (Revealed Flower Artwork) */}
              <div 
                className={`absolute inset-0 ${state.cardType === 'paper' ? 'rounded-none' : 'rounded-[16px]'} ${
                  (revealStage === 'revealed' && !isFlipped) ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
                }`}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)'
                }}
              >
                {renderFront()}
              </div>

              {/* Back Card Face: Mystery Pack when unrevealed, Personal Letter when revealed */}
              <div 
                className={`absolute inset-0 ${state.cardType === 'paper' ? 'rounded-none' : 'rounded-[16px]'} ${
                  (revealStage !== 'revealed' || isFlipped) ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
                }`}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {revealStage !== 'revealed' ? renderMysteryPackCover() : renderBack()}
              </div>
            </motion.div>
          </div>

          {/* Right Side Controls Dock matching Figma: [ ▶ Play ] on top, [ 🔄 Rotate ] below */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ 
              opacity: revealStage === 'revealed' ? 1 : 0,
              x: revealStage === 'revealed' ? 0 : 10,
              pointerEvents: revealStage === 'revealed' ? 'auto' : 'none'
            }}
            transition={{ duration: 0.35 }}
            className="absolute left-[calc(100%+16px)] sm:left-[calc(100%+24px)] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3.5 z-20"
          >
            {/* 1. Play Button (Circular dark liquid glass) */}
            <LiquidGlassIconButton
              label="Replay reveal"
              onClick={handleReplay}
              icon={<Play size={28} weight="regular" />}
            />

            {/* 2. Rotate / Flip Button (Circular dark liquid glass) */}
            <LiquidGlassIconButton
              label="Rotate card"
              onClick={handleToggleFlip}
              icon={<ArrowClockwise size={28} weight="regular" />}
            />
          </motion.div>
        </div>

        {/* Bottom Button: Disabled until card is revealed, fits within viewport */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: revealStage === 'revealed' ? 1 : 0.40,
            y: 0
          }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-center mt-3.5 sm:mt-4 z-20"
        >
          <LiquidGlassButton
            variant="primary"
            size="lg"
            disabled={revealStage !== 'revealed'}
            onClick={revealStage === 'revealed' ? onCraftOwn : undefined}
          >
            Craft Your Bloom
          </LiquidGlassButton>
        </motion.div>
      </div>
    </div>
  );
}
