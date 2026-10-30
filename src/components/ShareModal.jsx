import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Warning } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';
import { saveSharedCard } from '@/lib/supabase';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';
import { PokemonCardFront, PokemonCardBack } from './cards/PokemonCard';
import { MetallicCardFront, MetallicCardBack } from './cards/MetallicCard';
import { PaperCardBack } from './cards/PaperCard';
import { PaperCardFront } from '@/components/card/modes/PaperCardFront';
import { showToast } from '@/components/ui/AppleToast';

// Exact spring physics matching TitleModal and MessageModal
const springTransition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.9
};

// Rich celebration palette (Apple vibrant tones)
const CONFETTI_COLORS = [
  '#0088FF', '#00C7BE', '#30B0C7', '#FFD60A', '#FF9F0A', 
  '#FF375F', '#BF5AF2', '#34C759', '#FFFFFF', '#64D2FF'
];

/**
 * Dramatic Button-Anchored Confetti Burst (Framer Motion)
 */
function DramaticButtonConfetti({ triggerKey }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!triggerKey) return;
    const count = 48;
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angleDeg = -90 + (Math.random() - 0.5) * 150;
      const angleRad = (angleDeg * Math.PI) / 180;
      const distance = 65 + Math.random() * 85;
      const x = Math.cos(angleRad) * distance;
      const y = Math.sin(angleRad) * distance - 25;
      const size = 3.5 + Math.random() * 4.5;
      const shapeType = i % 3;
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const rotateX = Math.random() * 720;
      const rotateY = Math.random() * 720;
      const rotateZ = (Math.random() - 0.5) * 540;

      return {
        id: `${triggerKey}-${i}`,
        x,
        y,
        size,
        shapeType,
        color,
        rotateX,
        rotateY,
        rotateZ,
        duration: 0.75 + Math.random() * 0.35,
      };
    });

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0.1, 
            opacity: 1, 
            rotateX: 0, 
            rotateY: 0, 
            rotateZ: 0 
          }}
          animate={{
            x: p.x,
            y: [0, p.y * 1.15, p.y + 35],
            scale: [0.1, 1.25, 0.8, 0],
            opacity: [1, 1, 0.9, 0],
            rotateX: p.rotateX,
            rotateY: p.rotateY,
            rotateZ: p.rotateZ,
          }}
          transition={{
            duration: p.duration,
            times: [0, 0.45, 0.8, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: p.shapeType === 1 ? `${p.size * 2.2}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shapeType === 0 ? '9999px' : p.shapeType === 1 ? '1px' : '2px',
            boxShadow: `0 0 8px ${p.color}88`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Tactical Amber Caution Starburst Badge
 * Clean, flat vector geometry with zero glow or drop-shadow halo
 */
function CautionWarningBadge() {
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 480,
          damping: 24,
          mass: 0.8,
        }}
        className="w-12 h-12 flex items-center justify-center relative select-none"
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <polygon 
            points="50.0,0.5 57.7,11.3 68.9,4.3 71.9,17.2 85.0,15.0 82.8,28.1 95.7,31.1 88.7,42.3 99.5,50.0 88.7,57.7 95.7,68.9 82.8,71.9 85.0,85.0 71.9,82.8 68.9,95.7 57.7,88.7 50.0,99.5 42.3,88.7 31.1,95.7 28.1,82.8 15.0,85.0 17.2,71.9 4.3,68.9 11.3,57.7 0.5,50.0 11.3,42.3 4.3,31.1 17.2,28.1 15.0,15.0 28.1,17.2 31.1,4.3 42.3,11.3" 
            fill="#D97706"
            stroke="#FDE68A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Canonical Phosphor Warning Icon (size=22) */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 500, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center text-white pb-0.5"
        >
          <Warning size={22} weight="bold" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Phosphor Tick inside the Blue Polygon Starburst Badge
 * Clean, flat vector geometry with zero glow or drop-shadow halo
 */
function PolygonCheckmarkBadge() {
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 480,
          damping: 24,
          mass: 0.8,
        }}
        className="w-12 h-12 flex items-center justify-center relative select-none"
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <polygon 
            points="50.0,0.5 57.7,11.3 68.9,4.3 71.9,17.2 85.0,15.0 82.8,28.1 95.7,31.1 88.7,42.3 99.5,50.0 88.7,57.7 95.7,68.9 82.8,71.9 85.0,85.0 71.9,82.8 68.9,95.7 57.7,88.7 50.0,99.5 42.3,88.7 31.1,95.7 28.1,82.8 15.0,85.0 17.2,71.9 4.3,68.9 11.3,57.7 0.5,50.0 11.3,42.3 4.3,31.1 17.2,28.1 15.0,15.0 28.1,17.2 31.1,4.3 42.3,11.3" 
            fill="#0B65FF"
            stroke="#5C9DFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Canonical Phosphor Checkmark Icon (size=22 matching Warning) */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 500, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center text-white"
        >
          <Check size={22} weight="bold" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Pre-Flight Scanning Progress Diagnostics
 */
const LINK_PREFLIGHT_STEPS = [
  "Calibrating 3D holographic foil...",
  "Securing emotional payload...",
  "Sealing virtual envelope..."
];

const PDF_PREFLIGHT_STEPS = [
  "Rasterizing 300+ DPI card faces...",
  "Aligning double-sided punch holes...",
  "Packaging keychain keepsake PDF..."
];

export default function ShareModal({ onClose, onOpenRecipientPreview }) {
  const { state, dispatch, flower } = useCard();
  const [step, setStep] = useState('choice');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const frontRef = React.useRef(null);
  const backRef = React.useRef(null); // 'choice' | 'sealing' | 'success'
  const [preflightIndex, setPreflightIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyConfettiKey, setCopyConfettiKey] = useState(0);
  const [pdfConfettiKey, setPdfConfettiKey] = useState(0);
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
    setCopyConfettiKey(prev => prev + 1);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateLink = async () => {
    if (step === 'sealing') return;
    setStep('sealing');
    setPreflightIndex(0);

    const stepInterval = setInterval(() => {
      setPreflightIndex((prev) => (prev < LINK_PREFLIGHT_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await saveSharedCard(state);
      if (result.state?.selectedBackImage && result.state.selectedBackImage !== state.selectedBackImage) {
        dispatch({ type: 'SET_BACK_IMAGE', payload: result.state.selectedBackImage });
      }
      setShareUrl(result.shareUrl);
      window.history.replaceState(null, '', `/?card=${result.id}`);
    } catch (err) {
      console.error('Failed to save card to Supabase:', err);
      setShareUrl(`${window.location.origin}/?preview=recipient`);
    } finally {
      setTimeout(() => {
        clearInterval(stepInterval);
        setStep('success');
      }, 1400);
    }
  };

  const handleDownloadPDF = async () => {
    if (step === 'packaging' || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setStep('packaging');
    setPreflightIndex(0);

    const stepInterval = setInterval(() => {
      setPreflightIndex((prev) => (prev < PDF_PREFLIGHT_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    // Give browser brief tick to transition into packaging view smoothly
    await new Promise((r) => setTimeout(r, 80));

    try {
      const { generateKeychainPdf } = await import('@/lib/generateCardPdf');
      await generateKeychainPdf({
        frontElement: frontRef.current,
        backElement: backRef.current,
        cardTitle: state.subject || state.title || 'bloom-keychain-keepsake',
      });

      // Brief pause for tactile visual feedback before showing success
      setTimeout(() => {
        clearInterval(stepInterval);
        setIsGeneratingPdf(false);
        setStep('pdf-success');
        setPdfConfettiKey((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      clearInterval(stepInterval);
      setIsGeneratingPdf(false);
      setStep('choice');
      console.error('Failed to generate keychain PDF:', err);
      showToast({
        title: 'Could not generate PDF keepsake',
        description: 'Please try again or check browser permissions.',
        duration: 3500,
      });
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop matching TitleModal & MessageModal */}
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
          role="dialog"
          aria-modal="true"
          aria-label="Generate Link or Download"
          layout
          className="relative z-10 w-[calc(100%-8px)] sm:w-[calc(100%-32px)] max-w-[420px] sm:max-w-[466px] mx-auto flex flex-col select-none rounded-[20px] sm:rounded-[24px] bg-[#0E0E0E] border border-white/[0.12] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)] font-sans"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={springTransition}
        >
          {/* Header Bar matching Figma Tablet Surface with equal top & right close button gap */}
          <div className="flex items-center justify-between h-[48px] sm:h-[60px] pl-4 sm:pl-5 pr-2 sm:pr-[11px] bg-[#1F1F1F] border-b border-white/[0.08]">
            <h2 className="text-[rgba(255,255,255,0.85)] font-semibold sm:font-medium text-[15px] sm:text-[17px] leading-[20px] sm:leading-[22px] tracking-[-0.02em] font-sans">
              {step === 'choice'
              ? 'Seal & Send'
              : step === 'sealing'
              ? 'Sealing Your Bloom'
              : step === 'packaging'
              ? 'Packaging Print Keepsake'
              : step === 'pdf-success'
              ? 'Keepsake Ready'
              : 'Share Your Card'}
            </h2>

            {/* Cancel Button (Destructive Liquid Glass Icon Button) */}
            <LiquidGlassIconButton 
              size="sm"
              label="Close dialog"
              onClick={onClose}
              icon={<X size={17} weight="bold" className="text-[#FF383C]" />}
              className="!w-[32px] !h-[32px] sm:!w-[38px] sm:!h-[38px]"
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 'choice' ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-6 pt-6 pb-7 flex flex-col items-center text-center bg-[#0E0E0E] font-sans"
              >
                {/* Hero Decal Badge */}
                <div className="mb-3">
                  <CautionWarningBadge />
                </div>

                {/* Title & Copy Group */}
                <h3 className="text-white font-bold text-[19px] leading-[24px] tracking-[-0.02em] font-sans">
                  Point of No Return
                </h3>
                
                <p className="mt-2 text-[#999999] text-[12.5px] leading-[19px] max-w-[340px] font-sans font-normal">
                  Your card is ready. Ship it out before you accidentally talk yourself out of being this wholesome.
                </p>

                {/* Actions Group: Figma 24px breathing space */}
                <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 sm:gap-3 w-full max-w-[380px] justify-center mt-6 font-sans">
                  <div className="relative w-full sm:flex-1 sm:max-w-[190px]">
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="dark-liquid-glass-pill w-full h-[48px] sm:h-[44px] px-5 text-[15px] sm:text-[14px] leading-[20px] tracking-[-0.01em] font-medium text-white flex items-center justify-center font-sans active:scale-[0.96] transition-transform cursor-pointer whitespace-nowrap"
                    >
                      <span>{isGeneratingPdf ? 'Packaging...' : 'Download PDF'}</span>
                    </button>
                  </div>

                  <LiquidGlassButton
                    variant="primary"
                    size="md"
                    onClick={handleGenerateLink}
                    className="w-full sm:flex-1 sm:max-w-[190px] h-[48px] sm:h-[44px] text-[15px] sm:text-[14px] leading-[20px] tracking-[-0.01em] font-medium text-white font-sans"
                  >
                    Generate Link
                  </LiquidGlassButton>
                </div>
              </motion.div>
            ) : step === 'sealing' || step === 'packaging' ? (
              /* Pre-Flight Inspection & Live Envelope Sealing / Packaging View */
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="p-8 pt-7 pb-9 flex flex-col items-center text-center bg-[#0E0E0E] gap-4 font-sans"
              >
                {/* Interactive Envelope Icon with spring lock animation */}
                <div className="relative w-16 h-14 rounded-[12px] bg-[#1A1A1A] border border-white/[0.12] flex items-center justify-center shadow-lg overflow-hidden">
                  {/* Flap */}
                  <motion.div
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: [0, 180] }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute top-0 inset-x-0 h-7 bg-[#242424] border-b border-white/[0.10] origin-top"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  />
                  {/* Seal dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ delay: 0.65, duration: 0.35, type: "spring", stiffness: 400 }}
                    className="relative z-10 w-4 h-4 rounded-full bg-[#0088FF] shadow-[0_0_10px_rgba(0,136,255,0.8)]"
                  />
                </div>

                <div className="flex flex-col items-center gap-1.5 font-sans">
                  <h3 className="text-white font-semibold text-[17px] leading-[22px] tracking-[-0.01em] font-sans">
                    {step === 'packaging' ? 'Packaging Keepsake' : 'Pre-Flight Inspection'}
                  </h3>
                  {/* Unified typeface (Geist / font-sans) throughout */}
                  <motion.p
                    key={`${step}-${preflightIndex}`}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    className="text-[#0088FF] text-[13px] font-medium font-sans"
                  >
                    {step === 'packaging'
                      ? PDF_PREFLIGHT_STEPS[preflightIndex]
                      : LINK_PREFLIGHT_STEPS[preflightIndex]}
                  </motion.p>
                </div>
              </motion.div>
            ) : step === 'pdf-success' ? (
              /* PDF Download Success Celebration View */
              <motion.div
                key="pdf-success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-6 pt-6 pb-7 flex flex-col items-center text-center bg-[#0E0E0E] font-sans"
              >
                {/* Hero Decal Badge: Same Starburst & Tick as Share Link */}
                <div className="mb-3">
                  <PolygonCheckmarkBadge />
                </div>
                
                {/* Title & Copy Group */}
                <h3 className="text-white font-bold text-[19px] leading-[24px] tracking-[-0.02em] font-sans">
                  Keepsake Ready to Print!
                </h3>
                
                <p className="mt-2 text-[#999999] text-[12.5px] leading-[19px] max-w-[340px] font-sans font-normal">
                  Your 300+ DPI keychain print sheet is in your downloads. Cut along the crop marks, laminate, and attach to your keychain!
                </p>

                {/* Continue Action Button with Celebration Confetti */}
                <div className="relative w-full max-w-[340px] mt-6 font-sans">
                  <DramaticButtonConfetti triggerKey={pdfConfettiKey} />
                  <LiquidGlassButton
                    variant="primary"
                    size="md"
                    onClick={onClose}
                    className="w-full h-[44px] font-medium text-white font-sans"
                  >
                    Continue
                  </LiquidGlassButton>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-6 pt-6 pb-7 flex flex-col items-center text-center bg-[#0E0E0E] font-sans"
              >
                {/* Hero Decal Badge */}
                <div className="mb-3">
                  <PolygonCheckmarkBadge />
                </div>
                
                {/* Title & Copy Group */}
                <h3 className="text-white font-bold text-[19px] leading-[24px] tracking-[-0.02em] font-sans">
                  Hot & Fresh Out the Oven
                </h3>
                
                <p className="mt-2 text-[#999999] text-[12.5px] leading-[19px] max-w-[340px] font-sans font-normal">
                  Send this interactive 3D link to your human. Zero spam, 100% emotional damage (the good kind).
                </p>

                {/* Actions Group: Figma 24px breathing space */}
                <div className="w-full max-w-[400px] flex items-center gap-2.5 mt-6 font-sans">
                  {/* Link Box: rounded-[14px], #181818, zero shadow, border-white/[0.08] */}
                  <div className="flex-1 h-[44px] px-3.5 flex items-center rounded-[14px] bg-[#181818] border border-white/[0.08] focus-within:border-white/[0.20] transition-colors">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="bg-transparent text-[#E5E5EA] text-[12.5px] font-sans tracking-tight w-full outline-none select-all truncate"
                    />
                  </div>

                  {/* Copy Button matching Continue/Confirm button shape, surface & liquid glass */}
                  <div className="relative shrink-0">
                    <DramaticButtonConfetti triggerKey={copyConfettiKey} />
                    <LiquidGlassButton
                      variant="primary"
                      size="md"
                      onClick={handleCopy}
                      className="h-[44px] px-5 font-medium text-white font-sans"
                    >
                      <motion.span
                        key={copied ? 'copied' : 'copy'}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.span>
                    </LiquidGlassButton>
                  </div>
                </div>

                {/* Recipient Link Preview Action: 12px gap from link row */}
                <div className="w-full max-w-[400px] mt-3 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      if (!state.date || !state.time) {
                        const now = new Date();
                        dispatch({
                          type: 'SET_TIMESTAMP',
                          payload: {
                            date: state.date || now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
                            time: state.time || now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
                          }
                        });
                      }
                      onOpenRecipientPreview?.();
                    }}
                    className="dark-liquid-glass-pill w-full h-[40px] px-5 text-[13.5px] leading-[20px] font-medium text-[#FFFFFF] hover:text-[#FFFFFF] flex items-center justify-center font-sans cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <span>Sneak a Peek as Recipient</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    {/* In-Viewport Hidden 350x488 Render Stage for Keychain PDF Capture (Studio-Calibrated Proportions) */}
      <div 
        aria-hidden="true"
        className="fixed left-0 top-0 pointer-events-none flex flex-col gap-4 overflow-visible"
        style={{ zIndex: -1, opacity: 0.003 }}
      >
        <div 
          ref={frontRef} 
          style={{ width: '350px', height: '488px', minWidth: '350px', maxWidth: '350px', minHeight: '488px', maxHeight: '488px', flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: (state.cardType === 'pokemon' || state.cardType === 'metallic') ? '16px' : '0px', backgroundColor: 'transparent' }}
        >
          {state.cardType === 'pokemon' ? (
            <PokemonCardFront isPreview={true} />
          ) : state.cardType === 'metallic' ? (
            <MetallicCardFront isPreview={true} />
          ) : (
            <PaperCardFront state={state} flower={flower} isPreview={true} />
          )}
        </div>

        <div 
          ref={backRef} 
          style={{ width: '350px', height: '488px', minWidth: '350px', maxWidth: '350px', minHeight: '488px', maxHeight: '488px', flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: (state.cardType === 'pokemon' || state.cardType === 'metallic') ? '16px' : '0px', backgroundColor: 'transparent' }}
        >
          {state.cardType === 'pokemon' ? (
            <PokemonCardBack isPreview={true} />
          ) : state.cardType === 'metallic' ? (
            <MetallicCardBack isPreview={true} />
          ) : (
            <PaperCardBack isPreview={true} />
          )}
        </div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
