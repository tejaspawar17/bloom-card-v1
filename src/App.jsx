import { useState } from 'react';
import { CardProvider } from './context/CardContext';
import Navbar from './components/Navbar';
import DesignPage from './pages/DesignPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('design');

  return (
    <CardProvider>
      {/* Dark textured background */}
      <div
        className="min-h-screen noise-overlay"
        style={{ background: '#0e0e0e' }}
      >
        {/* Subtle ambient glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,110,244,0.08) 0%, transparent 70%)',
          }}
        />

        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'design' ? <DesignPage /> : <AboutPage />}
      </div>
    </CardProvider>
  );
}
