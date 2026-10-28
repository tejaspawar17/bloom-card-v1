import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import CardViewer from '@/components/cards/CardViewer';
import MobileCustomizeSheet from '@/components/MobileCustomizeSheet';
import TitleModal from '@/components/TitleModal';
import MessageModal from '@/components/MessageModal';
import ShareModal from '@/components/ShareModal';
import CardRevealPreview from '@/components/cards/CardRevealPreview';
import FeedbackModal from '@/components/FeedbackModal';
import Footer from '@/components/Footer';

// Atmospheric page transition: pure optical opacity + blur dissolve (matching About ↔ Design)
const pageVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      opacity: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
      filter: { duration: 0.54, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(8px)',
    transition: {
      opacity: { duration: 0.22, ease: [0.36, 0, 0.66, 0] },
      filter: { duration: 0.22, ease: [0.36, 0, 0.66, 0] },
    },
  },
};

export default function DesignPage({ isRecipientMode = false, onSetRecipientMode, onNavigateTab }) {
  const [modal, setModal] = useState(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [leftHeight, setLeftHeight] = useState('auto');
  const observerRef = useRef(null);

  const leftPanelCallback = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (node) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
          if (height > 0) {
            setLeftHeight((prev) => {
              const next = height + 'px';
              return prev === next ? prev : next;
            });
          }
        }
      });
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleCraftOwn = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('preview');
    url.searchParams.delete('card');
    const cleanHash = url.hash === '#preview' ? '' : url.hash;
    window.history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + cleanHash);
    onSetRecipientMode?.(false);
  };

  return (
    <div className="flex flex-col flex-1">
      <AnimatePresence mode="wait" initial={false}>
        {isRecipientMode ? (
          <motion.div
            key="recipient-view"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex-1 flex flex-col"
          >
            <CardRevealPreview onCraftOwn={handleCraftOwn} />
          </motion.div>
        ) : (
          <motion.div
            key="studio-view"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex-1 flex flex-col"
          >
            {/* Main 3-Column Studio matching reference screen — centered vertically below Navbar */}
            <div className="w-full min-h-[calc(100dvh-60px)] xl:min-h-[calc(100dvh-74px)] flex flex-col justify-center pt-3 pb-1 xl:pt-4 xl:pb-2">
              <main 
                className="w-full max-w-[1440px] mx-auto px-3 xl:px-8 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-start justify-center gap-3 xl:gap-8 z-10 translate-y-[2px] xl:translate-y-[4px]"
              >
                {/* Left Window (Occasion & Pokemon Selection) - Desktop Only */}
                <div ref={leftPanelCallback} className="hidden lg:block"><LeftPanel /></div>

                {/* Center Canvas (Switchers, Card, Actions, Confirm Button) */}
                <motion.div 
                  animate={{
                    scale: isCustomizeOpen ? 0.96 : 1,
                    y: isCustomizeOpen ? -8 : 0,
                    opacity: isCustomizeOpen ? 0.88 : 1,
                  }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="flex flex-col items-center justify-center max-h-full"
                >
                  <CardViewer 
                    onOpenEditTitle={() => setModal('title')}
                    onOpenEditMessage={() => setModal('message')}
                    onConfirm={() => setModal('share')}
                    onOpenCustomize={() => setIsCustomizeOpen(true)}
                  />
                </motion.div>

                {/* Right Window (Back Image, Emote Emojis, Stickers) - Desktop Only */}
                <div className="hidden lg:block"><RightPanel /></div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet Customization Bottom Sheet */}
      <MobileCustomizeSheet 
        isOpen={isCustomizeOpen} 
        onClose={() => setIsCustomizeOpen(false)} 
      />

      {/* Footer matching reference */}
      <div className={isRecipientMode ? "mt-8 pb-12 w-full z-10 relative" : "mt-8 xl:mt-24 pt-8 xl:pt-16 pb-12 w-full z-10 relative"}>
        <Footer 
          onFeedback={() => setModal('feedback')} 
          onTerms={() => onNavigateTab?.('terms')}
          onPrivacy={() => onNavigateTab?.('privacy')} 
        />
      </div>

      {/* Modals */}
      {modal === 'title' && (
        <TitleModal onClose={() => setModal(null)} />
      )}

      {modal === 'message' && (
        <MessageModal onClose={() => setModal(null)} />
      )}

      {modal === 'share' && (
        <ShareModal 
          onClose={() => setModal(null)} 
          onOpenRecipientPreview={() => {
            setModal(null);
            onSetRecipientMode?.(true);
          }} 
        />
      )}

      {modal === 'feedback' && (
        <FeedbackModal onClose={() => setModal(null)} />
      )}
    </div>
  );
}
