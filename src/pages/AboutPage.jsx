import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  CursorClick,
  Link as LinkIcon,
  Sparkle,
  SlidersHorizontal,
  Check
} from '@phosphor-icons/react';
import { Card } from '@heroui/react';
import { BloomLogo } from '@/components/ui';
import CoffeeButton from '@/components/ui/CoffeeButton';
import Footer from '@/components/Footer';

// Apple Spring Physics for snappy, tactile, organic motion
const appleSpring = {
  type: "spring",
  stiffness: 380,
  damping: 28,
  mass: 0.8
};

// Interactive Cursor-Tracking Eyes (GPU Motion Values - Zero Re-render Overhead)
function TrackingEyes() {
  const eyeLeftRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 600, damping: 35 });
  const smoothY = useSpring(rawY, { stiffness: 600, damping: 35 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!eyeLeftRef.current) return;
      const rect = eyeLeftRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = Math.min(4, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 32);

      rawX.set(Math.cos(angle) * distance);
      rawY.set(Math.sin(angle) * distance);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rawX, rawY]);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141414] border border-[#404040] shadow-inner select-none">
      {/* Left Eye */}
      <div 
        ref={eyeLeftRef}
        className="w-4 h-4 rounded-full bg-white flex items-center justify-center relative shadow-sm overflow-hidden"
      >
        <motion.div 
          style={{ x: smoothX, y: smoothY }}
          className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E]"
        />
      </div>

      {/* Right Eye */}
      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center relative shadow-sm overflow-hidden">
        <motion.div 
          style={{ x: smoothX, y: smoothY }}
          className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E]"
        />
      </div>
    </div>
  );
}

export default function AboutPage({ onStartCrafting, onFeedback, onTerms, onPrivacy }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeVibe, setActiveVibe] = useState('flower');

  const handleCopyDemo = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between select-none font-sans overflow-hidden bg-[#0E0E0E]">
      
      {/* Blueprint Grid Background (Figma opacity 0.03) */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 opacity-[0.035] -z-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FFFFFF 1px, transparent 1px),
            linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Atmospheric Ambient Emerald Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed top-10 left-1/2 -translate-x-1/2 w-[840px] h-[400px] bg-[radial-gradient(ellipse,rgba(134,183,90,0.16)_0%,rgba(0,136,255,0.06)_50%,transparent_75%)] blur-[110px] -z-10" 
      />

      {/* Main Narrative Column (Figma 8pt Spacing Scale) */}
      <main className="w-full max-w-[760px] px-5 sm:px-8 pt-14 sm:pt-20 pb-24 flex flex-col items-center gap-16 sm:gap-20 relative z-10">

        {/* ============================================================
            1. HERO SECTION: Brand Mark + Apple HIG Display Typography
           ============================================================ */}
        <section className="flex flex-col items-center text-center gap-6 relative max-w-[640px]">
          
          {/* Logo with Exact Navbar Aura Glow */}
          <div className="relative py-1">
            <BloomLogo size="lg" version="Ver. 1.1" />
          </div>

          {/* Interactive Mouse Tracking Eyes Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <TrackingEyes />
            <span className="text-[12px] leading-[16px] text-[#999999] font-normal tracking-tight">watching you craft</span>
          </motion.div>

          {/* Apple HIG Large Title Display: 44px / 48px, line-height 52px, tracking -0.035em, font-normal 400 */}
          <div className="flex flex-col gap-4">
            <h1 className="text-[#F5F5F5] font-normal text-[38px] sm:text-[46px] md:text-[48px] leading-[1.12] sm:leading-[52px] tracking-[-0.035em]">
              I make greeting cards that people{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#86B75A] via-[#CFC531] to-[#7CE0DC]">
                actually keep.
              </span>
            </h1>

            {/* Apple HIG Body / Secondary (Figma Gray 200 #E5E5EA): 16px, line-height 24px, tracking -0.015em */}
            <p className="text-[#E5E5EA] font-normal text-[15px] sm:text-[16px] leading-[24px] tracking-[-0.015em] max-w-[500px] mx-auto">
              No drugstore greeting card aisles. No rhyming poems. Just 60fps tactile cards and stickers placed at questionable angles.
            </p>
          </div>

          {/* Figma Interactive Pill Button: Gray 850 surface, Gray 600 border, Gray 100 text */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStartCrafting}
            className="relative px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#1F1F1F] border border-[#404040] hover:border-[#727272] text-[#F5F5F5] font-medium text-[13.5px] leading-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.6)] cursor-pointer flex items-center gap-2 transition-all mt-2 outline-none hig-focus"
          >
            <span>Start a card</span>
            <ArrowRight size={14} className="text-[#999999]" />
          </motion.button>
        </section>


        {/* ============================================================
            2. FLAT PROCESS CARDS: "How It Works"
            Flat alignment (0deg), no visual noise, micro-visual widgets (smaller than body)
           ============================================================ */}
        <section className="w-full flex flex-col gap-3.5">
          
          {/* Section Eyebrow (Apple HIG Caption 2: 11px, line-height 13px, tracking 0.08em, Gray 400) */}
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[#999999] text-[11px] leading-[13px] font-semibold tracking-[0.08em] uppercase">
              How it works
            </span>
            <span className="text-[#727272] text-[11px] leading-[13px] font-normal flex items-center gap-1.5">
              <CursorClick size={12} />
              interactive steps
            </span>
          </div>

          {/* 3 Flat, Clean, Disciplined Cards (Zero Rotation, Perfect Horizontal Alignment) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
            
            {/* ---------------- CARD 01: Pick a Vibe ---------------- */}
            <motion.div whileHover={{ y: -4 }} transition={appleSpring} className="w-full">
              <Card
                className="relative rounded-[20px] bg-[#141414] border border-[#404040]/80 hover:border-[#727272] p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.75)] cursor-default select-none"
                style={{ minHeight: '270px' }}
              >
                {/* Subtle Specular Bevel Highlight */}
                <div 
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none rounded-[20px]"
                  style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)' }}
                />

                {/* Top Row: Clean Step Number + Category Tag */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-sans font-semibold text-[11px] leading-[13px] tracking-wide px-2 py-0.5 rounded-full bg-[#1F1F1F] border border-[#404040] text-[#F5F5F5]">
                    01
                  </span>
                  <span className="font-sans font-medium text-[11px] leading-[13px] tracking-[0.06em] uppercase text-[#999999]">
                    Mood-first
                  </span>
                </div>

                {/* Middle Content: Title (20px/25px) & Body (14px/20px) */}
                <div className="flex flex-col gap-1.5 text-left relative z-10">
                  <h3 className="text-[#F5F5F5] font-semibold text-[19px] sm:text-[20px] leading-[25px] tracking-[-0.017em]">
                    Pick a Vibe
                  </h3>
                  <p className="text-[#E5E5EA] font-normal text-[13.5px] sm:text-[14px] leading-[20px] tracking-[-0.01em]">
                    Deep apologies, milestone birthdays, or &ldquo;I miss you but in a normal way.&rdquo;
                  </p>
                </div>

                {/* Micro-Visual Widget: Segmented Canvas Selector (11px / smaller than body) */}
                <div className="relative z-10 pt-2 border-t border-[#404040]/60 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1A1A1A] border border-[#404040]/80">
                    <button
                      type="button"
                      onClick={() => setActiveVibe('flower')}
                      className={`flex-1 py-1 px-2 rounded-lg text-[11px] leading-[13px] font-medium transition-all ${
                        activeVibe === 'flower'
                          ? 'bg-[#1F1F1F] text-[#F5F5F5] shadow-sm border border-[#727272]/50'
                          : 'text-[#999999] hover:text-[#E5E5EA]'
                      }`}
                    >
                      🌸 Flower
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVibe('foil')}
                      className={`flex-1 py-1 px-2 rounded-lg text-[11px] leading-[13px] font-medium transition-all ${
                        activeVibe === 'foil'
                          ? 'bg-[#1F1F1F] text-[#F5F5F5] shadow-sm border border-[#727272]/50'
                          : 'text-[#999999] hover:text-[#E5E5EA]'
                      }`}
                    >
                      ✨ Foil
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVibe('monster')}
                      className={`flex-1 py-1 px-2 rounded-lg text-[11px] leading-[13px] font-medium transition-all ${
                        activeVibe === 'monster'
                          ? 'bg-[#1F1F1F] text-[#F5F5F5] shadow-sm border border-[#727272]/50'
                          : 'text-[#999999] hover:text-[#E5E5EA]'
                      }`}
                    >
                      👾 Monster
                    </button>
                  </div>
                  <span className="text-[10.5px] leading-[13px] text-[#727272] flex items-center justify-between px-0.5">
                    <span>Meaning: Botanical symbol</span>
                    <span className="text-[#86B75A]">● Active</span>
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* ---------------- CARD 02: Slap On Details ---------------- */}
            <motion.div whileHover={{ y: -4 }} transition={appleSpring} className="w-full">
              <Card
                className="relative rounded-[20px] bg-[#141414] border border-[#404040]/80 hover:border-[#727272] p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.75)] cursor-default select-none"
                style={{ minHeight: '270px' }}
              >
                {/* Subtle Specular Bevel Highlight */}
                <div 
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none rounded-[20px]"
                  style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)' }}
                />

                {/* Top Row: Clean Step Number + Category Tag */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-sans font-semibold text-[11px] leading-[13px] tracking-wide px-2 py-0.5 rounded-full bg-[#1F1F1F] border border-[#404040] text-[#F5F5F5]">
                    02
                  </span>
                  <span className="font-sans font-medium text-[11px] leading-[13px] tracking-[0.06em] uppercase text-[#999999]">
                    Crafted
                  </span>
                </div>

                {/* Middle Content: Title (20px/25px) & Body (14px/20px) */}
                <div className="flex flex-col gap-1.5 text-left relative z-10">
                  <h3 className="text-[#F5F5F5] font-semibold text-[19px] sm:text-[20px] leading-[25px] tracking-[-0.017em]">
                    Slap On Details
                  </h3>
                  <p className="text-[#E5E5EA] font-normal text-[13.5px] sm:text-[14px] leading-[20px] tracking-[-0.01em]">
                    Paper textures, metallic Victorian foil, custom stats &amp; crooked stickers.
                  </p>
                </div>

                {/* Micro-Visual Widget: Tactile Parameter Blueprint (11px / smaller than body) */}
                <div className="relative z-10 pt-2 border-t border-[#404040]/60 flex flex-col gap-1.5">
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#1A1A1A] border border-[#404040]/80 flex flex-col gap-1 text-[11px] leading-[14px]">
                    <div className="flex items-center justify-between text-[#D9D9D9]">
                      <span className="text-[#999999] flex items-center gap-1">
                        <SlidersHorizontal size={11} /> Texture
                      </span>
                      <span className="font-mono text-[10.5px] text-[#F5F5F5]">Cotton 300gsm</span>
                    </div>
                    <div className="flex items-center justify-between text-[#D9D9D9]">
                      <span className="text-[#999999] flex items-center gap-1">
                        <Sparkle size={11} /> Foil Bevel
                      </span>
                      <span className="font-mono text-[10.5px] text-[#CFC531]">Sun Gold</span>
                    </div>
                  </div>
                  <span className="text-[10.5px] leading-[13px] text-[#727272] flex items-center justify-between px-0.5">
                    <span>Sticker: Crooked -12°</span>
                    <span className="text-[#CFC531]">● Applied</span>
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* ---------------- CARD 03: Ship the Link ---------------- */}
            <motion.div whileHover={{ y: -4 }} transition={appleSpring} className="w-full">
              <Card
                className="relative rounded-[20px] bg-[#141414] border border-[#404040]/80 hover:border-[#727272] p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.75)] cursor-default select-none"
                style={{ minHeight: '270px' }}
              >
                {/* Subtle Specular Bevel Highlight */}
                <div 
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none rounded-[20px]"
                  style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)' }}
                />

                {/* Top Row: Clean Step Number + Category Tag */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-sans font-semibold text-[11px] leading-[13px] tracking-wide px-2 py-0.5 rounded-full bg-[#1F1F1F] border border-[#404040] text-[#F5F5F5]">
                    03
                  </span>
                  <span className="font-sans font-medium text-[11px] leading-[13px] tracking-[0.06em] uppercase text-[#999999]">
                    Zero Friction
                  </span>
                </div>

                {/* Middle Content: Title (20px/25px) & Body (14px/20px) */}
                <div className="flex flex-col gap-1.5 text-left relative z-10">
                  <h3 className="text-[#F5F5F5] font-semibold text-[19px] sm:text-[20px] leading-[25px] tracking-[-0.017em]">
                    Ship the Link
                  </h3>
                  <p className="text-[#E5E5EA] font-normal text-[13.5px] sm:text-[14px] leading-[20px] tracking-[-0.01em]">
                    No account wall. Just a permanent 60fps 3D link that actually makes someone feel remembered.
                  </p>
                </div>

                {/* Micro-Visual Widget: Share Link Pill (11px / smaller than body) */}
                <div className="relative z-10 pt-2 border-t border-[#404040]/60 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyDemo}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#1F1F1F] border border-[#404040]/80 hover:border-[#727272] flex items-center justify-between text-[11px] leading-[14px] transition-colors cursor-pointer outline-none"
                  >
                    <span className="font-mono text-[10.5px] text-[#D9D9D9] flex items-center gap-1.5 truncate">
                      <LinkIcon size={11} className="text-[#999999] shrink-0" />
                      bloom.cards/p/8x9f
                    </span>
                    <span className="text-[10px] text-[#7CE0DC] font-medium shrink-0 flex items-center gap-1">
                      {copiedLink ? <><Check size={10} /> Copied</> : 'Copy'}
                    </span>
                  </button>
                  <span className="text-[10.5px] leading-[13px] text-[#727272] flex items-center justify-between px-0.5">
                    <span>No login required</span>
                    <span className="text-[#7CE0DC]">● 60fps 3D</span>
                  </span>
                </div>
              </Card>
            </motion.div>

          </div>
        </section>


        {/* ============================================================
            3. CREATOR WINDOW: Apple macOS Chrome with Figma Palette
           ============================================================ */}
        <motion.section 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full rounded-[24px] bg-[#141414] border border-[#404040]/80 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
        >
          {/* Apple macOS Style Window Header Bar */}
          <div className="h-[46px] px-5 flex items-center justify-between bg-[#1A1A1A] border-b border-[#404040]/80 select-none">
            {/* Apple Window Stoplights */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
            </div>

            <span className="text-[#999999] font-medium text-[12.5px] leading-[16px] tracking-tight">
              About the Creator
            </span>

            {/* Invisible counterweight for centered title */}
            <div className="w-12" aria-hidden="true" />
          </div>

          {/* Window Body Area */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 text-left">
            <div className="flex items-center gap-4">
              {/* Rubber Duck Avatar */}
              <div className="w-13 h-13 rounded-[16px] bg-[#1A1A1A] border border-[#404040] flex items-center justify-center shrink-0 shadow-inner">
                <img 
                  src="/assets/bloom/duck.png" 
                  alt="rubber duck" 
                  className="w-9 h-9 object-contain pointer-events-none drop-shadow-sm select-none" 
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[#F5F5F5] font-semibold text-[16px] leading-[21px] tracking-tight">
                  One human. Zero committees.
                </span>
                <span className="text-[#999999] font-normal text-[12.5px] leading-[16px]">
                  (Not my actual face. The duck has higher self-esteem.)
                </span>
              </div>
            </div>

            {/* Short Honest Story with Figma Gray 200 */}
            <div className="flex flex-col gap-3 text-[#E5E5EA] font-normal text-[14px] sm:text-[14.5px] leading-[22px]">
              <p>
                Hi. I built Bloom because getting a dry <span className="text-[#F5F5F5] font-medium text-[13px] bg-[#1F1F1F] border border-[#404040] px-1.5 py-0.5 rounded">&ldquo;hbd 🎂&rdquo;</span> text hurts my soul. 
                People deserve something tactile that feels like it took more than two seconds of effort.
              </p>
              <p>
                I spent an embarrassing amount of time simulating real paper grain, foil bevels, and drawing silly stickers. 
                Bloom is completely free, open, and has no accounts to remember.
              </p>
            </div>

            {/* Action Bar: Buy Coffee */}
            <div className="pt-4 border-t border-[#404040]/80 flex items-center justify-between">
              <span className="text-[#999999] font-normal text-[13px] leading-[18px]">
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
