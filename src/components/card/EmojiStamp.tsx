import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiStampProps {
  emoji?: string;
  className?: string;
}

export function EmojiStamp({ emoji, className = '' }: EmojiStampProps) {
  if (!emoji) return null;

  return (
    <div className={`absolute z-20 flex items-center justify-center w-[clamp(56px,21cqw,86px)] h-[clamp(56px,21cqw,86px)] select-none aspect-square ${className}`}>
      
      {/* Layer 1: Wider 16-Point Royal Blue Starburst with Stroke */}
      <div className="absolute z-10 flex items-center justify-center w-[88%] h-[88%]">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] pointer-events-none"
        >
          <polygon 
            points="50.0,0.5 57.7,11.3 68.9,4.3 71.9,17.2 85.0,15.0 82.8,28.1 95.7,31.1 88.7,42.3 99.5,50.0 88.7,57.7 95.7,68.9 82.8,71.9 85.0,85.0 71.9,82.8 68.9,95.7 57.7,88.7 50.0,99.5 42.3,88.7 31.1,95.7 28.1,82.8 15.0,85.0 17.2,71.9 4.3,68.9 11.3,57.7 0.5,50.0 11.3,42.3 4.3,31.1 17.2,28.1 15.0,15.0 28.1,17.2 31.1,4.3 42.3,11.3" 
            fill="#0B65FF"
            stroke="#5C9DFF"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>

        {/* Layer 2: Dynamic 3D Apple Emoji */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={emoji}
            initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.2, opacity: 0, rotate: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute z-10 w-[64%] h-[64%] flex items-center justify-center leading-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] pointer-events-none"
          >
            <img 
              src={`/assets/emojis/${emoji}.png`} 
              alt={emoji}
              className="w-full h-full object-contain pointer-events-none drop-shadow-md z-10 animate-fade-in" 
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.display = "none"; 
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Layer 3a: Physical Plastic Blur and Dimming */}
      <div className="absolute inset-0 z-20 rounded-full backdrop-blur-[1.5px] bg-black/5 pointer-events-none" />

      {/* Layer 3b: Plastic Film Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 rounded-full w-full h-full"
        style={{
          backgroundImage: "url('/assets/bloom/stamp-plastic-film.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'screen',
          opacity: 0.88,
          boxShadow: 'inset 0 0 0 0.75px rgba(255,255,255,0.35)',
        }}
      />
    </div>
  );
}
