import { useState } from 'react';
import { RotateCcw, MessageSquare, Type, Share2, RefreshCw } from 'lucide-react';
import { useCard } from '../context/CardContext';
import CardViewer from '../components/cards/CardViewer';
import MoodPicker from '../components/MoodPicker';
import CardTypePicker from '../components/CardTypePicker';
import MessageModal from '../components/MessageModal';
import TitleModal from '../components/TitleModal';
import ShareModal from '../components/ShareModal';

/**
 * DesignPage — The main card builder screen.
 * Layout: Left panel (mood + card type) | Center (card preview) | Right panel (actions)
 */
export default function DesignPage() {
  const { state, dispatch } = useCard();
  const [modal, setModal] = useState(null); // null | 'message' | 'title' | 'share'

  const hasContent = state.mood !== null;

  return (
    <div className="min-h-screen pt-24 pb-8 px-6 flex flex-col">
      {/* Main 3-column layout */}
      <div className="flex-1 flex items-start justify-center gap-4 max-w-[1400px] mx-auto w-full">

        {/* ─── Left Panel ─── */}
        <div className="flex flex-col gap-4 w-80 flex-shrink-0">
          <MoodPicker />
          <CardTypePicker />
        </div>

        {/* ─── Center — Card Preview ─── */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          {/* Flower info above card */}
          {state.flower && (
            <div className="flex flex-col items-center gap-1 text-center max-w-xs">
              <div
                className="flower-pill px-4 py-1.5 rounded-full text-sm font-medium text-white"
              >
                {state.flower.emoji} {state.flower.name}
              </div>
            </div>
          )}

          <CardViewer />

          {/* Action buttons row */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setModal('title')}
              disabled={!hasContent}
              className="glass-button flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/70 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Type size={14} />
              Title
            </button>

            <button
              onClick={() => setModal('message')}
              disabled={!hasContent}
              className="glass-button flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/70 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageSquare size={14} />
              Message
            </button>

            <button
              onClick={() => setModal('share')}
              disabled={!hasContent}
              className="glass-button-primary flex items-center gap-2 px-5 py-2 rounded-full text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>

          {/* Reset */}
          {hasContent && (
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="text-white/30 text-xs flex items-center gap-1.5 hover:text-white/60 transition-colors"
            >
              <RefreshCw size={12} />
              Start over
            </button>
          )}
        </div>

        {/* ─── Right Panel ─── */}
        <div className="flex flex-col gap-4 w-80 flex-shrink-0">
          {/* Flower meaning card */}
          <div className="window-panel rounded-2xl overflow-hidden">
            <div className="relative">
              <div
                className="absolute inset-0"
                style={{
                  background: 'rgba(31, 31, 31, 0.55)',
                  backdropFilter: 'blur(3px)',
                  borderBottom: '0.67px solid rgba(255,255,255,0.1)',
                }}
              />
              <div className="relative px-5 py-4">
                <h3 className="text-white/85 font-semibold text-base">
                  Why this flower?
                </h3>
              </div>
            </div>

            <div className="p-5">
              {state.flower ? (
                <div className="flex flex-col gap-3">
                  <div className="text-5xl text-center">{state.flower.emoji}</div>
                  <div
                    className={`w-full h-24 rounded-xl flex items-center justify-center mood-bg-${state.mood}`}
                  >
                    <span className="text-white/80 text-sm font-medium">
                      {state.flower.name}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {state.flower.meaning}
                  </p>
                </div>
              ) : (
                <p className="text-white/30 text-sm text-center py-4">
                  Select a mood to discover which flower matches your feeling
                </p>
              )}
            </div>
          </div>

          {/* Preview summary */}
          {hasContent && (
            <div className="window-panel rounded-2xl p-4 flex flex-col gap-2">
              <h3 className="text-white/85 font-semibold text-sm mb-1">Card Summary</h3>

              {[
                { label: 'Mood', value: state.mood ? `${getMoodEmoji(state.mood)} ${capitalize(state.mood)}` : null },
                { label: 'Card', value: state.cardType ? capitalize(state.cardType) : null },
                { label: 'Title', value: state.title || null },
                { label: 'To', value: state.to || null },
                { label: 'From', value: state.from || null },
              ].map(({ label, value }) =>
                value ? (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white/70 font-medium">{value}</span>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="mt-8 flex flex-col items-center gap-2 text-white/25 text-xs">
        <div className="flex items-center gap-3">
          <button className="hover:text-white/50 transition-colors underline">Terms of Use</button>
          <span>·</span>
          <button className="hover:text-white/50 transition-colors underline">Privacy Policy</button>
        </div>
        <p className="text-white/15 text-xs">
          thinking about buying me a Cup of coffee? ☕
        </p>
      </footer>

      {/* ─── Modals ─── */}
      {modal === 'message' && <MessageModal onClose={() => setModal(null)} />}
      {modal === 'title' && <TitleModal onClose={() => setModal(null)} />}
      {modal === 'share' && <ShareModal onClose={() => setModal(null)} />}
    </div>
  );
}

function getMoodEmoji(mood) {
  const map = {
    apologetic: '🥺', happy: '😄', sad: '😢', angry: '😡',
    grateful: '🙏', excited: '🤩', celebratory: '🎉', love: '❤️',
    birthday: '🎂', friendship: '🤝',
  };
  return map[mood] || '🌸';
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
