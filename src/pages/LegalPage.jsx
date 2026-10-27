import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  WarningCircle, 
  Sparkle, 
  Copy,
  HardDrives,
  ShareNetwork,
  InstagramLogo
} from '@phosphor-icons/react';
import ScatteredKeepsakes from '@/components/ui/ScatteredKeepsakes';
import Footer from '@/components/Footer';
import { showToast } from '@/components/ui/AppleToast';
import '@/components/ui/LiquidGlassIconButton.css';

const TABS = [
  { id: 'terms', label: 'Terms of Use', icon: FileText },
  { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck }
];

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
      <main className="w-full max-w-[760px] px-5 sm:px-8 pt-8 sm:pt-12 pb-24 sm:pb-28 flex flex-col items-center relative z-10">

        {/* Top Control Bar: Back Button (Feedback pill UI) + Segmented Tab (Form UI) */}
        <div className="w-full flex items-center justify-between gap-4 mb-6 sm:mb-8">
          
          {/* Back to Studio Button matching Feedback button UI */}
          <button
            type="button"
            onClick={onStartCrafting}
            className="dark-liquid-glass-pill h-[42px] px-5 text-[14px] font-medium text-white font-sans cursor-pointer active:scale-95 transition-transform flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Studio</span>
          </button>

          {/* Segmented Control matching Feedback Category Tab from FeedbackModal */}
          <div 
            role="tablist"
            aria-label="Legal Document Selection" 
            className="flex items-center p-1 bg-[#161616] border border-white/[0.08] rounded-full relative"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  type="button"
                  role="tab"
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  onClick={() => handleSwitchTab(tab.id)}
                  className="relative z-10 flex items-center justify-center gap-1.5 h-[34px] px-4 sm:px-5 rounded-full text-[13px] font-medium transition-colors cursor-pointer outline-none select-none"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeLegalTab"
                      className="absolute inset-0 rounded-full bg-[#242424] -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 38,
                        mass: 0.8
                      }}
                    />
                  )}
                  <Icon 
                    size={15} 
                    weight={isActive ? 'duotone' : 'regular'} 
                    className={`transition-colors ${isActive ? 'text-[#FFFFFF]' : 'text-[#999999]'}`} 
                  />
                  <span className={`transition-colors ${isActive ? 'text-[#FFFFFF] font-medium' : 'text-[#999999] hover:text-[#FFFFFF]'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Container */}
        <AnimatePresence mode="wait">
          {currentTab === 'terms' ? (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Apple macOS Style Window Frame */}
              <div className="w-full rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left">
                
                {/* macOS Stoplights Header Bar with Clean Title */}
                <div className="h-[48px] px-5 flex items-center justify-between bg-[#1A1A1A] border-b border-white/[0.08] select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
                  </div>

                  <span className="text-[#999999] font-medium text-[13px] leading-[16px] tracking-tight">
                    Terms of Use
                  </span>

                  <div className="w-12" aria-hidden="true" />
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-9 flex flex-col gap-7 text-[#E5E5EA] text-[14px] sm:text-[14.5px] leading-[23px]">
                  
                  {/* Clean Timestamp */}
                  <div className="text-[12px] text-[#727272] tracking-wide -mb-2">
                    Last Updated: October 2026
                  </div>

                  {/* Section 1 */}
                  <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#86B75A] font-semibold px-2 py-0.5 rounded bg-[#86B75A]/10 border border-[#86B75A]/20">
                        SECTION 01
                      </span>
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Non-Commercial Portfolio & Fan Project Disclaimer
                      </h2>
                    </div>
                    <p className="text-[#A3A3A3]">
                      Bloom Card (&ldquo;Bloom&rdquo;) is a free, non-commercial personal portfolio and educational creative engineering demonstration project created by <strong className="text-white font-medium">Tejas Pawar</strong>.
                    </p>
                    <p className="text-[#A3A3A3]">
                      It is not a commercial product or business, and no fees, subscriptions, or monetized services are offered on this platform.
                    </p>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 2 */}
                  <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#CFC531] font-semibold px-2 py-0.5 rounded bg-[#CFC531]/10 border border-[#CFC531]/20">
                        SECTION 02
                      </span>
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Intellectual Property & Fair Use Parody Notice
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-0.5">
                      {/* Original UI */}
                      <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white font-medium text-[13.5px]">
                          <Sparkle size={15} className="text-[#86B75A]" />
                          <span>Original UI & Code Architecture</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          The Bloom studio interface, custom 3D metallic frames, layout architecture, and interactive reveal mechanics are original creative works.
                        </p>
                      </div>

                      {/* Pokemon Parody */}
                      <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white font-medium text-[13.5px]">
                          <span className="text-[12px] font-bold text-[#CFC531]">⚡</span>
                          <span>Pokémon TCG Parody Templates</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          Pokémon, character names (e.g., Psyduck), and trading card framing are trademarks of Nintendo, Creatures Inc., and GAME FREAK. Bloom Card is an unofficial parody creator and is in no way affiliated with, endorsed, or sponsored by Nintendo or The Pokémon Company.
                        </p>
                      </div>

                      {/* Music Stickers */}
                      <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white font-medium text-[13.5px]">
                          <span className="text-[12px] font-bold text-[#7CE0DC]">💿</span>
                          <span>Music & Cultural Stickers</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          Album art references and cultural stickers (e.g., <em>IGOR</em>, <em>Blond</em>, <em>CMIYGL</em>) are property of their respective recording artists and labels, included strictly as non-commercial homage.
                        </p>
                      </div>

                      {/* Microsoft Fluent UI Emojis MIT Notice */}
                      <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-medium text-[13.5px]">
                          <span className="text-[12px] font-bold text-white">🪪</span>
                          <span>3D Emojis & Botanical Art</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          3D emoji assets are sourced from Microsoft's open-source Fluent UI Emoji library (MIT License). Botanical illustrations are sourced from public domain archives or custom-rendered assets.
                        </p>
                        <div className="p-2.5 rounded-[8px] bg-black/60 border border-white/[0.06] font-mono text-[11px] text-[#A3A3A3] leading-[16px]">
                          Copyright (c) Microsoft Corporation. Sourced under the MIT License.
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 3 */}
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#7CE0DC] font-semibold px-2 py-0.5 rounded bg-[#7CE0DC]/10 border border-[#7CE0DC]/20">
                        SECTION 03
                      </span>
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Takedown Requests
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      If you are a copyright or trademark holder and would like a specific reference asset removed, please contact us directly and it will be taken down promptly:
                    </p>

                    <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium text-[13px]">Creator Contact Inbox</span>
                        <span className="text-[#999999] text-[12px]">Direct takedown email: pawartejas517@gmail.com</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="dark-liquid-glass-pill h-[36px] px-3.5 text-[12.5px] font-medium text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                        >
                          <Copy size={13} />
                          <span>Copy Email</span>
                        </button>
                        <a
                          href="https://www.instagram.com/teja_vu._.archive?obrf=OGI4N3BkNGlyMnIz&utm_source=qr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dark-liquid-glass-pill h-[36px] px-3.5 text-[12.5px] font-medium text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                        >
                          <InstagramLogo size={13} />
                          <span>Instagram</span>
                        </a>
                      </div>
                    </div>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 4 */}
                  <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#FFBD2E] font-semibold px-2 py-0.5 rounded bg-[#FFBD2E]/10 border border-[#FFBD2E]/20">
                        SECTION 04
                      </span>
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        User-Generated Content & Conduct
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      You retain 100% ownership of the personal photos and custom text you input into Bloom Card. However, by using this studio, you agree <strong className="text-white font-medium">not</strong> to use Bloom Card to generate or distribute:
                    </p>

                    <ul className="list-disc list-inside space-y-1 text-[#CCCCCC] text-[13px] pl-1">
                      <li>Unlawful, defamatory, or non-consensual intimate imagery.</li>
                      <li>Severe harassment, hate speech, threats, or malicious content.</li>
                      <li>Content that infringes upon the privacy or legal rights of another individual.</li>
                    </ul>

                    <p className="text-[#86B75A] text-[12.5px] italic pt-0.5">
                      (Friendly roasting and consensual banter between friends are welcome; genuine abuse is strictly prohibited.)
                    </p>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 5 */}
                  <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#999999] font-semibold px-2 py-0.5 rounded bg-white/[0.08] border border-white/[0.12]">
                        SECTION 05
                      </span>
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Disclaimer of Warranties (&ldquo;As-Is&rdquo;)
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      Bloom Card is provided on an <strong className="text-white font-medium">&ldquo;AS IS&rdquo;</strong> and <strong className="text-white font-medium">&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind. Because card data is stored locally or inside shareable URLs, we do not guarantee permanent archiving of shared links or uninterrupted availability of the web application.
                    </p>
                  </section>

                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Apple macOS Style Window Frame */}
              <div className="w-full rounded-[24px] bg-[#0E0E0E] border border-white/[0.10] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left">
                
                {/* macOS Stoplights Header Bar with Clean Title */}
                <div className="h-[48px] px-5 flex items-center justify-between bg-[#1A1A1A] border-b border-white/[0.08] select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
                  </div>

                  <span className="text-[#999999] font-medium text-[13px] leading-[16px] tracking-tight">
                    Privacy Policy
                  </span>

                  <div className="w-12" aria-hidden="true" />
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-9 flex flex-col gap-7 text-[#E5E5EA] text-[14px] sm:text-[14.5px] leading-[23px]">
                  
                  {/* Clean Timestamp */}
                  <div className="text-[12px] text-[#727272] tracking-wide -mb-2">
                    Last Updated: October 2026
                  </div>

                  {/* Section 1 */}
                  <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#86B75A] font-semibold px-2 py-0.5 rounded bg-[#86B75A]/10 border border-[#86B75A]/20">
                        SECTION 01
                      </span>
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Overview (Zero-Database Architecture)
                      </h2>
                    </div>
                    <p className="text-[#A3A3A3]">
                      Bloom Card (&ldquo;Bloom&rdquo;) is an interactive digital greeting card studio built as an independent design and creative engineering project. We believe your personal messages and inside jokes belong strictly between you and the person receiving your card.
                    </p>
                    <p className="text-[#A3A3A3]">
                      Bloom operates entirely client-side within your web browser and does not maintain a backend database to collect, read, or harvest your personal content.
                    </p>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 2 */}
                  <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#7CE0DC] font-semibold px-2 py-0.5 rounded bg-[#7CE0DC]/10 border border-[#7CE0DC]/20">
                        SECTION 02
                      </span>
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Local Processing & Custom Image Uploads
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-0.5">
                      <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white font-medium text-[13.5px]">
                          <HardDrives size={15} className="text-[#7CE0DC]" />
                          <span>Text & Customization</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          All messages, trainer stats, flower selections, and sticker placements are processed locally in your browser's memory.
                        </p>
                      </div>

                      <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white font-medium text-[13.5px]">
                          <ShieldCheck size={15} className="text-[#86B75A]" />
                          <span>Uploaded Photos</span>
                        </div>
                        <p className="text-[#999999] text-[13px] leading-[20px]">
                          When you upload a custom photo for the back of a card, the image file is processed directly inside your device's browser (via local Data URLs / Canvas). Your personal photos are never uploaded to or stored permanently on our servers.
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
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Shared Card Links (&ldquo;/view&rdquo; Route)
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      When you confirm and generate a shareable link for your card, your card's configuration and text are encoded directly into the URL parameters (such as Base64 URL state) or a private shared record:
                    </p>

                    <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-white font-medium text-[13.5px]">
                        <ShareNetwork size={15} className="text-[#CFC531]" />
                        <span>Private & Unguessable Direct Links</span>
                      </div>
                      <p className="text-[#999999] text-[13px] leading-[20px]">
                        Anyone who has access to that unique link can view the card and its contents. Because the card data lives inside the link itself or an unlisted record rather than a central database, deleting the link removes access. Please share your generated links responsibly.
                      </p>
                    </div>
                  </section>

                  <div className="w-full h-[1px] bg-white/[0.08]" aria-hidden="true" />

                  {/* Section 4 */}
                  <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#999999] font-semibold px-2 py-0.5 rounded bg-white/[0.08] border border-white/[0.12]">
                        SECTION 04
                      </span>
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Analytics & Local Storage
                      </h2>
                    </div>

                    <ul className="list-disc list-inside space-y-1.5 text-[#A3A3A3] text-[13px] pl-1">
                      <li>
                        <strong className="text-white font-medium">Browser Storage:</strong> Bloom may use your browser's native <code className="text-[#86B75A] font-mono text-[11.5px]">localStorage</code> or <code className="text-[#86B75A] font-mono text-[11.5px]">sessionStorage</code> strictly to preserve your active card draft while you design so you do not lose progress on page refresh.
                      </li>
                      <li>
                        <strong className="text-white font-medium">Anonymized Performance Data:</strong> Our hosting provider (e.g., Vercel) may collect basic, anonymized telemetry (such as page load speed, viewport category, and aggregate visit counts) to ensure the 3D shaders and animations run smoothly. No personally identifiable information (PII) or card text is ever attached to these metrics.
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
                      <h2 className="text-white font-semibold text-[17px] tracking-tight">
                        Contact & Inquiries
                      </h2>
                    </div>

                    <p className="text-[#A3A3A3]">
                      If you have any questions regarding privacy, data handling, or this project, please reach out via Instagram at <strong className="text-white font-medium">@teja_vu._.archive</strong> or contact the creator directly:
                    </p>

                    <div className="p-4 rounded-[14px] bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium text-[13px]">Creator Contact Inbox</span>
                        <span className="text-[#999999] text-[12px]">Direct email: pawartejas517@gmail.com</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="dark-liquid-glass-pill h-[36px] px-3.5 text-[12.5px] font-medium text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                        >
                          <Copy size={13} />
                          <span>Copy Email</span>
                        </button>
                        <a
                          href="https://www.instagram.com/teja_vu._.archive?obrf=OGI4N3BkNGlyMnIz&utm_source=qr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dark-liquid-glass-pill h-[36px] px-3.5 text-[12.5px] font-medium text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
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

      {/* Global Footer (includes Feedback, Terms, Privacy, Instagram, Email, Coffee) */}
      <Footer 
        onFeedback={onFeedback} 
        onTerms={onTerms} 
        onPrivacy={onPrivacy} 
      />
    </div>
  );
}
