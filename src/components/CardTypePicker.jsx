import clsx from 'clsx';
import { CARD_TYPES } from '../data/cardData';
import { useCard } from '../context/CardContext';

/**
 * CardTypePicker — Vertical segmented control for Paper / Metallic / Pokémon
 */
export default function CardTypePicker() {
  const { state, dispatch } = useCard();

  return (
    <div className="window-panel rounded-2xl overflow-hidden flex flex-col w-full">
      {/* Title */}
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
          <h3 className="text-[#FFFFFF] font-semibold text-base">Card Style</h3>
          <p className="text-[#999999] text-xs mt-0.5">
            Choose how your card looks
          </p>
        </div>
      </div>

      {/* Card Type Tabs */}
      <div className="p-4 flex flex-col gap-2">
        {CARD_TYPES.map((type) => {
          const isActive = state.cardType === type.id;
          return (
            <button
              key={type.id}
              onClick={() =>
                dispatch({ type: 'SET_CARD_TYPE', payload: type.id })
              }
              className={clsx(
                'seg-tab w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all',
                isActive && 'active'
              )}
            >
              <span className="text-xl">{type.icon}</span>
              <span
                className={clsx(
                  'text-sm font-medium',
                  isActive ? 'text-[#FFFFFF]' : 'text-[#999999]'
                )}
              >
                {type.label}
              </span>
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
