import { useState } from 'react';
import clsx from 'clsx';
import { useCard } from '../../context/CardContext';
import { POKEMON_LIST } from '../../data/cardData';

/**
 * PokemonCard — Pokémon-style card, front and back
 */
export function PokemonCardFront() {
  const { state, dispatch } = useCard();
  const { pokemon, mood } = state;
  const [showPicker, setShowPicker] = useState(false);

  const selected = POKEMON_LIST.find((p) => p.id === pokemon) || null;

  const typeColors = {
    Electric: '#FFD700',
    Fire: '#FF6347',
    Water: '#4169E1',
    Grass: '#32CD32',
    Psychic: '#DA70D6',
    Normal: '#A8A878',
    Ghost: '#705898',
  };

  const bgColor = selected ? typeColors[selected.type] || '#FFD700' : '#FFD700';

  return (
    <div
      className="pokemon-card rounded-2xl overflow-hidden relative w-full h-full flex flex-col"
      style={{
        minHeight: '460px',
        background: selected
          ? `linear-gradient(135deg, ${bgColor}aa, ${bgColor}44, #1a1a2e)`
          : 'linear-gradient(135deg, #FFD700aa, #FF914daa, #FF2D5544, #5856D6)',
      }}
    >
      {/* Card border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: '2px solid rgba(255,255,255,0.4)',
          boxShadow: `inset 0 0 30px rgba(255,255,255,0.1), 0 0 30px ${bgColor}44`,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 z-10">
        <div>
          <div className="text-white font-bold text-lg tracking-wide drop-shadow">
            {selected?.name || 'Choose Pokémon'}
          </div>
          {selected && (
            <div
              className="inline-block text-xs px-2 py-0.5 rounded-full font-semibold mt-1"
              style={{
                background: typeColors[selected.type] || '#FFD700',
                color: '#000',
              }}
            >
              {selected.type}
            </div>
          )}
        </div>
        {selected && (
          <div className="text-right">
            <div className="text-white/60 text-xs">HP</div>
            <div className="text-white font-bold text-lg">{selected.hp}</div>
          </div>
        )}
      </div>

      {/* Pokémon Art Area */}
      <div
        className="flex-1 flex items-center justify-center cursor-pointer z-10"
        onClick={() => setShowPicker(true)}
      >
        {selected ? (
          <div className="text-center">
            <div className="text-9xl filter drop-shadow-2xl">{selected.art}</div>
            <div className="text-white/60 text-xs mt-2">#{selected.id}</div>
          </div>
        ) : (
          <div className="text-center text-white/60">
            <div className="text-6xl mb-3">⚡</div>
            <div className="text-sm font-medium">Tap to choose Pokémon</div>
          </div>
        )}
      </div>

      {/* Mood badge */}
      {mood && (
        <div className="absolute top-3 right-3 z-10">
          <div
            className="text-xs px-2 py-1 rounded-full font-medium text-white"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          >
            {mood}
          </div>
        </div>
      )}

      {/* Holographic shimmer lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)',
        }}
      />

      {/* Pokémon Picker Modal */}
      {showPicker && (
        <PokemonPickerModal
          onSelect={(id) => {
            dispatch({ type: 'SET_POKEMON', payload: id });
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
          selected={pokemon}
        />
      )}
    </div>
  );
}

export function PokemonCardBack() {
  const { state } = useCard();
  const { pokemon, message, from, to, mood } = state;
  const selected = POKEMON_LIST.find((p) => p.id === pokemon);

  return (
    <div
      className="rounded-2xl overflow-hidden relative w-full h-full flex flex-col"
      style={{
        minHeight: '460px',
        background: 'linear-gradient(135deg, rgba(149,160,166,0.65), rgba(100,120,140,0.5))',
        border: '1px solid rgba(255,255,255,0.25)',
      }}
    >
      {/* Pokéball pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.8) 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Stamp / Polaroid area */}
      <div className="flex items-start gap-3 p-5 z-10">
        <div
          className="rounded-lg p-2 flex-shrink-0"
          style={{
            background: '#fff',
            boxShadow: '1px 1px 2px rgba(0,0,0,0.35)',
            width: 80,
            height: 80,
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {selected?.art || '⚡'}
          </div>
        </div>

        {/* Stamp */}
        <div className="ml-auto">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-white"
            style={{ boxShadow: '1px 1px 2px rgba(0,0,0,0.35)' }}
          >
            {getMoodEmoji(mood)}
          </div>
        </div>
      </div>

      {/* Message section */}
      <div className="flex-1 flex items-center px-5 z-10">
        <div
          className="w-full rounded-2xl p-4"
          style={{
            background: '#fff',
            boxShadow: '0px 4px 4px rgba(0,0,0,0.4)',
          }}
        >
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>To: <span className="font-medium text-gray-600">{to || '—'}</span></span>
            <span>From: <span className="font-medium text-gray-600">{from || '—'}</span></span>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed min-h-16">
            {message || (
              <span className="text-gray-400 italic">Your message will appear here...</span>
            )}
          </div>
        </div>
      </div>

      {/* Date + divider */}
      <div className="px-5 py-3 z-10 border-t border-white/20">
        <div className="text-white/60 text-xs text-center">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

function PokemonPickerModal({ onSelect, onClose, selected }) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="window-panel rounded-2xl p-5 w-72 modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white font-semibold text-base mb-4">Select Pokémon</h3>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {POKEMON_LIST.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={clsx(
                'flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center',
                selected === p.id
                  ? 'bg-blue-500/30 border border-blue-400/60'
                  : 'mood-chip'
              )}
            >
              <span className="text-3xl">{p.art}</span>
              <span className="text-white/90 text-xs font-medium">{p.name}</span>
              <span className="text-white/40 text-xs">{p.type}</span>
            </button>
          ))}
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
  return map[mood] || '⚡';
}
