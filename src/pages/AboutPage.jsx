import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  CursorClick
} from '@phosphor-icons/react';
import { Card } from '@heroui/react';
import ScatteredKeepsakes from '@/components/ui/ScatteredKeepsakes';
import ShaderButton from '@/components/ui/ShaderButton';
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
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0E0E0E] border border-white/[0.10] select-none">
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

// 3 Tactile Stationery Fan Cards
const HOW_IT_WORKS_CARDS = [
  {
    num: '01',
    tag: 'CURATED MOODS',
    title: 'Choose the Tone',
    desc: 'Curated moods for real moments, from birthdays to apologies.',
    rotate: -2.2,
    pushpin: '#86B75A', // Spring Olive (single matching accent color)
    accent: '#86B75A',
  },
  {
    num: '02',
    tag: 'TACTILE CRAFT',
    title: 'Craft the Details',
    desc: 'Add tactile paper textures, gold foil, and personal notes.',
    rotate: 1.8,
    pushpin: '#CFC531', // Warm Sunlight (single matching accent color)
    accent: '#CFC531',
  },
  {
    num: '03',
    tag: 'ZERO FRICTION',
    title: 'Share in Seconds',
    desc: 'Send a permanent 3D link that opens instantly on any phone.',
    rotate: -1.4,
    pushpin: '#7CE0DC', // Mint Cyan (single matching accent color)
    accent: '#7CE0DC',
  },
];

export default function AboutPage({ onStartCrafting, onFeedback, onTerms, onPrivacy }) {
  const [hoveredCard, setHoveredCard] = useState(null);

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

      {/* Scattered Ambient Keepsake Folders in Background Margins (Option B) */}
      <ScatteredKeepsakes />

      {/* Main Narrative Column */}
      <main className="w-full max-w-[740px] px-5 sm:px-8 pt-12 sm:pt-16 pb-20 flex flex-col items-center gap-14 sm:gap-16 relative z-10">

        {/* ============================================================
            1. HERO SECTION: Brand Mark + Exact Apple Display Type Scale & Weights
           ============================================================ */}
        <div className="flex flex-col items-center text-center gap-6 relative max-w-[640px]">

          {/* Interactive Mouse Tracking Eyes */}
          <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <TrackingEyes />
            <span className="text-[12px] leading-[16px] text-white/35 font-normal tracking-tight">watching you craft</span>
          </motion.div>

          {/* Apple HIG Large Title: 44px / 48px, line-height 52px, tracking -0.035em, font-normal 400 */}
          <div className="flex flex-col gap-3">
            <h1 className="text-white font-normal text-[38px] sm:text-[46px] md:text-[48px] leading-[1.12] sm:leading-[52px] tracking-[-0.035em]">
              I make greeting cards that people{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#86B75A] via-[#CFC531] to-[#7CE0DC]">
                actually keep.
              </span>
            </h1>

            {/* Apple HIG Body: 16px, line-height 24px, tracking -0.015em, font-normal 400 */}
            <p className="text-white/55 font-normal text-[15px] sm:text-[16px] leading-[24px] tracking-[-0.015em] max-w-[480px] mx-auto">
              No drugstore greeting card aisles. No rhyming poems. Just 60fps tactile cards and stickers placed at questionable angles.
            </p>
          </div>

          {/* Framer WebGL Liquid Gradient Shader Button */}
          <div className="mt-1">
            <ShaderButton onClick={onStartCrafting}>
              Design your card
            </ShaderButton>
          </div>
        </div>


        {/* ============================================================
            2. TACTILE STATIONERY FAN CARDS: "How It Works"
           ============================================================ */}
        <section className="w-full flex flex-col gap-4">
          
          {/* Section Eyebrow (Apple HIG Caption 2: 11px, line-height 13px, tracking 0.08em uppercase, font-normal 400) */}
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-white/40 text-[11px] leading-[13px] font-normal tracking-[0.08em] uppercase">
              How it works
            </span>
            <span className="text-white/30 text-[11px] leading-[13px] font-normal flex items-center gap-1.5">
              <CursorClick size={12} />
              hover or tap cards
            </span>
          </div>

          {/* 3 Tilted Stationery Cards (Fan Layout) */}
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
                    className={`relative rounded-[22px] bg-[#0E0E0E] border p-6 flex flex-col justify-between gap-6 cursor-default select-none overflow-hidden transition-colors duration-300 ${
                      isHovered 
                        ? 'border-white/[0.22]' 
                        : 'border-white/[0.10]'
                    }`}
                    style={{
                      minHeight: '230px',
                      outline: '1px solid transparent',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Decorative Corner Ribbon Triangle (Vector Anti-Aliased) */}
                    <svg 
                      aria-hidden="true"
                      viewBox="0 0 36 36"
                      className="absolute top-0 right-0 w-9 h-9 pointer-events-none"
                      shapeRendering="geometricPrecision"
                    >
                      <path d="M0 0 L36 0 L36 36 Z" fill={card.accent} fillOpacity="0.85" />
                    </svg>

                    {/* Top Pushpin Dot + Step Pill */}
                    <div className="flex items-center justify-between relative z-10">
                      {/* Tactile Pushpin Dot */}
                      <div 
                        className="w-3 h-3 rounded-full border border-white/40"
                        style={{ backgroundColor: card.pushpin }}
                      />
                      <span className="font-sans font-normal text-[11px] leading-[13px] text-white/35 tracking-wider pr-4">
                        STEP {card.num}
                      </span>
                    </div>

                    {/* Middle Content Area */}
                    <div className="flex flex-col gap-2 text-left relative z-10">
                      {/* Eyebrow Tag (Apple HIG Caption 2: 11px, line-height 13px, tracking 0.06em, font-normal 400) */}
                      <span 
                        className="font-sans font-normal text-[11px] leading-[13px] tracking-[0.06em] uppercase"
                        style={{ color: card.accent }}
                      >
                        {card.tag}
                      </span>

                      {/* Card Title (Apple HIG Title 3: 20px, line-height 25px, tracking -0.017em, font-normal 400) */}
                      <h3 className="text-white font-normal text-[19px] sm:text-[20px] leading-[25px] tracking-[-0.017em]">
                        {card.title}
                      </h3>

                      {/* Card Body Copy (Apple HIG Footnote: 12.5px - 13px, line-height 18px, tracking -0.01em, font-normal 400) */}
                      <p className="text-white/50 font-normal text-[12.5px] sm:text-[13px] leading-[18px] sm:leading-[19px] tracking-[-0.01em]">
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
            3. CREATOR WINDOW: Apple macOS Chrome with Exact Type Scale & Weights
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
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
            </div>

            {/* Window Title (Apple HIG Subheadline: 12.5px, line-height 16px, font-medium 500) */}
            <span className="text-white/60 font-medium text-[12.5px] leading-[16px] tracking-tight">
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
                {/* Headline: 16px, line-height 21px, font-semibold 600 */}
                <span className="text-white font-semibold text-[16px] leading-[21px] tracking-tight">
                  One human. Zero committees.
                </span>
                {/* Caption: 12.5px, line-height 16px, font-normal 400 */}
                <span className="text-white/40 font-normal text-[12.5px] leading-[16px]">
                  (Not my actual face. The duck has higher self-esteem.)
                </span>
              </div>
            </div>

            {/* Story Paragraphs: 14px, line-height 22px, font-normal 400 */}
            <div className="flex flex-col gap-2.5 text-white/65 font-normal text-[14px] sm:text-[14.5px] leading-[22px] pt-1">
              <p>
                Hi. I built Bloom because getting a dry <span className="text-white/90 font-medium text-[13px] bg-white/[0.06] px-1.5 py-0.5 rounded">&ldquo;hbd 🎂&rdquo;</span> text hurts my soul. 
                People deserve something tactile that feels like it took more than two seconds of effort.
              </p>
              <p>
                I spent an embarrassing amount of time simulating real paper grain, foil bevels, and drawing silly stickers. 
                Bloom is completely free, open, and has no accounts to remember.
              </p>
            </div>

            {/* Action Bar: Buy Coffee */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-white/45 font-normal text-[12.5px] leading-[18px]">
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
