import { useCard } from '../../context/CardContext';

/**
 * MetallicCard — Greeting Card Metallic style, front and back
 */
export function MetallicCardFront() {
  const { state } = useCard();
  const { flower, mood, title } = state;

  return (
    <div
      className="metallic-card rounded-2xl overflow-hidden relative w-full h-full flex flex-col"
      style={{ minHeight: '460px' }}
    >
      {/* Sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.15) 100%)',
        }}
      />

      {/* Flower area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{ minHeight: '320px' }}
      >
        <div className="text-center z-10">
          <div
            className="text-8xl mb-4"
            style={{
              filter:
                'drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 20px rgba(255,255,255,0.3))',
            }}
          >
            {flower?.emoji || '✨'}
          </div>
          <div className="text-xs font-medium text-white/70 tracking-widest uppercase">
            {flower?.name || 'Select a mood'}
          </div>
        </div>

        {/* Flower name pill */}
        {flower && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
            style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {flower.name}
          </div>
        )}
      </div>

      {/* Subject */}
      <div
        className="p-4"
        style={{
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div className="text-white font-semibold text-sm">
          {title || (mood ? `A ${mood} card` : 'Your greeting...')}
        </div>
        <div className="text-white/60 text-xs mt-1">
          {flower?.meaning || 'Select a mood to reveal your flower'}
        </div>
      </div>

      {/* Date */}
      <div className="absolute top-3 right-3">
        <div
          className="text-xs px-2 py-1 rounded-full font-medium text-white"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
        >
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

export function MetallicCardBack() {
  const { state } = useCard();
  const { flower, message, from, to, mood } = state;

  return (
    <div
      className="metallic-card rounded-2xl overflow-hidden relative w-full h-full flex flex-col"
      style={{ minHeight: '460px' }}
    >
      {/* Sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
        }}
      />

      {/* Flower usecase pill */}
      {flower && (
        <div className="px-5 pt-5 z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white"
            style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <span>{flower.emoji}</span>
            <span>{flower.meaning}</span>
          </div>
        </div>
      )}

      {/* Message */}
      <div className="flex-1 flex items-center justify-center p-5 z-10">
        <div
          className="w-full rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '1px 3px 2px rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex justify-between text-xs text-white/60 mb-3">
            <span>To: <span className="font-medium text-white/80">{to || '—'}</span></span>
            <span>From: <span className="font-medium text-white/80">{from || '—'}</span></span>
          </div>
          <div className="text-sm text-white/90 leading-relaxed min-h-20">
            {message || (
              <span className="text-white/40 italic">Your message will appear here...</span>
            )}
          </div>
        </div>
      </div>

      {/* Stamp */}
      <div className="absolute bottom-4 right-4 z-10">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '1px 1px 2px rgba(0,0,0,0.35)',
          }}
        >
          {getMoodEmoji(mood)}
        </div>
      </div>
    </div>
  );
}

function getMoodEmoji(mood) {
  const map = {
    apologetic: '🥺', happy: '😄', sad: '😢', angry: '😡',
    grateful: '🙏', excited: '🤩', celebratory: '🎉', love: '❤️',
    birthday: '🎂', friendship: '🤝',
  };
  return map[mood] || '✨';
}
