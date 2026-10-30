import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCard } from '@/context/CardContext';
import { X } from '@phosphor-icons/react';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';

export default function MessageModal({ onClose }) {
  const { state, dispatch } = useCard();
  const [to, setTo] = useState(state.to || '');
  const [from, setFrom] = useState(state.from || '');
  const [message, setMessage] = useState(state.message || '');
  const [trainerName, setTrainerName] = useState(state.trainerName || '');
  const [trainerBio, setTrainerBio] = useState(state.trainerBio || '');

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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    dispatch({ type: 'SET_TO', payload: to });
    dispatch({ type: 'SET_FROM', payload: from });
    dispatch({ type: 'SET_MESSAGE', payload: message });
    dispatch({ type: 'SET_TRAINER_NAME', payload: trainerName });
    dispatch({ type: 'SET_TRAINER_BIO', payload: trainerBio });
    onClose();
  };

  const isTrainer = state.cardType === 'pokemon' && state.pokemonSubtype === 'trainer';

  const handleReset = () => {
    if (isTrainer) {
      setTrainerName('');
      setTrainerBio('');
    } else {
      setTo('');
      setFrom('');
      setMessage('');
    }
  };

  const badge = (() => {
    if (state.cardType === 'pokemon') {
      return {
        label: isTrainer ? 'Trainer Card' : 'Pokémon Card',
        icon: isTrainer ? '🧢' : '⚡',
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

  // UX Copywriting: Emotionally resonant occasion-aware placeholders
  const messagePlaceholder = (() => {
    switch (state.occasion) {
      case 'birthday': return 'Write your warmest birthday wishes and memories...';
      case 'love': return 'Pour your heart out and say what they mean to you...';
      case 'thank_you': return 'Share what you are deeply grateful for...';
      case 'sorry': return 'Speak from the heart and make things right...';
      case 'celebration': return 'Cheer for their big moment and achievements...';
      case 'miss_you': return 'Tell them how much you miss having them around...';
      case 'get_well': return 'Send your gentle thoughts and healing energy...';
      case 'so_proud': return 'Celebrate how hard they worked to get here...';
      case 'angry': return 'Say your piece and let it all out...';
      case 'tired': return 'Remind them to rest, recharge, and take care...';
      case 'homie': return 'Drop a note for your day-one partner in crime...';
      default: return "Write what you've been wanting to say...";
    }
  })();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col items-center sm:justify-center p-3 sm:p-4">
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
            isKeyboardActive ? 'grow-0 h-[4px]' : 'grow'
          }`}
        />
        
        {/* Modal Window matching Figma Tablets & Compact Mobile */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={isTrainer ? "Edit Trainer Details" : "Edit Card Message"}
          className="relative z-10 w-full max-w-[440px] sm:max-w-[480px] max-h-[calc(100svh-24px)] sm:max-h-[calc(100svh-32px)] bg-[#0E0E0E] rounded-[20px] sm:rounded-[24px] overflow-hidden flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.85)] border border-white/[0.12] select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between h-[48px] sm:h-[60px] pl-4 sm:pl-5 pr-2 sm:pr-[11px] bg-[#1F1F1F] border-b border-white/[0.08] shrink-0">
            <h2 className="text-[rgba(255,255,255,0.85)] font-semibold text-[15px] sm:text-[17px] leading-[20px] sm:leading-[22px] tracking-[-0.02em] font-sans">
              {isTrainer ? 'Trainer Details' : 'Your Personal Note'}
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
            className="p-3 sm:p-6 flex flex-col gap-2 sm:gap-4 bg-[#0E0E0E] overflow-y-auto flex-1"
          >
            {isTrainer ? (
              <>
                {/* Name Field */}
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="trainer-name-input" className="text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                      Trainer Name:
                    </label>
                    <span className="text-[10px] sm:text-[11px] text-[#8E8E93] font-sans">
                      Badge name
                    </span>
                  </div>
                  <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150">
                    <input
                      id="trainer-name-input"
                      type="text"
                      placeholder="e.g., Red, Ash, Sarah..."
                      value={trainerName}
                      onChange={(e) => setTrainerName(e.target.value)}
                      maxLength={15}
                      className="w-full bg-transparent px-3.5 sm:px-4 py-2 sm:py-3 text-[16px] sm:text-[15px] leading-[22px] sm:leading-[20px] text-white placeholder-[#727272] outline-none font-sans pr-14 sm:pr-16"
                      autoFocus={typeof window !== 'undefined' && window.innerWidth >= 640}
                    />
                    <div className={`absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-[10px] sm:text-[11px] font-normal tabular-nums font-sans ${trainerName.length >= 15 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                      {trainerName.length} / 15
                    </div>
                  </div>
                </div>

                {/* Bio Field */}
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="trainer-bio-input" className="text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                      Bio & Battle Stats:
                    </label>
                    <span className="text-[10px] sm:text-[11px] text-[#8E8E93] font-sans">
                      Bottom banner
                    </span>
                  </div>
                  <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150">
                    <textarea
                      id="trainer-bio-input"
                      value={trainerBio}
                      placeholder="e.g., Level 99 Coffee Lover • HT: 5'8&quot; WT: 150 lbs"
                      onChange={(e) => setTrainerBio(e.target.value)}
                      maxLength={80}
                      rows={2}
                      className="w-full bg-transparent px-3.5 sm:px-4 pt-2.5 sm:pt-3.5 pb-6 sm:pb-7 text-[16px] sm:text-[15px] leading-[22px] text-white placeholder-[#727272] outline-none resize-none font-sans h-[80px] sm:h-[96px] overflow-y-auto"
                    />
                    <div className={`absolute bottom-2 sm:bottom-2.5 right-3 text-[10px] sm:text-[11px] font-normal tabular-nums font-sans ${trainerBio.length >= 80 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                      {trainerBio.length} / 80
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* To & From Fields: Side-by-side on mobile (<640px) to save 70px height; stacked on sm+ (tablet/laptop/PC) */}
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 sm:gap-4">
                  {/* To Field */}
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="card-to-input" className="text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                        To:
                      </label>
                      <span className="hidden sm:inline text-[11px] text-[#8E8E93] font-sans">
                        Recipient
                      </span>
                      <span className={`sm:hidden text-[10px] tabular-nums font-sans ${to.length >= 15 ? 'text-[#FF6961]/70' : 'text-[#8E8E93]'}`}>
                        {to.length}/15
                      </span>
                    </div>
                    <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150">
                      <input
                        id="card-to-input"
                        type="text"
                        placeholder="e.g., Maya..."
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        maxLength={15}
                        className="w-full bg-transparent px-3 sm:px-4 py-1.5 sm:py-3 text-[16px] sm:text-[15px] leading-[20px] text-white placeholder-[#727272] outline-none font-sans sm:pr-16"
                        autoFocus={typeof window !== 'undefined' && window.innerWidth >= 640}
                      />
                      <div className={`hidden sm:block absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-normal tabular-nums font-sans ${to.length >= 15 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                        {to.length} / 15
                      </div>
                    </div>
                  </div>

                  {/* From Field */}
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="card-from-input" className="text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                        From:
                      </label>
                      <span className="hidden sm:inline text-[11px] text-[#8E8E93] font-sans">
                        Sender
                      </span>
                      <span className={`sm:hidden text-[10px] tabular-nums font-sans ${from.length >= 15 ? 'text-[#FF6961]/70' : 'text-[#8E8E93]'}`}>
                        {from.length}/15
                      </span>
                    </div>
                    <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150">
                      <input
                        id="card-from-input"
                        type="text"
                        placeholder="e.g., Alex..."
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        maxLength={15}
                        className="w-full bg-transparent px-3 sm:px-4 py-1.5 sm:py-3 text-[16px] sm:text-[15px] leading-[20px] text-white placeholder-[#727272] outline-none font-sans sm:pr-16"
                      />
                      <div className={`hidden sm:block absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-normal tabular-nums font-sans ${from.length >= 15 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                        {from.length} / 15
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Field: Height fits full 194 chars completely without scroll */}
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="card-message-input" className="text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                      Message:
                    </label>
                    <span className="text-[10px] sm:text-[11px] text-[#8E8E93] font-sans">
                      Printed on back
                    </span>
                  </div>

                  <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150 pb-6 sm:pb-7">
                    <textarea
                      id="card-message-input"
                      placeholder={messagePlaceholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={194}
                      className="w-full h-[126px] sm:h-[124px] bg-transparent px-3.5 sm:px-4 pt-2.5 sm:pt-3.5 pb-0 text-[16px] sm:text-[15px] leading-[20px] sm:leading-[21px] text-white placeholder-[#727272] outline-none resize-none font-sans overflow-y-auto"
                    />
                    <div className={`absolute bottom-1.5 sm:bottom-2 right-3 text-[10px] sm:text-[11px] font-normal tabular-nums font-sans pointer-events-none ${message.length >= 194 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                      {message.length} / 194
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Footer Action Buttons matching Figma Pills */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-0.5 sm:pt-2 shrink-0">
              {/* Clear All Pill Button */}
              <button 
                type="button" 
                onClick={handleReset}
                className="dark-liquid-glass-pill h-[36px] sm:h-[44px] px-4 sm:px-5 text-[14px] sm:text-[15px] leading-[18px] sm:leading-[20px] font-medium text-white font-sans"
              >
                Clear All
              </button>

              {/* Done Primary Blue Pill Button */}
              <LiquidGlassButton 
                variant="primary" 
                size="md" 
                type="submit"
                className="!h-[36px] sm:!h-[44px] !px-4 sm:!px-5 !text-[14px] sm:!text-[15px]"
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
