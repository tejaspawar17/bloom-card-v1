import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * SegmentedControl Component
 * Emil Kowalski design engineering approach: fluid layout animations.
 */
export default function SegmentedControl({
  options = [],
  value,
  onChange,
  className = '',
}) {
  return (
    <div
      role="tablist"
      className={clsx(
        'relative inline-flex items-center p-1 rounded-full select-none',
        'bg-white/25 backdrop-blur-md border border-white/75 shadow-[0_6px_16px_rgba(147,51,234,0.3),0_2px_4px_rgba(0,0,0,0.15)]',
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isSelected}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              'relative z-10 px-5 py-2 rounded-full text-[13px] font-medium transition-colors duration-200 outline-none',
              'hig-focus active:scale-[0.97]',
              isSelected ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] font-bold' : 'text-black/60 hover:text-black/90 font-semibold'
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-indicator"
                className="absolute inset-0 rounded-full -z-10" style={{ background: "radial-gradient(100% 100% at 35% 20%, #D86EFF 0%, #A82FFC 55%, #7E12E0 100%)", boxShadow: "inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(59,7,100,0.5)" }}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  mass: 1
                }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {opt.icon && <span className="text-base">{opt.icon}</span>}
              <span style={{ letterSpacing: '0.01em' }}>{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

