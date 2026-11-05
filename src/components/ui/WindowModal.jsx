import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidGlassButton from './LiquidGlassButton';
import { X } from '@phosphor-icons/react';

/**
 * WindowModal Component
 * Emil Kowalski design engineering approach: Spring-based, interruptible animations.
 */
export default function WindowModal({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  maxWidth = 'max-w-[466px]',
  className = '',
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={clsx(
              'figma-modal-window relative z-10 w-full p-6 flex flex-col gap-5 select-none shadow-2xl bg-[#141515]/95 border border-white/10 rounded-[28px]',
              maxWidth,
              className
            )}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 1
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-white font-semibold text-lg tracking-tight">
                {title}
              </h2>
              <LiquidGlassButton
                variant="destructive"
                size="icon-sm"
                onClick={onClose}
                title="Close"
                aria-label="Close modal"
                icon={<X size={18} weight="regular" />}
              />
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-4">
              {children}
            </div>

            {/* Footer Actions */}
            {footer && (
              <div className="flex justify-end gap-3 pt-2 ">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}


