import React from 'react';
import clsx from 'clsx';

// We soften the harsh Figma alphas for the glass effect to match the actual visual rendering
const GLASS_SHADOW = "0px 8px 15px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px 0.5px rgba(166, 166, 166, 0.25), inset 0px 40px 30px -40px rgba(230, 230, 230, 0.06), inset 0px -40px 10px -40px rgba(26, 26, 26, 0.8)";

function NavTab({ children, isActive, onClick }) {
  return (
    <div className="relative flex items-center justify-center w-[82px] h-[42px] xl:w-[88px] xl:h-[46px] 2xl:w-[96px] 2xl:h-[52px]">
      {/* The Glowing Gradient Background */}
      <div className="absolute inset-0 z-0 rounded-[500px] blur-[12px] shadow-[0px_24px_24px_6px_rgba(40,40,40,0.2)] pointer-events-none figma-aura-gradient opacity-60"></div>
      
      {/* The Glass Button */}
      <button
        type="button"
        onClick={onClick}
        className="relative z-10 w-[64px] h-[34px] xl:w-[70px] xl:h-[38px] 2xl:w-[76px] 2xl:h-[42px] rounded-[1000px] flex items-center justify-center cursor-pointer select-none transition-all outline-none active:scale-95"
        style={{
          background: "rgba(14, 14, 14, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: GLASS_SHADOW
        }}
      >
        <span 
          className={clsx(
            "font-sans font-medium text-[12.5px] xl:text-[13.5px] 2xl:text-[14px] leading-[18px] tracking-[-0.01em] transition-colors",
            // #A3A3A3 gives a safe ~7:1 contrast ratio against the dark background to comfortably pass WCAG 4.5:1
            isActive ? "text-[#FFFFFF]" : "text-[#A3A3A3]"
          )}
        >
          {children}
        </span>
      </button>
    </div>
  );
}

function BloomTab({ children, onClick }) {
  return (
    <div className="relative flex items-center justify-center w-[118px] h-[46px] xl:w-[130px] xl:h-[54px] 2xl:w-[144px] 2xl:h-[60px]">
      {/* The Glowing Gradient Background */}
      <div className="absolute inset-0 z-0 rounded-[500px] blur-[12px] shadow-[0px_24px_24px_6px_rgba(40,40,40,0.2)] pointer-events-none figma-aura-gradient opacity-60"></div>
      
      {/* The Glass Button */}
      <button
        type="button"
        onClick={onClick}
        className="relative z-10 w-[98px] h-[38px] xl:w-[110px] xl:h-[44px] 2xl:w-[120px] 2xl:h-[48px] rounded-[1000px] flex flex-row items-center justify-center cursor-pointer select-none outline-none active:scale-95"
        style={{
          background: "rgba(14, 14, 14, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: GLASS_SHADOW
        }}
      >
        {children}
      </button>
    </div>
  );
}

export default function Navbar({ activeTab = 'design', onTabChange }) {
  return (
    <header role="banner" className="relative w-full pt-[2px] flex items-center justify-center z-30 select-none overflow-visible">
      
      <nav role="tablist" aria-label="Navigation Tabs" className="relative flex flex-row items-center justify-center gap-[10px] w-full">
        
        {/* Menu Divider Line (exactly the width of the layout) */}
        <div className="absolute top-1/2 left-0 w-full h-[4px] -translate-y-1/2 z-0">
          <div className="w-full h-full rounded-[24px] blur-[12px] shadow-[0px_24px_24px_6px_rgba(40,40,40,0.2)] pointer-events-none figma-aura-gradient opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-row items-center gap-[10px]">
          <NavTab isActive={activeTab === 'about'} onClick={() => onTabChange('about')}>
            About
          </NavTab>

          <BloomTab onClick={() => onTabChange('design')}>
            <div className="flex flex-row items-baseline gap-[2px]">
               <span className="font-serif italic text-[20px] xl:text-[21px] 2xl:text-[23px] tracking-[-0.05em] text-white leading-none">
                 Bloom
               </span>
               <span className="font-sans text-[11.5px] xl:text-[12px] 2xl:text-[13px] tracking-[-0.05em] text-white leading-none">
                 Ver. 1.1
               </span>
            </div>
          </BloomTab>

          <NavTab isActive={activeTab === 'design'} onClick={() => onTabChange('design')}>
            Design
          </NavTab>
        </div>
      </nav>

    </header>
  );
}
