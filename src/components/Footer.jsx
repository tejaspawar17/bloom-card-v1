import React from 'react';
import { InstagramLogo, EnvelopeSimple, Coffee } from '@phosphor-icons/react';
import '@/components/ui/LiquidGlassIconButton.css';

export default function Footer({ onFeedback, onTerms, onPrivacy }) {
  return (
    <footer 
      role="contentinfo" 
      aria-label="Footer"
      className="w-full px-8 py-4 flex flex-row items-center justify-between border-t border-white/5 z-20 text-neutral-400 select-none mt-auto flex-shrink-0 relative"
    >
      {/* 1. Left Section - Bloom Branding & Legal */}
      <div className="flex flex-col gap-1 max-w-[340px]">
        <div className="flex items-baseline gap-2">
          <span className="font-serif italic text-[28px] text-white">
            Bloom
          </span>
          <span className="font-sans text-[11px] text-neutral-400">
            Ver. 1.1
          </span>
        </div>

        {/* Divider Line */}
        <div className="w-[260px] h-[1px] bg-white/10 my-1" aria-hidden="true" />

        <p className="text-[9px] text-neutral-500 leading-relaxed font-normal">
          (Description about what Bloom is) I'm so sorry for hurting you and for the disappointment my actions caused. I should have listened, communicated honestly
        </p>

        <nav aria-label="Legal Links" className="flex items-center gap-2 text-[9px] text-neutral-500 mt-1">
          <button onClick={onTerms} className="rounded hover:text-white transition-colors cursor-pointer">Terms of Use</button>
          <span aria-hidden="true">|</span>
          <button onClick={onPrivacy} className="rounded hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
        </nav>
      </div>

      {/* 2. Center Section - Actions (Hero UI lg tier 50px suite) */}
      <div className="flex items-center gap-3">
        <a 
          href="#" 
          aria-label="Instagram"
          className="liquid-glass-icon-button text-white/80 hover:text-white"
        >
          <span className="liquid-glass-icon-button__glass">
            <InstagramLogo size={32} />
          </span>
        </a>

        <button 
          onClick={onFeedback} 
          className="dark-liquid-glass-pill h-[50px] px-6 text-white/90 hover:text-white text-[17px] leading-[22px] font-medium"
        >
          Feedback
        </button>

        <a 
          href="#" 
          aria-label="Email"
          className="liquid-glass-icon-button text-white/80 hover:text-white"
        >
          <span className="liquid-glass-icon-button__glass">
            <EnvelopeSimple size={32} />
          </span>
        </a>
      </div>

      {/* 3. Right Section - Buy Me a Coffee */}
      <div className="flex flex-col gap-1 max-w-[340px] text-right xl:items-end">
        <div className="flex items-center justify-end gap-2 text-white">
          <span className="text-lg">?? ??</span>
          <span className="font-medium text-xs tracking-tight">
            Thinking About Buying Me A Cup Of Coffee
          </span>
        </div>

        {/* Divider Line */}
        <div className="w-[260px] h-[1px] bg-white/10 my-1 ml-auto" aria-hidden="true" />

        <p className="text-[9px] text-neutral-500 leading-relaxed max-w-[260px]">
          [Description about what Bloom is) I'm so sorry for hurting you and for the disappointment my actions
        </p>

        <a href="#" className="inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-600 text-white px-5 py-1.5 rounded-full text-[11px] font-medium transition-all shadow-md w-fit mt-1 ml-auto">
          <Coffee size={14} weight="regular" />
          Coffee
        </a>
      </div>
    </footer>
  );
}
