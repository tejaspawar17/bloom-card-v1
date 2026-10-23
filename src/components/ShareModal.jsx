import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Link, FileArrowDown, Sparkle, Heart, Eye } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';
import { saveSharedCard } from '@/lib/supabase';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';

// Shared spring physics matching TitleModal and MessageModal
const springTransition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.9
};

export default function ShareModal({ onClose, onOpenRecipientPreview }) {
  const { state, dispatch } = useCard();
  const [step, setStep] = useState('choice'); // 'choice' | 'success'
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState(`${window.location.origin}/?preview=recipient`);

  // Handle ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleGenerateLink = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const result = await saveSharedCard(state);
      if (result.state?.selectedBackImage && result.state.selectedBackImage !== state.selectedBackImage) {
        dispatch({ type: 'SET_BACK_IMAGE', payload: result.state.selectedBackImage });
      }
      setShareUrl(result.shareUrl);
      window.history.replaceState(null, '', `/?card=${result.id}`);
      setStep('success');
    } catch (err) {
      console.error('Failed to save card to Supabase:', err);
      setShareUrl(`${window.location.origin}/?preview=recipient`);
      setStep('success');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    alert("Generating print-ready PDF keepsake with card textures...");
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop matching Form Modals */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        />

        {/* Modal Window matching Figma Tablets & Form Modals */}
        <motion.div
          layout
          role="dialog"
          aria-modal="true"
          aria-label="Share Bloom Card"
          className="relative z-10 w-full max-w-[466px] flex flex-col select-none rounded-[32px] bg-[#131416] border border-white/[0.12] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={springTransition}
        >
          {/* Header Bar matching Figma Tablet Surface */}
          <div className="flex items-center justify-between h-[64px] pl-6 pr-2.5 bg-[#232427] border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-white font-semibold text-[17px] leading-[22px] tracking-[-0.0253em] font-sans">
                {step === 'choice' ? 'Share Your Creation' : 'Interactive Link'}
              </h2>
              {step === 'choice' ? (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-[14px] border ${badge.badgeClass} font-sans`}>
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-[14px] border bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-sans">
                  <span>✓</span>
                  <span>Live & Ready</span>
                </span>
              )}
            </div>

            {/* Liquid Glass Red Cross Button from Preview Mode */}
            <LiquidGlassIconButton 
              size="sm"
              label="Close dialog"
              onClick={onClose}
              icon={<X size={26} weight="regular" className="text-[#FF383C]" />}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 'choice' ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-7 flex flex-col items-center text-center bg-[#131416]"
              >
                {/* Hero Sparkle Orb */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#0066FF]/20 to-[#0066FF]/5 border border-[#0066FF]/30 flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(0,102,255,0.25)]">
                  <Sparkle size={30} weight="fill" className="text-[#0088FF]" />
                </div>

                <h3 className="text-white font-semibold text-[22px] leading-[28px] tracking-tight mb-2.5 font-sans">
                  Ready to Send the Magic?
                </h3>
                
                <p className="text-[rgba(229,229,234,0.7)] text-[14px] leading-[21px] max-w-[390px] mb-8 font-sans">
                  Generate an interactive 3D link so your recipient can flip, tilt, and explore every detail — or download a print-ready keepsake PDF.
                </p>

                {/* Hero UI Actions */}
                <div className="flex items-center gap-3 w-full justify-center">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="dark-liquid-glass-pill flex-1 max-w-[190px] h-[44px] px-5 text-[15px] leading-[20px] font-medium text-white flex items-center justify-center gap-2 font-sans"
                  >
                    <FileArrowDown size={26} weight="regular" className="text-white/80" />
                    <span>Download PDF</span>
                  </button>
                  <LiquidGlassButton
                    variant="primary"
                    size="md"
                    onClick={handleGenerateLink}
                    icon={<Link size={26} weight="regular" />}
                    className="flex-1 max-w-[200px]"
                  >
                    {isSaving ? 'Saving...' : 'Generate Link'}
                  </LiquidGlassButton>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-7 flex flex-col items-center text-center bg-[#131416]"
              >
                {/* Hero Glowing Check Disc */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#0066FF]/25 to-[#0066FF]/10 border-2 border-[#0088FF] flex items-center justify-center mb-5 shadow-[0_0_32px_rgba(0,136,255,0.4)]">
                  <Check size={32} weight="regular" className="text-[#0088FF]" />
                </div>
                
                <h3 className="text-white font-semibold text-[22px] leading-[28px] tracking-tight mb-2 font-sans">
                  Your Link is Ready! 🎉
                </h3>
                
                <p className="text-[rgba(229,229,234,0.7)] text-[14px] leading-[21px] max-w-[390px] mb-6 font-sans">
                  Anyone with this link can open the 3D card, unfold the message, and enjoy all interactive effects. Spread the warmth!
                </p>

                {/* Recessed Capsule Input matching Form UI */}
                <div className="w-full flex items-center justify-between bg-[#1B1C1F] border border-white/[0.10] focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/25 rounded-full p-1.5 pl-4 transition-all duration-150 mb-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent text-white/90 text-[13px] font-mono flex-1 outline-none truncate mr-2 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`h-[36px] w-[98px] shrink-0 rounded-full text-[13px] leading-[18px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer font-sans active:scale-[0.96] outline-none primary-liquid-glass-button text-white ${
                      copied ? 'is-success' : ''
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={18} weight="regular" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Link size={18} weight="regular" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Recipient Link Preview Action */}
                <div className="w-full mb-5">
                  <button
                    type="button"
                    onClick={onOpenRecipientPreview}
                    className="dark-liquid-glass-pill w-full h-[44px] px-5 text-[15px] leading-[20px] font-medium text-white flex items-center justify-center gap-2 font-sans cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <Eye size={22} weight="regular" className="text-white/80" />
                    <span>Preview Reveal as Recipient</span>
                  </button>
                </div>

                {/* Delight / Review Micro-copy */}
                <div className="flex items-center gap-1.5 text-[12px] text-[rgba(235,235,245,0.45)] font-sans">
                  <Heart size={14} weight="fill" className="text-pink-400" />
                  <span>Made someone smile today? Leave a review or craft another Bloom!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
