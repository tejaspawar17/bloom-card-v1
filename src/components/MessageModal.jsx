import React, { useState, useEffect } from 'react';
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        />
        
        {/* Modal Window matching Figma Tablets */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={isTrainer ? "Edit Trainer Details" : "Edit Card Message"}
          className="relative z-10 w-full max-w-[480px] bg-[#0E0E0E] rounded-[24px] overflow-hidden flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.85)] border border-white/[0.12] select-none"
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar matching Figma Tablet Surface */}
          {/* Title Background Band matching Figma [466x60] */}
          <div className="flex items-center justify-between h-[60px] pl-5 pr-3 bg-[#1F1F1F] border-b border-white/[0.08]">
            <h2 className="text-[rgba(255,255,255,0.85)] font-medium text-[17px] leading-[22px] tracking-[-0.02em] font-sans">
              {isTrainer ? 'Trainer Details' : 'Your Personal Note'}
            </h2>
            
            {/* Cancel Button (Destructive Icon Button) centered vertically 5px from edges */}
            <LiquidGlassIconButton 
              size="sm"
              label="Close dialog"
              onClick={onClose}
              icon={<X size={22} weight="bold" className="text-white/80 hover:text-white transition-colors" />}
            />
          </div>

          {/* Form Content Area */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 bg-[#0E0E0E]">
            {isTrainer ? (
              <>
                {/* Name Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="trainer-name-input" className="text-[13px] leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                      Trainer Name:
                    </label>
                    <span className="text-[11px] text-[#8E8E93] font-sans">
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
                      className="w-full bg-transparent px-4 py-3 text-[15px] leading-[20px] text-white placeholder-[#727272] outline-none font-sans pr-16"
                      autoFocus
                    />
                    <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-normal tabular-nums font-sans ${trainerName.length >= 15 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                      {trainerName.length} / 15
                    </div>
                  </div>
                </div>

                {/* Bio Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="trainer-bio-input" className="text-[13px] leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                      Bio & Battle Stats:
                    </label>
                    <span className="text-[11px] text-[#8E8E93] font-sans">
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
                      rows={3}
                      className="w-full bg-transparent px-4 pt-3.5 pb-7 text-[15px] leading-[22px] text-white placeholder-[#727272] outline-none resize-none font-sans h-[96px]"
                    />
                    <div className={`absolute bottom-2.5 right-3 text-[11px] font-normal tabular-nums font-sans ${trainerBio.length >= 80 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                      {trainerBio.length} / 80
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* To Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="card-to-input" className="text-[13px] leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                      To:
                    </label>
                    <span className="text-[11px] text-[#8E8E93] font-sans">
                      Recipient
                    </span>
                  </div>
                  <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150">
                    <input
                      id="card-to-input"
                      type="text"
                      placeholder="e.g., Maya, Bestie, Mom..."
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      maxLength={15}
                      className="w-full bg-transparent px-4 py-3 text-[15px] leading-[20px] text-white placeholder-[#727272] outline-none font-sans pr-16"
                      autoFocus
                    />
                    <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-normal tabular-nums font-sans ${to.length >= 15 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                      {to.length} / 15
                    </div>
                  </div>
                </div>

                {/* From Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="card-from-input" className="text-[13px] leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                      From:
                    </label>
                    <span className="text-[11px] text-[#8E8E93] font-sans">
                      Sender
                    </span>
                  </div>
                  <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150">
                    <input
                      id="card-from-input"
                      type="text"
                      placeholder="e.g., Alex, Secret Admirer..."
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      maxLength={15}
                      className="w-full bg-transparent px-4 py-3 text-[15px] leading-[20px] text-white placeholder-[#727272] outline-none font-sans pr-16"
                    />
                    <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-normal tabular-nums font-sans ${from.length >= 15 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                      {from.length} / 15
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="card-message-input" className="text-[13px] leading-[18px] font-semibold text-[#D9D9D9] font-sans">
                      Message:
                    </label>
                    <span className="text-[11px] text-[#8E8E93] font-sans">
                      Printed on back
                    </span>
                  </div>

                  <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150">
                    <textarea
                      id="card-message-input"
                      placeholder={messagePlaceholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={194}
                      className="w-full h-[140px] bg-transparent px-4 pt-3.5 pb-8 text-[15px] leading-[22px] text-white placeholder-[#727272] outline-none resize-none font-sans"
                    />
                    <div className={`absolute bottom-2.5 right-3 text-[11px] font-normal tabular-nums font-sans ${message.length >= 194 ? 'text-[#FF6961]/70' : 'text-[#727272]'}`}>
                      {message.length} / 194
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Footer Action Buttons matching Figma Pills */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {/* Clear All Pill Button */}
              <button 
                type="button" 
                onClick={handleReset}
                className="dark-liquid-glass-pill h-[44px] px-5 text-[15px] leading-[20px] font-medium text-white font-sans"
              >
                Clear All
              </button>

              {/* Done Primary Blue Pill Button */}
              <LiquidGlassButton 
                variant="primary" 
                size="md" 
                type="submit"
              >
                Done
              </LiquidGlassButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
