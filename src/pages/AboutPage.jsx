import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CursorClick
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

// Interactive Cursor-Tracking Eyes (Subtle Apple/Framer Delight)
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
      const distance = Math.min(4.5, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 32);

      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161616] border border-white/[0.08] shadow-inner select-none">
      {/* Left Eye */}
      <div 
        ref={eyeLeftRef}
        className="w-4 h-4 rounded-full bg-white flex items-center justify-center relative shadow-sm overflow-hidden"
      >
        <motion.div 
          className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E]"
          animate={{ x: pupilPos.x, y: pupilPos.y }}
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
        />
      </div>

      {/* Right Eye */}
      <div 
        ref={eyeRightRef}
        className="w-4 h-4 rounded-full bg-white flex items-center justify-center relative shadow-sm overflow-hidden"
      >
        <motion.div 
          className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E]"
          animate={{ x: pupilPos.x, y: pupilPos.y }}
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
        />
      </div>
    </div>
  );
}

// 3 Tactile Stationery Fan Cards (Elevated Creatiie / Apple HIG standard)
const HOW_IT_WORKS_CARDS = [
  {
    num: '01',
    tag: 'MOOD-FIRST',
    title: 'Pick a Vibe',
    desc: 'Deep apologies, milestone birthdays, or "I miss you but in a normal way."',
    rotate: -2.2,
    pushpin: '#FF453A', // Apple Coral/Red
    accent: '#86B75A',  // Spring Olive
  },
  {
    num: '02',
    tag: 'CRAFTED',
    title: 'Slap On Details',
    desc: 'Paper textures, metallic Victorian foil, custom stats & crooked stickers.',
    rotate: 1.8,
    pushpin: '#FF9F0A', // Apple Amber/Gold
    accent: '#CFC531',  // Warm Sunlight
  },
  {
    num: '03',
    tag: 'ZERO FRICTION',
    title: 'Ship the Link',
    desc: 'No account wall. Just a permanent 60fps 3D link that actually makes them smile.',
    rotate: -1.4,
    pushpin: '#0A84FF', // Apple Electric Blue
    accent: '#7CE0DC',  // Mint Cyan
  },
];

export default function AboutPage({ onStartCrafting, onFeedback, onTerms, onPrivacy }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between select-none font-sans overflow-hidden">
      
      {/* Blueprint Grid Background */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 opacity-[0.03] -z-20"
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

      {/* Main Narrative Column (Apple HIG 8pt Spacing Scale) */}
      <main className="w-full max-w-[760px] px-5 sm:px-8 pt-14 sm:pt-20 pb-24 flex flex-col items-center gap-16 sm:gap-20 relative z-10">

        {/* ============================================================
            1. HERO SECTION: Brand Mark + Strict Apple Display Typography
           ============================================================ */}
        <section className="flex flex-col items-center text-center gap-6 relative max-w-[620px]">
          
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
            <span className="text-[12px] text-[#86868B] font-normal tracking-tight">watching you craft</span>
          </motion.div>

          {/* Apple Display Headline: 44px/48px, leading 1.12, tracking -0.035em, font-normal 400 */}
          <div className="flex flex-col gap-4">
            <h1 className="text-white font-normal text-[38px] sm:text-[46px] md:text-[48px] leading-[1.12] tracking-[-0.035em]">
              I make greeting cards that people{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#86B75A] via-[#CFC531] to-[#7CE0DC]">
                actually keep.
              </span>
            </h1>

            {/* Apple Secondary Body: 16px, leading 26px (relaxed 1.62x ratio), tracking -0.012em */}
            <p className="text-[#A1A1A6] font-normal text-[15px] sm:text-[16px] leading-[26px] tracking-[-0.012em] max-w-[480px] mx-auto">
              No drugstore greeting card aisles. No rhyming poems. Just 60fps tactile cards and stickers placed at questionable angles.
            </p>
          </div>

          {/* Apple Liquid Glass CTA Pill */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStartCrafting}
            className="relative px-5 py-2.5 rounded-full bg-[#181818] hover:bg-[#1E1E1E] border border-white/[0.14] hover:border-white/[0.24] text-white font-medium text-[14px] shadow-[0_12px_28px_rgba(0,0,0,0.6)] cursor-pointer flex items-center gap-2 transition-all mt-2 outline-none hig-focus"
          >
            <span>Start a card</span>
            <ArrowRight size={14} className="text-[#A1A1A6]" />
          </motion.button>
        </section>


        {/* ============================================================
            2. TACTILE STATIONERY CARDS: "How It Works"
            Restored to the user-favorite Creatiie/Desk aesthetic, elevated with HeroUI Card surface
           ============================================================ */}
        <section className="w-full flex flex-col gap-4">
          
          {/* Section Eyebrow with Apple HIG Typography */}
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[#86868B] text-[11px] font-medium tracking-[0.08em] uppercase">
              How it works
            </span>
            <span className="text-[#86868B] text-[11px] font-normal flex items-center gap-1.5">
              <CursorClick size={12} />
              hover or tap cards
            </span>
          </div>

          {/* 3 Tilted Stationery Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 sm:gap-4 w-full pt-1">
            {HOW_IT_WORKS_CARDS.map((card, idx) => {
              const isHovered = hoveredCard === idx;

              return (
                <motion.div
                  key={card.num}
                  tabIndex={0}
                  role="region"
                  aria-label={`Step ${card.num}: ${card.title}`}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onFocus={() => setHoveredCard(idx)}
                  onBlur={() => setHoveredCard(null)}
                  animate={{
                    rotate: isHovered ? 0 : card.rotate,
                    y: isHovered ? -8 : 0,
                    scale: isHovered ? 1.02 : 1,
                  }}
                  transition={appleSpring}
                  className="outline-none"
                >
                  <Card
                    className={`relative rounded-[22px] bg-[#141414] border p-6 flex flex-col justify-between gap-6 cursor-default select-none overflow-hidden transition-colors duration-300 ${
                      isHovered 
                        ? 'border-white/[0.22] shadow-[0_24px_50px_rgba(0,0,0,0.85)]' 
                        : 'border-white/[0.08] shadow-[0_16px_36px_rgba(0,0,0,0.6)]'
                    }`}
                    style={{
                      minHeight: '230px',
                    }}
                  >
                    {/* Inner Specular Highlight */}
                    <div 
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none rounded-[22px]"
                      style={{
                        boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
                      }}
                    />

                    {/* Decorative Corner Ribbon Triangle */}
                    <div 
                      className="absolute top-0 right-0 w-9 h-9 pointer-events-none opacity-85"
                      style={{
                        background: `linear-gradient(225deg, ${card.accent} 50%, transparent 50%)`
                      }}
                    />

                    {/* Top Pushpin Dot + Step Pill */}
                    <div className="flex items-center justify-between relative z-10">
                      {/* Tactile Pushpin with 3D Specular Highlight */}
                      <div 
                        className="w-3 h-3 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.7)] border border-white/50"
                        style={{ backgroundColor: card.pushpin }}
                      />
                      <span className="font-sans font-medium text-[11px] text-white/35 tracking-wider pr-4">
                        STEP {card.num}
                      </span>
                    </div>

                    {/* Middle Content Area */}
                    <div className="flex flex-col gap-2 text-left relative z-10">
                      {/* Eyebrow Tag */}
                      <span 
                        className="font-sans font-semibold text-[11px] tracking-[0.06em] uppercase"
                        style={{ color: card.accent }}
                      >
                        {card.tag}
                      </span>

                      {/* Card Title */}
                      <h3 className="text-white font-medium text-[20px] sm:text-[21px] leading-[26px] tracking-[-0.02em]">
                        {card.title}
                      </h3>

                      {/* Honest, Punchy Copy */}
                      <p className="text-[#A1A1A6] font-normal text-[13.5px] sm:text-[14px] leading-[22px] tracking-[-0.01em]">
                        {card.desc}
                      </p>
                    </div>
                  </Card>
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
          className="w-full rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
        >
          {/* Apple macOS Style Window Header Bar */}
          <div className="h-[46px] px-5 flex items-center justify-between bg-[#181818] border-b border-white/[0.08] select-none">
            {/* Apple Window Stoplights */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
            </div>

            <span className="text-[#A1A1A6] font-medium text-[12.5px] tracking-tight">
              About the Creator
            </span>

            {/* Invisible counterweight for centered title */}
            <div className="w-12" aria-hidden="true" />
          </div>

          {/* Window Body Area */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 text-left">
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
                <span className="text-[#86868B] font-normal text-[12.5px]">
                  (Not my actual face. The duck has higher self-esteem.)
                </span>
              </div>
            </div>

            {/* Short Honest Story: Apple Body scale 14.5px, 24px leading */}
            <div className="flex flex-col gap-3 text-[#A1A1A6] font-normal text-[14px] sm:text-[14.5px] leading-[24px]">
              <p>
                Hi. I built Bloom because getting a dry <span className="text-white font-medium text-[13px] bg-white/[0.06] px-1.5 py-0.5 rounded">&ldquo;hbd 🎂&rdquo;</span> text hurts my soul. 
                People deserve something tactile that feels like it took more than two seconds of effort.
              </p>
              <p>
                I spent an embarrassing amount of time simulating real paper grain, foil bevels, and drawing silly stickers. 
                Bloom is completely free, open, and has no accounts to remember.
              </p>
            </div>

            {/* Action Bar: Buy Coffee */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[#86868B] font-normal text-[13px]">
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
