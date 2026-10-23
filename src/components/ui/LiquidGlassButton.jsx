import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import './PrimaryLiquidGlassButton.css';

const springTransition = {
  type: "spring",
  stiffness: 420,
  damping: 26,
  mass: 0.9
};

/**
 * LiquidGlassButton Component
 * Matches Figma component sets:
 * - Primary Button - Liquid Glass (1173:2326) - Blue liquid glass with 6-layer specular reflections
 */
export default function LiquidGlassButton({
  variant = 'secondary',
  size = 'md',
  icon = null,
  label = null,
  children = null,
  isDisabled = false,
  isActive = false,
  onClick,
  className = '',
  title = '',
  type = 'button',
  ...rest
}) {
  const content = children || label;

  if (variant === 'primary' || variant === 'ios27') {
    const primarySizeStyles = {
      sm: 'h-[36px] px-4 text-[13px] leading-[18px]',
      md: 'h-[44px] px-5 text-[15px] leading-[20px]',
      lg: 'h-[clamp(44px,5.2vh,50px)] px-[clamp(18px,2vw,24px)] text-[clamp(15px,1.8vh,17px)] leading-[22px]',
    };

    return (
      <motion.button
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        title={title}
        whileTap={{ scale: 0.95 }}
        transition={springTransition}
        className={clsx(
          'primary-liquid-glass-button group',
          primarySizeStyles[size] || primarySizeStyles.lg,
          isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
          className
        )}
        {...rest}
      >
        <span 
          className={clsx(
            "relative z-10 flex items-center justify-center select-none text-center",
            size === 'sm' ? 'gap-1.5' : size === 'md' ? 'gap-2' : 'gap-2.5'
          )}
          style={{
            color: 'var(--Color-Primary-Button-Label-Default, #E5E5EA)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {content}
        </span>
      </motion.button>
    );
  }

  const baseStyles = 'relative inline-flex items-center justify-center font-medium select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none';

  const variantStyles = {
    secondary: clsx(
      'bg-[rgba(14,14,14,0.85)] backdrop-blur-md border border-[rgba(166,166,166,0.5)] text-neutral-200 hover:text-white',
      'shadow-[0px_8px_15px_rgba(0,0,0,0.04)] [box-shadow:inset_0px_40px_30px_-40px_rgba(230,230,230,0.9),inset_0px_-40px_10px_-40px_rgba(26,26,26,1)]',
      'hover:border-white/60',
      isActive && 'border-white/70 text-white bg-white/10'
    ),
    tertiary: 'bg-[rgba(14,14,14,0.85)] backdrop-blur-md border border-[rgba(166,166,166,0.4)] text-neutral-300 hover:text-white shadow-lg',
    destructive: 'bg-[rgba(14,14,14,0.85)] backdrop-blur-md border border-red-500/40 text-red-400 hover:text-red-300 hover:border-red-400',
    text: 'bg-transparent hover:bg-white/10 border border-transparent hover:border-white/20 text-neutral-300 hover:text-white',
    menu: clsx(
      'bg-[rgba(14,14,14,0.85)] backdrop-blur-md border border-[rgba(166,166,166,0.5)] [box-shadow:inset_0px_40px_30px_-40px_rgba(230,230,230,0.9)] transition-all',
      isActive ? 'text-white border-white/60 bg-white/15' : 'text-neutral-400 hover:text-white hover:border-white/30'
    ),
  };

  const sizeStyles = {
    sm: 'h-[36px] px-4 rounded-full text-[13px] leading-[18px] gap-1.5',
    md: 'h-[44px] px-5 rounded-full text-[15px] leading-[20px] gap-2',
    lg: 'h-[50px] px-6 rounded-full text-[17px] leading-[22px] gap-2.5',
    icon: 'w-[44px] h-[44px] rounded-full p-0 flex items-center justify-center',
    'icon-sm': 'w-[36px] h-[36px] rounded-full p-0 flex items-center justify-center text-xs',
    'icon-lg': 'w-[50px] h-[50px] rounded-full p-0 flex items-center justify-center',
  };

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      title={title}
      whileTap={{ scale: 0.93 }}
      transition={springTransition}
      className={clsx(
        baseStyles,
        variantStyles[variant] || variantStyles.secondary,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
      {...rest}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {content && <span>{content}</span>}
    </motion.button>
  );
}
