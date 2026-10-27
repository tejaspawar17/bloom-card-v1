import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from '@phosphor-icons/react';

/**
 * CoffeeButton
 * Apple-grade liquid glass button with tactile presence,
 * playful jittering coffee mug, and subtle rising steam micro-interaction on hover.
 */
export default function CoffeeButton({
  href = 'https://buymeacoffee.com/tejavu',
  className = '',
}) {
  // Security protocol guard: strictly require HTTPS protocol to prevent javascript:, data:, or insecure HTTP
  const safeHref =
    typeof href === 'string' && /^https:\/\//i.test(href.trim())
      ? href.trim()
      : 'https://buymeacoffee.com/tejavu';

  return (
    <motion.a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="strict-origin-when-cross-origin"
      aria-label="Buy me a coffee on BuyMeACoffee (opens in new tab)"
      whileHover="hover"
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`group relative inline-flex items-center justify-center gap-2.5 bg-[#1E6EF5] hover:bg-[#165FD6] active:bg-[#1052BD] text-white font-medium text-[14px] leading-none px-5 h-[42px] rounded-full select-none cursor-pointer outline-none border border-white/[0.14] transition-colors ${className}`}
      style={{
        boxShadow: `
          inset 0 1px 0.5px 0 rgba(255, 255, 255, 0.32),
          inset 0 -1px 0.5px 0 rgba(255, 255, 255, 0.12),
          0 3px 10px 0 rgba(0, 0, 0, 0.35)
        `,
      }}
    >
      {/* Coffee Mug with Jitter & Rising Steam Micro-Interaction */}
      <div className="relative inline-flex items-center justify-center">
        {/* Rising Steam Lines on Hover */}
        <div className="absolute -top-2 inset-x-0 flex justify-center gap-1 pointer-events-none overflow-visible">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              variants={{
                hover: {
                  opacity: [0, 0.8, 0],
                  y: [0, -7],
                  x: i === 0 ? [-1, 1, -1] : [1, -1, 1],
                  transition: {
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeInOut',
                  },
                },
              }}
              initial={{ opacity: 0 }}
              className="w-[1.5px] h-[5px] bg-white/70 rounded-full blur-[0.3px]"
            />
          ))}
        </div>

        {/* Phosphor Coffee Mug with Jitter Animation */}
        <motion.span
          variants={{
            hover: {
              rotate: [0, -12, 12, -8, 8, -4, 4, 0],
              transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.6 },
            },
          }}
          className="inline-flex items-center justify-center"
        >
          <Coffee size={17} weight="fill" className="text-white drop-shadow-xs" />
        </motion.span>
      </div>

      <span className="font-sans font-medium tracking-tight">Coffee</span>
    </motion.a>
  );
}
