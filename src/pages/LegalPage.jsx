import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  WarningCircle, 
  EnvelopeSimple, 
  InstagramLogo, 
  Sparkle, 
  Copy,
  LockKey,
  HardDrives,
  ShareNetwork,
  Scales
} from '@phosphor-icons/react';
import ScatteredKeepsakes from '@/components/ui/ScatteredKeepsakes';
import Footer from '@/components/Footer';
import { showToast } from '@/components/ui/AppleToast';

const appleSpring = {
  type: "spring",
  stiffness: 380,
  damping: 28,
  mass: 0.8
};

export default function LegalPage({ 
  initialTab = 'terms', 
  onStartCrafting, 
  onFeedback, 
  onTerms, 
  onPrivacy 
}) {
  const [currentTab, setCurrentTab] = useState(initialTab);

  // Sync state if initialTab prop changes from external router/footer
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  const handleSwitchTab = (tab) => {
    setCurrentTab(tab);
    window.history.replaceState(null, '', `#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = async () => {
    const email = 'pawartejas517@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showToast({ 
      title: 'Takedown email copied', 
      description: email, 
      duration: 2600 
    });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between select-none font-sans overflow-hidden bg-black text-white selection:bg-blue-600 selection:text-white">
      
      {/* Scattered Ambient Keepsake Folders and Blinking Stars in Background Margins */}
      <ScatteredKeepsakes />

      {/* Main Narrative Column */}
      <main className="w-full max-w-[780px] px-5 sm:px-8 pt-6 sm:pt-10 pb-24 sm:pb-28 flex flex-col items-center relative z-10">

        {/* Top Floating Controls: Back Pill + Segmented Glass Tab Switcher */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12">
          
          {/* Back to Studio Glass Pill */}
          <button
            type="button"
            onClick={onStartCrafting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E0E0E]/90 border border-white/[0.12] hover:border-white/[0.24] text-[#999999] hover:text-white transition-all text-[12.5px] font-sans active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer backdrop-blur-xl group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Studio</span>
          </button>

          {/* Liquid Glass Segmented Switcher */}
          <div 
            role="tablist"
            aria-label="Legal document selection"
            className="inline-flex items-center p-1 rounded-full bg-[#0E0E0E]/90 border border-white/[0.12] shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={currentTab === 'terms'}
              onClick={() => handleSwitchTab('terms')}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-[12.5px] font-medium transition-all cursor-pointer ${
                currentTab === 'terms'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#999999] hover:text-white'
              }`}
            >
              <FileText size={14} weight={currentTab === 'terms' ? 'bold' : 'regular'} />
              <span>Terms of Use</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={currentTab === 'privacy'}
              onClick={() => handleSwitchTab('privacy')}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-[12.5px] font-medium transition-all cursor-pointer ${
                currentTab === 'privacy'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#999999] hover:text-white'
              }`}
            >
              <ShieldCheck size={14} weight={currentTab === 'privacy' ? 'bold' : 'regular'} />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Container */}
        <AnimatePresence mode="wait">
          {currentTab === 'terms' ? (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center"
            >
              {/* Header Hero Area */}
              <div className="flex flex-col items-center text-center gap-3.5 mb-10 max-w-[620px]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E0E0E] border border-white/[0.10]">
                  <Scales size={13} className="text-[#86B75A]" />
                  <span className="text-[11px] leading-[13px] font-normal tracking-[0.08em] uppercase text-[#86B75A]">
                    Legal & Ethical Framework
                  </span>
                </div>

                <h1 className="text-white font-normal text-[36px] sm:text-[44px] md:text-[48px] leading-[1.12] sm:leading-[52px] tracking-[-0.035em]">
                  Rules of the craft,{' '}
                  <span 
                    className="italic font-thin text-white"
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontWeight: 100,
                      fontStyle: 'italic',
                      fontSynthesis: 'none',
                    }}
                  >
                    fair play & parody.
                  </span>
                </h1>

                <p className="text-[#999999] font-normal text-[14.5px] sm:text-[15.5px] leading-[23px] tracking-[-0.015em]">
                  An independent, non-commercial stationery studio. Crafted for real human connections, humorous tributes, and inside jokes among friends.
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#727272] tracking-wide pt-1">
                  <span>Last Updated: October 2026</span>
                  <span>•</span>
                  <span>Version 1.1 Studio Release</span>
                </div>
              </div>

              {/* Apple macOS Style Window Frame */}
              <div className="w-full rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left">
                
                {/* macOS Stoplights Header Bar */}
                <div className="h-[48px] px-5 flex items-center justify-between bg-[#1A1A1A] border-b border-white/[0.08] select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
                  </div>

                  <span className="text-[#999999] font-medium text-[12px] sm:text-[12.5px] leading-[16px] tracking-tight font-mono">
                    terms_of_use.md
                  </span>

                  <div className="w-12" aria-hidden="true" />
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-9 flex flex-col gap-8 text-[#E5E5EA] text-[14px] sm:text-[14.5px] leading-[23px]">
                  
                  {/* Section 1 */}
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#86B75A] font-semibold px-2 py-0.5 rounded bg-[#86B75A]/10 border border-[#86B75A]/20">
                        SECTION 01
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        Non-Commercial Portfolio & Fan Project Disclaimer
                      </h2>
                    </div>
                    <p className="text-[#A3A3A3]">
                      Bloom Card (&ldquo;Bloom&rdquo;) is a free, non-commercial personal portfolio and educational creative engineering demonstration project designed and developed independently by <strong className="text-white font-medium">Tejas Pawar</strong>.
                    </p>
                    <p className="text-[#A3A3A3]">
                      It is not a commercial enterprise, business, or subscription service. No fees, recurring subscriptions, paid feature gating, or in-app purchases are offered on this platform.
                    </p>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 2 */}
                  <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#CFC531] font-semibold px-2 py-0.5 rounded bg-[#CFC531]/10 border border-[#CFC531]/20">
                        SECTION 02
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        Intellectual Property & Transformative Fair Use Parody
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      Bloom Card combines original engineering with transformative visual culture homages:
                    </p>

                    <div className="grid grid-cols-1 gap-3.5 pt-1">
                      {/* Original UI */}
                      <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-medium text-[14px]">
                          <Sparkle size={16} className="text-[#86B75A]" />
                          <span>Original Interface & Code Architecture</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          The Bloom studio workspace, 3D metallic foil shaders, tactile paper grain synthesis, and interactive envelope reveal sequences are proprietary original creative works (© 2026 Tejas Pawar).
                        </p>
                      </div>

                      {/* Pokemon Parody */}
                      <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-medium text-[14px]">
                          <span className="text-[13px] font-bold text-[#CFC531]">⚡</span>
                          <span>Pokémon TCG Parody Templates</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          Pokémon, Pokémon character names (including Psyduck), HP counters, and trading card border layouts are registered trademarks and copyrights of <strong className="text-[#CCCCCC] font-normal">Nintendo, Creatures Inc., and GAME FREAK</strong>. Bloom Card is an unofficial fan parody creator intended solely for transformative, non-commercial creative tribute and playful greetings. Bloom Card is in no way affiliated with, authorized, endorsed, or sponsored by Nintendo or The Pokémon Company.
                        </p>
                      </div>

                      {/* Music Stickers */}
                      <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-medium text-[14px]">
                          <span className="text-[13px] font-bold text-[#7CE0DC]">💿</span>
                          <span>Music & Cultural Vinyl Stickers</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          Album artwork and cultural sticker homages (such as Tyler, the Creator’s <em>IGOR</em> and <em>CALL ME IF YOU GET LOST</em>, and Frank Ocean’s <em>Blonde</em>) are the intellectual property of their respective recording artists, photographers, and record labels. They are included strictly as transformative, non-commercial cultural homage.
                        </p>
                      </div>

                      {/* Microsoft Fluent UI Emojis MIT Notice */}
                      <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-medium text-[14px]">
                          <span className="text-[13px] font-bold text-white">🪪</span>
                          <span>Microsoft 3D Fluent UI Emojis (MIT License)</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          3D emoji assets in the studio are sourced from Microsoft's open-source Fluent UI Emoji library under the MIT License:
                        </p>
                        <div className="p-2.5 rounded-[10px] bg-black/60 border border-white/[0.06] font-mono text-[11.5px] text-[#A3A3A3] leading-[18px]">
                          Copyright (c) Microsoft Corporation. Sourced from <code className="text-white">microsoft/fluentui-emoji</code> under the MIT License.
                        </div>
                      </div>

                      {/* Botanical archives */}
                      <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-medium text-[14px]">
                          <span className="text-[13px] font-bold text-[#86B75A]">🌿</span>
                          <span>Botanical & Vintage Postage Art</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          Vintage botanical illustrations, flower engravings, and postal stamp frames are sourced from open public domain archives or custom digital hand-drawn assets.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 3 */}
                  <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#7CE0DC] font-semibold px-2 py-0.5 rounded bg-[#7CE0DC]/10 border border-[#7CE0DC]/20">
                        SECTION 03
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        DMCA & Prompt Copyright Takedown Procedure
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      We respect the intellectual property rights of artists, publishers, and creators. If you are a copyright or trademark owner (or authorized representative) and believe any parody asset or cultural reference on Bloom Card infringes upon your rights, please notify us immediately.
                    </p>

                    <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium text-[13.5px]">Direct Creator Takedown Inbox</span>
                        <span className="text-[#999999] text-[12.5px]">Requests are addressed within 48 hours without friction.</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black font-semibold text-[12px] hover:bg-neutral-200 transition-colors cursor-pointer active:scale-95 shadow-sm"
                        >
                          <Copy size={13} />
                          <span>Copy Email</span>
                        </button>
                        <a
                          href="https://www.instagram.com/teja_vu._.archive?obrf=OGI4N3BkNGlyMnIz&utm_source=qr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-[12px] transition-colors border border-white/[0.10]"
                        >
                          <InstagramLogo size={13} />
                          <span>Instagram</span>
                        </a>
                      </div>
                    </div>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 4 */}
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#FFBD2E] font-semibold px-2 py-0.5 rounded bg-[#FFBD2E]/10 border border-[#FFBD2E]/20">
                        SECTION 04
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        User-Generated Content & Acceptable Conduct
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      You retain 100% ownership of your personal messages, custom stats, and uploaded photos. By using Bloom Card, you agree to treat others with basic human dignity:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3.5 rounded-[14px] bg-[#86B75A]/[0.06] border border-[#86B75A]/20 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[#86B75A] font-medium text-[13px]">
                          <CheckCircle size={15} />
                          <span>Warmly Encouraged</span>
                        </div>
                        <p className="text-[#CCCCCC] text-[12.5px] leading-[19px]">
                          Heartfelt notes, genuine compliments, celebration cards, inside jokes, and friendly, consensual teasing between friends.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-[14px] bg-[#FF5F56]/[0.06] border border-[#FF5F56]/20 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[#FF5F56] font-medium text-[13px]">
                          <WarningCircle size={15} />
                          <span>Strictly Prohibited</span>
                        </div>
                        <p className="text-[#CCCCCC] text-[12.5px] leading-[19px]">
                          Non-consensual intimate imagery, hate speech, severe harassment, malicious defamation, extortion, or illegal content.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 5 */}
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#999999] font-semibold px-2 py-0.5 rounded bg-white/[0.08] border border-white/[0.12]">
                        SECTION 05
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        Disclaimer of Warranties (&ldquo;As-Is&rdquo;)
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      Bloom Card is provided on an <strong className="text-white font-medium">&ldquo;AS IS&rdquo;</strong> and <strong className="text-white font-medium">&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind.
                    </p>
                    <p className="text-[#A3A3A3]">
                      Because cards are stored either client-side in browser state or in lightweight shared link stores, we do not guarantee permanent archival storage of generated cards. We recommend that users take screenshots or screen recordings of cherished cards to preserve them indefinitely.
                    </p>
                  </section>

                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center"
            >
              {/* Header Hero Area */}
              <div className="flex flex-col items-center text-center gap-3.5 mb-10 max-w-[620px]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E0E0E] border border-white/[0.10]">
                  <LockKey size={13} className="text-[#7CE0DC]" />
                  <span className="text-[11px] leading-[13px] font-normal tracking-[0.08em] uppercase text-[#7CE0DC]">
                    Zero-Database Privacy Architecture
                  </span>
                </div>

                <h1 className="text-white font-normal text-[36px] sm:text-[44px] md:text-[48px] leading-[1.12] sm:leading-[52px] tracking-[-0.035em]">
                  Your private notes stay{' '}
                  <span 
                    className="italic font-thin text-white"
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontWeight: 100,
                      fontStyle: 'italic',
                      fontSynthesis: 'none',
                    }}
                  >
                    strictly private.
                  </span>
                </h1>

                <p className="text-[#999999] font-normal text-[14.5px] sm:text-[15.5px] leading-[23px] tracking-[-0.015em]">
                  No accounts, no email logins, and zero database harvesting. All card crafting and image processing takes place directly in your browser.
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#727272] tracking-wide pt-1">
                  <span>Last Updated: October 2026</span>
                  <span>•</span>
                  <span>Version 1.1 Studio Release</span>
                </div>
              </div>

              {/* Apple macOS Style Window Frame */}
              <div className="w-full rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left">
                
                {/* macOS Stoplights Header Bar */}
                <div className="h-[48px] px-5 flex items-center justify-between bg-[#1A1A1A] border-b border-white/[0.08] select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
                  </div>

                  <span className="text-[#999999] font-medium text-[12px] sm:text-[12.5px] leading-[16px] tracking-tight font-mono">
                    privacy_policy.md
                  </span>

                  <div className="w-12" aria-hidden="true" />
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-9 flex flex-col gap-8 text-[#E5E5EA] text-[14px] sm:text-[14.5px] leading-[23px]">
                  
                  {/* Section 1 */}
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#86B75A] font-semibold px-2 py-0.5 rounded bg-[#86B75A]/10 border border-[#86B75A]/20">
                        SECTION 01
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        Overview: Zero-Database Philosophy
                      </h2>
                    </div>
                    <p className="text-[#A3A3A3]">
                      Bloom Card (&ldquo;Bloom&rdquo;) is built upon an uncompromising <strong className="text-white font-medium">zero-database, client-side first</strong> architecture. We believe your personal messages, confessions, and inside jokes belong strictly between you and the person receiving your card.
                    </p>
                    <p className="text-[#A3A3A3]">
                      We do not require account registration, we do not request your phone number, and we do not maintain a marketing database to read, harvest, or monetize your personal correspondence.
                    </p>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 2 */}
                  <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#7CE0DC] font-semibold px-2 py-0.5 rounded bg-[#7CE0DC]/10 border border-[#7CE0DC]/20">
                        SECTION 02
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        Local Memory & Custom Photo Handling
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 pt-1">
                      <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-medium text-[14px]">
                          <HardDrives size={16} className="text-[#7CE0DC]" />
                          <span>In-Browser Memory Processing</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          All messages, trainer stats, flower choices, and sticker coordinates are stored and manipulated entirely in your device's browser memory (React state).
                        </p>
                      </div>

                      <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-medium text-[14px]">
                          <ShieldCheck size={16} className="text-[#86B75A]" />
                          <span>Local Photo Downscaling & Canvas Processing</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          When you upload a custom photo for the back of your card or Polaroid frame, the image is processed directly on your device via HTML5 Canvas. Your raw high-resolution camera roll files are never transmitted to any centralized cloud warehouse or analyzed by machine vision models.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 3 */}
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#CFC531] font-semibold px-2 py-0.5 rounded bg-[#CFC531]/10 border border-[#CFC531]/20">
                        SECTION 03
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        Shared Card Links & Recipient Mode
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      When you generate a shareable link for your card to send to a friend:
                    </p>

                    <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white font-medium text-[13.5px]">
                        <ShareNetwork size={16} className="text-[#CFC531]" />
                        <span>Cryptographically Unguessable Short Links</span>
                      </div>
                      <p className="text-[#999999] text-[13px] leading-[20px]">
                        Your card configuration (theme, message text, sticker coordinates, and compressed image thumbnail) is serialized into an anonymized cloud record in Supabase with a high-entropy, random identifier.
                      </p>
                      <p className="text-[#999999] text-[13px] leading-[20px]">
                        Anyone in possession of that exact URL can open and view the card in recipient reveal mode. Shared card links are unindexed, unlisted, and private to whoever holds the link. Please share your generated links responsibly.
                      </p>
                    </div>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 4 */}
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#999999] font-semibold px-2 py-0.5 rounded bg-white/[0.08] border border-white/[0.12]">
                        SECTION 04
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        Browser Storage & Anonymized Telemetry
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      Bloom utilizes standard browser capabilities to protect your work and ensure performance:
                    </p>

                    <ul className="list-disc list-inside space-y-1.5 text-[#A3A3A3] text-[13.5px] pl-1">
                      <li>
                        <strong className="text-white font-medium">Local Storage Drafts:</strong> Bloom preserves your active card design draft in your browser's native <code className="text-[#86B75A] font-mono text-[12px]">localStorage</code> so you don't lose progress if you accidentally refresh or switch tabs. This draft stays solely on your computer or phone.
                      </li>
                      <li>
                        <strong className="text-white font-medium">Hosting Performance Metrics:</strong> Our hosting provider (Vercel) records aggregate, non-personally identifiable telemetry (e.g. page response time, viewport category, WebGL FPS rates) strictly to ensure the 3D shaders render at 60fps. No card text or personal identifiers are ever attached to these logs.
                      </li>
                    </ul>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 5 */}
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#86B75A] font-semibold px-2 py-0.5 rounded bg-[#86B75A]/10 border border-[#86B75A]/20">
                        SECTION 05
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        In-App Feedback & Creator Communications
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      When you submit feedback using the in-app Feedback dialog, your message, rating, and optional contact email are stored securely in our feedback database and dispatched directly to the creator's inbox via Resend serverless email functions.
                    </p>
                    <p className="text-[#A3A3A3]">
                      We use your feedback solely to debug issues, fix visual glitches, and improve Bloom. Your email will never be sold, rented, or enrolled in promotional newsletters.
                    </p>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 6 */}
                  <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#7CE0DC] font-semibold px-2 py-0.5 rounded bg-[#7CE0DC]/10 border border-[#7CE0DC]/20">
                        SECTION 06
                      </span>
                      <h2 className="text-white font-semibold text-[17px] sm:text-[18px] tracking-tight">
                        Contact & Privacy Inquiries
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      If you have questions regarding data privacy, wish to request the deletion of a shared card record, or have questions about how Bloom works, please reach out to the creator directly:
                    </p>

                    <div className="p-4 rounded-[16px] bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium text-[13.5px]">Tejas Pawar — Independent Creator</span>
                        <span className="text-[#999999] text-[12.5px]">Open to inquiries, bug reports, and privacy questions.</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black font-semibold text-[12px] hover:bg-neutral-200 transition-colors cursor-pointer active:scale-95 shadow-sm"
                        >
                          <Copy size={13} />
                          <span>Copy Email</span>
                        </button>
                        <a
                          href="https://www.instagram.com/teja_vu._.archive?obrf=OGI4N3BkNGlyMnIz&utm_source=qr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-[12px] transition-colors border border-white/[0.10]"
                        >
                          <InstagramLogo size={13} />
                          <span>Instagram</span>
                        </a>
                      </div>
                    </div>
                  </section>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Global Footer (Already includes Feedback, Terms, Privacy, Instagram, Email, Coffee) */}
      <Footer 
        onFeedback={onFeedback} 
        onTerms={onTerms} 
        onPrivacy={onPrivacy} 
      />
    </div>
  );
}
