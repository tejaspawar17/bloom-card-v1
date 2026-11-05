import AppleToast from '@/components/ui/AppleToast';
import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardProvider, useCard } from './context/CardContext';
import { loadSharedCard, decodeCardStateParam } from './lib/supabase';
import Navbar from './components/Navbar';
import DesignPage from './pages/DesignPage';
import FeedbackModal from './components/FeedbackModal';
import AnimatedAILoaderFX from '@/components/ui/AnimatedAILoaderFX';
import { FLOWERS, POKEMON_CARDS } from './data/cardData';

// Route-level code-splitting: secondary pages loaded asynchronously in background
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));

// Atmospheric page transition: pure optical opacity + blur dissolve
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

// Loader transition: razor-sharp from frame 0 (no entry blur glitch), soft optical dissolve on exit
const loaderVariants = {
  initial: {
    opacity: 1,
    filter: 'blur(0px)',
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    transition: {
      opacity: { duration: 0.32, ease: [0.36, 0, 0.66, 0] },
      filter: { duration: 0.32, ease: [0.36, 0, 0.66, 0] },
    },
  },
};

function AppShell() {
  const { dispatch } = useCard();
  
  // Only show the preloader on first session visit OR when hydrating a shared card link (?card= / ?d=)
  const [isAppLoading, setIsAppLoading] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search.includes('og=1')) {
        return false;
      }
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      if (
        (pathname && /^\/(?:c|s)\/[^/?#]+/.test(pathname)) ||
        (typeof window !== 'undefined' &&
          (window.location.search.includes('card=') || window.location.search.includes('d=')))
      ) {
        return true;
      }
      return sessionStorage.getItem('bloom_has_loaded') !== 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState('design');
  const [isRecipientMode, setIsRecipientMode] = useState(false);
  const [isCreatorPreview, setIsCreatorPreview] = useState(false);
  const [globalModal, setGlobalModal] = useState(null);

  const syncFromUrl = useCallback(async () => {
    const pathname = window.location.pathname || '';
    const pathMatch = pathname.match(/^\/(?:c|s)\/([^/?#]+)/);
    const pathCardId = pathMatch ? pathMatch[1] : null;

    const params = new URLSearchParams(window.location.search);
    const sharedCardId = pathCardId || params.get('card');
    const encodedData = params.get('d');
    const hash = window.location.hash;
    const hasPreview =
      hash === '#preview' ||
      params.get('preview') === 'recipient' ||
      Boolean(sharedCardId) ||
      Boolean(encodedData);

    setIsRecipientMode(hasPreview);
    setIsCreatorPreview(false);

    if (hash === '#terms') {
      setActiveTab('terms');
    } else if (hash === '#privacy') {
      setActiveTab('privacy');
    } else if (hash === '#about') {
      setActiveTab('about');
    } else {
      setActiveTab('design');
    }

    if (encodedData) {
      const decodedState = decodeCardStateParam(encodedData);
      if (decodedState) {
        dispatch({ type: 'HYDRATE_CARD', payload: decodedState });
      }
    }

    if (sharedCardId) {
      try {
        const savedState = await loadSharedCard(sharedCardId);
        if (savedState) {
          dispatch({ type: 'HYDRATE_CARD', payload: savedState });
        }
      } catch (err) {
        console.error('Failed to load shared card from Supabase:', err);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      // If ?og=1 is present, skip wait immediately
      if (typeof window !== 'undefined' && window.location.search.includes('og=1')) {
        await syncFromUrl();
        if (isMounted) setIsAppLoading(false);
        return;
      }

      // If already loaded in this session, immediately sync without artificial wait
      if (sessionStorage.getItem('bloom_has_loaded') === 'true') {
        await syncFromUrl();
        if (isMounted) setIsAppLoading(false);
        return;
      }

      const startTime = Date.now();

      // Parallel pre-warming: fonts, initial card artwork, and URL sync
      const criticalImages = [
        '/assets/flower-illustrations/white_tulip.png',
        '/assets/flower-illustrations/sunflower.png',
        '/assets/cards/pokemon-frame.png',
        '/assets/bloom/sample-cards/sample-card-1.png',
        '/assets/pokemon-back/base-card-back.png',
        '/assets/pokemon-back/trainer-card-frame.png',
        '/assets/pokemon-back/trainer-card-textures.png',
        '/assets/bloom/paper_back_blank_labels.png',
        '/assets/bloom/metallic_back.png',
        ...FLOWERS.map((f) => f.thumb).filter(Boolean),
        ...POKEMON_CARDS.map((p) => p.thumb).filter(Boolean),
      ];

      const preloadImagesPromise = Promise.all(
        criticalImages.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              if (img.decode) {
                img.decode().then(resolve).catch(resolve);
              } else {
                img.onload = resolve;
                img.onerror = resolve;
              }
            })
        )
      );

      const fontsPromise = document.fonts?.ready ? document.fonts.ready : Promise.resolve();

      await Promise.all([syncFromUrl(), fontsPromise, preloadImagesPromise]);

      // Complete natural wave cycle (~450ms)
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 450 - elapsed);

      setTimeout(() => {
        if (isMounted) {
          try {
            sessionStorage.setItem('bloom_has_loaded', 'true');
          } catch {}
          setIsAppLoading(false);


        }
      }, remaining);
    };

    initApp();

    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      isMounted = false;
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, [syncFromUrl]);

  // Step 1: Silently pre-decode all full-res card artworks into RAM/GPU cache once the splash finishes
  useEffect(() => {
    if (isAppLoading) return;
    const fullResArtworks = [
      ...FLOWERS.map((f) => f.image).filter(Boolean),
      ...POKEMON_CARDS.map((p) => p.image).filter(Boolean),
    ];
    const warmQueue = () => {
      fullResArtworks.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.decode?.().catch(() => {});
      });
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(warmQueue, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(handle);
    } else {
      const timer = setTimeout(warmQueue, 100);
      return () => clearTimeout(timer);
    }
  }, [isAppLoading]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'design') {
      const isComingFromSharedLink =
        window.location.search.includes('card=') ||
        window.location.search.includes('d=') ||
        /^\/(?:c|s)\//.test(window.location.pathname);

      if (isComingFromSharedLink && !isCreatorPreview) {
        window.history.replaceState(null, '', '/');
        dispatch({ type: 'RESET_CARD' });
      } else {
        window.history.replaceState(null, '', '/');
      }
      setIsRecipientMode(false);
      setIsCreatorPreview(false);
    } else {
      window.history.pushState(null, '', `/#${tab}`);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isAppLoading ? (
        /* Full-Screen Preloader: Exact Framer AnimatedAILoaderFX (crisp from frame 0, zero blur glitch) */
        <motion.div
          key="app-loader"
          variants={loaderVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070908] select-none"
        >
          <AnimatedAILoaderFX palette="framer" />
        </motion.div>
      ) : (
        /* Full App Content: Enters seamlessly using existing Bloom optical blur transition */
        <motion.div
          key="app-shell"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative min-h-screen overflow-y-auto overflow-x-hidden flex flex-col justify-between bg-black text-white selection:bg-blue-600 selection:text-white"
        >
          {/* Persistent Subtle Blueprint Grid spanning all pages, starting from top of screen */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none fixed inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] z-0" 
          />

          {/* Top Navbar matching Figma Menu Section */}
          <Navbar activeTab={isRecipientMode ? null : activeTab} onTabChange={handleTabChange} />

          {/* Tab View with Atmospheric Optical Transition */}
          <div className="relative z-10 flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex-1 flex flex-col min-h-0"
              >
                <Suspense
                  fallback={
                    <div className="w-full flex-1 flex items-center justify-center min-h-[60vh]">
                      <AnimatedAILoaderFX palette="framer" size={140} />
                    </div>
                  }
                >
                  {activeTab === 'design' ? (
                    <DesignPage 
                      isRecipientMode={isRecipientMode} 
                      onSetRecipientMode={setIsRecipientMode} 
                      isCreatorPreview={isCreatorPreview}
                      onSetCreatorPreview={setIsCreatorPreview}
                      onNavigateTab={handleTabChange}
                    />
                  ) : activeTab === 'terms' ? (
                    <LegalPage 
                      initialTab="terms"
                      onStartCrafting={() => handleTabChange('design')}
                      onFeedback={() => setGlobalModal('feedback')}
                      onTerms={() => handleTabChange('terms')}
                      onPrivacy={() => handleTabChange('privacy')}
                    />
                  ) : activeTab === 'privacy' ? (
                    <LegalPage 
                      initialTab="privacy"
                      onStartCrafting={() => handleTabChange('design')}
                      onFeedback={() => setGlobalModal('feedback')}
                      onTerms={() => handleTabChange('terms')}
                      onPrivacy={() => handleTabChange('privacy')}
                    />
                  ) : (
                    <AboutPage 
                      onStartCrafting={() => handleTabChange('design')}
                      onFeedback={() => setGlobalModal('feedback')}
                      onTerms={() => handleTabChange('terms')}
                      onPrivacy={() => handleTabChange('privacy')}
                    />
                  )}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Global Feedback Modal */}
          {globalModal === 'feedback' && (
            <FeedbackModal onClose={() => setGlobalModal(null)} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <CardProvider>
      <AppleToast />
      <AppShell />
    </CardProvider>
  );
}
