import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Apple Spring Physics for snappy tactile card cycling
const appleCardSpring = {
  type: 'spring',
  stiffness: 420,
  damping: 28,
  mass: 0.7,
};

/**
 * KeepsakeFolder Component
 * Modeled after the Framer Keepsake component.
 * Holds 3 cards (placeholder white rectangles or custom PNGs) tucked into a physical pocket sleeve.
 */
export default function KeepsakeFolder({
  cards = [
    { id: '1', title: 'Card 01', note: 'Milestone', color: '#86B75A' },
    { id: '2', title: 'Card 02', note: 'Victorian', color: '#CFC531' },
    { id: '3', title: 'Card 03', note: '3D Link', color: '#7CE0DC' },
  ],
  label = 'KEEPSAKE',
  defaultRotation = -6,
  className = '',
  style = {},
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleCycle = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${label} folder. Tap to cycle cards.`}
      onClick={handleCycle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCycle(e);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.96 }}
      animate={{
        rotate: isHovered ? defaultRotation * 0.5 : defaultRotation,
        y: isHovered ? -4 : 0,
      }}
      transition={appleCardSpring}
      className={`relative w-[138px] sm:w-[152px] h-[154px] sm:h-[168px] flex items-end justify-center cursor-pointer select-none touch-manipulation outline-none ${className}`}
      style={{
        ...style,
      }}
    >
      {/* 1. Back Folder Flap */}
      <div 
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[132px] sm:h-[144px] rounded-[18px] bg-[#141414] border border-white/[0.10] shadow-[0_16px_36px_rgba(0,0,0,0.7)] pointer-events-none z-0"
      />

      {/* 2. The 3 Tucked Cards (White Placeholders or PNGs) */}
      <div className="absolute inset-x-0 top-0 bottom-[44px] sm:bottom-[48px] flex items-center justify-center z-1 pointer-events-none">
        {cards.map((card, idx) => {
          // Relative order: 0 = front, 1 = middle, 2 = back
          const order = (idx - activeIndex + cards.length) % cards.length;

          let fanX = 0;
          let fanRotate = 0;
          let fanY = 0;

          if (isHovered) {
            if (order === 0) {
              fanX = 0;
              fanRotate = 0;
              fanY = -16;
            } else if (order === 1) {
              fanX = 28;
              fanRotate = 7;
              fanY = -10;
            } else {
              fanX = -28;
              fanRotate = -7;
              fanY = -10;
            }
          } else {
            if (order === 0) {
              fanX = 0;
              fanRotate = 0;
              fanY = 0;
            } else if (order === 1) {
              fanX = 5;
              fanRotate = 3;
              fanY = -8;
            } else {
              fanX = -5;
              fanRotate = -3;
              fanY = -14;
            }
          }

          const zIndex = 5 - order;
          const scale = 1 - order * 0.05;
          const opacity = 1 - order * 0.12;

          return (
            <motion.div
              key={card.id || idx}
              layout
              animate={{
                x: fanX,
                y: fanY,
                rotate: fanRotate,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
              }}
              transition={appleCardSpring}
              className="absolute w-[106px] sm:w-[118px] h-[126px] sm:h-[138px] rounded-[12px] bg-white border border-black/[0.08] shadow-[0_8px_20px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col justify-between p-2.5 text-black select-none"
              style={{
                outline: '1px solid transparent',
                backfaceVisibility: 'hidden',
              }}
            >
              {card.image ? (
                // When PNG is provided
                <img
                  src={card.image}
                  alt={card.title || 'card'}
                  className="w-full h-full object-cover rounded-[8px] pointer-events-none"
                />
              ) : (
                // Placeholder White Card
                <>
                  {/* Top card header indicator */}
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: card.color || '#86B75A' }} 
                    />
                    <span className="text-[9px] font-sans font-semibold tracking-wider text-black/40 uppercase">
                      BLOOM
                    </span>
                  </div>

                  {/* Center Placeholder Card Content */}
                  <div className="flex flex-col items-center justify-center my-auto w-full text-center gap-1">
                    <div className="w-8 h-8 rounded-lg bg-black/[0.05] border border-dashed border-black/20 flex items-center justify-center">
                      <span className="text-[11px] font-medium text-black/50">
                        {order + 1}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-black/80 tracking-tight leading-tight">
                      {card.title || `Card 0${idx + 1}`}
                    </span>
                  </div>

                  {/* Bottom bar */}
                  <div className="w-full flex items-center justify-between border-t border-black/[0.06] pt-1">
                    <span className="text-[8.5px] font-normal text-black/40">
                      {card.note || 'Placeholder'}
                    </span>
                    <span className="text-[8px] font-mono text-black/30">
                      60fps
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 3. Front Pocket Sleeve (Tucks cards inside) */}
      <div 
        className="relative w-full h-[68px] sm:h-[74px] rounded-b-[18px] rounded-t-[10px] bg-[#181818]/95 backdrop-blur-md border-t border-x border-white/[0.14] shadow-[0_-6px_18px_rgba(0,0,0,0.6)] z-10 px-3.5 flex items-center justify-between"
      >
        <div className="flex flex-col text-left">
          <span className="font-sans font-semibold text-[9.5px] leading-[12px] tracking-[0.08em] uppercase text-white/45">
            {label}
          </span>
          <span className="font-sans font-normal text-[11px] sm:text-[11.5px] text-white/90 leading-[14px] tracking-tight">
            {cards[activeIndex]?.title || `Card 0${activeIndex + 1}`}
          </span>
        </div>

        {/* 3 Step Dot Indicators */}
        <div className="flex items-center gap-1" aria-hidden="true">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex 
                  ? 'w-3 bg-white' 
                  : 'w-1 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
