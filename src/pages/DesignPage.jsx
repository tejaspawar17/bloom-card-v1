import React, { useState, useRef, useEffect, useCallback } from 'react';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import CardViewer from '@/components/cards/CardViewer';
import TitleModal from '@/components/TitleModal';
import MessageModal from '@/components/MessageModal';
import ShareModal from '@/components/ShareModal';
import CardRevealPreview from '@/components/cards/CardRevealPreview';
import FeedbackModal from '@/components/FeedbackModal';
import Footer from '@/components/Footer';
import { WindowModal, LiquidGlassButton } from '@/components/ui';

export default function DesignPage({ isRecipientMode = false, onSetRecipientMode }) {
  const [modal, setModal] = useState(null);
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
      {isRecipientMode ? (
        <CardRevealPreview onCraftOwn={handleCraftOwn} />
      ) : (
        /* Main 3-Column Studio matching reference screen — centered vertically below Navbar */
        <div className="w-full min-h-[calc(100dvh-60px)] xl:min-h-[calc(100dvh-74px)] flex flex-col justify-center pt-3 pb-1 xl:pt-4 xl:pb-2">
          <main 
            className="w-full max-w-[1440px] mx-auto px-3 xl:px-8 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-start justify-center gap-3 xl:gap-8 z-10 translate-y-[2px] xl:translate-y-[4px]"
          >
            {/* Left Window (Occasion & Pokemon Selection) */}
            <div ref={leftPanelCallback}><LeftPanel /></div>

            {/* Center Canvas (Switchers, Card, Actions, Confirm Button) */}
            <div className="flex flex-col items-center justify-center max-h-full">
              <CardViewer 
                onOpenEditTitle={() => setModal('title')}
                onOpenEditMessage={() => setModal('message')}
                onConfirm={() => setModal('share')}
              />
            </div>

            {/* Right Window (Back Image, Emote Emojis, Stickers) */}
            <div><RightPanel /></div>
          </main>
        </div>
      )}

      {/* Footer matching reference */}
      <div className={isRecipientMode ? "mt-8 pb-12 w-full z-10 relative" : "mt-8 xl:mt-24 pt-8 xl:pt-16 pb-12 w-full z-10 relative"}>
        <Footer 
          onFeedback={() => setModal('feedback')} 
          onTerms={() => setModal('terms')}
          onPrivacy={() => setModal('privacy')} 
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

      {modal === 'terms' && (
        <WindowModal
          isOpen={true}
          onClose={() => setModal(null)}
          title="Terms of Use"
          footer={
            <LiquidGlassButton variant="primary" size="sm" onClick={() => setModal(null)}>
              Accept & Close
            </LiquidGlassButton>
          }
        >
          <div className="p-4 text-sm text-neutral-300">
            By using Bloom Card, you agree to spread joy and positive emotions.
          </div>
        </WindowModal>
      )}

      {modal === 'privacy' && (
        <WindowModal
          isOpen={true}
          onClose={() => setModal(null)}
          title="Privacy Policy"
          footer={
            <LiquidGlassButton variant="primary" size="sm" onClick={() => setModal(null)}>
              Close
            </LiquidGlassButton>
          }
        >
          <div className="p-4 text-sm text-neutral-300">
            We do not store your personal messages. All card data is local or encoded in the shareable link.
          </div>
        </WindowModal>
      )}

      {modal === 'feedback' && (
        <FeedbackModal onClose={() => setModal(null)} />
      )}
    </div>
  );
}
