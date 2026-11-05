import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useCard } from '@/context/CardContext';
import { EMOTE_EMOJIS } from '@/data/cardData';
import WindowPanel from '@/components/ui/WindowPanel';
import StampDustParticles from '@/components/ui/StampDustParticles';

export default function StampEmotionPicker({ title = "Stamp an Emotion", className = "", isMobile = false }) {
  const { state, dispatch } = useCard();
  const [activeStampTrigger, setActiveStampTrigger] = useState(null);

  const handleEmoteClick = (emoteId) => {
    setActiveStampTrigger(`emote-${emoteId}-${Date.now()}`);
    dispatch({ type: 'SET_STAMP_EMOJI', payload: emoteId });
    if (state.activeSide !== 'back') {
      dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'back' });
    }
  };

  const renderGrid = (isMobileMode = false) => (
    <div className={clsx("flex flex-col w-full mx-auto", isMobileMode ? "gap-2 max-w-[308px]" : "gap-[5px] xl:gap-[6px] max-w-[328px]")}>
      {/* Row 1 (First 8 Emojis) */}
      <div className="flex flex-row justify-between items-center w-full">
        {EMOTE_EMOJIS.slice(0, 8).map((emote) => {
          const isEmoteActive = activeStampTrigger?.startsWith(`emote-${emote.id}`);
          return (
            <div key={emote.id} className="relative">
              <StampDustParticles triggerKey={isEmoteActive ? activeStampTrigger : null} color="#0088FF" />
              <motion.button
                whileTap={{ scale: 0.88, y: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                type="button"
                role="listitem"
                aria-label={"Mood: " + emote.name}
                onClick={() => handleEmoteClick(emote.id)}
                className={clsx(
                  "flex items-center justify-center rounded-full outline-none cursor-pointer select-none border-0 shadow-none transition-colors duration-150",
                  isMobileMode
                    ? "w-[33px] h-[33px]"
                    : "w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] xl:w-[32px] xl:h-[32px] 2xl:w-[34px] 2xl:h-[34px]",
                  state.stampEmoji === emote.id
                    ? "bg-[#0088FF] shadow-[0_2px_8px_rgba(0,136,255,0.4)]"
                    : "bg-[rgba(114,114,114,0.08)] hover:bg-[rgba(153,153,153,0.15)] active:scale-90"
                )}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <motion.img 
                  src={emote.src} 
                  alt={emote.name} 
                  className={clsx(
                    "object-contain drop-shadow-sm pointer-events-none",
                    isMobileMode ? "w-[19px] h-[19px]" : "w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] xl:w-[18px] xl:h-[18px] 2xl:w-[20px] 2xl:h-[20px]"
                  )}
                  draggable={false}
                  animate={isEmoteActive ? { scale: [1.25, 0.95, 1], rotate: [0, -6, 6, 0] } : {}}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </motion.button>
            </div>
          );
        })}
      </div>
      {/* Row 2 (Next 8 Emojis) */}
      <div className="flex flex-row justify-between items-center w-full">
        {EMOTE_EMOJIS.slice(8, 16).map((emote) => {
          const isEmoteActive = activeStampTrigger?.startsWith(`emote-${emote.id}`);
          return (
            <div key={emote.id} className="relative">
              <StampDustParticles triggerKey={isEmoteActive ? activeStampTrigger : null} color="#0088FF" />
              <motion.button
                whileTap={{ scale: 0.88, y: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                type="button"
                role="listitem"
                aria-label={"Mood: " + emote.name}
                onClick={() => handleEmoteClick(emote.id)}
                className={clsx(
                  "flex items-center justify-center rounded-full outline-none cursor-pointer select-none border-0 shadow-none transition-colors duration-150",
                  isMobileMode
                    ? "w-[33px] h-[33px]"
                    : "w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] xl:w-[32px] xl:h-[32px] 2xl:w-[34px] 2xl:h-[34px]",
                  state.stampEmoji === emote.id
                    ? "bg-[#0088FF] shadow-[0_2px_8px_rgba(0,136,255,0.4)]"
                    : "bg-[rgba(114,114,114,0.08)] hover:bg-[rgba(153,153,153,0.15)] active:scale-90"
                )}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <motion.img 
                  src={emote.src} 
                  alt={emote.name} 
                  className={clsx(
                    "object-contain drop-shadow-sm pointer-events-none",
                    isMobileMode ? "w-[19px] h-[19px]" : "w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] xl:w-[18px] xl:h-[18px] 2xl:w-[20px] 2xl:h-[20px]"
                  )}
                  draggable={false}
                  animate={isEmoteActive ? { scale: [1.25, 0.95, 1], rotate: [0, -6, 6, 0] } : {}}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={clsx("h-fit w-full", className)}>
      <WindowPanel
        title={title}
        bodyClassName={clsx(
          "pb-[15px] xl:pt-[15px] xl:px-[17px] xl:pb-[17px] 2xl:pt-[16px] 2xl:px-[18px] 2xl:pb-[18px]",
          isMobile ? "pt-[12px] px-[12px]" : "pt-[13px] px-[15px]"
        )}
      >
        {renderGrid(isMobile)}
      </WindowPanel>
    </div>
  );
}
