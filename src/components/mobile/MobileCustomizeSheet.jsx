import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function MobileCustomizeSheet({ isOpen, onClose, initialStep = 1 }) {
  const { state, dispatch } = useCard();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [hasPickedOccasion, setHasPickedOccasion] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
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

          {/* Slide-Up Bottom Sheet — Height 520px matching Figma #1880:27679 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 w-full max-w-[440px] mx-auto bg-[#0a0d0a]/95 border-t border-white/12 rounded-t-[34px] shadow-[0_-16px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col h-[520px] max-h-[82vh] overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Customize Card"
          >
            {/* Top Drag Indicator Pill */}
            <div className="w-full flex justify-center pt-2.5 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header: [X] -- Customize + Stepper Dots -- [✓] */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 flex items-center justify-center text-white/80 transition-all outline-none"
                aria-label="Close"
              >
                <X size={18} weight="bold" />
              </button>

              {/* Title + Stepper Dots */}
              <div className="flex flex-col items-center">
                <span className="text-[15px] font-semibold text-white tracking-tight">Customize</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {STEPS.map((step) => {
                    const isActive = step.id === currentStep;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setCurrentStep(step.id)}
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

              {/* Done / Checkmark Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#0088FF] hover:bg-[#0077E6] active:scale-95 flex items-center justify-center text-white transition-all shadow-[0_2px_10px_rgba(0,136,255,0.4)] outline-none"
                aria-label="Done"
              >
                <Check size={18} weight="bold" />
              </button>
            </div>

            {/* Step Tag & Descriptive Subtitle */}
            <div className="px-5 pt-3 pb-2 flex flex-col border-b border-white/[0.04] flex-shrink-0">
              <span className="text-[11px] font-mono tracking-[0.18em] text-[#86B75A] font-semibold uppercase">
                {stepMeta.tag}
              </span>
              <p className="text-[12.5px] leading-snug text-[#9aa097] mt-0.5">
                {stepMeta.subtitle}
              </p>
            </div>

            {/* Scrollable Step Content */}
            <div className="px-4 py-3.5 flex-1 overflow-y-auto space-y-4">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 pb-2"
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
                        <FlowerPokemonGrid heightClassName="h-[200px]" />
                      </WindowPanel>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 pb-2"
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 pb-2"
                  >
                    {/* Sticker Selector */}
                    <StickersGrid title="Decorate with Stickers" heightClassName="h-[210px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Next / Previous Stepper Navigation */}
            <div className="px-5 py-3 border-t border-white/[0.06] bg-black/40 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={cn(
                  "flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 rounded-xl transition-all outline-none",
                  currentStep === 1
                    ? "opacity-30 cursor-not-allowed text-white/50"
                    : "text-white/80 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] active:scale-95"
                )}
              >
                <CaretLeft size={14} weight="bold" />
                Previous
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentStep < 3) {
                    setCurrentStep((prev) => prev + 1);
                  } else {
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-white px-4 py-2 rounded-xl bg-white/[0.12] hover:bg-white/[0.18] active:scale-95 transition-all outline-none border border-white/10"
              >
                {currentStep < 3 ? 'Next' : 'Finish Customizing'}
                {currentStep < 3 && <CaretRight size={14} weight="bold" />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
