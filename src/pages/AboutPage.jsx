import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { BloomLogo } from '@/components/ui';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';
import CoffeeButton from '@/components/ui/CoffeeButton';

// Apple-style easing + gentle stagger
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] },
});

const WHAT_IT_DOES = [
  { emoji: '🌸', title: 'Pick a mood', text: 'Sorry, happy birthday, congrats, "I miss you but in a normal way". That kind of thing.' },
  { emoji: '🦆', title: 'Make it yours', text: 'Write a message, choose a card, add stickers. Crooked placement is encouraged.' },
  { emoji: '💌', title: 'Send it', text: 'Share a link or download a PDF. Then wait nervously for a reply.' },
];

const HONEST_ANSWERS = [
  { q: 'Is it free?', a: 'Yes. I haven\u2019t figured out how to charge for it without feeling weird.' },
  { q: 'Do I need an account?', a: 'No. I didn\u2019t want to build a login page, honestly.' },
  { q: 'Will there be bugs?', a: 'Almost definitely. Please tell me through the feedback button. Gently.' },
];

export default function AboutPage({ onStartCrafting }) {
  return (
    <div className="flex justify-center px-4 md:px-6 py-12 md:py-16">
      <div className="w-full max-w-[640px] flex flex-col gap-8">

        {/* Hero */}
        <motion.section {...fadeUp(0)} className="flex flex-col items-center text-center gap-5">
          <BloomLogo size="lg" version="ver. 1.1" />
          <h1 className="text-white font-bold text-[28px] md:text-[34px] leading-[1.15] tracking-[-0.03em] font-sans">
            Hi. This is Bloom.<br />
            <span className="text-white/50">It makes cards. That&rsquo;s mostly it.</span>
          </h1>
          <p className="text-white/55 text-[14.5px] leading-[23px] max-w-[480px] font-sans">
            I made it because typing &ldquo;hbd&rdquo; felt rude, and store-bought cards
            felt like they were written by a very polite robot. So, um, here we are.
          </p>
        </motion.section>

        {/* What it does */}
        <motion.section {...fadeUp(0.08)} className="rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden">
          <div className="h-[52px] px-6 flex items-center bg-[#1F1F1F] border-b border-white/[0.08]">
            <h2 className="text-white/85 font-semibold text-[15px] tracking-[-0.02em] font-sans">What it does</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {WHAT_IT_DOES.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#161616] flex items-center justify-center text-[18px] select-none">
                  {item.emoji}
                </div>
                <div className="flex flex-col gap-1 pt-0.5">
                  <span className="text-white font-medium text-[14px] font-sans">{item.title}</span>
                  <span className="text-white/50 text-[13px] leading-[19px] font-sans">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* About me */}
        <motion.section {...fadeUp(0.16)} className="rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden">
          <div className="h-[52px] px-6 flex items-center bg-[#1F1F1F] border-b border-white/[0.08]">
            <h2 className="text-white/85 font-semibold text-[15px] tracking-[-0.02em] font-sans">The person who made this</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/bloom/duck.png"
                alt=""
                className="w-11 h-11 object-contain select-none pointer-events-none"
              />
              <p className="text-white/40 text-[12.5px] font-sans">
                Not my actual face. I&rsquo;m not ready for that.
              </p>
            </div>
            <p className="text-white/65 text-[14px] leading-[22px] font-sans">
              Hi, it&rsquo;s just me. One person. No team, no office, no investors asking
              about growth. I spent way too long moving stickers by a single pixel and
              asking myself if a shadow was &ldquo;too much&rdquo;. It usually was.
            </p>
            <p className="text-white/65 text-[14px] leading-[22px] font-sans">
              If one of these cards made someone smile, that&rsquo;s honestly the whole point.
              And if it didn&rsquo;t&hellip; please don&rsquo;t tell me.
            </p>
          </div>
        </motion.section>

        {/* Honest answers */}
        <motion.section {...fadeUp(0.24)} className="flex flex-col gap-2">
          {HONEST_ANSWERS.map((item) => (
            <div key={item.q} className="rounded-[16px] bg-[#161616] px-5 py-4 flex flex-col gap-1">
              <span className="text-white font-medium text-[13.5px] font-sans">{item.q}</span>
              <span className="text-white/50 text-[13px] leading-[19px] font-sans">{item.a}</span>
            </div>
          ))}
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUp(0.32)} className="flex flex-col items-center text-center gap-4 pt-2">
          <p className="text-white/45 text-[13px] font-sans">
            Okay, that&rsquo;s enough about me. Go make something.
          </p>
          <div className="flex items-center gap-3">
            <CoffeeButton />
            <LiquidGlassButton variant="primary" size="md" onClick={onStartCrafting} className="px-6 font-sans">
              <span>Make a card</span>
              <ArrowRight size={16} weight="bold" />
            </LiquidGlassButton>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
