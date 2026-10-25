import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkle, 
  Heart, 
  ShieldCheck, 
  CursorClick
} from '@phosphor-icons/react';
import { BloomLogo } from '@/components/ui';
import CoffeeButton from '@/components/ui/CoffeeButton';
import Footer from '@/components/Footer';

// Apple Spring Physics for snappy tactile response
const appleSpring = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.8
};

// Interactive Cursor-Tracking Eyes (Inspired by Framer Easter Egg)
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

// 3 Fan Cards: HeroUI Surface Card tokens + Apple HIG geometry + subtle corner tag
const HOW_IT_WORKS_CARDS = [
  {
    num: '01',
    title: 'Pick a Vibe',
    tag: 'Mood-first',
    desc: 'Apologies, milestone birthdays, or "I miss you but in a normal way."',
    rotate: -2.5,
    accent: '#86B75A',
  },
  {
    num: '02',
    title: 'Slap On Details',
    tag: 'Crafted',
    desc: 'Paper textures, metallic foil bevels, custom stats & crooked stickers.',
    rotate: 2,
    accent: '#CFC531',
  },
  {
    num: '03',
    title: 'Ship the Link',
    tag: 'Instant 3D',
    desc: 'No account wall. Just a permanent 60fps 3D link that actually makes them smile.',
    rotate: -1.5,
    accent: '#7CE0DC',
  },
];

export default function AboutPage({ onStartCrafting, onFeedback, onTerms, onPrivacy }) {
  const [activeCard, setActiveCard] = useState(null);

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
      <main className="w-full max-w-[740px] px-5 sm:px-8 pt-12 sm:pt-16 pb-20 flex flex-col items-center gap-14 sm:gap-16 relative z-10">

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
            2. TILTED CARD FAN: "How It Works" in HeroUI Card System
           ============================================================ */}
        <section className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-white/40 text-[12px] font-normal tracking-wide uppercase">
              How it works
            </span>
            <span className="text-white/30 text-[11px] font-normal flex items-center gap-1">
              <CursorClick size={13} />
              hover or tap cards
            </span>
          </div>

          {/* 3 HeroUI Surface Cards with Apple spring tilt */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3.5 w-full pt-2">
            {HOW_IT_WORKS_CARDS.map((card, i) => {
              const isHovered = activeCard === i;
              return (
                <motion.div
                  key={card.num}
                  onMouseEnter={() => setActiveCard(i)}
                  onMouseLeave={() => setActiveCard(null)}
                  whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
                  animate={{ 
                    rotate: isHovered ? 0 : card.rotate,
                    y: isHovered ? -8 : 0 
                  }}
                  transition={appleSpring}
                  className="relative rounded-[20px] bg-[#141414] border border-white/[0.10] p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-[0_16px_36px_rgba(0,0,0,0.7)] cursor-default select-none overflow-hidden"
                >
                  {/* Subtle Corner Color Accent */}
                  <div 
                    className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-80"
                    style={{
                      background: `linear-gradient(225deg, ${card.accent} 50%, transparent 50%)`
                    }}
                  />

                  {/* Top Step Pill */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08]"
                      style={{ color: card.accent }}
                    >
                      {card.tag}
                    </span>
                    <span className="text-[11px] text-white/35 font-normal">
                      STEP {card.num}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <h3 className="text-white font-medium text-[16px] leading-[22px] tracking-[-0.015em]">
                      {card.title}
                    </h3>
                    <p className="text-white/50 font-normal text-[13px] leading-[19px]">
                      {card.desc}
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
