import React from 'react';
import { InstagramLogo, EnvelopeSimple } from '@phosphor-icons/react';
import '@/components/ui/LiquidGlassIconButton.css';
import CoffeeButton from '@/components/ui/CoffeeButton';

export default function Footer({ onFeedback, onTerms, onPrivacy }) {
  return (
    <footer 
      role="contentinfo" 
      aria-label="Footer"
      className="w-full px-8 xl:px-14 pt-6 pb-6 flex flex-col md:flex-row items-center md:items-stretch justify-between z-20 text-neutral-400 select-none relative gap-6 md:gap-4 font-sans"
    >
      {/* 1. Left Section - Bloom Logo & Description + Bottom-Aligned Legal Links */}
      <div className="flex flex-col w-[326px] text-center md:text-left items-center md:items-start shrink-0 justify-between self-stretch">
        <div>
          {/* Header Block: Height calibrated to match right side (40px) */}
          <div className="h-[40px] flex items-end gap-[3px] pb-1">
            {/* Logo matching Navbar typography exactly */}
            <span className="font-serif italic text-[30px] xl:text-[32px] tracking-[-0.05em] text-white leading-none">
              Bloom
            </span>
            <span className="font-sans text-[14px] xl:text-[15px] tracking-[-0.05em] text-white leading-none pb-0.5">
              Ver. 1.1
            </span>
          </div>

          {/* Divider Line: exactly 326px */}
          <div className="w-[326px] h-[1px] bg-white/[0.08] mt-2 mb-2" aria-hidden="true" />

          {/* Description: Regular weight, 12px / 17px leading */}
          <p className="text-[12px] text-[#999999] leading-[17px] font-sans font-normal w-[326px] tracking-[-0.01em]">
            I built Bloom because getting a dry "HBD 🎂" text hurts my soul. Real people deserve more than a generic blue bubble.
          </p>
        </div>

        {/* Legal Links (Flush on bottom baseline matching Coffee Button) */}
        <nav aria-label="Legal Links" className="flex items-center gap-2.5 text-[11px] text-white/35 font-sans font-normal mt-4 pb-3">
          <button onClick={onTerms} className="hover:text-white transition-colors cursor-pointer outline-none">
            Terms of Use
          </button>
          <span aria-hidden="true" className="opacity-30">|</span>
          <button onClick={onPrivacy} className="hover:text-white transition-colors cursor-pointer outline-none">
            Privacy Policy
          </button>
        </nav>
      </div>

      {/* 2. Center Section - Action Trio (Instagram, Feedback, Email) Bottom-Aligned */}
      <div className="flex items-center gap-3 shrink-0 self-center md:self-end pb-0.5">
        <a 
          href="https://instagram.com" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="liquid-glass-icon-button text-white/80 hover:text-white"
        >
          <span className="liquid-glass-icon-button__glass">
            <InstagramLogo size={30} />
          </span>
        </a>

        <button 
          type="button"
          onClick={onFeedback} 
          className="dark-liquid-glass-pill h-[50px] px-6 text-white/90 hover:text-white text-[16px] xl:text-[17px] leading-[22px] font-medium cursor-pointer"
        >
          Feedback
        </button>

        <a 
          href="mailto:hello@bloomcard.app" 
          aria-label="Email"
          className="liquid-glass-icon-button text-white/80 hover:text-white"
        >
          <span className="liquid-glass-icon-button__glass">
            <EnvelopeSimple size={30} />
          </span>
        </a>
      </div>

      {/* 3. Right Section - Buy Me a Coffee (Exact Height & Baseline Match) */}
      <div className="flex flex-col w-[326px] text-center md:text-right items-center md:items-end shrink-0 justify-between self-stretch">
        <div>
          {/* Header Block: Exactly 40px height matching left logo, spanning 326px to anchor divider line */}
          <div className="w-[326px] h-[40px] flex items-end justify-between pb-0.5">
            {/* Decals Group: Die-cut Duck Sticker (36x34px) + Rotated Eyes (34px) anchored to left edge */}
            <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
              <img 
                src="/assets/bloom/duck.png" 
                alt="rubber duck sticker" 
                className="w-[36px] h-[34px] object-contain pointer-events-none drop-shadow-sm select-none" 
              />
              <img 
                src="/assets/bloom/eyes.png" 
                alt="eyes" 
                className="w-[34px] h-[34px] object-contain pointer-events-none drop-shadow-sm select-none rotate-[-8deg]" 
              />
            </div>

            {/* Title: Sentence Case, 18px font-size, 17px line-height, text-right, text-white */}
            <div className="text-[18px] leading-[17px] font-normal tracking-[-0.02em] text-right text-white select-none">
              Thinking about buying me a<br />
              cup of coffee
            </div>
          </div>

          {/* Divider Line: Exactly 326px, exactly mt-2 mb-2 matching left divider */}
          <div className="w-[326px] h-[1px] bg-white/[0.08] mt-2 mb-2 ml-auto" aria-hidden="true" />

          {/* Shortened Awkward Funny Text: 12px / 17px leading */}
          <p className="text-[12px] text-[#999999] leading-[17px] font-sans font-normal w-[326px] tracking-[-0.01em]">
            Umm... so, yeah. I never know how to ask this without sounding weird, haha. But if this card made someone smile today, you could, maybe, buy me a coffee?
          </p>
        </div>

        {/* Scaled Coffee Button (Flush on bottom baseline) */}
        <div className="mt-4 ml-auto">
          <CoffeeButton />
        </div>
      </div>
    </footer>
  );
}
