import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Check, X } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';
import { OCCASIONS } from '@/data/cardData';
import WindowPanel from '@/components/ui/WindowPanel';
import OccasionPicker from '@/components/ui/OccasionPicker';
import FlowerPokemonGrid from '@/components/studio/FlowerPokemonGrid';
import WindowSelectBackImage from '@/components/WindowSelectBackImage';
import StampEmotionPicker from '@/components/studio/StampEmotionPicker';
import StickersGrid from '@/components/studio/StickersGrid';

const STEPS = [
  {
    id: 1,
    tag: '01 · OCCASION & FRONT',
    title: 'Card Front',
    description: 'Choose an occasion and pick your floral arrangement or Pokémon companion.',
    heightClass: 'max-h-[76dvh] h-[76dvh]',
  },
  {
    id: 2,
    tag: '02 · BACK COVER & STAMP',
    title: 'Back Cover',
    description: 'Select back cover artwork or upload a photo, then stamp an emotion emoji.',
    heightClass: 'max-h-[64dvh] h-[64dvh]',
  },
  {
    id: 3,
    tag: '03 · DECORATE & FINISH',
    title: 'Stickers',
    description: 'Add finishing touches and collectible stickers across your card.',
    heightClass: 'max-h-[52dvh] h-[52dvh]',
  },
];

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 28 : -28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -28 : 28,
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

export default function MobileCustomizeSheet({ isOpen, onClose }) {
  const { state, dispatch } = useCard();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [hasPickedOccasion, setHasPickedOccasion] = useState(false);

  // Horizontal swipe touch tracking
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // Sync card side with the active step
  useEffect(() => {
    if (!isOpen) return;
    if (step === 1 && state.activeSide !== 'front') {
      dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'front' });
    } else if ((step === 2 || step === 3) && state.activeSide !== 'back') {
      dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'back' });
    }
  }, [step, isOpen, dispatch]);

  // Lock body scroll when open
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
    if (newStep === step || newStep < 1 || newStep > 3) return;
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Dominant horizontal swipe
    if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && step < 3) {
        handleStepChange(step + 1);
      } else if (deltaX > 0 && step > 1) {
        handleStepChange(step - 1);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const stepMeta = STEPS[step - 1] || STEPS[0];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <motion.div
            key="mobile-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            key="mobile-sheet-panel"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.85 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.08, bottom: 0.6 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 70 || info.velocity.y > 350) {
                onClose();
              }
            }}
            className={`relative w-full max-w-[460px] mx-auto bg-[#121214]/95 backdrop-blur-2xl border-t border-white/12 rounded-t-[32px] shadow-[0_-16px_40px_rgba(0,0,0,0.85)] flex flex-col z-10 transition-[height,max-height] duration-300 ease-out ${stepMeta.heightClass}`}
            role="dialog"
            aria-modal="true"
            aria-label="Customize Card"
          >
            {/* Grabber only - clean Apple HIG, interactive drag handle */}
            <div className="w-full pt-3 pb-1 flex justify-center cursor-pointer select-none">
              <div className="w-14 h-1.5 rounded-full bg-white/25 hover:bg-white/40 transition-colors" />
            </div>

            {/* Header Control Bar */}
            <div className="px-4 py-2 border-b border-white/[0.08] flex items-center justify-between">
              {/* Left action button (Circle 36px) */}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close sheet"
                  className="w-[42px] h-[42px] rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 flex items-center justify-center text-white/90 transition-colors cursor-pointer"
                >
                  <X size={22} weight="bold" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStepChange(step - 1)}
                  aria-label="Previous step"
                  className="w-[42px] h-[42px] rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 flex items-center justify-center text-white/90 transition-colors cursor-pointer"
                >
                  <CaretLeft size={22} weight="bold" />
                </button>
              )}

              {/* Step Title & Apple-style Circular Page Indicator */}
              <div className="flex flex-col items-center select-none">
                <span className="text-[17px] font-semibold text-white tracking-tight">
                  {stepMeta.title}
                </span>
                <div className="flex items-center gap-2.5 mt-2">
                  {STEPS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleStepChange(s.id)}
                      aria-label={`Jump to ${s.title}`}
                      className={`w-[8px] h-[8px] rounded-full transition-all duration-200 cursor-pointer ${
                        s.id === step
                          ? 'bg-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                          : 'bg-white/25 hover:bg-white/45'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right action button: Next (→) on steps 1 & 2, Done (✓) on step 3 */}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => handleStepChange(step + 1)}
                  aria-label="Next step"
                  className="w-[42px] h-[42px] rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 flex items-center justify-center text-white/90 transition-colors cursor-pointer"
                >
                  <CaretRight size={22} weight="bold" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Save and close"
                  className="w-[42px] h-[42px] rounded-full bg-[#0088FF] hover:bg-[#0077EE] active:scale-95 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(0,136,255,0.4)] transition-all cursor-pointer"
                >
                  <Check size={22} weight="bold" />
                </button>
              )}
            </div>

            {/* Sub-header: Green Category Tag + Explanatory Description */}
            <div className="px-5 pt-3 pb-2.5 flex flex-col gap-1 border-b border-white/[0.05] select-none">
              <span className="text-[11px] font-mono tracking-[0.16em] text-[#4ADE80] font-semibold uppercase">
                {stepMeta.tag}
              </span>
              <p className="text-[13.5px] leading-[19px] text-[rgba(229,229,234,0.82)]">
                {stepMeta.description}
              </p>
            </div>

            {/* Scrollable Step Content with Swipe Gesture Support */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex-1 overflow-y-auto px-3.5 pb-6 pt-2"
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`step-${step}`}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col gap-3.5"
                >
                  {step === 1 && (
                    <>
                      <OccasionPicker
                        isMobile={true}
                        value={hasPickedOccasion ? OCCASIONS.find(o => o.id === state.occasion)?.label : null}
                        onChange={(label) => {
                          setHasPickedOccasion(Boolean(label));
                          const occ = OCCASIONS.find(o => o.label === label);
                          if (occ) dispatch({ type: 'SET_OCCASION', payload: occ.id });
                        }}
                      />
                      <WindowPanel
                        title={state.cardType === 'pokemon' ? 'Pick Your Pokémon' : 'Pick Your Bloom'}
                        bodyClassName="pt-[12px] px-[12px] pb-[16px] overflow-hidden"
                      >
                        <FlowerPokemonGrid isMobile={true} heightClassName="h-[240px]" />
                      </WindowPanel>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <WindowSelectBackImage isMobile={true} />
                      <StampEmotionPicker isMobile={true} />
                    </>
                  )}

                  {step === 3 && (
                    <StickersGrid isMobile={true} heightClassName="h-[270px]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
