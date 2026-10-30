import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCard } from '@/context/CardContext';
import { X } from '@phosphor-icons/react';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';

export default function TitleModal({ onClose }) {
  const { state, dispatch } = useCard();
  const [val, setVal] = useState(state.subject || '');

  // Mobile virtual keyboard state (boolean only - avoids 60fps visualViewport jitter & iOS transform caret bug)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const blurTimeoutRef = useRef(null);

  // Prevent background scroll and maintain viewport stability on iOS
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    const updateViewport = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const shrunk = vv.height < (window.innerHeight - 100);
        setIsKeyboardOpen((prev) => (prev !== shrunk ? shrunk : prev));
      }
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    updateViewport();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
      window.visualViewport.addEventListener('scroll', updateViewport);
    }
    window.addEventListener('scroll', updateViewport, { passive: false });

    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      document.body.style.overflow = prevOverflow;
      window.scrollTo(0, scrollY);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
        window.visualViewport.removeEventListener('scroll', updateViewport);
      }
      window.removeEventListener('scroll', updateViewport);
    };
  }, []);

  const isKeyboardActive = isFocused || isKeyboardOpen;

  // Handle ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    dispatch({ type: 'SET_SUBJECT', payload: val });
    onClose();
  };

  const handleReset = () => {
    setVal('');
  };

  const badge = (() => {
    if (state.cardType === 'pokemon') {
      return {
        label: state.pokemonSubtype === 'trainer' ? 'Trainer Card' : 'Pokémon Card',
        icon: '⚡',
        badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      };
    }
    if (state.cardType === 'metallic') {
      return {
        label: 'Metallic Card',
        icon: '🪙',
        badgeClass: 'bg-amber-400/15 text-amber-300 border-amber-400/30'
      };
    }
    return {
      label: 'Flower Card',
      icon: '🌸',
      badgeClass: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30'
    };
  })();

  // UX Copywriting: Dynamic occasion-aware placeholders for format guidance
  const placeholder = (() => {
    switch (state.occasion) {
      case 'birthday': return 'e.g., Happy 24th, Maya! ✨';
      case 'love': return 'e.g., To the moon & back 🌙';
      case 'thank_you': return 'e.g., Heartfelt Gratitude 🙏';
      case 'celebration': return 'e.g., Huge Congratulations! 🥂';
      case 'sorry': return 'e.g., Forgive me? 🥺';
      case 'miss_you': return 'e.g., Thinking of you always 💭';
      case 'get_well': return 'e.g., Sending warm healing hugs 🩹';
      case 'so_proud': return 'e.g., You did it!! So proud ⭐';
      case 'angry': return 'e.g., Read when you calm down 💥';
      case 'tired': return 'e.g., Time to pause & breathe 🌿';
      case 'homie': return 'e.g., To my day one 🤜🤛';
      default: return 'Give your card a headline...';
    }
  })();

  const maxLength = 25;
  const isAtLimit = val.length >= maxLength;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col items-center sm:justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />

        {/* Mobile Top Flex Spacer: smoothly glides modal up on focus without CSS transform (keeps iOS blue caret 100% locked) */}
        <div
          className={`w-full sm:hidden transition-[flex-grow,height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none ${
            isKeyboardActive ? 'grow-0 h-[28px]' : 'grow'
          }`}
        />

        {/* Modal Window matching Figma Tablets & Compact Mobile */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Edit Card Title"
          className="relative z-10 w-full max-w-[420px] sm:max-w-[466px] max-h-[calc(100svh-24px)] sm:max-h-[calc(100svh-32px)] flex flex-col select-none rounded-[20px] sm:rounded-[24px] bg-[#0E0E0E] border border-white/[0.12] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between h-[48px] sm:h-[60px] pl-4 sm:pl-5 pr-3.5 sm:pr-4 bg-[#1F1F1F] border-b border-white/[0.08] shrink-0">
            <h2 className="text-white/85 font-semibold text-[15px] sm:text-[17px] leading-[20px] sm:leading-[22px] tracking-[-0.02em] font-sans">
              Card Title
            </h2>

            {/* Cancel Button (Destructive Icon Button) */}
            <LiquidGlassIconButton 
              size="sm"
              label="Close dialog"
              onClick={onClose}
              icon={<X size={17} weight="bold" className="text-[#FF383C]" />}
              className="!w-[32px] !h-[32px] sm:!w-[38px] sm:!h-[38px]"
            />
          </div>

          {/* Form Content Area */}
          <form 
            onSubmit={handleSubmit} 
            onFocusCapture={() => {
              if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
              setIsFocused(true);
            }}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                blurTimeoutRef.current = setTimeout(() => {
                  setIsFocused(false);
                }, 80);
              }
            }}
            className="flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 bg-[#0E0E0E] overflow-y-auto"
          >
            {/* Title Field matching Figma Recessed Dark Box */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="card-title-input" 
                  className="text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-semibold text-[#D9D9D9] font-sans"
                >
                  Title:
                </label>
                {/* Spatial Context Helper Tag */}
                <span className="text-[10px] sm:text-[11px] text-[#8E8E93] font-sans">
                  Appears on front cover
                </span>
              </div>

              <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150 pb-6 sm:pb-7">
                <textarea
                  id="card-title-input"
                  value={val}
                  onChange={(e) => {
                    // Cap explicit newlines to 1 (strictly 2 lines max) so cursor never drops onto a phantom 3rd line
                    const raw = e.target.value;
                    const lines = raw.split('\n');
                    const clamped = lines.length > 2 ? `${lines[0]}\n${lines.slice(1).join(' ')}` : raw;
                    setVal(clamped.slice(0, maxLength));
                  }}
                  placeholder={placeholder}
                  rows={2}
                  maxLength={maxLength}
                  className="w-full h-[54px] bg-transparent px-3.5 sm:px-4 pt-2.5 pb-0 text-[16px] sm:text-[15px] leading-[22px] text-white placeholder-[#727272] outline-none resize-none overflow-hidden font-sans"
                  autoFocus={typeof window !== 'undefined' && window.innerWidth >= 640}
                />
                
                {/* Character Counter */}
                <div 
                  className={`absolute bottom-2 sm:bottom-2.5 right-3 text-[10px] sm:text-[11px] font-normal tabular-nums tracking-[0.0055em] font-sans transition-colors pointer-events-none ${
                    isAtLimit ? 'text-[#FF6961]/70' : 'text-white/25'
                  }`}
                >
                  {val.length} / {maxLength}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-1 sm:pt-2 shrink-0">
              {/* Clear Pill Button */}
              <button 
                type="button"
                onClick={handleReset}
                className="dark-liquid-glass-pill h-[38px] sm:h-[44px] px-4 sm:px-5 text-[14px] sm:text-[15px] leading-[18px] sm:leading-[20px] font-medium text-white font-sans"
              >
                Clear
              </button>

              {/* Done Primary Blue Pill Button */}
              <LiquidGlassButton 
                variant="primary" 
                size="md" 
                type="submit"
                className="!h-[38px] sm:!h-[44px] !px-4 sm:!px-5 !text-[14px] sm:!text-[15px]"
              >
                Done
              </LiquidGlassButton>
            </div>
          </form>
        </motion.div>

        {/* Mobile Bottom Flex Spacer: balances top spacer when keyboard is closed */}
        <div className="w-full grow sm:hidden pointer-events-none" />
      </div>
    </AnimatePresence>,
    document.body
  );
}
