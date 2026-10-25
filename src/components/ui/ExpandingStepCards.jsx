import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ExpandingStepCards
 * 
 * Production React + Framer Motion implementation of the Pixels71 Framer Component
 * (https://www.framer.com/marketplace/components/expanding-step-cards/)
 * Calibrated with Bloom's Apple-style typographic scale: Inter/SF Pro `font-sans`,
 * refined `font-normal` 400 and `font-medium` 500 weights, zero monospace.
 */

const springTransition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.8,
};

export default function ExpandingStepCards({
  steps = [],
  defaultActive = 0,
  cardHeight = 400,
  resetOnLeave = false,
  className = "",
}) {
  const [activeIdx, setActiveIdx] = useState(defaultActive);

  return (
    <div 
      className={`w-full flex flex-col sm:flex-row gap-3.5 sm:gap-4 box-border select-none ${className}`}
      style={{ minHeight: typeof cardHeight === 'number' ? `${cardHeight}px` : cardHeight }}
      onMouseLeave={() => {
        if (resetOnLeave) {
          setActiveIdx(defaultActive);
        }
      }}
      role="region"
      aria-label="Process steps"
    >
      {steps.map((step, index) => {
        const isOpen = activeIdx === index;

        return (
          <motion.div
            key={index}
            layout
            tabIndex={0}
            role="button"
            aria-expanded={isOpen}
            aria-label={`Step ${step.number}: ${step.title}`}
            onClick={() => setActiveIdx(index)}
            onFocus={() => setActiveIdx(index)}
            onMouseEnter={() => setActiveIdx(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveIdx(index);
              }
            }}
            transition={springTransition}
            className={`group relative rounded-[24px] overflow-hidden cursor-pointer border flex flex-col justify-between transition-colors duration-300 outline-none hig-focus ${
              isOpen
                ? 'sm:flex-[3.4] border-white/[0.22] shadow-[0_24px_50px_rgba(0,0,0,0.85)]'
                : 'sm:flex-[1] border-white/[0.08] hover:border-white/[0.16]'
            }`}
            style={{
              backgroundColor: '#121212',
              minHeight: '260px',
              height: typeof cardHeight === 'number' ? `${cardHeight}px` : cardHeight,
            }}
          >
            {/* Background Image Overlay with Cinematic Lighting */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <motion.img
                src={step.image}
                alt=""
                aria-hidden="true"
                animate={{
                  scale: isOpen ? 1 : 1.08,
                  opacity: isOpen ? 0.85 : 0.22,
                  filter: isOpen ? 'grayscale(0%) contrast(105%)' : 'grayscale(80%) contrast(90%)',
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full object-cover select-none"
              />
              {/* Refined multi-layer gradient mask for contrast & high readability */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(14,14,14,0.35) 0%, rgba(14,14,14,0.1) 25%, rgba(14,14,14,0.65) 65%, rgba(14,14,14,0.96) 100%)',
                }}
              />
            </div>

            {/* Top Bar: Step Number & Accent Tag */}
            <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="font-sans font-medium text-[15px] sm:text-[16px] tracking-tight transition-colors duration-300"
                  style={{ color: isOpen ? (step.accent || '#ffffff') : 'rgba(255, 255, 255, 0.45)' }}
                >
                  {step.number}
                </span>

                {step.tag && (
                  <span className="text-[12px] font-sans font-normal text-white/40 hidden sm:inline-block">
                    • {step.tag}
                  </span>
                )}
              </div>

              {/* Revealable Top-Right Badge */}
              <AnimatePresence>
                {isOpen && step.chip && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9, x: 6 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 6 }}
                    transition={{ duration: 0.2 }}
                    className="font-sans font-normal text-[11.5px] text-white/70 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.10] shadow-sm select-none"
                  >
                    {step.chip}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Bar: Title & Smoothly Revealable Description */}
            <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-1.5 text-left">
              <h3 className="text-white font-sans font-medium text-[19px] sm:text-[21px] leading-[26px] tracking-[-0.02em]">
                {step.title}
              </h3>

              {/* Smoothly Revealed Copy */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 8 }}
                    transition={{
                      opacity: { duration: 0.22, delay: 0.04 },
                      height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                      y: { duration: 0.22, delay: 0.04 },
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/65 font-sans font-normal text-[13.5px] sm:text-[14px] leading-[22px] tracking-[-0.01em] max-w-[420px] pt-1">
                      {step.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
