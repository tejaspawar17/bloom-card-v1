import React from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import KeepsakeFolder from './KeepsakeFolder';

/**
 * Ambient Celestial Star Particle
 * Glowing emerald-mint gradient starlight with soft atmospheric blur matching Bloom's cosmic brand aura.
 */
function CosmicStar({
  top,
  left,
  right,
  size = 5,
  blur = 2,
  parallaxSpeed = -150,
  progress,
  twinkleDuration = 3.5,
  delay = 0,
}) {
  const y = useTransform(progress, [0, 1], [0, parallaxSpeed]);

  return (
    <motion.div
      style={{
        top,
        left,
        right,
        width: size,
        height: size,
        y,
        background: 'radial-gradient(circle, #86B75A 0%, #7CE0DC 60%, rgba(134, 183, 90, 0.2) 100%)',
        boxShadow: '0 0 10px rgba(134, 183, 90, 0.9), 0 0 20px rgba(124, 224, 220, 0.5)',
        filter: `blur(${blur}px)`,
      }}
      animate={{
        opacity: [0.35, 1, 0.35],
        scale: [0.85, 1.4, 0.85],
      }}
      transition={{
        duration: twinkleDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className="absolute rounded-full pointer-events-none"
    />
  );
}

/**
 * ScatteredKeepsakes Component (Zero-G Cosmic Parallax & 4-Folder Balanced Constellation)
 * 
 * Features:
 * 1. 4-Folder Balanced Orbit (eliminates empty space in Fold 1):
 *    - Folder 1 (Hero Left): January 2026, scale={0.64}, top-[180px], -10°, topCardIndex={0} (Pokemon style on top)
 *    - Folder 2 (Hero Right): Spring 2026, scale={0.48}, top-[340px], +12°, topCardIndex={1} (Metallic style on top)
 *    - Folder 3 (How It Works Right): Summer 2026, scale={0.52}, top-[890px], -8°, topCardIndex={2} (Paper style on top)
 *    - Folder 4 (Creator Left): Autumn 2026, scale={0.38}, top-[1330px], +7°, topCardIndex="random"
 * 
 * 2. Unified 100% Opacity on all folders (crisp frosted glass, scale depth preserved).
 * 3. Bloom Green Gradient Starlight with Dreamy Bokeh Blur (1.5px – 2.4px).
 * 4. Multi-plane Scroll Parallax & Inertial Velocity Micro-tilt.
 */
export default function ScatteredKeepsakes() {
  const { scrollY, scrollYProgress } = useScroll();

  // Smooth springs for buttery 60fps cosmic inertia
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 180,
    damping: 32,
  });

  // Parallax Y drift for each focal plane
  const yForeground = useTransform(smoothProgress, [0, 1], [0, -135]);
  const yMidground = useTransform(smoothProgress, [0, 1], [0, -78]);
  const yDeepSpace = useTransform(smoothProgress, [0, 1], [0, -38]);

  // Inertial momentum micro-tilt on scroll velocity (subtle floating torque)
  const velocityTilt1 = useTransform(smoothVelocity, [-1200, 0, 1200], [4.5, 0, -4.5]);
  const velocityTilt2 = useTransform(smoothVelocity, [-1200, 0, 1200], [-5.0, 0, 5.0]);
  const velocityTilt3 = useTransform(smoothVelocity, [-1200, 0, 1200], [3.5, 0, -3.5]);
  const velocityTilt4 = useTransform(smoothVelocity, [-1200, 0, 1200], [-4.0, 0, 4.0]);

  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* ============================================================
          BLOOM BRAND GREEN GRADIENT STARDUST (Soft Bokeh Blur)
          ============================================================ */}
      <CosmicStar top="120px" left="6%" size={5} blur={1.8} parallaxSpeed={-180} progress={smoothProgress} delay={0.2} />
      <CosmicStar top="260px" right="6%" size={4} blur={1.5} parallaxSpeed={-120} progress={smoothProgress} delay={1.1} />
      <CosmicStar top="540px" left="9%" size={6.5} blur={2.4} parallaxSpeed={-240} progress={smoothProgress} delay={0.7} />
      <CosmicStar top="820px" right="5%" size={4} blur={1.6} parallaxSpeed={-150} progress={smoothProgress} delay={1.8} />
      <CosmicStar top="1080px" left="4%" size={5} blur={2.0} parallaxSpeed={-90} progress={smoothProgress} delay={2.3} />
      <CosmicStar top="1340px" right="11%" size={6} blur={2.2} parallaxSpeed={-200} progress={smoothProgress} delay={0.5} />
      <CosmicStar top="1560px" left="8%" size={4.5} blur={1.8} parallaxSpeed={-140} progress={smoothProgress} delay={1.4} />

      {/* ============================================================
          1. FOLDER 1 (Hero Left): January 2026 (scale: 0.64, topCard: Card 1 / Pokemon)
          ============================================================ */}
      <motion.div 
        style={{
          y: yForeground,
          rotate: velocityTilt1,
        }}
        className="absolute top-[520px] lg:top-[180px] -left-6 sm:left-[2%] lg:left-[8%] xl:left-[11%] 2xl:left-[14%] opacity-20 sm:opacity-30 lg:opacity-100 scale-75 sm:scale-90 lg:scale-100 pointer-events-none lg:pointer-events-auto"
      >
        <KeepsakeFolder
          folderTitle="January"
          folderBody="2026"
          scale={0.64}
          opacity={1.0}
          defaultRotation={-10}
          floatDelay={0}
          topCardIndex={0}
        />
      </motion.div>

      {/* ============================================================
          2. FOLDER 2 (Hero Right — Balances Fold 1): Spring 2026 (scale: 0.48, topCard: Card 2 / Metallic)
          ============================================================ */}
      <motion.div 
        style={{
          y: yMidground,
          rotate: velocityTilt2,
        }}
        className="absolute top-[600px] lg:top-[340px] -right-6 sm:right-[2%] lg:right-[8%] xl:right-[11%] 2xl:right-[14%] opacity-20 sm:opacity-30 lg:opacity-100 scale-75 sm:scale-90 lg:scale-100 pointer-events-none lg:pointer-events-auto"
      >
        <KeepsakeFolder
          folderTitle="Spring"
          folderBody="2026"
          scale={0.48}
          opacity={1.0}
          defaultRotation={12}
          floatDelay={1.8}
          topCardIndex={1}
        />
      </motion.div>

      {/* ============================================================
          3. FOLDER 3 (How It Works Right): Summer 2026 (scale: 0.52, topCard: Card 3 / Paper)
          ============================================================ */}
      <motion.div 
        style={{
          y: yMidground,
          rotate: velocityTilt3,
        }}
        className="absolute top-[1020px] lg:top-[890px] -right-6 sm:right-[2%] lg:right-[8%] xl:right-[11%] 2xl:right-[14%] opacity-20 sm:opacity-30 lg:opacity-100 scale-75 sm:scale-90 lg:scale-100 pointer-events-none lg:pointer-events-auto"
      >
        <KeepsakeFolder
          folderTitle="Summer"
          folderBody="2026"
          scale={0.52}
          opacity={1.0}
          defaultRotation={-8}
          floatDelay={0.9}
          topCardIndex={2}
        />
      </motion.div>

      {/* ============================================================
          4. FOLDER 4 (Creator Left): Autumn 2026 (scale: 0.38, topCard: Random)
          ============================================================ */}
      <motion.div 
        style={{
          y: yDeepSpace,
          rotate: velocityTilt4,
        }}
        className="absolute top-[1480px] lg:top-[1330px] -left-6 sm:left-[2%] lg:left-[8%] xl:left-[11%] 2xl:left-[14%] opacity-20 sm:opacity-30 lg:opacity-100 scale-75 sm:scale-90 lg:scale-100 pointer-events-none lg:pointer-events-auto"
      >
        <KeepsakeFolder
          folderTitle="Autumn"
          folderBody="2026"
          scale={0.38}
          opacity={1.0}
          defaultRotation={7}
          floatDelay={2.5}
          topCardIndex="random"
        />
      </motion.div>
    </div>
  );
}
