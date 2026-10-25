import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CursorClick,
  Sparkle
} from '@phosphor-icons/react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Chip 
} from '@heroui/react';
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

// 3 Tactile Stationery Cards (Designed with HeroUI Card System & Apple Typography)
const HOW_IT_WORKS_STEPS = [
  {
    num: '01',
    title: 'Pick a Vibe',
    tag: 'Mood-first',
    desc: 'From heartfelt apologies and milestones to "I miss you but in a normal way." Pick a flower, metal, or monster.',
    rotate: -1.6,
    accent: '#86B75A',
    previewBadge: '🌸 Flower Meaning',
    cardImage: '/assets/bloom/paper_back_clean.png',
  },
  {
    num: '02',
    title: 'Slap On Details',
    tag: 'Tactile Craft',
    desc: 'Simulate paper grain, Victorian metallic foil, custom stats & crooked stickers placed at questionable angles.',
    rotate: 1.2,
    accent: '#CFC531',
    previewBadge: '✨ Foil Bevels',
    cardImage: '/assets/bloom/metallic_subject_front.png',
  },
  {
    num: '03',
    title: 'Ship the Link',
    tag: 'Instant 3D',
    desc: 'No account wall. Just a permanent 60fps 3D link that flips, tilts, and actually makes someone feel remembered.',
    rotate: -1.2,
    accent: '#7CE0DC',
    previewBadge: '⚡ 60fps 3D',
    cardImage: '/assets/polaroid-defaults/pokemon_card_back.png',
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
            2. HERO UI COMPONENT CARD SYSTEM: "How It Works"
            Engineered with @heroui/react Card, CardHeader, CardContent, CardFooter & Chip
           ============================================================ */}
        <section className="w-full flex flex-col gap-4">
          
          {/* Section Eyebrow with Apple HIG Typography */}
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[#86868B] text-[11px] font-medium tracking-[0.08em] uppercase">
              How it works
            </span>
            <span className="text-[#86868B] text-[11px] font-normal flex items-center gap-1.5">
              <CursorClick size={12} />
              hover to inspect
            </span>
          </div>

          {/* 3 HeroUI Surface Cards with Apple spring tilt */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const isHovered = hoveredCard === idx;

              return (
                <motion.div
                  key={step.num}
                  tabIndex={0}
                  role="region"
                  aria-label={`Step ${step.num}: ${step.title}`}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onFocus={() => setHoveredCard(idx)}
                  onBlur={() => setHoveredCard(null)}
                  animate={{
                    rotate: isHovered ? 0 : step.rotate,
                    y: isHovered ? -8 : 0,
                    scale: isHovered ? 1.02 : 1,
                  }}
                  transition={appleSpring}
                  className="outline-none"
                >
                  <Card
                    className={`group relative rounded-[24px] bg-[#141414]/90 backdrop-blur-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                      isHovered 
                        ? 'border-white/[0.22] shadow-[0_24px_50px_rgba(0,0,0,0.85)]' 
                        : 'border-white/[0.08] shadow-[0_12px_28px_rgba(0,0,0,0.5)]'
                    }`}
                    style={{ minHeight: '380px' }}
                  >
                    {/* Inner Specular Bevel Highlight */}
                    <div 
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none rounded-[24px]"
                      style={{
                        boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
                      }}
                    />

                    {/* HeroUI CardHeader: Step Indicator + Tag */}
                    <CardHeader className="flex items-center justify-between p-5 pb-2">
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          variant="flat"
                          className="bg-white/[0.06] border border-white/[0.10] px-2.5 py-1 text-white font-medium text-[12.5px] tracking-tight flex items-center gap-1.5"
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full inline-block mr-1 shadow-sm"
                            style={{ backgroundColor: step.accent }}
                          />
                          {step.num}
                        </Chip>
                      </div>

                      <Chip
                        size="sm"
                        variant="bordered"
                        className="text-[#86868B] border-white/[0.08] text-[11px] font-normal"
                      >
                        {step.tag}
                      </Chip>
                    </CardHeader>

                    {/* HeroUI CardContent: Visual Showcase Box + Title + Description */}
                    <CardContent className="px-5 py-2 flex flex-col gap-3">
                      {/* Featured Visual Media Container (The HeroUI card showcase signature) */}
                      <div className="w-full h-[140px] rounded-[16px] overflow-hidden relative border border-white/[0.08] bg-[#0A0A0A] group-hover:border-white/[0.18] transition-colors">
                        <img 
                          src={step.cardImage} 
                          alt={step.title}
                          className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05] group-hover:scale-105 group-hover:brightness-100 transition-all duration-500 select-none"
                        />
                        {/* Cinematic Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent opacity-70" />
                      </div>

                      <div className="flex flex-col gap-1.5 pt-1 text-left">
                        <CardTitle className="text-white font-medium text-[19px] sm:text-[20px] leading-snug tracking-[-0.02em]">
                          {step.title}
                        </CardTitle>

                        <CardDescription className="text-[#A1A1A6] font-normal text-[13.5px] sm:text-[14px] leading-[22px] tracking-[-0.01em]">
                          {step.desc}
                        </CardDescription>
                      </div>
                    </CardContent>

                    {/* HeroUI CardFooter: Action/Feature Pill */}
                    <CardFooter className="p-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[12px] font-normal text-[#86868B] flex items-center gap-1.5">
                        {step.previewBadge}
                      </span>
                      <motion.div
                        animate={{ opacity: isHovered ? 1 : 0.4, scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center text-[#86868B]"
                      >
                        <Sparkle size={13} style={{ color: step.accent }} />
                      </motion.div>
                    </CardFooter>
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
