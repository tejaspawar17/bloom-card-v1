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
          className="relative z-10 w-full max-w-[466px] flex flex-col select-none rounded-[32px] bg-[#131416] border border-white/[0.12] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
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
          <div className="flex items-center justify-between h-[64px] pl-6 pr-2.5 bg-[#232427] border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-white font-semibold text-[17px] leading-[22px] tracking-[-0.0253em] font-sans">
                Card Title
              </h2>
              {/* Context Tag preserved */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-[14px] border ${badge.badgeClass} font-sans`}>
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </span>
            </div>

            {/* Liquid Glass Red Cross Button from Preview Mode */}
            <LiquidGlassIconButton 
              size="sm"
              label="Close dialog"
              onClick={onClose}
              icon={<X size={26} weight="regular" className="text-[#FF383C]" />}
            />
          </div>

          {/* Form Content Area */}
          <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-6 bg-[#131416]">
            {/* Title Field matching Figma Recessed Dark Box */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="card-title-input" 
                  className="text-[13px] leading-[18px] font-semibold text-[rgba(229,229,234,0.85)] font-sans"
                >
                  Title:
                </label>
                {/* Spatial Context Helper Tag */}
                <span className="text-[11px] text-[rgba(235,235,245,0.4)] font-sans">
                  Appears on front cover
                </span>
              </div>

              <div className="relative rounded-[14px] bg-[#1B1C1F] hover:bg-[#202125] focus-within:bg-[#202125] border border-white/[0.08] focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/30 transition-all duration-150">
                <textarea
                  id="card-title-input"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  maxLength={maxLength}
                  className="w-full bg-transparent px-4 pt-3.5 pb-8 text-[15px] leading-[22px] text-white placeholder-[#5A5B60] outline-none resize-none font-sans"
                  autoFocus
                />
                
                {/* Character Counter */}
                <div 
                  className={`absolute bottom-2.5 right-3 text-[11px] font-medium tracking-[0.0055em] font-sans transition-colors ${
                    isAtLimit ? 'text-amber-400 font-semibold' : 'text-[rgba(235,235,245,0.40)]'
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
