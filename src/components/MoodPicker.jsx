import clsx from 'clsx';
import { MOODS } from '../data/cardData';
import { useCard } from '../context/CardContext';

/**
 * MoodPicker — Left panel "Select Occasion" window
 */
export default function MoodPicker() {
  const { state, dispatch } = useCard();

  return (
    <div className="window-panel rounded-2xl overflow-hidden flex flex-col w-full">
      {/* Title Section */}
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
          <h3 className="text-[#FFFFFF] font-semibold text-base leading-tight">
            Select Occasion
          </h3>
          <p className="text-[#999999] text-xs mt-0.5">
            Pick a mood to generate your card
          </p>
        </div>
      </div>

      {/* Mood Grid */}
      <div className="p-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
        {MOODS.map((mood) => {
          const isSelected = state.mood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => dispatch({ type: 'SET_MOOD', payload: mood.id })}
              className={clsx(
                'mood-chip w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left',
                isSelected && 'selected'
              )}
            >
              <span className="text-2xl leading-none">{mood.emoji}</span>
              <div className="flex flex-col">
                <span
                  className={clsx(
                    'text-sm font-medium leading-tight',
                    isSelected ? 'text-[#FFFFFF]' : 'text-[#E5E5EA]'
                  )}
                >
                  {mood.label}
                </span>
                <span className="text-[#999999] text-xs">{mood.description}</span>
              </div>
              {isSelected && (
                <span className="ml-auto text-blue-400 text-xs font-semibold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
