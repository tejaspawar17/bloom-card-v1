import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkle, Heart, Bug, ShieldCheck, Code } from '@phosphor-icons/react';
import { BloomLogo } from '@/components/ui';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';
import CoffeeButton from '@/components/ui/CoffeeButton';
import Footer from '@/components/Footer';

// Apple HIG spring transition
const appleSpring = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pick a mood, not a greeting card aisle cliché',
    desc: 'From heartfelt confessions and sincere apologies to chaotic celebrations or "I miss you but in a normal way."',
    tag: 'Mood-first',
  },
  {
    step: '02',
    title: 'Customize the physical-digital canvas',
    desc: 'Write nostalgic notes, choose tactile paper, metallic foils, or collector Pokémon layouts, and slap on stickers at questionable angles.',
    tag: 'Crafted details',
  },
  {
    step: '03',
    title: 'Share an interactive 3D keepsake link',
    desc: 'No account wall. No ads. It opens instantly in a 60fps 3D viewer where they can flip, inspect, and save it forever.',
    tag: 'Instant link',
  },
];

const QUESTIONS = [
  {
    q: 'Is Bloom genuinely free?',
    a: 'Yes. There are no paywalls, hidden subscriptions, or watermarks. I built this for the joy of building it.',
  },
  {
    q: 'Why no accounts or sign-up screens?',
    a: 'Because nobody wants to remember a password just to send a card to their friend. You craft it, hit share, and you are done.',
  },
  {
    q: 'Will there be bugs?',
    a: 'Almost certainly. If a sticker behaves like an unhinged squirrel, click Send Feedback in the footer and I’ll fix it.',
  },
];

export default function AboutPage({ onStartCrafting, onFeedback, onTerms, onPrivacy }) {
  return (
    <div className="w-full flex flex-col items-center select-none font-sans">
      {/* Main Content Column: Max-w-[680px], HeroUI 4px/8px rhythm */}
      <main className="w-full max-w-[680px] px-5 sm:px-6 pt-12 sm:pt-16 pb-20 flex flex-col gap-12 sm:gap-14">
        
        {/* ============================================================
            1. HERO SECTION: Brand Mark + Apple Display Typography
           ============================================================ */}
        <motion.section 
          {...fadeUp(0)} 
          className="flex flex-col items-center text-center gap-6"
        >
          {/* Logo with Exact Navbar Glow & Instrument Serif Typography */}
          <div className="relative py-2">
            <BloomLogo size="lg" version="Ver. 1.1" />
          </div>

          {/* Headline using Apple-style tight tracking & balanced weights */}
          <div className="flex flex-col gap-3 max-w-[540px]">
            <h1 className="text-white font-extrabold text-[32px] sm:text-[40px] leading-[1.12] tracking-[-0.035em]">
              Crafted for moments when a plain text message feels{' '}
              <span className="text-white/40 font-normal">mildly disrespectful.</span>
            </h1>
            <p className="text-white/60 font-normal text-[15px] sm:text-[16px] leading-[25px] tracking-[-0.01em]">
              Bloom makes interactive, mood-driven digital keepsakes. 
              Because greeting card aisles are corporate and typing &ldquo;hbd&rdquo; looks like an unpaid parking ticket.
            </p>
          </div>

          {/* Trust Pills / Designer Badges (HeroUI pill tokens) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] border border-white/[0.08] text-[12px] font-medium text-white/70">
              <ShieldCheck size={14} className="text-[#34C759]" weight="fill" />
              100% Free & Open
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] border border-white/[0.08] text-[12px] font-medium text-white/70">
              <Sparkle size={14} className="text-[#0088FF]" weight="fill" />
              60fps Liquid Glass
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] border border-white/[0.08] text-[12px] font-medium text-white/70">
              <Heart size={14} className="text-[#FF375F]" weight="fill" />
              Zero Sign-Up Required
            </span>
          </div>
        </motion.section>

        {/* ============================================================
            2. WHAT IT DOES: HeroUI Structured Card with Sub-surface Hierarchy
           ============================================================ */}
        <motion.section 
          {...fadeUp(0.1)} 
          className="rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Header Bar matching TitleModal & ShareModal */}
          <div className="h-[54px] px-6 flex items-center justify-between bg-[#1F1F1F] border-b border-white/[0.08]">
            <h2 className="text-white/90 font-semibold text-[15px] tracking-[-0.02em]">
              How it works
            </h2>
            <span className="text-white/35 font-mono text-[11px] uppercase tracking-wider">
              3 simple steps
            </span>
          </div>

          {/* Step Rows: HeroUI 16px/24px spacing */}
          <div className="p-6 sm:p-7 flex flex-col gap-5">
            {HOW_IT_WORKS.map((item, idx) => (
              <div 
                key={item.step} 
                className="flex items-start gap-4 pb-5 border-b border-white/[0.06] last:border-b-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/[0.10] flex items-center justify-center text-[12px] font-mono font-bold text-white/80 shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-white font-semibold text-[14.5px] leading-[20px] tracking-[-0.015em]">
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-medium text-white/35 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06] shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-white/55 font-normal text-[13.5px] leading-[21px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ============================================================
            3. ABOUT THE CREATOR: Awkward, Honest, & Handcrafted
           ============================================================ */}
        <motion.section 
          {...fadeUp(0.18)} 
          className="rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Header Bar */}
          <div className="h-[54px] px-6 flex items-center justify-between bg-[#1F1F1F] border-b border-white/[0.08]">
            <h2 className="text-white/90 font-semibold text-[15px] tracking-[-0.02em]">
              The human behind the screen
            </h2>
            <span className="text-white/35 font-mono text-[11px] uppercase tracking-wider">
              Solo project
            </span>
          </div>

          <div className="p-6 sm:p-7 flex flex-col gap-5">
            {/* Mascot Decal Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-[16px] bg-[#161616] border border-white/[0.08] flex items-center justify-center shrink-0">
                <img 
                  src="/assets/bloom/duck.png" 
                  alt="rubber duck" 
                  className="w-8 h-8 object-contain pointer-events-none drop-shadow-sm select-none" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium text-[14px]">
                  Independent Designer & Developer
                </span>
                <span className="text-white/40 text-[12px]">
                  (Not my actual face. The duck has higher self-esteem.)
                </span>
              </div>
            </div>

            {/* Awkward Honest Story */}
            <div className="flex flex-col gap-3 text-white/65 font-normal text-[14px] sm:text-[14.5px] leading-[23px]">
              <p>
                Hi. I’m just one person who got annoyed by how sterile and transactional modern communication has become.
                Everyone sends disposable reactions, heart taps, or generic group chat birthday texts.
              </p>
              <p>
                So I spent months obsessing over tactile materials—simulating real pressed paper fibers, 
                Victorian foil bevels, and interactive liquid glass shaders that actually react to light. 
                I probably spent three full days deciding whether the rubber duck sticker was rotated 6 degrees or 8 degrees.
              </p>
              <p>
                Bloom is completely non-commercial. If this little project helped you make someone smile today, that is genuinely the entire reward.
              </p>
            </div>

            {/* Coffee Support Recessed Surface */}
            <div className="mt-2 p-4 rounded-[16px] bg-[#161616] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-white font-medium text-[13.5px]">
                  Enjoying Bloom?
                </span>
                <span className="text-white/45 text-[12px] leading-[17px]">
                  You can buy me a coffee to fuel the late-night pixel pushing.
                </span>
              </div>
              <div className="shrink-0">
                <CoffeeButton />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ============================================================
            4. FREQUENTLY ASKED QUESTIONS (HeroUI Recessed Cards)
           ============================================================ */}
        <motion.section {...fadeUp(0.24)} className="flex flex-col gap-3">
          <div className="px-1">
            <h2 className="text-white/80 font-semibold text-[15px] tracking-[-0.02em]">
              Honest answers to obvious questions
            </h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {QUESTIONS.map((item) => (
              <div 
                key={item.q}
                className="rounded-[16px] bg-[#121212] border border-white/[0.06] p-4 sm:p-5 flex flex-col gap-1.5 hover:border-white/[0.12] transition-colors"
              >
                <span className="text-white font-medium text-[14px] tracking-[-0.01em]">
                  {item.q}
                </span>
                <span className="text-white/50 font-normal text-[13px] leading-[20px]">
                  {item.a}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ============================================================
            5. BOTTOM CTA: High-Contrast Calm Action Block
           ============================================================ */}
        <motion.section 
          {...fadeUp(0.3)} 
          className="flex flex-col items-center text-center gap-5 pt-4 pb-2"
        >
          <div className="flex flex-col gap-1.5">
            <p className="text-white font-semibold text-[16px] tracking-[-0.02em]">
              Okay, that’s enough reading.
            </p>
            <p className="text-white/45 text-[13px]">
              Someone out there probably deserves a really nice card right now.
            </p>
          </div>

          <LiquidGlassButton
            variant="primary"
            size="md"
            onClick={onStartCrafting}
            className="px-7 font-sans text-[14px] font-medium"
          >
            <span>Start Crafting Card</span>
            <ArrowRight size={16} weight="bold" />
          </LiquidGlassButton>
        </motion.section>

      </main>

      {/* Embedded Global Footer */}
      <Footer 
        onFeedback={onFeedback} 
        onTerms={onTerms} 
        onPrivacy={onPrivacy} 
      />
    </div>
  );
}
