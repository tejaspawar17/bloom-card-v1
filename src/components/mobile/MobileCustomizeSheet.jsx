import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Check, CaretLeft, CaretRight, CaretUp, CaretDown } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useCard } from '@/context/CardContext';
import { OCCASIONS } from '@/data/cardData';
import OccasionPicker from '@/components/ui/OccasionPicker';
import WindowSelectBackImage from '@/components/WindowSelectBackImage';
import FlowerPokemonGrid from '@/components/studio/FlowerPokemonGrid';
import StampEmotionPicker from '@/components/studio/StampEmotionPicker';
import StickersGrid from '@/components/studio/StickersGrid';

const STEPS = [
  {
    id: 1,
    tag: '01 · MESSAGE',
    title: 'Occasion & Bloom',
    subtitle: 'Choose an occasion and botanical or Pokémon artwork for your card.',
  },
  {
    id: 2,
    tag: '02 · FINISH',
    title: 'Back Artwork & Stamp',
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
    x: dir > 0 ? 32 : -32,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -32 : 32,
  }),
};

export default function MobileCustomizeSheet({ isOpen, onClose, initialStep = 1 }) {
  const { state, dispatch } = useCard();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPickedOccasion, setHasPickedOccasion] = useState(false);
  const dragControls = useDragControls();

  // Touch Swipe tracking between steps
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
      setDirection(1);
      setIsExpanded(false);
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

    // Trigger step navigation only when horizontal swipe dominates
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

          {/* Interactive Dual-Detent Bottom Sheet (Medium 64vh <-> Expanded 92vh) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ 
              y: '0%',
              height: isExpanded ? '92vh' : '64vh'
            }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.15, bottom: 0.6 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 60 || info.velocity.y > 300) {
                if (isExpanded) {
                  setIsExpanded(false);
                } else {
                  onClose();
                }
              } else if (info.offset.y < -60 || info.velocity.y < -300) {
                if (!isExpanded) {
                  setIsExpanded(true);
                }
              }
            }}
            className="absolute inset-x-0 bottom-0 w-full max-w-[480px] mx-auto bg-[#0a0d0a]/95 border-t border-white/12 rounded-t-[32px] shadow-[0_-16px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col overflow-hidden z-10 transition-[border-radius] duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Customize Card"
          >
            {/* Top Grab Handle Area — Tap or drag to toggle between Medium (64vh) & Large (92vh) detents */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              onClick={() => setIsExpanded(prev => !prev)}
              className="w-full flex flex-col items-center justify-center pt-2.5 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none select-none group"
              title={isExpanded ? "Collapse sheet" : "Expand to full screen"}
            >
              <div className="w-11 h-1.5 rounded-full bg-white/25 group-hover:bg-white/45 transition-colors" />
              <div className="flex items-center gap-1 text-[10px] text-white/35 group-hover:text-white/60 transition-colors mt-0.5 font-medium">
                {isExpanded ? (
                  <>
                    <span>Swipe down to collapse</span>
                    <CaretDown size={11} weight="bold" />
                  </>
                ) : (
                  <>
                    <span>Swipe up for full screen</span>
                    <CaretUp size={11} weight="bold" />
                  </>
                )}
              </div>
            </div>

            {/* Header: Apple HIG Standard Navigation */}
            {/* Left: (X Close / Back) | Center: Title + Dots | Right: (Next / Done) */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
              {/* Left Action: Close on Step 1, Back on Steps 2 & 3 */}
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all outline-none"
                  aria-label="Close"
                >
                  <X size={18} weight="bold" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStepChange(currentStep - 1)}
                  className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all outline-none"
                  aria-label="Back to previous step"
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
              )}

              {/* Center: Dynamic Step Title + Stepper Dots */}
              <div className="flex flex-col items-center">
                <span className="text-[14.5px] font-semibold text-white tracking-tight">
                  {stepMeta.title}
                </span>
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

              {/* Right Action: Next on Steps 1 & 2, Done on Step 3 */}
              <div className="flex items-center justify-end min-w-[70px]">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => handleStepChange(currentStep + 1)}
                    className="w-9 h-9 rounded-full bg-white/[0.10] hover:bg-white/[0.16] active:scale-95 flex items-center justify-center text-white transition-all border border-white/10 outline-none shadow-sm"
                    aria-label="Next step"
                  >
                    <CaretRight size={18} weight="bold" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-9 px-4 rounded-full bg-[#0088FF] hover:bg-[#0077E6] active:scale-95 flex items-center gap-1.5 text-white font-semibold text-[13.5px] transition-all shadow-[0_2px_10px_rgba(0,136,255,0.4)] outline-none"
                    aria-label="Done"
                  >
                    <span>Done</span>
                    <Check size={16} weight="bold" />
                  </button>
                )}
              </div>
            </div>

            {/* Step Subtitle Bar */}
            <div className="px-5 pt-2 pb-2 flex items-center justify-between border-b border-white/[0.04] flex-shrink-0">
              <span className="text-[11px] font-mono tracking-[0.16em] text-[#86B75A] font-semibold uppercase">
                {stepMeta.tag}
              </span>
              <p className="text-[12px] text-[#9aa097] truncate max-w-[240px]">
                {stepMeta.subtitle}
              </p>
            </div>

            {/* Scrollable Step Content with Horizontal Swipe Detection */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="px-4 py-3 flex-1 overflow-y-auto space-y-4"
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
                    {/* Occasion Selector (Bare, Native Touch Chips) */}
                    <OccasionPicker
                      bare={true}
                      value={hasPickedOccasion ? OCCASIONS.find(o => o.id === state.occasion)?.label : null}
                      onChange={(label) => {
                        setHasPickedOccasion(Boolean(label));
                        const occ = OCCASIONS.find(o => o.label === label);
                        if (occ) dispatch({ type: 'SET_OCCASION', payload: occ.id });
                      }}
                    />

                    {/* Flower / Pokemon Grid (Borderless, Responsive Touch Tiles) */}
                    <div>
                      <div className="text-[14px] font-semibold text-white tracking-tight mb-2.5 px-0.5">
                        {listTitle}
                      </div>
                      <FlowerPokemonGrid 
                        isMobile={true}
                        heightClassName={isExpanded ? "h-[calc(92vh-280px)]" : "h-[240px]"} 
                      />
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
                    {/* Back Artwork Selector (Bare, Touch Friendly) */}
                    <WindowSelectBackImage bare={true} />

                    {/* Emotion Emoji Stamp (Bare, Touch Friendly) */}
                    <StampEmotionPicker bare={true} title="What do you want to emote" />
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
                    {/* Sticker Selector (Bare, Responsive Touch Tiles) */}
                    <StickersGrid 
                      bare={true}
                      isMobile={true}
                      title="Decorate with Stickers" 
                      heightClassName={isExpanded ? "h-[calc(92vh-160px)]" : "h-[270px]"} 
                    />
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
