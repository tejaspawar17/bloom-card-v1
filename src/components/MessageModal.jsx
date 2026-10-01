import { useState } from 'react';
import { X } from 'lucide-react';
import { useCard } from '../context/CardContext';

/**
 * MessageModal — Slide-up overlay to compose the card message (To, From, Message).
 */
export default function MessageModal({ onClose }) {
  const { state, dispatch } = useCard();
  const [to, setTo] = useState(state.to || '');
  const [from, setFrom] = useState(state.from || '');
  const [message, setMessage] = useState(state.message || '');

  const handleConfirm = () => {
    dispatch({ type: 'SET_TO', payload: to });
    dispatch({ type: 'SET_FROM', payload: from });
    dispatch({ type: 'SET_MESSAGE', payload: message });
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
          <h3 className="text-white font-semibold text-lg">Write Message</h3>
          <button
            onClick={onClose}
            className="glass-button w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-4">
          {/* To / From row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-white/50 text-xs font-medium mb-1.5 block">To</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipient's name"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/60 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              />
            </div>
            <div className="flex-1">
              <label className="text-white/50 text-xs font-medium mb-1.5 block">From</label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Your name"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/60 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={5}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none resize-none focus:border-blue-400/60 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            />
            <div className="text-right text-white/30 text-xs mt-1">
              {message.length} / 300
            </div>
          </div>

          {/* Confirm button */}
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
