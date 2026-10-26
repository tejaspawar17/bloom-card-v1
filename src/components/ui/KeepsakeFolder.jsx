import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cards, Sparkle } from '@phosphor-icons/react';

const PREMADE_CARDS = [
  {
    id: 'paper',
    name: 'Milestone Birthday',
    tag: 'PAPER STOCK',
    bg: '/assets/bloom/paper_back_clean.png',
    sticker: '/assets/emojis/birthday-cake.png',
    stickerStyle: 'bottom-3 right-3 w-8 h-8 rotate-12',
    accentColor: '#86B75A',
  },
  {
    id: 'foil',
    name: 'Victorian Foil',
    tag: 'METALLIC BEVEL',
    bg: '/assets/bloom/metallic_subject_front.png',
    sticker: '/assets/stickers/Smile.png',
    stickerStyle: 'top-3 right-3 w-9 h-9 -rotate-6',
    accentColor: '#CFC531',
  },
  {
    id: 'pokemon',
    name: 'Inside Joke 3D',
    tag: 'HOLOGRAM CARD',
    bg: '/pokemon/001-002-psyduck.png',
    sticker: '/assets/bloom/duck.png',
    stickerStyle: 'bottom-3 left-3 w-8 h-8 rotate-6',
    accentColor: '#7CE0DC',
  },
];

export default function KeepsakeFolder() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleCycle = () => {
    setActiveIndex((prev) => (prev + 1) % PREMADE_CARDS.length);
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 select-none">
      
      {/* Folder Container */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Keepsake folder with premade cards. Tap to cycle."
        onClick={handleCycle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCycle();
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        className="relative w-full max-w-[340px] sm:max-w-[420px] h-[220px] sm:h-[245px] flex items-end justify-center cursor-pointer outline-none group touch-manipulation"
      >
        {/* Ambient Backing Glow */}
        <div 
          aria-hidden="true" 
          className="absolute inset-x-8 top-12 bottom-0 rounded-[32px] bg-[radial-gradient(ellipse,rgba(134,183,90,0.14)_0%,transparent_70%)] blur-[30px] pointer-events-none -z-10" 
        />

        {/* Back Folder Pocket Flap */}
        <div 
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[190px] sm:h-[210px] rounded-[22px] bg-[#0A0A0A] border border-white/[0.08] shadow-[0_16px_36px_rgba(0,0,0,0.7)] pointer-events-none z-0"
        />

        {/* The 3 Layered Premade Cards Inside the Folder */}
        <div className="absolute inset-x-0 top-0 bottom-[55px] sm:bottom-[60px] flex items-center justify-center z-1 pointer-events-none">
          {PREMADE_CARDS.map((card, idx) => {
            // Position relative to active index: 0 = front, 1 = middle, 2 = back
            const order = (idx - activeIndex + PREMADE_CARDS.length) % PREMADE_CARDS.length;

            // Fanning offsets on desktop hover
            let fanX = 0;
            let fanRotate = 0;
            let fanY = 0;

            if (isHovered) {
              if (order === 0) {
                fanX = 0;
                fanRotate = 0;
                fanY = -18;
              } else if (order === 1) {
                fanX = 72;
                fanRotate = 9;
                fanY = -12;
              } else {
                fanX = -72;
                fanRotate = -9;
                fanY = -12;
              }
            } else {
              // Default layered stationery stack
              if (order === 0) {
                fanX = 0;
                fanRotate = 0;
                fanY = 0;
              } else if (order === 1) {
                fanX = 8;
                fanRotate = 3.5;
                fanY = -10;
              } else {
                fanX = -8;
                fanRotate = -3.5;
                fanY = -18;
              }
            }

            const zIndex = 5 - order;
            const scale = 1 - order * 0.04;
            const opacity = 1 - order * 0.12;

            return (
              <motion.div
                key={card.id}
                layout
                animate={{
                  x: fanX,
                  y: fanY,
                  rotate: fanRotate,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 28,
                  mass: 0.8,
                }}
                className="absolute w-[128px] sm:w-[150px] h-[180px] sm:h-[210px] rounded-[16px] overflow-hidden border border-white/[0.14] shadow-[0_12px_28px_rgba(0,0,0,0.85)] bg-[#121212] select-none"
                style={{
                  outline: '1px solid transparent',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Real Card PNG Texture */}
                <img
                  src={card.bg}
                  alt={card.name}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  loading="eager"
                />

                {/* Crooked Authentic Sticker */}
                <img
                  src={card.sticker}
                  alt="card sticker"
                  className={`absolute ${card.stickerStyle} object-contain pointer-events-none select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]`}
                />

                {/* Subtle Specular Sheen Rim */}
                <div 
                  aria-hidden="true" 
                  className="absolute inset-0 rounded-[16px] pointer-events-none border border-white/20"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Front Folder Lip / Pocket Overlay (Tucks the bottom of the cards in) */}
        <div 
          className="relative w-full h-[76px] sm:h-[84px] rounded-b-[22px] rounded-t-[14px] bg-[#0E0E0E]/95 backdrop-blur-md border-t border-x border-white/[0.12] shadow-[0_-8px_24px_rgba(0,0,0,0.5)] z-10 px-5 flex items-center justify-between"
        >
          {/* Left Title & Status */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <Cards size={13} className="text-white/60" />
              <span className="font-sans font-normal text-[11px] leading-[14px] tracking-[0.06em] uppercase text-white/50">
                Keepsake Folder
              </span>
            </div>
            <span className="font-sans font-normal text-[13px] sm:text-[14px] text-white leading-[18px] tracking-tight">
              {PREMADE_CARDS[activeIndex].name}
            </span>
          </div>

          {/* Right Indicator & Action Hint */}
          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {PREMADE_CARDS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex 
                      ? 'w-4 bg-white/90' 
                      : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Tap Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10.5px] text-white/60 font-normal">
              tap to cycle
            </span>
          </div>
        </div>
      </motion.div>

      {/* Micro-hint for mobile */}
      <span className="sm:hidden text-white/35 text-[11px] font-normal tracking-tight">
        tap folder to pull next card
      </span>
    </div>
  );
}
