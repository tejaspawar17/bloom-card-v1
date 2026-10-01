import { useCard } from '../context/CardContext';

/**
 * PaperCard — Greeting Card Paper style, front and back
 */
export function PaperCardFront() {
  const { state } = useCard();
  const { flower, mood, title } = state;

  const bgColor = flower?.color || '#f5f0e8';
  const accentColor = flower?.accent || '#666';

  return (
    <div
      className="paper-card rounded-2xl overflow-hidden relative w-full h-full flex flex-col"
      style={{ minHeight: '460px' }}
    >
      {/* Flower image area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${bgColor}33, ${accentColor}33)`,
          minHeight: '300px',
        }}
      >
        {/* Large flower emoji as placeholder art */}
        <div className="text-center">
          <div className="text-8xl mb-4 filter drop-shadow-lg">
            {flower?.emoji || '🌸'}
          </div>
          <div className="text-xs font-medium opacity-60 tracking-widest uppercase">
            {flower?.name || 'Select a mood'}
          </div>
        </div>

        {/* Flower name pill */}
        {flower && (
          <div
            className="flower-pill absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
          >
            {flower.name}
          </div>
        )}
      </div>

      {/* Subject section */}
      <div
        className="p-4 flex flex-col gap-2"
        style={{ background: '#fff', borderTop: `3px solid ${accentColor}33` }}
      >
        <div
          className="text-sm font-semibold"
          style={{ color: accentColor || '#333', minHeight: '20px' }}
        >
          {title || (mood ? `A ${state.mood} greeting` : 'Your greeting...')}
        </div>
        <div className="text-xs text-gray-500">
          {flower?.meaning || 'Select a mood to discover your flower'}
        </div>
      </div>

      {/* Date badge */}
      <div className="absolute top-3 right-3">
        <div
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: 'rgba(255,255,255,0.7)', color: '#666' }}
        >
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

export function PaperCardBack() {
  const { state } = useCard();
  const { flower, message, from, to } = state;
  const accentColor = flower?.accent || '#666';

  return (
    <div
      className="paper-card rounded-2xl overflow-hidden relative w-full h-full flex flex-col"
      style={{ minHeight: '460px', background: '#faf8f4' }}
    >
      {/* Flower usecase pill */}
      {flower && (
        <div className="px-5 pt-5">
          <div
            className="flower-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ color: 'rgba(0,0,0,0.6)' }}
          >
            <span>{flower.emoji}</span>
            <span>{flower.meaning}</span>
          </div>
        </div>
      )}

      {/* Message card */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div
          className="w-full rounded-2xl p-5 shadow-md"
          style={{
            background: '#fff',
            border: `1px solid ${accentColor}22`,
            boxShadow: '0px 4px 4px rgba(0,0,0,0.08)',
          }}
        >
          {/* To / From */}
          <div className="flex justify-between text-xs text-gray-400 mb-3">
            <span>To: <span className="font-medium text-gray-600">{to || '—'}</span></span>
            <span>From: <span className="font-medium text-gray-600">{from || '—'}</span></span>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed min-h-20">
            {message || (
              <span className="text-gray-400 italic">
                Your message will appear here...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stamp */}
      <div className="absolute bottom-4 right-4">
        <div className="stamp" style={{ width: 64, height: 64, fontSize: '1.8rem' }}>
          {state.mood ? getMoodEmoji(state.mood) : '🌸'}
        </div>
      </div>

      {/* Lines decoration */}
      <div className="absolute bottom-20 left-5 right-5 border-t border-gray-200" />
      <div className="absolute bottom-28 left-5 right-5 border-t border-gray-100" />
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
