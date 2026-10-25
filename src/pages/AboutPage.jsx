import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkle, 
  Heart, 
  Coffee, 
  ChatCircleDots,
  ShieldCheck, 
  CursorClick, 
  Minus, 
  Square, 
  X,
  Question
} from '@phosphor-icons/react';
import { BloomLogo } from '@/components/ui';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';
import CoffeeButton from '@/components/ui/CoffeeButton';
import Footer from '@/components/Footer';

// Apple Spring Physics for snappy tactile feel
const appleSpring = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.8
};

// Interactive Cursor-Tracking Eyes (Inspired by creatiie.framer.website)
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
      const distance = Math.min(6, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 25);

      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-white/[0.08] shadow-inner select-none">
      {/* Left Eye */}
      <div 
        ref={eyeLeftRef}
        className="w-6 h-6 rounded-full bg-white flex items-center justify-center relative shadow-sm overflow-hidden"
      >
        <motion.div 
          className="w-2.5 h-2.5 rounded-full bg-[#0E0E0E]"
          animate={{ x: pupilPos.x, y: pupilPos.y }}
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
        />
      </div>

      {/* Right Eye */}
      <div 
        ref={eyeRightRef}
        className="w-6 h-6 rounded-full bg-white flex items-center justify-center relative shadow-sm overflow-hidden"
      >
        <motion.div 
          className="w-2.5 h-2.5 rounded-full bg-[#0E0E0E]"
          animate={{ x: pupilPos.x, y: pupilPos.y }}
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
        />
      </div>
    </div>
  );
}

// 3 Fan Cards (Favorite "How It Works" section, framed like the Framer website cards)
const HOW_IT_WORKS_CARDS = [
  {
    num: '01',
    title: 'Pick a Vibe',
    tag: 'Mood-first',
    desc: 'Deep apologies, milestone birthdays, or "I miss you but in a normal way."',
    rotate: -3,
    pushpin: '#FF3B30', // red pushpin
    accent: '#86B75A',
  },
  {
    num: '02',
    title: 'Slap On Details',
    tag: 'Crafted',
    desc: 'Paper textures, metallic Victorian foil, custom Pokémon stats & crooked stickers.',
    rotate: 2,
    pushpin: '#FF9500', // amber pushpin
    accent: '#CFC531',
  },
  {
    num: '03',
    title: 'Ship the Link',
    tag: 'Zero Friction',
    desc: 'No account wall. Just a permanent 60fps 3D link that actually makes them smile.',
    rotate: -1.5,
    pushpin: '#0088FF', // blue pushpin
    accent: '#7CE0DC',
  },
];

export default function AboutPage({ onStartCrafting, onFeedback, onTerms, onPrivacy }) {
  const [activeCard, setActiveCard] = useState(null);
  const [isWindowClosed, setIsWindowClosed] = useState(false);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between select-none font-sans overflow-hidden">
      
      {/* 1. BLUEPRINT GRID BACKGROUND (matching creatiie.framer.website) */}
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
      <main className="w-full max-w-[760px] px-5 sm:px-8 pt-12 sm:pt-16 pb-16 flex flex-col items-center gap-14 sm:gap-18 relative z-10">

        {/* ============================================================
            HERO SECTION: Logo + Apple Regular Weight Editorial Typography
           ============================================================ */}
        <div className="flex flex-col items-center text-center gap-6 relative">
          
          {/* Logo with Exact Navbar Aura Glow */}
          <div className="relative py-1">
            <BloomLogo size="lg" version="Ver. 1.1" />
          </div>

          {/* Interactive Mouse Tracking Eyes (Framer Easter Egg) */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            className="flex items-center gap-2"
          >
            <TrackingEyes />
            <span className="text-[12px] font-mono text-white/35">watching you craft</span>
          </motion.div>

          {/* Apple-style Display Typography: Regular (400) Weight with tight tracking */}
          <div className="flex flex-col gap-3 max-w-[620px]">
            <h1 className="text-white font-normal text-[36px] sm:text-[46px] md:text-[50px] leading-[1.1] tracking-[-0.04em]">
              We make greeting cards that people{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#86B75A] via-[#CFC531] to-[#7CE0DC]">
                actually keep.
              </span>
            </h1>

            <p className="text-white/55 font-normal text-[15px] sm:text-[16.5px] leading-[26px] tracking-[-0.015em] max-w-[500px] mx-auto">
              No drugstore greeting card aisles. No rhyming poems. Just 60fps tactile cards and stickers placed at questionable angles.
            </p>
          </div>

          {/* Floating Sticky Pushpin CTA (Framer Website Style) */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartCrafting}
            className="relative px-5 py-2.5 rounded-full bg-[#181818] border border-white/[0.14] text-white font-medium text-[13.5px] shadow-[0_12px_30px_rgba(0,0,0,0.6)] cursor-pointer flex items-center gap-2 rotate-[-2deg] active:scale-95 transition-all mt-1"
          >
            {/* Red Pushpin Decal */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] shadow-[0_2px_4px_rgba(255,59,48,0.6)] border border-white/40 shrink-0" />
            <span>Start a card</span>
            <ArrowRight size={14} weight="bold" className="text-white/60" />
          </motion.button>
        </div>


        {/* ============================================================
            TILTED CARD FAN: "How It Works" in Creatiie / Framer Layout
           ============================================================ */}
        <section className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-white/40 text-[12px] font-mono tracking-wider uppercase">
              // HOW_IT_WORKS
            </span>
            <span className="text-white/30 text-[11px] font-mono flex items-center gap-1">
              <CursorClick size={13} />
              hover or tap cards
            </span>
          </div>

          {/* 3 Tilted Index Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3.5 w-full pt-2">
            {HOW_IT_WORKS_CARDS.map((card, i) => {
              const isHovered = activeCard === i;
              return (
                <motion.div
                  key={card.num}
                  onMouseEnter={() => setActiveCard(i)}
                  onMouseLeave={() => setActiveCard(null)}
                  whileHover={{ y: -8, rotate: 0, scale: 1.03 }}
                  animate={{ 
                    rotate: isHovered ? 0 : card.rotate,
                    y: isHovered ? -8 : 0 
                  }}
                  transition={appleSpring}
                  className="relative rounded-[20px] bg-[#141414] border border-white/[0.10] p-5 sm:p-6 flex flex-col justify-between gap-6 shadow-[0_16px_36px_rgba(0,0,0,0.7)] cursor-default select-none overflow-hidden"
                >
                  {/* Decorative Corner Color Triangle (from Creatiie screenshot) */}
                  <div 
                    className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-80"
                    style={{
                      background: `linear-gradient(225deg, ${card.accent} 50%, transparent 50%)`
                    }}
                  />

                  {/* Top Pushpin */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-3 h-3 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.5)] border border-white/50"
                      style={{ backgroundColor: card.pushpin }}
                    />
                    <span className="font-mono text-[11px] text-white/35 font-bold">
                      STEP {card.num}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: card.accent }}>
                      {card.tag}
                    </div>
                    <h3 className="text-white font-semibold text-[17px] leading-[22px] tracking-[-0.02em]">
                      {card.title}
                    </h3>
                    <p className="text-white/55 font-normal text-[13px] leading-[19px] mt-1">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>


        {/* ============================================================
            WINDOWS XP SYSTEM DIALOG: "System Properties: Human.exe"
            Blends vintage XP window chrome with Bloom dark liquid glass
           ============================================================ */}
        {!isWindowClosed && (
          <motion.section 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-[20px] bg-[#0E0E0E] border border-white/[0.12] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Windows XP-Inspired Header Bar (In Bloom Dark Obsidian Glass) */}
            <div className="h-[44px] px-4 flex items-center justify-between bg-[#1B1B1B] border-b border-white/[0.08] select-none">
              <div className="flex items-center gap-2">
                {/* XP Blue System Square Icon */}
                <div className="w-4 h-4 rounded-[4px] bg-[#0088FF] flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                  B
                </div>
                <span className="text-white/85 font-mono text-[12px] font-medium tracking-tight">
                  bloom_creator.exe — System Properties
                </span>
              </div>

              {/* XP Window Buttons (Minimize, Maximize, Close) */}
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
                  aria-label="Minimize"
                  className="w-6 h-6 rounded-[5px] bg-[#2A2A2A] hover:bg-[#353535] text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus size={11} weight="bold" />
                </button>
                <button 
                  type="button"
                  aria-label="Maximize"
                  className="w-6 h-6 rounded-[5px] bg-[#2A2A2A] hover:bg-[#353535] text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Square size={10} weight="bold" />
                </button>
                <button 
                  type="button"
                  aria-label="Close"
                  onClick={() => setIsWindowClosed(true)}
                  className="w-6 h-6 rounded-[5px] bg-[#C42B1C] hover:bg-[#E81123] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={12} weight="bold" />
                </button>
              </div>
            </div>

            {/* XP Dialog Content Area */}
            <div className="p-6 sm:p-7 flex flex-col gap-4 text-left">
              <div className="flex items-start gap-4">
                {/* Draggable Rubber Duck Decal */}
                <motion.div 
                  drag
                  dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileDrag={{ scale: 1.15, cursor: "grabbing" }}
                  className="w-14 h-14 rounded-[14px] bg-[#161616] border border-white/[0.08] flex items-center justify-center shrink-0 cursor-grab shadow-inner select-none"
                  title="Drag me!"
                >
                  <img 
                    src="/assets/bloom/duck.png" 
                    alt="duck" 
                    className="w-10 h-10 object-contain pointer-events-none drop-shadow-sm select-none" 
                  />
                </motion.div>

                <div className="flex flex-col gap-1">
                  <span className="text-white font-medium text-[15px] tracking-tight">
                    One human. Zero committees.
                  </span>
                  <span className="text-white/40 text-[12px] font-mono">
                    STATUS: obsessed_with_shadows_and_60fps
                  </span>
                </div>
              </div>

              {/* Awkward, Short Honest Story */}
              <div className="flex flex-col gap-2.5 text-white/65 font-normal text-[14px] leading-[22px] pt-1">
                <p>
                  Hi. I built Bloom because getting a dry <span className="text-white/90 font-mono text-[13px] bg-white/[0.06] px-1.5 py-0.5 rounded">&ldquo;hbd 🎂&rdquo;</span> text hurts my soul. 
                  People deserve something tactile that feels like it took more than two seconds of effort.
                </p>
                <p>
                  I spent an embarrassing amount of time simulating real paper grain, foil bevels, and drawing silly stickers. 
                  Bloom is completely free and has no accounts to remember.
                </p>
              </div>

              {/* Action Strip: Buy Coffee + Send Feedback */}
              <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CoffeeButton />
                </div>
                
                <button
                  type="button"
                  onClick={onFeedback}
                  className="text-white/50 hover:text-white text-[12.5px] font-sans flex items-center gap-1.5 transition-colors cursor-pointer outline-none"
                >
                  <ChatCircleDots size={15} className="text-[#0088FF]" />
                  <span>Send direct feedback</span>
                </button>
              </div>
            </div>
          </motion.section>
        )}


        {/* ============================================================
            FLOATING TACTILE DOCK (Creatiie / Mac / XP Hybrid Dock)
           ============================================================ */}
        <section className="flex flex-col items-center gap-3">
          <div className="px-3 py-2 rounded-[22px] bg-[#161616]/90 backdrop-blur-xl border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex items-center gap-2">
            
            {/* Dock Item 1: Craft */}
            <button
              type="button"
              onClick={onStartCrafting}
              title="Start Crafting"
              className="w-11 h-11 rounded-[16px] bg-[#222222] hover:bg-[#2C2C2E] border border-white/[0.08] flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              🌸
            </button>

            {/* Dock Item 2: Duck */}
            <button
              type="button"
              onClick={() => alert("Quack! You found the duck.")}
              title="Duck Decal"
              className="w-11 h-11 rounded-[16px] bg-[#222222] hover:bg-[#2C2C2E] border border-white/[0.08] flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              🦆
            </button>

            {/* Dock Item 3: Coffee */}
            <a
              href="https://buymeacoffee.com/sujay1"
              target="_blank"
              rel="noopener noreferrer"
              title="Buy Me a Coffee"
              className="w-11 h-11 rounded-[16px] bg-[#222222] hover:bg-[#2C2C2E] border border-white/[0.08] flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              ☕
            </a>

            {/* Dock Item 4: Feedback */}
            <button
              type="button"
              onClick={onFeedback}
              title="Give Feedback"
              className="w-11 h-11 rounded-[16px] bg-[#0088FF] hover:bg-[#0077EE] border border-white/[0.20] flex items-center justify-center text-white shadow-[0_0_12px_rgba(0,136,255,0.4)] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChatCircleDots size={20} weight="fill" />
            </button>
          </div>

          <span className="text-[11px] font-mono text-white/30">
            tactile desktop v1.1
          </span>
        </section>

      </main>

      {/* Global Footer */}
      <Footer 
        onFeedback={onFeedback} 
        onTerms={onTerms} 
        onPrivacy={onPrivacy} 
      />
    </div>
  );
}
