import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Authentic Framer Keepsake Spring Transitions
 * Extracted directly from https://framer.com/m/Keepsake-zYTAEE.js@kJgEQuDTiylAdj0q2BJB
 */
const keepsakeTransition = {
  type: 'spring',
  duration: 0.5,
  bounce: 0.2,
  delay: 0,
};

const flipTransition = {
  type: 'spring',
  stiffness: 150,
  damping: 35,
  mass: 1.9,
  delay: 0,
};

/**
 * Authentic Framer Default Cards
 */
const defaultKeepsakeCards = [
  {
    id: 'card-1',
    image: '/assets/bloom/keepsake-card-3.jpeg',
    text: 'Standing under the Colosseum arches',
  },
  {
    id: 'card-2',
    image: '/assets/bloom/keepsake-card-2.jpeg',
    text: 'Looking up at the golden statue',
  },
  {
    id: 'card-3',
    image: '/assets/bloom/keepsake-card-1.jpeg',
    text: 'Golden hour on an empty street',
  },
];

/**
 * FlipCard Component
 * 1:1 replica of Framer FlipCard (iAhmnxAQq)
 * 127px x 119px flippable postcard with photo on front and typography quote on back.
 */
function KeepsakeFlipCard({
  image,
  text,
  isSpread,
  isFlipped,
  onFlip,
}) {
  const [isHoverFlipped, setIsHoverFlipped] = useState(false);
  const activeFlip = isSpread && (isFlipped || isHoverFlipped);

  return (
    <div
      role="button"
      tabIndex={isSpread ? 0 : -1}
      aria-label={isSpread ? `Card: ${text}. Click to flip.` : undefined}
      onClick={(e) => {
        if (!isSpread) return;
        e.stopPropagation();
        onFlip?.();
      }}
      onMouseEnter={() => {
        if (isSpread) setIsHoverFlipped(true);
      }}
      onMouseLeave={() => {
        if (isSpread) setIsHoverFlipped(false);
      }}
      className="relative w-[127px] h-[119px] select-none"
      style={{
        perspective: 1000,
        cursor: isSpread ? 'pointer' : 'inherit',
      }}
    >
      {/* Photo Face (Side A: rotateY 0 -> 180) */}
      <motion.div
        animate={{
          rotateY: activeFlip ? 180 : 0,
        }}
        transition={flipTransition}
        className="absolute inset-0 w-full h-full rounded-[5px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={image}
          alt={text || 'keepsake photo'}
          className="w-full h-full object-cover rounded-[5px] pointer-events-none"
          loading="lazy"
        />
      </motion.div>

      {/* Quote Text Face (Side B: rotateY 180 -> 0) */}
      <motion.div
        animate={{
          rotateY: activeFlip ? 0 : 180,
        }}
        transition={flipTransition}
        className="absolute inset-0 w-full h-full rounded-[5px] bg-white border border-[#222222] p-3 flex flex-col justify-center items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
        }}
      >
        <p
          className="text-[#222222] text-[12px] leading-[15px] font-medium tracking-tight"
          style={{
            fontFamily: '"Clash Display", sans-serif',
          }}
        >
          {text}
        </p>
      </motion.div>
    </div>
  );
}

/**
 * KeepsakeFolder Component
 * 1:1 Exact Re-creation of https://framer.com/m/Keepsake-zYTAEE.js@kJgEQuDTiylAdj0q2BJB
 * 
 * Sizing:
 * - Native Framer canvas size: 149px wide × 158px high (pocket 110px).
 * - Scaled down cleanly via `scale` prop (default: 0.62) for an authentic, delicate miniature stationery aesthetic.
 * 
 * Interactions:
 * - Variant 1 (Tucked): Cards resting inside frosted glass sleeve.
 * - Variant 2 (Peek): On hover, front flap tilts to -43deg, cards lift and fan gently, text turns Framer blue rgb(0, 88, 252).
 * - Variant 3 (Spread): On click, front flap opens to -65deg, 3 cards fly out horizontally side-by-side above the sleeve.
 * - Cards flip 180deg on hover/tap when spread to reveal handwritten-style quotes.
 */
export default function KeepsakeFolder({
  cards = defaultKeepsakeCards,
  folderTitle = 'January',
  folderBody = '2026',
  scale = 0.64,
  defaultRotation = -6,
  floatDelay = 0,
  opacity = 1,
  className = '',
  style = {},
}) {
  // 'tucked' (Variant 1) | 'peek' (Variant 2) | 'spread' (Variant 3)
  const [variant, setVariant] = useState('tucked');
  const [flippedCards, setFlippedCards] = useState({});

  const cardList = [
    cards[0] || defaultKeepsakeCards[0],
    cards[1] || defaultKeepsakeCards[1],
    cards[2] || defaultKeepsakeCards[2],
  ];

  const handleMouseEnter = () => {
    if (variant === 'tucked') {
      setVariant('peek');
    }
  };

  const handleMouseLeave = () => {
    if (variant === 'peek') {
      setVariant('tucked');
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (variant === 'spread') {
      setVariant('tucked');
      setFlippedCards({});
    } else {
      setVariant('spread');
    }
  };

  const toggleFlip = (cardIndex) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardIndex]: !prev[cardIndex],
    }));
  };

  // Dimensions of the scaled wrapper
  const scaledWidth = Math.round(149 * scale);
  const scaledHeight = Math.round(158 * scale);

  // Exact Framer motion positions for the 3 cards
  // Card 1: framer-1uo03bd-container (Colosseum / card 3)
  const card1Animate = {
    x: variant === 'spread' ? 140 : variant === 'peek' ? 0.5 : 11,
    y: variant === 'spread' ? -117 : variant === 'peek' ? -21 : 30.5,
    rotate: variant === 'spread' ? 0 : variant === 'peek' ? -5 : -6,
    zIndex: variant === 'spread' ? 30 : 1,
  };

  // Card 2: framer-1mrqt1-container (Golden statue / card 2)
  const card2Animate = {
    x: variant === 'spread' ? 11 : variant === 'peek' ? 25.5 : 11,
    y: variant === 'spread' ? -117 : variant === 'peek' ? -10 : 31.5,
    rotate: variant === 'spread' ? 0 : variant === 'peek' ? 14 : 3,
    zIndex: variant === 'spread' ? 31 : 2,
  };

  // Card 3: framer-v64nxm-container (Golden hour / card 1)
  const card3Animate = {
    x: variant === 'spread' ? -118 : variant === 'peek' ? -0.5 : 11,
    y: variant === 'spread' ? -117 : variant === 'peek' ? 6 : 32.5,
    rotate: variant === 'spread' ? 0 : variant === 'peek' ? -10 : -3,
    zIndex: variant === 'spread' ? 30 : 3,
  };

  // Front flap rotateX
  const flapRotateX = variant === 'spread' ? -65 : variant === 'peek' ? -43 : 0;

  // Text color (turns Framer blue rgb(0, 88, 252) during peek variant)
  const textColor = variant === 'peek' ? 'rgb(0, 88, 252)' : 'rgb(255, 255, 255)';

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: scaledWidth,
        height: scaledHeight,
        zIndex: variant === 'spread' ? 50 : 1,
        ...style,
      }}
    >
      {/* 
        Scaled Wrapper: Scales the exact 149px × 158px Framer Canvas from top-left,
        ensuring it fits exactly inside the scaledWidth × scaledHeight bounding box.
      */}
      <div
        style={{
          width: 149,
          height: 158,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={`Keepsake folder ${folderTitle} ${folderBody}. ${variant === 'spread' ? 'Tap to close.' : 'Tap to open.'}`}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle(e);
            }
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotate: variant === 'spread' ? 0 : defaultRotation,
            y: variant === 'tucked' ? [0, -5, 0] : 0,
            opacity: variant === 'tucked' ? opacity : 1,
          }}
          transition={{
            rotate: keepsakeTransition,
            y: variant === 'tucked'
              ? { duration: 4.2 + scale * 2, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }
              : { duration: 0.3 },
            opacity: { duration: 0.3 },
          }}
          className="w-[149px] h-[158px] cursor-pointer outline-none relative"
          style={{
            transformOrigin: 'center center',
            perspective: 1200,
          }}
        >
        {/* ============================================================
            1. FROSTED GLASS BACK POCKET FLAP (framer-dpyfmh)
            ============================================================ */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-[110px] pointer-events-none rounded-[5px]"
          style={{
            backdropFilter: 'blur(7px)',
            WebkitBackdropFilter: 'blur(7px)',
            background:
              'linear-gradient(180deg, rgba(212, 212, 212, 0.48) 0%, rgba(0, 0, 0, 0.23) 51.7241%, rgba(0, 0, 0, 0.26) 100%)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
          }}
        />

        {/* ============================================================
            2. THREE TUCKED CARDS (FlipCards)
            ============================================================ */}
        {/* Card 1 (Back / Right in spread) */}
        <motion.div
          animate={card1Animate}
          transition={keepsakeTransition}
          className="absolute"
          style={{
            width: 127,
            height: 119,
          }}
        >
          <KeepsakeFlipCard
            image={cardList[0].image}
            text={cardList[0].text}
            isSpread={variant === 'spread'}
            isFlipped={!!flippedCards[0]}
            onFlip={() => toggleFlip(0)}
          />
        </motion.div>

        {/* Card 2 (Middle / Center in spread) */}
        <motion.div
          animate={card2Animate}
          transition={keepsakeTransition}
          className="absolute"
          style={{
            width: 127,
            height: 119,
          }}
        >
          <KeepsakeFlipCard
            image={cardList[1].image}
            text={cardList[1].text}
            isSpread={variant === 'spread'}
            isFlipped={!!flippedCards[1]}
            onFlip={() => toggleFlip(1)}
          />
        </motion.div>

        {/* Card 3 (Front / Left in spread) */}
        <motion.div
          animate={card3Animate}
          transition={keepsakeTransition}
          className="absolute"
          style={{
            width: 127,
            height: 119,
          }}
        >
          <KeepsakeFlipCard
            image={cardList[2].image}
            text={cardList[2].text}
            isSpread={variant === 'spread'}
            isFlipped={!!flippedCards[2]}
            onFlip={() => toggleFlip(2)}
          />
        </motion.div>

        {/* ============================================================
            3. FROSTED GLASS FRONT POCKET FLAP (framer-k524rs)
            ============================================================ */}
        <motion.div
          aria-hidden="true"
          animate={{
            rotateX: flapRotateX,
          }}
          transition={keepsakeTransition}
          className="absolute bottom-0 left-0 right-0 h-[110px] pointer-events-none rounded-[5px] overflow-hidden z-20"
          style={{
            backdropFilter: 'blur(7px)',
            WebkitBackdropFilter: 'blur(7px)',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(0, 0, 0, 0.25) 100%)',
            transformOrigin: '50% 100%',
            transformPerspective: 1200,
          }}
        >
          {/* Bottom-Left Typography (framer-1o1wg26) */}
          <div className="absolute bottom-[7px] left-[5px] flex flex-col gap-[1px] select-none pointer-events-none">
            <motion.span
              animate={{ color: textColor }}
              transition={{ duration: 0.2 }}
              className="text-[12px] leading-[14px] font-light tracking-tight"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
              }}
            >
              {folderTitle}
            </motion.span>
            <motion.span
              animate={{ color: textColor }}
              transition={{ duration: 0.2 }}
              className="text-[9px] leading-[11px] font-extralight tracking-tight"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 200,
              }}
            >
              {folderBody}
            </motion.span>
          </div>

          {/* Sticker 1: Bunny with headphones (framer-6tn3ig) */}
          <img
            src="/assets/bloom/folder-sticker-bunny.png"
            alt="bunny sticker"
            className="absolute bottom-[36px] right-[46px] h-[27px] w-auto object-contain pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            style={{
              transform: 'rotate(-24deg)',
            }}
          />

          {/* Sticker 2: Four-leaf clover (framer-vrywa5) */}
          <img
            src="/assets/bloom/folder-sticker-clover.png"
            alt="clover sticker"
            className="absolute bottom-[9px] right-[14px] h-[31px] w-auto object-contain pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            style={{
              transform: 'rotate(19deg)',
            }}
          />
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}
