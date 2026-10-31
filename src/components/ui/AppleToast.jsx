import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from '@phosphor-icons/react';

const TOAST_EVENT = 'bloom:toast';

/**
 * Dispatch an Apple Dynamic Island style toast from anywhere in the app.
 * @param {string | { title: string, description?: string, duration?: number }} options 
 */
export function showToast(options) {
  if (typeof window === 'undefined') return;
  const detail = typeof options === 'string' ? { title: options } : options;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
}

export default function AppleToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let timer = null;

    const handleToast = (e) => {
      const { title, description, duration = 2800 } = e.detail || {};
      setToast({ title, description, key: Date.now() });

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setToast(null);
      }, duration);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed top-5 inset-x-0 mx-auto z-[100] flex justify-center pointer-events-none px-4">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, y: -20, scale: 0.94, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, scale: 0.94, filter: 'blur(3px)' }}
            transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.8 }}
            className="pointer-events-auto flex items-center gap-2 h-[38px] sm:h-[42px] px-3.5 sm:px-4 rounded-full bg-[#121413]/94 backdrop-blur-2xl border border-white/18 text-white shadow-[0_12px_36px_rgba(0,0,0,0.65)] select-none font-sans max-w-[calc(100vw-32px)]"
            style={{
              boxShadow: '0 12px 36px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.1)'
            }}
          >
            {/* Emerald glowing checkmark */}
            <div className="flex items-center justify-center w-[17px] h-[17px] rounded-full bg-[#34C759]/20 text-[#34C759] shrink-0">
              <CheckCircle size={14} weight="fill" />
            </div>

            {/* Title */}
            <span className="text-[12.5px] sm:text-[13px] font-medium text-white tracking-[-0.01em] whitespace-nowrap">
              {toast.title}
            </span>

            {/* Optional detail badge */}
            {toast.description && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/25 shrink-0" />
                <span className="text-[11.5px] sm:text-[12px] text-white/60 tracking-tight font-sans truncate">
                  {toast.description}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
