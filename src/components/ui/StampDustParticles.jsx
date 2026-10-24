import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * StampDustParticles Component
 * Erupts a soft radial puff of 12 delicate dust/glitter particles when a stamp or sticker drops
 */
export default function StampDustParticles({ triggerKey, color = '#FFD60A' }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!triggerKey) return;
    const count = 12;
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * (Math.PI * 2) + (Math.random() * 0.3 - 0.15);
      const distance = 14 + Math.random() * 12;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 2.5 + Math.random() * 2;
      return { id: `${triggerKey}-${i}`, x, y, size };
    });

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 450);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-30">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0.2, opacity: 0.9 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0.2, 1, 0],
            opacity: [0.9, 0.7, 0],
          }}
          transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1] }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '9999px',
            backgroundColor: color,
            boxShadow: `0 0 4px ${color}`,
          }}
        />
      ))}
    </div>
  );
}
