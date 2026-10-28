import React, { useState, useEffect } from 'react';
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

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 30 : -30,
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
    x: direction > 0 ? -30 : 30,
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPickedOccasion, setHasPickedOccasion] = useState(false);

  // Sync card side with the active step
  useEffect(() => {
    if (!isOpen) return;
    if (step === 1 && state.activeSide !== 'front') {
      dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'front' });
    } else if ((step === 2 || step === 3) && state.activeSide !== 'back') {
      dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'back' });
    }
  }, [step, isOpen, dispatch]);

  const handleStepChange = (newStep) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const stepMeta = [
    {
      title: 'Step 1 of 3: Card Front',
      description: 'Choose an occasion and pick your floral arrangement or Pokémon companion.',
    },
    {
      title: 'Step 2 of 3: Back Cover',
      description: 'Select the artwork or upload a personalized photo for the back of your card.',
    },
    {
      title: 'Step 3 of 3: Stamping & Stickers',
      description: 'Stamp an emotion and decorate with handcrafted stickers.',
    },
  ];

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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            key="mobile-sheet-panel"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.85 }}
            className={`relative w-full max-w-[460px] mx-auto bg-[#121214]/95 backdrop-blur-2xl border-t border-white/12 rounded-t-[32px] shadow-[0_-16px_40px_rgba(0,0,0,0.85)] flex flex-col z-10 transition-[max-height] duration-300 ease-out ${
              isExpanded ? 'max-h-[92dvh] h-[92dvh]' : 'max-h-[72dvh] h-[72dvh]'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Customize Card"
          >
            {/* Grabber only - clean Apple HIG, no instructional copy */}
            <div 
              className="w-full pt-3 pb-1 flex justify-center cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="w-10 h-1.2 rounded-full bg-white/25 hover:bg-white/40 transition-colors" />
            </div>

            {/* Header Control Bar */}
            <div className="px-4 py-2 border-b border-white/[0.08] flex items-center justify-between">
              {/* Left action button (Circle 36px) */}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close sheet"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 flex items-center justify-center text-white/90 transition-colors cursor-pointer"
                >
                  <X size={18} weight="bold" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStepChange(step - 1)}
                  aria-label="Previous step"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 flex items-center justify-center text-white/90 transition-colors cursor-pointer"
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
              )}

              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-semibold text-white tracking-tight">
                  {stepMeta[step - 1].title}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStepChange(s)}
                      aria-label={`Jump to step ${s}`}
                      className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                        s === step ? 'w-5 bg-[#0088FF]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right action button (Circle 36px) */}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => handleStepChange(step + 1)}
                  aria-label="Next step"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 flex items-center justify-center text-white/90 transition-colors cursor-pointer"
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Complete customization"
                  className="w-9 h-9 rounded-full bg-[#0088FF] hover:bg-[#0077EE] active:scale-95 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(0,136,255,0.4)] transition-all cursor-pointer"
                >
                  <Check size={18} weight="bold" />
                </button>
              )}
            </div>

            {/* Subtitle with natural 2-line wrap */}
            <div className="px-5 pt-2.5 pb-2 text-center">
              <p className="text-[12px] leading-[17px] text-[rgba(229,229,234,0.70)]">
                {stepMeta[step - 1].description}
              </p>
            </div>

            {/* Scrollable Step Content with Directional Transitions */}
            <div className="flex-1 overflow-y-auto px-3.5 pb-6 pt-1">
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
                        <FlowerPokemonGrid isMobile={true} heightClassName="h-[230px]" />
                      </WindowPanel>
                    </>
                  )}

                  {step === 2 && (
                    <WindowSelectBackImage isMobile={true} />
                  )}

                  {step === 3 && (
                    <>
                      <StampEmotionPicker isMobile={true} />
                      <StickersGrid isMobile={true} heightClassName="h-[250px]" />
                    </>
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
