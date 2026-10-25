import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkle, 
  Heart, 
  ShieldCheck, 
  CursorClick,
  EnvelopeSimple,
  ShareNetwork,
  Smiley
} from '@phosphor-icons/react';
import { BloomLogo } from '@/components/ui';
import CoffeeButton from '@/components/ui/CoffeeButton';
import Footer from '@/components/Footer';

// Apple Spring Physics for fluid expansion
const expansionSpring = {
  type: "spring",
  stiffness: 350,
  damping: 32,
  mass: 0.8
};

// Interactive Cursor-Tracking Eyes (Framer Easter Egg)
function TrackingEyes() {
  const eyeLeftRef = useRef(null);
  const eyeRightRef = useRef(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!eyeLeftRef.current) return;
      const rect = eyeLeftRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = Math.min(5, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 28);

      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161616] border border-white/[0.08] shadow-inner select-none">
      {/* Left Eye */}
      <div 
        ref={eyeLeftRef}
        className="w-5 h-5 rounded-full bg-white flex items-center justify-center relative shadow-sm overflow-hidden"
      >
        <motion.div 
          className="w-2 h-2 rounded-full bg-[#0E0E0E]"
          animate={{ x: pupilPos.x, y: pupilPos.y }}
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
        />
      </div>

      {/* Right Eye */}
      <div 
        ref={eyeRightRef}
        className="w-5 h-5 rounded-full bg-white flex items-center justify-center relative shadow-sm overflow-hidden"
      >
        <motion.div 
          className="w-2 h-2 rounded-full bg-[#0E0E0E]"
          animate={{ x: pupilPos.x, y: pupilPos.y }}
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
        />
      </div>
    </div>
  );
}

// Expanding Step Cards Data
const EXPANDING_STEPS = [
  {
    id: 0,
    step: '01',
    title: 'Pick a Vibe',
    tag: 'Mood-first',
    shortDesc: 'Apology to milestone birthday.',
    fullDesc: 'Choose how you actually feel: deep apologies, celebratory milestones, or "I miss you but in a normal way."',
    accent: '#86B75A',
    previewType: 'moods',
  },
  {
    id: 1,
    step: '02',
    title: 'Slap On Details',
    tag: 'Tactile Craft',
    shortDesc: 'Foil, textures & duck stickers.',
    fullDesc: 'Simulate archival pressed paper, metallic Victorian foil, custom Pokémon stats & crooked stickers.',
    accent: '#CFC531',
    previewType: 'craft',
  },
  {
    id: 2,
    step: '03',
    title: 'Ship the Link',
    tag: 'Instant 3D',
    shortDesc: 'Permanent 60fps 3D keepsake.',
    fullDesc: 'No login or paywall. Just a permanent link where they can peel stickers, flip the card, and smile.',
    accent: '#7CE0DC',
    previewType: 'share',
  },
];

// Interactive Visual Preview inside Expanded Card
function StepCardVisual({ type }) {
  if (type === 'moods') {
    return (
      <div className="w-full h-[120px] rounded-[14px] bg-[#101010] border border-white/[0.06] p-3 flex flex-col justify-center gap-2 overflow-hidden relative">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.10] text-[11px] font-normal text-white/80">
            🌸 Sincere Apology
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#86B75A]/20 border border-[#86B75A]/40 text-[11px] font-medium text-[#86B75A]">
            ✨ Big Milestone
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.10] text-[11px] font-normal text-white/70">
            💌 Just Because
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] font-normal text-white/40">
            ⚡ Pokémon Battle
          </span>
        </div>
      </div>
    );
  }

  if (type === 'craft') {
    return (
      <div className="w-full h-[120px] rounded-[14px] bg-[#101010] border border-white/[0.06] p-3 flex items-center justify-around overflow-hidden relative">
        <motion.div 
          animate={{ rotate: [-8, -2, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-[12px] bg-[#1C1C1E] border border-white/[0.12] flex items-center justify-center shadow-lg"
        >
          <img 
            src="/assets/bloom/duck.png" 
            alt="duck sticker" 
            className="w-9 h-9 object-contain drop-shadow select-none pointer-events-none" 
          />
        </motion.div>
        
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[11px] font-mono text-[#CFC531]">PAPER / METALLIC / POKÉMON</span>
          <span className="text-[12px] text-white/70 font-normal">Physical-digital materials</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[120px] rounded-[14px] bg-[#101010] border border-white/[0.06] p-3 flex flex-col justify-center items-center gap-2 overflow-hidden relative">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181818] border border-white/[0.12] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
        <span className="text-[12px] font-mono text-white/80">bloomcard.app/c/x9k2m4</span>
      </div>
      <span className="text-[11px] text-white/40 font-normal">Instant 60fps 3D viewer · Zero spam</span>
    </div>
  );
}

export default function AboutPage({ onStartCrafting, onFeedback, onTerms, onPrivacy }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between select-none font-sans overflow-hidden">
      
      {/* Blueprint Grid Background */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 opacity-[0.035] -z-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FFFFFF 1px, transparent 1px),
            linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Atmospheric Ambient Emerald Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed top-12 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-[radial-gradient(ellipse,rgba(134,183,90,0.18)_0%,rgba(0,136,255,0.08)_50%,transparent_75%)] blur-[100px] -z-10" 
      />

      {/* Main Narrative Column */}
      <main className="w-full max-w-[760px] px-5 sm:px-8 pt-12 sm:pt-16 pb-20 flex flex-col items-center gap-14 sm:gap-16 relative z-10">

        {/* ============================================================
            1. HERO SECTION: Brand Mark + Apple Display Typography
           ============================================================ */}
        <div className="flex flex-col items-center text-center gap-6 relative">
          
          {/* Logo with Exact Navbar Aura Glow */}
          <div className="relative py-1">
            <BloomLogo size="lg" version="Ver. 1.1" />
          </div>

          {/* Interactive Mouse Tracking Eyes */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 500 }}
            className="flex items-center gap-2"
          >
            <TrackingEyes />
            <span className="text-[12px] text-white/35 font-normal tracking-tight">watching you craft</span>
          </motion.div>

          {/* Apple-style Display Typography: Regular (400) Weight throughout with tight tracking */}
          <div className="flex flex-col gap-3 max-w-[600px]">
            <h1 className="text-white font-normal text-[36px] sm:text-[46px] md:text-[50px] leading-[1.1] tracking-[-0.04em]">
              I make greeting cards that people{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#86B75A] via-[#CFC531] to-[#7CE0DC]">
                actually keep.
              </span>
            </h1>

            <p className="text-white/55 font-normal text-[15px] sm:text-[16px] leading-[25px] tracking-[-0.015em] max-w-[480px] mx-auto">
              No drugstore greeting card aisles. No rhyming poems. Just 60fps tactile cards and stickers placed at questionable angles.
            </p>
          </div>

          {/* Floating Pill CTA */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartCrafting}
            className="relative px-5 py-2.5 rounded-full bg-[#181818] border border-white/[0.14] text-white font-normal text-[13.5px] shadow-[0_12px_28px_rgba(0,0,0,0.6)] cursor-pointer flex items-center gap-2 transition-all mt-1 outline-none"
          >
            <span>Start a card</span>
            <ArrowRight size={14} className="text-white/60" />
          </motion.button>
        </div>


        {/* ============================================================
            2. EXPANDING STEP CARDS (Inspired by Framer Marketplace)
           ============================================================ */}
        <section className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-white/40 text-[12px] font-normal tracking-wide uppercase">
              How it works
            </span>
            <span className="text-white/30 text-[11px] font-normal flex items-center gap-1">
              <CursorClick size={13} />
              hover to expand
            </span>
          </div>

          {/* Interactive Expanding Flex Row (Desktop) / Stacked (Mobile) */}
          <div className="w-full flex flex-col sm:flex-row gap-3 min-h-[300px]">
            {EXPANDING_STEPS.map((step) => {
              const isExpanded = activeStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  layout
                  transition={expansionSpring}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onClick={() => setActiveStep(step.id)}
                  className={`relative rounded-[22px] bg-[#141414] border transition-colors cursor-pointer select-none overflow-hidden p-5 flex flex-col justify-between ${
                    isExpanded 
                      ? 'sm:flex-[2.6] border-white/[0.16] shadow-[0_20px_45px_rgba(0,0,0,0.7)]' 
                      : 'sm:flex-[1] border-white/[0.08] hover:border-white/[0.12] bg-[#111111]'
                  }`}
                >
                  {/* Subtle Corner Accent Gradient */}
                  <div 
                    className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-60"
                    style={{
                      background: `linear-gradient(225deg, ${step.accent} 50%, transparent 50%)`
                    }}
                  />

                  {/* Header: Step Number & Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-mono font-medium text-white/35">
                      STEP {step.step}
                    </span>
                    <span 
                      className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08]"
                      style={{ color: step.accent }}
                    >
                      {step.tag}
                    </span>
                  </div>

                  {/* Expanded Visual Mockup (Revealed smoothly) */}
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.div
                        key="visual"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="my-3 w-full"
                      >
                        <StepCardVisual type={step.previewType} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Title & Description Block */}
                  <div className="flex flex-col gap-1 text-left">
                    <h3 className="text-white font-medium text-[16.5px] leading-[22px] tracking-[-0.015em]">
                      {step.title}
                    </h3>
                    <p className="text-white/50 font-normal text-[13px] leading-[19px]">
                      {isExpanded ? step.fullDesc : step.shortDesc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>


        {/* ============================================================
            3. APPLE-STYLE WINDOW: "One human. Zero committees."
           ============================================================ */}
        <motion.section 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        >
          {/* Apple macOS Style Window Header Bar */}
          <div className="h-[48px] px-5 flex items-center justify-between bg-[#1A1A1A] border-b border-white/[0.08] select-none">
            {/* Apple Window Stoplights */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
            </div>

            <span className="text-white/60 font-normal text-[12.5px] tracking-tight">
              About the Creator
            </span>

            {/* Invisible counterweight for centered title */}
            <div className="w-12" aria-hidden="true" />
          </div>

          {/* Window Body Area */}
          <div className="p-6 sm:p-8 flex flex-col gap-5 text-left">
            <div className="flex items-center gap-4">
              {/* Rubber Duck Avatar */}
              <div className="w-13 h-13 rounded-[16px] bg-[#161616] border border-white/[0.08] flex items-center justify-center shrink-0 shadow-inner">
                <img 
                  src="/assets/bloom/duck.png" 
                  alt="rubber duck" 
                  className="w-9 h-9 object-contain pointer-events-none drop-shadow-sm select-none" 
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-white font-medium text-[16px] tracking-tight">
                  One human. Zero committees.
                </span>
                <span className="text-white/40 font-normal text-[12.5px]">
                  (Not my actual face. The duck has higher self-esteem.)
                </span>
              </div>
            </div>

            {/* Short Honest Story */}
            <div className="flex flex-col gap-2.5 text-white/65 font-normal text-[14px] sm:text-[14.5px] leading-[23px] pt-1">
              <p>
                Hi. I built Bloom because getting a dry <span className="text-white/90 font-normal text-[13px] bg-white/[0.06] px-1.5 py-0.5 rounded">&ldquo;hbd 🎂&rdquo;</span> text hurts my soul. 
                People deserve something tactile that feels like it took more than two seconds of effort.
              </p>
              <p>
                I spent an embarrassing amount of time simulating real paper grain, foil bevels, and drawing silly stickers. 
                Bloom is completely free, open, and has no accounts to remember.
              </p>
            </div>

            {/* Action Bar: Buy Coffee */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-white/45 font-normal text-[12.5px]">
                Enjoying Bloom?
              </span>
              <CoffeeButton />
            </div>
          </div>
        </motion.section>

      </main>

      {/* Global Footer (Already includes Feedback, Terms, Privacy, Instagram, Email) */}
      <Footer 
        onFeedback={onFeedback} 
        onTerms={onTerms} 
        onPrivacy={onPrivacy} 
      />
    </div>
  );
}
