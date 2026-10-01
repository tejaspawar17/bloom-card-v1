import { useState } from 'react';
import { Check, Copy, X, Link } from 'lucide-react';

/**
 * ShareModal — Generate + copy a shareable link for the card.
 * (In a real app, this would call a backend to persist and return a URL)
 */
export default function ShareModal({ onClose }) {
  const [stage, setStage] = useState('idle'); // idle | generating | ready
  const [copied, setCopied] = useState(false);

  const fakeLink = `https://bloom.cards/share/${Math.random().toString(36).slice(2, 10)}`;

  const handleGenerate = () => {
    setStage('generating');
    setTimeout(() => setStage('ready'), 1800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(14,14,14,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="window-panel rounded-3xl w-full max-w-md mx-4 modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-white font-semibold text-lg">Share Card</h3>
          <button
            onClick={onClose}
            className="glass-button w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-4">
          {stage === 'idle' && (
            <>
              <p className="text-white/50 text-sm">
                Generate a unique link to share your Bloom card with anyone.
              </p>
              <button
                onClick={handleGenerate}
                className="glass-button-primary w-full py-3 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Link size={16} />
                Generate Link
              </button>
            </>
          )}

          {stage === 'generating' && (
            <div className="flex flex-col items-center py-6 gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"
              />
              <p className="text-white/60 text-sm">Generating your card link...</p>
            </div>
          )}

          {stage === 'ready' && (
            <>
              <p className="text-white/50 text-sm">Your card is ready to share!</p>
              {/* Link display */}
              <div
                className="glass rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <Link size={14} className="text-white/40 flex-shrink-0" />
                <span className="text-white/70 text-sm flex-1 truncate">
                  {fakeLink}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className={`w-full py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  copied
                    ? 'bg-green-500/20 border border-green-400/60 text-green-400'
                    : 'glass-button-primary text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Link
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
