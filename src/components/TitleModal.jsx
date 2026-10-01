import { useState } from 'react';
import { X } from 'lucide-react';
import { useCard } from '../context/CardContext';

/**
 * TitleModal — Overlay for setting the card title/subject line.
 */
export default function TitleModal({ onClose }) {
  const { state, dispatch } = useCard();
  const [title, setTitle] = useState(state.title || '');

  const handleConfirm = () => {
    dispatch({ type: 'SET_TITLE', payload: title });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center scrim"
      onClick={onClose}
    >
      <div
        className="window-panel rounded-3xl w-full max-w-md mx-4 modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-white font-semibold text-lg">Card Title</h3>
          <button
            onClick={onClose}
            className="glass-button w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-4">
          <p className="text-white/40 text-sm">
            Add a title or subject line to your card
          </p>

          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Happy Birthday! 🎉"
              maxLength={60}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
            <div className="text-right text-white/30 text-xs mt-1">
              {title.length} / 60
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="glass-button-primary w-full py-3 rounded-full text-white font-semibold text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
