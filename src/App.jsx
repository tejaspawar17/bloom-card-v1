import React, { useState } from 'react';
import { CardProvider, useCard } from './context/CardContext';
import { loadSharedCard } from './lib/supabase';
import Navbar from './components/Navbar';
import DesignPage from './pages/DesignPage';
import AboutPage from './pages/AboutPage';

function AppShell() {
  const { dispatch } = useCard();
  const [activeTab, setActiveTab] = useState('design');
  const [isRecipientMode, setIsRecipientMode] = useState(false);

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
          <AboutPage onStartCrafting={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); handleTabChange('design'); }} />
        )}
      </div>
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
