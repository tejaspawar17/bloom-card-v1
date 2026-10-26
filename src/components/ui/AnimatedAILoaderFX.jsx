import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedAILoaderFX Component
 * Modeled after the Framer AnimatedAILoaderFX component by DiverseKit.
 * Features:
 * - Dynamic rotating circular background orb
 * - Cycles through shifting gradient colors (Bloom palette: forest green, gold, chartreuse, cyan)
 * - Layered animated inset box-shadows with liquid depth
 * - Accelerated "charging" transition when recipient taps Reveal
 */
export default function AnimatedAILoaderFX({
  isCharging = false,
  size = 200,
  className = '',
}) {
  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* 1. Deep Atmospheric Radial Ambient Aura */}
      <motion.div
        animate={
          isCharging
            ? { scale: 1.35, opacity: 0.95, filter: 'blur(36px) brightness(1.6)' }
            : {
                scale: [0.95, 1.08, 0.95],
                opacity: [0.5, 0.75, 0.5],
                filter: ['blur(30px)', 'blur(38px)', 'blur(30px)'],
              }
        }
        transition={
          isCharging
            ? { duration: 0.65, ease: 'easeInOut' }
            : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
        }
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(134, 183, 90, 0.55) 0%, rgba(207, 197, 49, 0.35) 45%, rgba(124, 224, 220, 0.20) 70%, transparent 85%)',
        }}
      />

      {/* 2. Rotating Conic Gradient Core Ring (Cycles through Bloom Palette) */}
      <motion.div
        animate={{
          rotate: 360,
          scale: isCharging ? 1.15 : 1,
        }}
        transition={{
          rotate: {
            duration: isCharging ? 1.2 : 7.5,
            repeat: Infinity,
            ease: 'linear',
          },
          scale: {
            duration: 0.4,
            ease: 'easeOut',
          },
        }}
        className="absolute inset-2 rounded-full opacity-80"
        style={{
          background:
            'conic-gradient(from 0deg, #132013 0deg, #4F793E 50deg, #86B75A 100deg, #CFC531 160deg, #ADD9AD 220deg, #7CE0DC 280deg, #86B75A 330deg, #132013 360deg)',
          filter: 'blur(16px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3. The Signature AnimatedAILoaderFX Shifting Inset Box Shadow Orb */}
      <motion.div
        animate={
          isCharging
            ? {
                rotate: -360,
                boxShadow: [
                  'inset 0 0 28px 8px rgba(134, 183, 90, 0.7), inset 0 0 45px 16px rgba(207, 197, 49, 0.6), 0 0 40px 10px rgba(124, 224, 220, 0.5)',
                  'inset 0 0 35px 12px rgba(124, 224, 220, 0.8), inset 0 0 50px 20px rgba(134, 183, 90, 0.7), 0 0 50px 15px rgba(207, 197, 49, 0.6)',
                ],
              }
            : {
                rotate: -360,
                boxShadow: [
                  'inset 0 0 24px 6px rgba(134, 183, 90, 0.45), inset 0 0 40px 12px rgba(207, 197, 49, 0.35), 0 0 25px 4px rgba(124, 224, 220, 0.25)',
                  'inset 0 0 30px 10px rgba(124, 224, 220, 0.40), inset 0 0 45px 14px rgba(134, 183, 90, 0.35), 0 0 30px 6px rgba(207, 197, 49, 0.30)',
                  'inset 0 0 24px 6px rgba(134, 183, 90, 0.45), inset 0 0 40px 12px rgba(207, 197, 49, 0.35), 0 0 25px 4px rgba(124, 224, 220, 0.25)',
                ],
              }
        }
        transition={{
          rotate: {
            duration: isCharging ? 1.6 : 9.0,
            repeat: Infinity,
            ease: 'linear',
          },
          boxShadow: {
            duration: isCharging ? 0.6 : 4.0,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
        className="absolute inset-3 rounded-full border border-white/[0.12]"
        style={{
          background:
            'radial-gradient(circle, rgba(14, 18, 14, 0.65) 0%, rgba(10, 14, 10, 0.85) 65%, rgba(6, 8, 6, 0.95) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* 4. Fine Specular Ambient Orbit Rim */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-1 rounded-full border border-white/[0.08]"
      />
    </div>
  );
}
