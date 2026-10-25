import React, { useState } from 'react';
import { CardProvider, useCard } from './context/CardContext';
import { loadSharedCard } from './lib/supabase';
import Navbar from './components/Navbar';
import DesignPage from './pages/DesignPage';
import AboutPage from './pages/AboutPage';
import FeedbackModal from './components/FeedbackModal';
import { WindowModal, LiquidGlassButton } from './components/ui';

function AppShell() {
  const { dispatch } = useCard();
  const [activeTab, setActiveTab] = useState('design');
  const [isRecipientMode, setIsRecipientMode] = useState(false);
  const [globalModal, setGlobalModal] = useState(null);

  React.useEffect(() => {
    const syncFromUrl = async () => {
      const params = new URLSearchParams(window.location.search);
      const sharedCardId = params.get('card');
      const hasPreview =
        window.location.hash === '#preview' ||
        params.get('preview') === 'recipient' ||
        Boolean(sharedCardId);

      setIsRecipientMode(hasPreview);

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
    if (tab === 'design') {
      if (window.location.hash === '#preview' || window.location.search.includes('card=')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      setIsRecipientMode(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-y-auto overflow-x-hidden flex flex-col justify-between bg-black text-white selection:bg-blue-600 selection:text-white">
      {/* Top Navbar matching Figma Menu Section */}
      <Navbar activeTab={isRecipientMode ? null : activeTab} onTabChange={handleTabChange} />

      {/* Tab View */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {activeTab === 'design' ? (
          <DesignPage 
            isRecipientMode={isRecipientMode} 
            onSetRecipientMode={setIsRecipientMode} 
          />
        ) : (
          <AboutPage 
            onStartCrafting={() => { 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
              handleTabChange('design'); 
            }}
            onFeedback={() => setGlobalModal('feedback')}
            onTerms={() => setGlobalModal('terms')}
            onPrivacy={() => setGlobalModal('privacy')}
          />
        )}
      </div>

      {/* Global Modals triggered from About Page footer */}
      {globalModal === 'feedback' && (
        <FeedbackModal onClose={() => setGlobalModal(null)} />
      )}

      {globalModal === 'terms' && (
        <WindowModal
          isOpen={true}
          onClose={() => setGlobalModal(null)}
          title="Terms of Use"
          footer={
            <LiquidGlassButton variant="primary" size="sm" onClick={() => setGlobalModal(null)}>
              Accept & Close
            </LiquidGlassButton>
          }
        >
          <div className="p-4 text-sm text-neutral-300">
            By using Bloom Card, you agree to spread joy and positive emotions.
          </div>
        </WindowModal>
      )}

      {globalModal === 'privacy' && (
        <WindowModal
          isOpen={true}
          onClose={() => setGlobalModal(null)}
          title="Privacy Policy"
          footer={
            <LiquidGlassButton variant="primary" size="sm" onClick={() => setGlobalModal(null)}>
              Close
            </LiquidGlassButton>
          }
        >
          <div className="p-4 text-sm text-neutral-300">
            We do not store your personal messages. All card data is local or encoded in the shareable link.
          </div>
        </WindowModal>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CardProvider>
      <AppShell />
    </CardProvider>
  );
}
