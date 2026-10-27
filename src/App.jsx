import AppleToast from '@/components/ui/AppleToast';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardProvider, useCard } from './context/CardContext';
import { loadSharedCard } from './lib/supabase';
import Navbar from './components/Navbar';
import DesignPage from './pages/DesignPage';
import AboutPage from './pages/AboutPage';
import LegalPage from './pages/LegalPage';
import FeedbackModal from './components/FeedbackModal';

// Atmospheric page transition: pure optical opacity + blur dissolve (no scale, x, or y to eliminate lateral/vertical drift)
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

function AppShell() {
  const { dispatch } = useCard();
  const [activeTab, setActiveTab] = useState('design');
  const [isRecipientMode, setIsRecipientMode] = useState(false);
  const [globalModal, setGlobalModal] = useState(null);

  React.useEffect(() => {
    const syncFromUrl = async () => {
      const params = new URLSearchParams(window.location.search);
      const sharedCardId = params.get('card');
      const hash = window.location.hash;
      const hasPreview =
        hash === '#preview' ||
        params.get('preview') === 'recipient' ||
        Boolean(sharedCardId);

      setIsRecipientMode(hasPreview);

      if (hash === '#terms') {
        setActiveTab('terms');
      } else if (hash === '#privacy') {
        setActiveTab('privacy');
      } else if (hash === '#about') {
        setActiveTab('about');
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
    };

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, [dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'design') {
      if (window.location.hash === '#preview' || window.location.search.includes('card=')) {
        window.history.replaceState(null, '', window.location.pathname);
      } else if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      setIsRecipientMode(false);
    } else if (tab === 'terms') {
      window.history.replaceState(null, '', '#terms');
    } else if (tab === 'privacy') {
      window.history.replaceState(null, '', '#privacy');
    } else if (tab === 'about') {
      window.history.replaceState(null, '', '#about');
    }
  };

  return (
    <div className="relative min-h-screen overflow-y-auto overflow-x-hidden flex flex-col justify-between bg-black text-white selection:bg-blue-600 selection:text-white">
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
            {activeTab === 'design' ? (
              <DesignPage 
                isRecipientMode={isRecipientMode} 
                onSetRecipientMode={setIsRecipientMode} 
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Feedback Modal */}
      {globalModal === 'feedback' && (
        <FeedbackModal onClose={() => setGlobalModal(null)} />
      )}
    </div>
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
