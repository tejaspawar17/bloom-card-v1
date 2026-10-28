import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Check, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useCard } from '@/context/CardContext';
import { OCCASIONS } from '@/data/cardData';
import OccasionPicker from '@/components/ui/OccasionPicker';
import WindowPanel from '@/components/ui/WindowPanel';
import WindowSelectBackImage from '@/components/WindowSelectBackImage';
import FlowerPokemonGrid from '@/components/studio/FlowerPokemonGrid';
import StampEmotionPicker from '@/components/studio/StampEmotionPicker';
import StickersGrid from '@/components/studio/StickersGrid';

const STEPS = [
  {
    id: 1,
    tag: '01 · MESSAGE',
    title: 'Select Occasion & Bloom',
    subtitle: 'Choose an occasion and botanical or Pokémon artwork for your card.',
  },
  {
    id: 2,
    tag: '02 · FINISH',
    title: 'Back Artwork & Emotion',
    subtitle: 'Upload or choose the back cover, and stamp a personalized reaction.',
  },
  {
    id: 3,
    tag: '03 · DECORATE',
    title: 'Stickers & Keepsakes',
    subtitle: 'Tap stickers to attach them anywhere across your card.',
  },
];

const stepVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 36 : -36,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -36 : 36,
  }),
};

export default function MobileCustomizeSheet({ isOpen, onClose, initialStep = 1 }) {
  const { state, dispatch } = useCard();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const [hasPickedOccasion, setHasPickedOccasion] = useState(false);
  const dragControls = useDragControls();

  // Touch Swipe tracking between steps
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
      setDirection(1);
    }
  }, [isOpen, initialStep]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleStepChange = (newStep) => {
    if (newStep === currentStep) return;
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger only if horizontal swipe dominates vertical scrolling
    if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0 && currentStep < 3) {
        // Swiped left -> Next step
        handleStepChange(currentStep + 1);
      } else if (deltaX > 0 && currentStep > 1) {
        // Swiped right -> Previous step
        handleStepChange(currentStep - 1);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const isPokemonMode = state.cardType === 'pokemon';
  const listTitle = isPokemonMode ? 'Select Pokémon for the Card' : 'Select Flower for the Card';
  const stepMeta = STEPS[currentStep - 1] || STEPS[0];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-Up Bottom Sheet with Drag-to-Dismiss */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 80 || info.velocity.y > 350) {
                onClose();
              }
            }}
            className="absolute inset-x-0 bottom-0 w-full max-w-[440px] mx-auto bg-[#0a0d0a]/95 border-t border-white/12 rounded-t-[34px] shadow-[0_-16px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col h-[540px] max-h-[85vh] overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Customize Card"
          >
            {/* Top Grab Handle Area (Pointer drag bound to sheet dismiss) */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="w-full flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors" />
            </div>

            {/* Header: Option B Navigation */}
            {/* Left: (X) Close | Center: Title + Stepper Dots | Right: Dynamic Step Capsule */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
              {/* Left: Close Button (Always visible) */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all outline-none"
                aria-label="Close"
              >
                <X size={18} weight="bold" />
              </button>

              {/* Center: Title + Stepper Dots */}
              <div className="flex flex-col items-center">
                <span className="text-[14.5px] font-semibold text-white tracking-tight">Customize</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {STEPS.map((step) => {
                    const isActive = step.id === currentStep;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => handleStepChange(step.id)}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-200 outline-none",
                          isActive ? "w-5 bg-[#0088FF]" : "w-1.5 bg-white/25 hover:bg-white/40"
                        )}
                        aria-label={`Jump to step ${step.id}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Right: Dynamic Navigation Controls */}
              <div className="flex items-center justify-end min-w-[70px]">
                {/* Step 1: Forward Arrow Button */}
                {currentStep === 1 && (
                  <button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className="w-9 h-9 rounded-full bg-white/[0.10] hover:bg-white/[0.16] active:scale-95 flex items-center justify-center text-white transition-all border border-white/10 outline-none shadow-sm"
                    aria-label="Next step"
                  >
                    <CaretRight size={18} weight="bold" />
                  </button>
                )}

                {/* Step 2: Paired Capsule (Back + Forward) */}
                {currentStep === 2 && (
                  <div className="flex items-center bg-white/[0.08] rounded-full border border-white/10 p-0.5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleStepChange(1)}
                      className="w-8 h-8 rounded-full hover:bg-white/10 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all outline-none"
                      aria-label="Previous step"
                    >
                      <CaretLeft size={16} weight="bold" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/15 my-auto" />
                    <button
                      type="button"
                      onClick={() => handleStepChange(3)}
                      className="w-8 h-8 rounded-full hover:bg-white/10 active:scale-95 flex items-center justify-center text-white transition-all outline-none"
                      aria-label="Next step"
                    >
                      <CaretRight size={16} weight="bold" />
                    </button>
                  </div>
                )}

                {/* Step 3: Paired Capsule (Back + Done Checkmark) */}
                {currentStep === 3 && (
                  <div className="flex items-center bg-white/[0.08] rounded-full border border-white/10 p-0.5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleStepChange(2)}
                      className="w-8 h-8 rounded-full hover:bg-white/10 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all outline-none"
                      aria-label="Previous step"
                    >
                      <CaretLeft size={16} weight="bold" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/15 my-auto" />
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-[#0088FF] hover:bg-[#0077E6] active:scale-95 flex items-center justify-center text-white transition-all shadow-[0_2px_8px_rgba(0,136,255,0.4)] outline-none"
                      aria-label="Done"
                    >
                      <Check size={16} weight="bold" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Step Tag & Descriptive Subtitle */}
            <div className="px-5 pt-2.5 pb-2 flex flex-col border-b border-white/[0.04] flex-shrink-0">
              <span className="text-[11px] font-mono tracking-[0.18em] text-[#86B75A] font-semibold uppercase">
                {stepMeta.tag}
              </span>
              <p className="text-[12.5px] leading-snug text-[#9aa097] mt-0.5">
                {stepMeta.subtitle}
              </p>
            </div>

            {/* Scrollable Step Content with Horizontal Swipe Detection */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="px-4 py-3.5 flex-1 overflow-y-auto space-y-4"
            >
              <AnimatePresence mode="wait" custom={direction}>
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-4 pb-4"
                  >
                    {/* Occasion Selector */}
                    <div>
                      <OccasionPicker
                        value={hasPickedOccasion ? OCCASIONS.find(o => o.id === state.occasion)?.label : null}
                        onChange={(label) => {
                          setHasPickedOccasion(Boolean(label));
                          const occ = OCCASIONS.find(o => o.label === label);
                          if (occ) dispatch({ type: 'SET_OCCASION', payload: occ.id });
                        }}
                      />
                    </div>

                    {/* Flower / Pokemon Grid */}
                    <div>
                      <WindowPanel
                        title={listTitle}
                        bodyClassName="pt-[13px] pr-[4px] pb-[15px] pl-[15px] overflow-hidden"
                      >
                        <FlowerPokemonGrid heightClassName="h-[250px]" />
                      </WindowPanel>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-4 pb-4"
                  >
                    {/* Back Artwork Selector */}
                    <WindowSelectBackImage />

                    {/* Emotion Emoji Stamp */}
                    <StampEmotionPicker title="What do you want to emote" />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-4 pb-4"
                  >
                    {/* Sticker Selector */}
                    <StickersGrid title="Decorate with Stickers" heightClassName="h-[260px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
