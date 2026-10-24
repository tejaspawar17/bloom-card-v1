import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCard } from '@/context/CardContext';
import { X } from '@phosphor-icons/react';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';

export default function TitleModal({ onClose }) {
  const { state, dispatch } = useCard();
  const [val, setVal] = useState(state.subject || '');

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          aria-label="Edit Card Title"
          className="relative z-10 w-full max-w-[466px] flex flex-col select-none rounded-[24px] bg-[#0E0E0E] border border-white/[0.12] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 28,
            mass: 0.9
          }}
        >
          {/* Header Bar matching Figma Tablet Surface */}
          {/* Title Background Band matching Figma [466x60] */}
          <div className="flex items-center justify-between h-[60px] pl-5 pr-3 bg-[#1F1F1F] border-b border-white/[0.08]">
            <h2 className="text-white/85 font-semibold text-[17px] leading-[22px] tracking-[-0.02em] font-sans">
              Card Title
            </h2>

            {/* Cancel Button (Destructive Icon Button) centered vertically 5px from edges */}
            <LiquidGlassIconButton 
              size="sm"
              label="Close dialog"
              onClick={onClose}
              icon={<X size={26} weight="regular" className="text-[#FF383C]" />}
            />
          </div>

          {/* Form Content Area */}
          <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-6 bg-[#0E0E0E]">
            {/* Title Field matching Figma Recessed Dark Box */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="card-title-input" 
                  className="text-[13px] leading-[18px] font-semibold text-[#D9D9D9] font-sans"
                >
                  Title:
                </label>
                {/* Spatial Context Helper Tag */}
                <span className="text-[11px] text-[#8E8E93] font-sans">
                  Appears on front cover
                </span>
              </div>

              <div className="relative rounded-[11px] bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.10] focus-within:border-[#0055D4]/60 transition-all duration-150">
                <textarea
                  id="card-title-input"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  maxLength={maxLength}
                  className="w-full bg-transparent px-4 pt-3.5 pb-8 text-[15px] leading-[22px] text-white placeholder-[#727272] outline-none resize-none font-sans"
                  autoFocus
                />
                
                {/* Character Counter */}
                <div 
                  className={`absolute bottom-2.5 right-3 text-[11px] font-normal tabular-nums tracking-[0.0055em] font-sans transition-colors ${
                    isAtLimit ? 'text-[#FF6961]/70' : 'text-white/25'
                  }`}
                >
                  {val.length} / {maxLength}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons matching Figma Pills */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {/* Clear Pill Button */}
              <button 
                type="button"
                onClick={handleReset}
                className="dark-liquid-glass-pill h-[44px] px-5 text-[15px] leading-[20px] font-medium text-white font-sans"
              >
                Clear
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
    </AnimatePresence>
  );
}
