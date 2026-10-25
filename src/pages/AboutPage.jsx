import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkle, 
  Heart, 
  Coffee, 
  Bug, 
  Code, 
  SmileyWink, 
  ArrowRight,
  HandWaving,
  ShieldCheck,
  Lightning,
  PaintBrush,
  EnvelopeSimple,
  Globe,
  Ghost
} from '@phosphor-icons/react';
import { BloomLogo, WindowPanel } from '@/components/ui';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';
import CoffeeButton from '@/components/ui/CoffeeButton';

const STORY_TABS = [
  { id: 'why', label: 'The "Why"', icon: Heart },
  { id: 'craft', label: 'How It Works', icon: Lightning },
  { id: 'human', label: 'About Me', icon: SmileyWink },
  { id: 'confessions', label: 'Confessions', icon: Bug },
];

const CARD_SHOWCASE = [
  {
    title: 'Paper Card',
    tag: 'Classic Tactile',
    desc: 'Pressed card with archival paper grain, wax-seal stamps, botanical meanings, and nostalgic handwriting.',
    accent: '#86B75A',
    icon: '🌸',
    detail: 'For heartfelt confessions, soft apologies, or pretending you wrote a letter in 1842.'
  },
  {
    title: 'Metallic Card',
    tag: 'Victorian Foil',
    desc: 'Lustrous foil bevels, specular liquid glass borders, and shimmering tactile gold/platinum reflections.',
    accent: '#7CE0DC',
    icon: '✨',
    detail: 'For major life milestones, excessive celebrations, or flexing with ridiculous aesthetic flair.'
  },
  {
    title: 'Pokémon & Trainer',
    tag: 'Collector Edition',
    desc: 'Authentic trading card geometry, holographic foil sheen, custom HP stats, attacks, and trainer photos.',
    accent: '#0088FF',
    icon: '⚡',
    detail: 'For true best friends, goofy inside jokes, and declaring someone super effective against bad moods.'
  },
];

const STATS = [
  { value: '100%', label: 'Human-Crafted (No Bland AI Templates)' },
  { value: '0', label: 'Spam, trackers, or annoying popups' },
  { value: '3,400+', label: 'Stickers placed at questionable angles' },
  { value: '∞', label: 'Emotional damage (the wholesome kind)' },
];

export default function AboutPage() {
  const [activeStory, setActiveStory] = useState('why');

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 md:px-8 py-10 md:py-16 selection:bg-[#0088FF]/30 selection:text-white">
      {/* Background Ambient Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[radial-gradient(ellipse,rgba(134,183,90,0.18)_0%,rgba(0,136,255,0.10)_45%,transparent_70%)] blur-[90px] -z-10" 
      />

      <div className="w-full max-w-4xl flex flex-col items-center gap-10 md:gap-14">
        
        {/* HERO SECTION: Master Bloom Logo + Awkward Honest Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center gap-5 max-w-2xl"
        >
          {/* Master Bloom Logo - Exact Component */}
          <div className="relative group">
            <BloomLogo size="lg" version="ver. 1.1" />
            <motion.div 
              initial={{ scale: 0, rotate: 12 }}
              animate={{ scale: 1, rotate: 8 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
              className="absolute -top-3 -right-6 hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181818] border border-white/[0.12] text-[11px] font-mono text-[#CFC531] shadow-lg select-none pointer-events-none"
            >
              <span>hand-coded</span>
              <Sparkle size={12} weight="fill" />
            </motion.div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-[-0.03em] leading-[1.12] font-sans">
            Because a boring text message is{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#86B75A] via-[#CFC531] to-[#7CE0DC]">
              mildly disrespectful.
            </span>
          </h1>

          <p className="text-[15px] sm:text-[16px] text-white/60 leading-[25px] font-sans font-normal max-w-xl">
            Bloom was born out of a very specific dread: sending generic Hallmark cards that sound like an HR email, or worse, sending a single lowercase "happy birthday" text that looks like a court summons.
          </p>

          {/* Social Proof / Tiny Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 select-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] border border-white/[0.08] text-white/70 text-[12px] font-medium">
              <ShieldCheck size={14} className="text-[#34C759]" weight="fill" />
              <span>Free to craft & share</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] border border-white/[0.08] text-white/70 text-[12px] font-medium">
              <Ghost size={14} className="text-[#0088FF]" weight="duotone" />
              <span>Zero sign-up required</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] border border-white/[0.08] text-white/70 text-[12px] font-medium">
              <PaintBrush size={14} className="text-[#FF9F0A]" weight="duotone" />
              <span>Interactive 3D physics</span>
            </div>
          </div>
        </motion.div>


        {/* HERO UI INSPIRED SEGMENTED NARRATIVE DECK */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full flex flex-col items-center gap-4"
        >
          {/* HeroUI-Inspired Flat Segmented Control Track */}
          <div className="w-full max-w-md p-1 bg-[#161616] border border-white/[0.08] rounded-full relative">
            <div role="tablist" className="grid grid-cols-4 relative">
              {STORY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeStory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveStory(tab.id)}
                    className="relative z-10 flex items-center justify-center gap-1.5 h-[36px] rounded-full text-[12.5px] font-medium transition-colors cursor-pointer outline-none select-none"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeAboutTab"
                        className="absolute inset-0 rounded-full bg-[#242424] -z-10 shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 38,
                          mass: 0.8
                        }}
                      />
                    )}
                    <Icon 
                      size={14} 
                      weight={isActive ? 'duotone' : 'regular'} 
                      className={`transition-colors ${isActive ? 'text-white' : 'text-white/45'}`} 
                    />
                    <span className={`transition-colors ${isActive ? 'text-white font-medium' : 'text-white/45 hover:text-white/80'}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Content Card (HeroUI Surface Card Container) */}
          <div className="w-full relative rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
            <AnimatePresence mode="wait">
              {activeStory === 'why' && (
                <motion.div
                  key="why"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#181818] border border-white/[0.10] flex items-center justify-center text-xl shrink-0">
                      💌
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[19px] leading-[24px] font-sans">
                        The Awkward Truth About Greeting Cards
                      </h3>
                      <p className="text-white/40 text-[12px] font-mono">
                        CASE_FILE: emotional_vulnerability.md
                      </p>
                    </div>
                  </div>

                  <p className="text-white/70 text-[14.5px] leading-[24px] font-sans">
                    Have you ever spent 20 minutes standing in a drugstore card aisle holding a glittery piece of cardboard that says, <em>"To someone special who lights up the world like sunshine"</em>, and thought: <strong className="text-white">"I cannot hand this to my best friend without both of us throwing up."</strong>
                  </p>

                  <p className="text-white/70 text-[14.5px] leading-[24px] font-sans">
                    Bloom exists for the rest of us. People who want to say something genuinely kind, deeply personal, or delightfully unhinged, without the corporate cringe. Whether it's pairing a Victorian flower meaning with an honest apology, or building a custom holographic Pokémon card of your friend holding an iced coffee.
                  </p>

                  <div className="mt-2 p-4 rounded-[16px] bg-[#161616] border border-white/[0.08] flex items-start gap-3">
                    <span className="text-xl shrink-0">🦆</span>
                    <p className="text-white/60 text-[13px] leading-[20px] font-sans italic">
                      "Our cards don't end up in landfills. They live permanently on an interactive 3D link where you can peel off virtual stickers, read hidden messages, and save them forever."
                    </p>
                  </div>
                </motion.div>
              )}

              {activeStory === 'craft' && (
                <motion.div
                  key="craft"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#181818] border border-white/[0.10] flex items-center justify-center text-xl shrink-0">
                      ⚙️
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[19px] leading-[24px] font-sans">
                        Crafted with Liquid Glass & Apple Physics
                      </h3>
                      <p className="text-white/40 text-[12px] font-mono">
                        ENGINEERING: 60fps_tactile_delight
                      </p>
                    </div>
                  </div>

                  <p className="text-white/70 text-[14.5px] leading-[24px] font-sans">
                    Every bevel, glossy specular shine, and rubber sticker in Bloom is rendered with real physics. When you flip a card, it doesn't just cut across the screen—it carries tactile momentum, casts dynamic shadows, and catches simulated light across the foil foil.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 rounded-[14px] bg-[#161616] border border-white/[0.08] flex flex-col gap-1.5">
                      <span className="text-[#86B75A] font-semibold text-[13.5px]">01. Choose Vibe</span>
                      <p className="text-white/50 text-[12px] leading-[17px]">
                        Pick your mood from deep apologies to goofy celebrations.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-[14px] bg-[#161616] border border-white/[0.08] flex flex-col gap-1.5">
                      <span className="text-[#CFC531] font-semibold text-[13.5px]">02. Personalize</span>
                      <p className="text-white/50 text-[12px] leading-[17px]">
                        Add handwritten notes, slap on die-cut stickers, or customize Pokémon stats.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-[14px] bg-[#161616] border border-white/[0.08] flex flex-col gap-1.5">
                      <span className="text-[#7CE0DC] font-semibold text-[13.5px]">03. Ship the Link</span>
                      <p className="text-white/50 text-[12px] leading-[17px]">
                        Instant zero-lag link generation or download high-res printable PDF.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStory === 'human' && (
                <motion.div
                  key="human"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    {/* Die Cut Duck Decal with Eyes */}
                    <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                      <img 
                        src="/assets/bloom/duck.png" 
                        alt="duck" 
                        className="w-10 h-10 object-contain drop-shadow select-none pointer-events-none" 
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[19px] leading-[24px] font-sans">
                        Who is building this? (The Human Part)
                      </h3>
                      <p className="text-white/40 text-[12px] font-mono">
                        OCCUPATION: full_time_overthinker
                      </p>
                    </div>
                  </div>

                  <p className="text-white/70 text-[14.5px] leading-[24px] font-sans">
                    Hi! I'm an independent designer and developer who spends an unhealthy amount of time obsessing over whether a button shadow is 2 pixels too harsh or if a sticker should rotate 7 degrees instead of 6.
                  </p>

                  <p className="text-white/70 text-[14.5px] leading-[24px] font-sans">
                    I built Bloom because I wanted the web to feel fun, whimsical, and tactile again—like the early internet when people made things just because they brought joy, not because an algorithm demanded it. Every pixel, sticker illustration, and micro-interaction is handcrafted with care.
                  </p>

                  <div className="p-4 rounded-[16px] bg-[#161616] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 mt-1">
                    <div className="flex items-center gap-3">
                      <Coffee size={24} className="text-[#FFD60A] shrink-0" weight="duotone" />
                      <div>
                        <div className="text-white font-medium text-[13.5px]">Fuel the insanity?</div>
                        <div className="text-white/45 text-[12px]">If Bloom saved you from an awkward birthday text, you can buy me a coffee!</div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <CoffeeButton />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStory === 'confessions' && (
                <motion.div
                  key="confessions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#181818] border border-white/[0.10] flex items-center justify-center text-xl shrink-0">
                      🐛
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[19px] leading-[24px] font-sans">
                        Developer Confessions
                      </h3>
                      <p className="text-white/40 text-[12px] font-mono">
                        LOGS: uncensored_truths.txt
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-1 text-[13.5px] font-sans">
                    <div className="p-3 rounded-[12px] bg-[#161616] border border-white/[0.06] text-white/70 flex items-start gap-2.5">
                      <span className="text-[#FF453A] font-mono text-[12px] shrink-0 font-bold">[BUG]</span>
                      <span>I spent 4 hours fixing a bug only to realize I had muted my own speakers.</span>
                    </div>
                    <div className="p-3 rounded-[12px] bg-[#161616] border border-white/[0.06] text-white/70 flex items-start gap-2.5">
                      <span className="text-[#FF9F0A] font-mono text-[12px] shrink-0 font-bold">[STICKERS]</span>
                      <span>The rubber duck sticker was supposed to be a temporary placeholder. It is now the emotional backbone of this entire company.</span>
                    </div>
                    <div className="p-3 rounded-[12px] bg-[#161616] border border-white/[0.06] text-white/70 flex items-start gap-2.5">
                      <span className="text-[#30D158] font-mono text-[12px] shrink-0 font-bold">[LOVE]</span>
                      <span>I secretly read every single piece of feedback sent through the modal and do a tiny victory dance in my kitchen.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>


        {/* CARD FORMATS: Master Component Panels in Figma Tablet Window Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full flex flex-col gap-4"
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="text-white/90 font-bold text-[20px] tracking-[-0.02em] font-sans">
              Three Distinct Mediums
            </h2>
            <span className="text-white/40 text-[12px] font-mono">
              ALL_FREE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {CARD_SHOWCASE.map((card, i) => (
              <WindowPanel 
                key={card.title}
                title={card.title}
                className="hover:border-white/[0.24] transition-colors"
                bodyClassName="p-5 flex flex-col justify-between gap-4 min-h-[190px]"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl select-none">{card.icon}</span>
                    <span 
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08]"
                      style={{ color: card.accent }}
                    >
                      {card.tag}
                    </span>
                  </div>
                  <p className="text-[13px] text-white/60 leading-[19px] font-sans font-normal mt-1">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-[11.5px] text-white/35 italic font-sans leading-[16px]">
                    {card.detail}
                  </p>
                </div>
              </WindowPanel>
            ))}
          </div>
        </motion.div>


        {/* STATS BENTO SECTION (HeroUI / Apple inspired) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 select-none"
        >
          {STATS.map((stat) => (
            <div 
              key={stat.label}
              className="p-4 rounded-[18px] bg-[#0E0E0E] border border-white/[0.08] flex flex-col items-center text-center gap-1 hover:border-white/[0.16] transition-colors"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 font-sans tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11.5px] text-white/45 leading-[16px] font-sans">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>


        {/* FOOTER CALL TO ACTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#141414] via-[#111] to-[#141414] border border-white/[0.10] gap-5 text-center sm:text-left select-none"
        >
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-white font-bold text-[18px] sm:text-[20px] font-sans tracking-tight">
              Ready to create something wholesome?
            </h3>
            <p className="text-white/50 text-[13px] leading-[19px] font-sans">
              No login, no credit cards, no algorithmic nonsense. Just make someone smile.
            </p>
          </div>

          <LiquidGlassButton
            variant="primary"
            size="md"
            onClick={() => {
              // Smooth scroll to top and switch to design
              window.scrollTo({ top: 0, behavior: 'smooth' });
              const navBtn = document.querySelector('button[aria-label="Design"], nav button:first-child');
              if (navBtn) navBtn.click();
            }}
            className="px-6 font-sans text-[14px] shrink-0"
          >
            <span>Start Crafting Card</span>
            <ArrowRight size={16} weight="bold" />
          </LiquidGlassButton>
        </motion.div>

      </div>
    </div>
  );
}
