import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Sticker, ChatTeardropDots } from '@phosphor-icons/react';
import { Tabs, Tab, TabList, TabListContainer, TabIndicator } from '@heroui/react';
import { SharedElementTransition } from 'react-aria-components';
import { supabase } from '@/lib/supabase';
import LiquidGlassIconButton from '@/components/ui/LiquidGlassIconButton';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';

// Apple Spring Physics
const appleSpring = {
  type: "spring",
  stiffness: 500,
  damping: 35,
  mass: 0.8
};

const modalSpring = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.9
};

const CONFETTI_COLORS = [
  '#0088FF', '#00C7BE', '#30B0C7', '#FFD60A', '#FF9F0A', 
  '#FF375F', '#BF5AF2', '#34C759', '#FFFFFF', '#64D2FF'
];

function ConfettiBurst({ triggerKey }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!triggerKey) return;
    const count = 36;
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angleDeg = -90 + (Math.random() - 0.5) * 150;
      const angleRad = (angleDeg * Math.PI) / 180;
      const distance = 55 + Math.random() * 75;
      const x = Math.cos(angleRad) * distance;
      const y = Math.sin(angleRad) * distance - 20;
      const size = 3 + Math.random() * 3.5;
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];

      return {
        id: `${triggerKey}-${i}`,
        x,
        y,
        size,
        color,
        rotateZ: (Math.random() - 0.5) * 480,
        duration: 0.7 + Math.random() * 0.3,
      };
    });

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1100);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotateZ: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y * 1.15, p.y + 25],
            scale: [0.2, 1.2, 0.7, 0],
            opacity: [1, 1, 0.8, 0],
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
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: '9999px',
            boxShadow: `0 0 6px ${p.color}88`,
          }}
        />
      ))}
    </div>
  );
}

const CATEGORIES = [
  {
    id: 'bug',
    label: 'Bug',
    icon: Bug,
    placeholder: "What broke? Did a flower wilt, or did the whole card combust into flames? Tell me what happened...",
  },
  {
    id: 'sticker',
    label: 'Sticker Idea',
    icon: Sticker,
    placeholder: "What sticker do we desperately need? (e.g. an unhinged capybara, crying cat, dramatic hamster...)",
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: ChatTeardropDots,
    placeholder: "Be brutally honest. Loved it? Hated it? Have a wild idea? I'm listening...",
  },
];

const MAX_CHARS = 300;

export default function FeedbackModal({ onClose }) {
  const [category, setCategory] = useState('feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

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

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const activeCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[2];
  const isAtLimit = message.length >= MAX_CHARS;

  const handleReset = () => {
    setMessage('');
    setEmail('');
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setConfettiKey(prev => prev + 1);

    // Save to localStorage immediately so user feedback is permanently safe
    try {
      const existing = JSON.parse(localStorage.getItem('bloom_feedback') || '[]');
      existing.push({ 
        category, 
        message: message.trim(), 
        email: email.trim() || null, 
        time: new Date().toISOString() 
      });
      localStorage.setItem('bloom_feedback', JSON.stringify(existing));
    } catch (_) {}

    // Background push to Supabase with timeout (silent fallback if table doesn't exist)
    Promise.race([
      supabase.from('feedback').insert([{
        category,
        message: message.trim(),
        email: email.trim() || null,
        created_at: new Date().toISOString()
      }]),
      new Promise((_, reject) => setTimeout(() => reject('timeout'), 2500))
    ]).catch((err) => {
      console.info('Feedback logged locally:', { category, message, email });
    });

    // Background email alert via Vercel serverless Resend function
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        message: message.trim(),
        email: email.trim() || null,
        created_at: new Date().toISOString()
      })
    }).catch((err) => {
      console.warn('Feedback notification dispatch skipped or failed:', err);
    });

    // Instant, smooth transition into celebration screen
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 280);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col items-center sm:justify-center p-3 sm:p-4">
      {/* Backdrop matching ShareModal */}
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

      {/* Modal Window in exact ShareModal / Tablet Surface styling */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Send feedback"
        className="relative z-10 w-full max-w-[440px] sm:max-w-[466px] max-h-[calc(100svh-24px)] sm:max-h-[calc(100svh-32px)] flex flex-col select-none rounded-[20px] sm:rounded-[24px] bg-[#0E0E0E] border border-white/[0.12] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)] font-sans"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {/* Header Bar matching Figma Tablet Surface [466x60] */}
        <div className="flex items-center justify-between h-[48px] sm:h-[60px] pl-4 sm:pl-5 pr-2 sm:pr-[11px] bg-[#1F1F1F] border-b border-white/[0.08] shrink-0">
          <h2 className="text-[rgba(255,255,255,0.85)] font-semibold sm:font-medium text-[15px] sm:text-[17px] leading-[20px] sm:leading-[22px] tracking-[-0.02em] font-sans">
            {isSubmitted ? 'Feedback Sent' : 'Send Feedback'}
          </h2>

          <LiquidGlassIconButton 
            size="sm"
            label="Close dialog"
            onClick={onClose}
            icon={<X size={17} weight="bold" className="text-[#FF383C]" />}
            className="!w-[32px] !h-[32px] sm:!w-[38px] sm:!h-[38px]"
          />
        </div>

        {/* Modal Body: Aligned with TitleModal / MessageModal mobile & tablet scale */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form 
              key="form"
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 bg-[#0E0E0E] overflow-y-auto flex-1"
            >
              {/* Clean Subtitle */}
              <p className="text-[#999999] text-[12.5px] sm:text-[13px] leading-[17px] sm:leading-[18px] font-sans font-normal">
                Bugs, sticker ideas, or confessions. Goes straight to me.
              </p>

              {/* Segmented Control: HeroUI scale p-1 track, gap-1.5 label */}
              <div className="w-full">
                <div 
                  role="tablist"
                  aria-label="Feedback Category" 
                  className="grid grid-cols-3 p-1 bg-[#161616] border border-white/[0.08] rounded-full relative"
                >
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = category === cat.id;
                    return (
                      <button
                        type="button"
                        role="tab"
                        key={cat.id}
                        id={`tab-${cat.id}`}
                        aria-selected={isActive}
                        onClick={() => setCategory(cat.id)}
                        className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 h-[32px] sm:h-[34px] rounded-full text-[12px] sm:text-[13px] font-medium transition-colors cursor-pointer outline-none select-none"
                      >
                        {/* Pure Neutral Active Pill matching modal surface hierarchy */}
                        {isActive && (
                          <motion.div
                            layoutId="activeFeedbackTab"
                            className="absolute inset-0 rounded-full bg-[#242424] -z-10"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 38,
                              mass: 0.8
                            }}
                          />
                        )}
                        <Icon 
                          size={15} 
                          weight={isActive ? 'duotone' : 'regular'} 
                          className={`transition-colors shrink-0 ${isActive ? 'text-[#FFFFFF]' : 'text-[#999999]'}`} 
                        />
                        <span className={`transition-colors truncate ${isActive ? 'text-[#FFFFFF] font-medium' : 'text-[#999999] hover:text-[#FFFFFF]'}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recessed Textarea with Integrated Counter: HeroUI p-3.5 input scale */}
              <div className="relative rounded-[12px] sm:rounded-[14px] bg-[#161616] border border-white/[0.10] focus-within:border-[#0055D4]/70 focus-within:ring-1 focus-within:ring-[#0055D4]/30 transition-all">
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={activeCategory.placeholder}
                  maxLength={MAX_CHARS}
                  className="w-full h-[86px] sm:h-[108px] bg-transparent px-3.5 pt-2.5 sm:pt-3 pb-7 sm:pb-8 text-[16px] sm:text-[13.5px] leading-[21px] sm:leading-[20px] text-white placeholder-white/25 outline-none resize-none font-sans"
                />
                
                {/* Character Counter recessed in bottom-right corner */}
                <div 
                  className={`absolute bottom-2 sm:bottom-2.5 right-3 text-[10px] sm:text-[11px] font-normal tabular-nums font-sans transition-colors ${
                    isAtLimit ? 'text-[#FF6961]' : 'text-[#727272]'
                  }`}
                >
                  {message.length} / {MAX_CHARS}
                </div>
              </div>

              {/* Email Input (Optional) with Vibrant 3D Microsoft Fluent Envelope */}
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <label className="text-[12px] sm:text-[12.5px] font-medium text-[#E5E5EA] flex items-center gap-1.5">
                  <span>Your email</span>
                  <span className="text-[#727272] font-normal text-[10.5px] sm:text-[11px]">(optional)</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="So I can reply (or send you a virtual note)"
                    className="w-full bg-[#161616] border border-white/[0.10] focus:border-[#0055D4]/70 focus:ring-1 focus:ring-[#0055D4]/30 rounded-[12px] sm:rounded-[14px] h-[38px] sm:h-[42px] pl-3.5 pr-11 text-[16px] sm:text-[13.5px] text-white placeholder-white/25 outline-none transition-all font-sans"
                  />
                  {!email && (
                    <div className="absolute right-3.5 flex items-center pointer-events-none">
                      <img 
                        src="/assets/bloom/envelope.png" 
                        alt="envelope" 
                        className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] object-contain drop-shadow-md select-none" 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer Actions: Matches TitleModal / MessageModal button sizes */}
              <div className="flex items-center gap-2.5 sm:gap-3 w-full justify-end pt-1 shrink-0 font-sans">
                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="dark-liquid-glass-pill h-[38px] sm:h-[42px] px-4 sm:px-5 text-[14px] font-medium text-white font-sans cursor-pointer active:scale-95 transition-transform"
                >
                  Clear
                </button>

                {/* Primary Send Button */}
                <div className="relative">
                  <ConfettiBurst triggerKey={confettiKey} />
                  <LiquidGlassButton
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleSubmit}
                    isDisabled={!message.trim() || isSubmitting}
                    className="!h-[38px] sm:!h-[42px] px-5 sm:px-6 font-sans text-[14px] font-medium"
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </LiquidGlassButton>
                </div>
              </div>
            </motion.form>
          ) : (
            /* Funny Success Confirmation Screen matching Ready to Share / ShareModal architecture */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6 pt-6 pb-7 flex flex-col items-center text-center bg-[#0E0E0E] font-sans"
            >
              {/* Rubber Duck Sticker Hero: Scaled to match Caution Badge volume (72x72) */}
              <motion.div 
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 480, damping: 20 }}
                className="mb-3 w-16 h-16 flex items-center justify-center select-none"
              >
                <img 
                  src="/assets/bloom/duck.png" 
                  alt="rubber duck sticker" 
                  className="w-[68px] h-[68px] object-contain drop-shadow-lg pointer-events-none" 
                />
              </motion.div>

              {/* Dynamic Witty Headline & Subtitle matching Point of No Return type scale */}
              {category === 'bug' ? (
                <>
                  <h3 className="text-white font-bold text-[19px] leading-[24px] tracking-[-0.02em] font-sans">
                    Bug Caught! 🐛
                  </h3>
                  <p className="mt-2 text-[#999999] text-[12.5px] leading-[19px] max-w-[340px] font-sans font-normal">
                    I am already staring at the code in mild existential panic. Thank you for catching it before the whole card combusted.
                  </p>
                </>
              ) : category === 'sticker' ? (
                <>
                  <h3 className="text-white font-bold text-[19px] leading-[24px] tracking-[-0.02em] font-sans">
                    Added to the Sticker Vault! ✨
                  </h3>
                  <p className="mt-2 text-[#999999] text-[12.5px] leading-[19px] max-w-[340px] font-sans font-normal">
                    If this sticker is as unhinged as I think it is, expect to see it in the next update.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-white font-bold text-[19px] leading-[24px] tracking-[-0.02em] font-sans">
                    Delivered to My Inbox! 💌
                  </h3>
                  <p className="mt-2 text-[#999999] text-[12.5px] leading-[19px] max-w-[340px] font-sans font-normal">
                    A real human is reading this and either smiling like an idiot or taking furious notes. You're the best.
                  </p>
                </>
              )}

              {/* Actions Group: Figma 24px breathing space, balanced wide pill */}
              <div className="flex items-center justify-center w-full mt-6 font-sans">
                <LiquidGlassButton
                  variant="primary"
                  size="md"
                  onClick={onClose}
                  className="w-full max-w-[280px] font-sans text-[14px]"
                >
                  Back to Crafting
                </LiquidGlassButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>,
    document.body
  );
}
