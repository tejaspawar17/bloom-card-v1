import clsx from 'clsx';

/**
 * Navbar — Bloom logo + About / Design tabs
 */
export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4">
      {/* Left spacer */}
      <div className="w-32" />

      {/* Center — Logo + Tabs */}
      <div className="flex items-center gap-3">
        {/* About tab */}
        <button
          onClick={() => onTabChange('about')}
          className={clsx(
            'glass-button px-5 py-2.5 rounded-full text-sm font-medium transition-all',
            activeTab === 'about'
              ? 'text-white/90 border-white/30'
              : 'text-white/50 hover:text-white/80'
          )}
        >
          About
        </button>

        {/* Bloom logo pill */}
        <div
          className="relative flex items-center justify-center px-6 py-3 rounded-full"
          style={{
            background:
              'linear-gradient(180deg, rgba(19,32,19,1) 0%, rgba(79,121,62,1) 13%, rgba(134,183,90,1) 60%, rgba(173,217,173,1) 94%, rgba(124,224,220,1) 100%)',
            boxShadow: '0px 40px 40px 10px rgba(40,40,40,0.2)',
          }}
        >
          <span
            className="text-white text-2xl font-serif italic tracking-tight"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.05em' }}
          >
            Bloom{' '}
          </span>
          <span
            className="text-white/80 text-xs ml-1 mt-1 self-end"
            style={{ letterSpacing: '-0.05em', fontFamily: 'system-ui' }}
          >
            ver. 1.1
          </span>
        </div>

        {/* Design tab */}
        <button
          onClick={() => onTabChange('design')}
          className={clsx(
            'glass-button px-5 py-2.5 rounded-full text-sm font-medium transition-all',
            activeTab === 'design'
              ? 'text-white/90 border-white/30'
              : 'text-white/50 hover:text-white/80'
          )}
        >
          Design
        </button>
      </div>

      {/* Right spacer */}
      <div className="w-32" />
    </nav>
  );
}
