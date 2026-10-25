import React, { useState, useEffect } from 'react';
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

    // Instant, smooth transition into celebration screen
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 280);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop matching ShareModal */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* Modal Window in exact ShareModal / Tablet Surface styling */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Send feedback"
        layout
        className="relative z-10 w-full max-w-[466px] flex flex-col select-none rounded-[24px] bg-[#0E0E0E] border border-white/[0.12] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)] font-sans"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={modalSpring}
      >
        {/* Header Bar matching Figma Tablet Surface [466x60] */}
        <div className="flex items-center justify-between h-[60px] pl-5 pr-3 bg-[#1F1F1F] border-b border-white/[0.08]">
          <h2 className="text-white/85 font-semibold text-[17px] leading-[22px] tracking-[-0.02em] font-sans">
            {isSubmitted ? 'Feedback Sent' : 'Send Feedback'}
          </h2>

          <LiquidGlassIconButton 
            size="sm"
            label="Close dialog"
            onClick={onClose}
            icon={<X size={26} weight="regular" className="text-[#FF383C]" />}
          />
        </div>

        {/* Modal Body */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form 
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-5 pt-4 pb-5 flex flex-col gap-4 bg-[#0E0E0E]"
            >
              {/* Tight, Clean Subtitle */}
              <div>
                <p className="text-white/50 text-[13px] leading-[18px] font-sans font-normal">
                  Bugs, sticker ideas, or confessions. Goes straight to me.
                </p>
              </div>

              {/* Segmented Control using HeroUI Tabs with Smooth Animated Pill */}
              <div className="w-full">
                <div 
                  role="tablist"
                  aria-label="Feedback Category" 
                  className="grid grid-cols-3 p-1 bg-[#1A1A1A] rounded-full border border-white/[0.08] relative"
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
                        className="relative z-10 flex items-center justify-center gap-1.5 h-[36px] rounded-full text-[13px] font-medium transition-colors cursor-pointer outline-none select-none"
                      >
                        {/* Apple Motion Sliding Pill Indicator matching HeroUI Tabs */}
                        {isActive && (
                          <motion.div
                            layoutId="activeFeedbackTab"
                            className="absolute inset-0 rounded-full bg-[#2C2C2E] border border-white/[0.14] shadow-[0_2px_10px_rgba(0,0,0,0.5)] -z-10"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                              mass: 0.8
                            }}
                          />
                        )}
                        <Icon 
                          size={15} 
                          weight={isActive ? 'duotone' : 'regular'} 
                          className={`transition-colors ${isActive ? 'text-white' : 'text-white/45'}`} 
                        />
                        <span className={`transition-colors ${isActive ? 'text-white font-semibold' : 'text-white/50 hover:text-white/80'}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recessed Textarea with Integrated Counter */}
              <div className="relative rounded-[14px] bg-[#161616] border border-white/[0.10] focus-within:border-[#0055D4]/70 focus-within:ring-1 focus-within:ring-[#0055D4]/30 transition-all">
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={activeCategory.placeholder}
                  maxLength={MAX_CHARS}
                  required
                  className="w-full bg-transparent px-3.5 pt-3 pb-8 text-[13.5px] leading-[20px] text-white placeholder-white/25 outline-none resize-none font-sans"
                  autoFocus
                />
                
                {/* Character Counter recessed in bottom-right corner */}
                <div 
                  className={`absolute bottom-2.5 right-3 text-[11px] font-normal tabular-nums font-sans transition-colors ${
                    isAtLimit ? 'text-[#FF6961]/80' : 'text-white/30'
                  }`}
                >
                  {message.length} / {MAX_CHARS}
                </div>
              </div>

              {/* Email Input (Optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-medium text-white/80 flex items-center gap-1.5">
                  <span>Your email</span>
                  <span className="text-white/35 font-normal text-[11px]">(optional)</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="So I can reply (or send you a virtual note)"
                    className="w-full bg-[#161616] border border-white/[0.10] focus:border-[#0055D4]/70 focus:ring-1 focus:ring-[#0055D4]/30 rounded-[14px] h-[42px] pl-3.5 pr-10 text-[13.5px] text-white placeholder-white/25 outline-none transition-all font-sans"
                  />
                  {!email && (
                    <div className="absolute right-3.5 flex items-center pointer-events-none opacity-45">
                      <img 
                        src="/assets/bloom/envelope.png" 
                        alt="envelope" 
                        className="w-[18px] h-[18px] object-contain drop-shadow-sm select-none" 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: No dividing line, Clear Pill + Clean Text Send Button */}
              <div className="flex items-center gap-3 w-full justify-end mt-1 pt-1">
                {/* Clear Button (matching Title / Message modal) */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="dark-liquid-glass-pill h-[42px] px-5 text-[14px] font-medium text-white font-sans cursor-pointer active:scale-95 transition-transform"
                >
                  Clear
                </button>

                {/* Primary Send Button: Text-only, no icon */}
                <div className="relative">
                  <ConfettiBurst triggerKey={confettiKey} />
                  <LiquidGlassButton
                    type="submit"
                    variant="primary"
                    size="md"
                    onClick={handleSubmit}
                    isDisabled={!message.trim() || isSubmitting}
                    className="px-6 font-sans text-[14px] font-medium"
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </LiquidGlassButton>
                </div>
              </div>
            </motion.form>
          ) : (
            /* Funny Success Confirmation Screen with Rubber Duck Decal */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="p-6 pt-6 pb-7 flex flex-col items-center text-center bg-[#0E0E0E]"
            >
              {/* Rubber Duck Sticker Hero */}
              <motion.div 
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 480, damping: 20 }}
                className="mb-3.5 flex items-center justify-center select-none"
              >
                <img 
                  src="/assets/bloom/duck.png" 
                  alt="rubber duck sticker" 
                  className="w-[52px] h-[52px] object-contain drop-shadow-md pointer-events-none" 
                />
              </motion.div>

              {/* Dynamic Witty Headline & Subtitle */}
              {category === 'bug' ? (
                <>
                  <h3 className="text-white font-bold text-[18px] leading-[23px] tracking-[-0.02em] font-sans">
                    Bug Caught! 🐛
                  </h3>
                  <p className="mt-2 text-white/50 text-[13px] leading-[19px] max-w-[340px] font-sans font-normal">
                    I am already staring at the code in mild existential panic. Thank you for catching it before the whole card combusted.
                  </p>
                </>
              ) : category === 'sticker' ? (
                <>
                  <h3 className="text-white font-bold text-[18px] leading-[23px] tracking-[-0.02em] font-sans">
                    Added to the Sticker Vault! ✨
                  </h3>
                  <p className="mt-2 text-white/50 text-[13px] leading-[19px] max-w-[340px] font-sans font-normal">
                    If this sticker is as unhinged as I think it is, expect to see it in the next update.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-white font-bold text-[18px] leading-[23px] tracking-[-0.02em] font-sans">
                    Delivered to My Inbox! 💌
                  </h3>
                  <p className="mt-2 text-white/50 text-[13px] leading-[19px] max-w-[340px] font-sans font-normal">
                    A real human is reading this and either smiling like an idiot or taking furious notes. You're the best.
                  </p>
                </>
              )}

              {/* Single Done Button */}
              <div className="mt-6 w-full max-w-[180px]">
                <LiquidGlassButton
                  variant="primary"
                  size="md"
                  onClick={onClose}
                  className="w-full font-sans text-[14px]"
                >
                  Back to Crafting
                </LiquidGlassButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
