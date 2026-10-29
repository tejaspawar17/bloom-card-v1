import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence, useMotionValue } from 'framer-motion';
import { Check, ArrowsClockwise, X } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';
import { STICKERS } from '@/data/cardData';
import StampDustParticles from '@/components/ui/StampDustParticles';

export function DraggableSticker({ stickerData }) {
  const { dispatch } = useCard();
  const [isEditingSticker, setIsEditingSticker] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [landKey, setLandKey] = useState(0);
  const stickerRef = useRef(null);
  const dragControls = useDragControls();

  // Zero-latency direct GPU rotation via Framer MotionValue (0 React re-renders during drag)
  const rotate = useMotionValue(stickerData.r || 0);
  const latestRotationRef = useRef(stickerData.r || 0);
  const degreeTextRef = useRef(null);

  // Two-touch / two-thumb gesture rotation tracking (No scaling)
  const twoTouchRef = useRef({
    active: false,
    startAngle: 0,
    initialRot: 0,
  });

  // Sync motion value when sticker rotation changes externally or on load
  useEffect(() => {
    rotate.set(stickerData.r || 0);
    latestRotationRef.current = stickerData.r || 0;
  }, [stickerData.r, rotate]);

  // Tactile "slap on card" animation on initial spawn
  useEffect(() => {
    setIsEditingSticker(true);
    // Fire land dust and trigger shadow compaction
    const timer = setTimeout(() => {
      setHasLanded(true);
      setLandKey(Date.now());
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  // Click outside sticker on card auto-commits / dismisses handles
  useEffect(() => {
    if (!isEditingSticker) return;
    const handlePointerDownOutside = (e) => {
      if (stickerRef.current && !stickerRef.current.contains(e.target)) {
        setIsEditingSticker(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDownOutside);
    return () => window.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [isEditingSticker]);

  const handleDragEnd = (event, info) => {
    setLandKey(Date.now());
    const cardWidth = stickerRef.current?.parentElement?.clientWidth || 360;
    const cardHeight = stickerRef.current?.parentElement?.clientHeight || 500;
    const isCmiyglSticker = stickerData.stickerId === "cmiygl";
    const stickerWidth = stickerRef.current?.offsetWidth || (isCmiyglSticker ? 190 : 140);
    const stickerHeight = stickerRef.current?.offsetHeight || (isCmiyglSticker ? 108 : stickerWidth);

    // Clamp position so sticker stays on card and never overlaps the top segmented control
    const clampedX = Math.max(-stickerWidth * 0.4, Math.min(cardWidth - stickerWidth * 0.6, stickerData.x + info.offset.x));
    const clampedY = Math.max(8, Math.min(cardHeight - stickerHeight * 0.6, stickerData.y + info.offset.y));

    dispatch({
      type: 'UPDATE_STICKER_POS',
      payload: { 
        id: stickerData.id, 
        pos: { x: clampedX, y: clampedY } 
      }
    });
  };

  // 1-Finger/Mouse Rotation via Pointer Capture
  const startRotation = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
    
    if (!stickerRef.current) return;
    
    const target = e.currentTarget;
    try {
      target.setPointerCapture?.(e.pointerId);
    } catch (err) {}
    
    const rect = stickerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const initialRot = latestRotationRef.current;

    const onMove = (moveEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
      const delta = currentAngle - startAngle;
      const newRot = initialRot + delta;
      
      latestRotationRef.current = newRot;
      rotate.set(newRot);
      
      if (degreeTextRef.current) {
        degreeTextRef.current.textContent = `${Math.round(newRot)}°`;
      }
    };

    const onUp = (upEvent) => {
      try {
        target.releasePointerCapture?.(upEvent.pointerId);
      } catch (err) {}
      setIsRotating(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);

      dispatch({
        type: 'UPDATE_STICKER_POS',
        payload: { id: stickerData.id, pos: { r: latestRotationRef.current } }
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // Two-Thumb / Two-Finger Touch Rotation (Mobile Natural Gesture)
  const handleTouchStart = (e) => {
    if (!isEditingSticker) return;
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const angle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);
      twoTouchRef.current = {
        active: true,
        startAngle: angle,
        initialRot: latestRotationRef.current,
      };
      setIsRotating(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isEditingSticker) return;
    if (e.touches.length === 2 && twoTouchRef.current.active) {
      if (e.cancelable) e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentAngle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);
      const delta = currentAngle - twoTouchRef.current.startAngle;
      const newRot = twoTouchRef.current.initialRot + delta;

      latestRotationRef.current = newRot;
      rotate.set(newRot);

      if (degreeTextRef.current) {
        degreeTextRef.current.textContent = `${Math.round(newRot)}°`;
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (twoTouchRef.current.active && e.touches.length < 2) {
      twoTouchRef.current.active = false;
      setIsRotating(false);
      dispatch({
        type: 'UPDATE_STICKER_POS',
        payload: { id: stickerData.id, pos: { r: latestRotationRef.current } }
      });
    }
  };

  const imageUrl = STICKERS.find(s => s.id === stickerData.stickerId)?.image;
  if (!imageUrl) return null;

  const isCmiygl = stickerData.stickerId === "cmiygl";
  const isAlbum = ["igor", "blond", "sos", "pink_floyd", "brat"].includes(stickerData.stickerId);
  const isApples = stickerData.stickerId === "apples";

  let sizeClass = "w-[clamp(118px,40cqw,154px)] h-[clamp(118px,40cqw,154px)]";
  if (isCmiygl) {
    // Landscape passport ticket ratio (~1.9:1)
    sizeClass = "w-[clamp(168px,54cqw,215px)] h-[clamp(96px,31cqw,122px)]";
  } else if (isAlbum) {
    // Vinyl sleeve + peeking disc ratio (1.11:1)
    sizeClass = "w-[clamp(124px,42cqw,162px)] h-[clamp(112px,38cqw,146px)]";
  } else if (isApples) {
    // Apples quote badge (prominent hand lettering)
    sizeClass = "w-[clamp(122px,41cqw,158px)] h-[clamp(126px,42cqw,162px)]";
  }

  return (
    <motion.div 
      ref={stickerRef}
      className={`absolute pointer-events-auto top-0 left-0 ${sizeClass} z-40 ${isEditingSticker ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
      drag={isEditingSticker}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{ rotate }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      initial={{ 
        x: stickerData.x, 
        y: stickerData.y - 14, 
        scale: 1.28,
        filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.50))"
      }}
      animate={{ 
        x: stickerData.x, 
        y: stickerData.y,
        scale: 1,
        filter: hasLanded 
          ? "drop-shadow(0 2px 3px rgba(0,0,0,0.45))" 
          : "drop-shadow(0 14px 18px rgba(0,0,0,0.45))"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 480, 
        damping: 24,
        mass: 0.8
      }}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        if (!isEditingSticker) {
          e.stopPropagation();
          setIsEditingSticker(true);
        }
      }}
    >
      {/* Delicate tactile landing dust particles */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <StampDustParticles triggerKey={landKey} color="#FFD60A" />
      </div>

      <div 
        className="w-full h-full relative touch-none select-none" 
        onPointerDown={(e) => { 
          if (isEditingSticker && e.isPrimary) {
            dragControls.start(e); 
          }
        }}
      >
        <img src={imageUrl} alt="Sticker" className="w-full h-full object-contain pointer-events-none select-none" draggable={false} />
      </div>
      
      <AnimatePresence>
        {isEditingSticker && (
          <>
            {/* Inward Frosted Dashed Bounding Box */}
            <motion.div
              key="bounding-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 rounded-[16px] border-2 border-dashed border-white/50 shadow-[0_0_12px_rgba(255,255,255,0.15)] pointer-events-none z-30"
            />

            {/* Live Rotation Degree Readout in Center of Sticker */}
            {isRotating && (
              <motion.div
                key="degree-tooltip"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[#18191C]/95 backdrop-blur-md border border-white/25 text-[11px] font-bold text-white tracking-wider pointer-events-none z-50 shadow-2xl flex items-center gap-1 font-sans"
              >
                <span ref={degreeTextRef}>{Math.round(latestRotationRef.current)}°</span>
              </motion.div>
            )}

            {/* Check Button (Confirm) — Top-Left (38px Touch Target, 20px Icon) */}
            <motion.div
              key="check-handle"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute -top-3 -left-3 w-10 h-10 z-40 flex items-center justify-center pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button 
                type="button"
                aria-label="Confirm sticker placement"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingSticker(false);
                }}
                className="w-full h-full rounded-full bg-[#0088FF] hover:bg-[#0077EE] active:scale-95 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,136,255,0.45)] border-2 border-white/60 cursor-pointer outline-none transition-transform duration-100 ease-out flex-shrink-0"
              >
                <Check size={20} weight="bold" className="block shrink-0 pointer-events-none" />
              </button>
            </motion.div>

            {/* Delete Button (X) — Top-Right (38px Touch Target, 20px Icon) */}
            <motion.div
              key="delete-handle"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute -top-3 -right-3 w-10 h-10 z-40 flex items-center justify-center pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button 
                type="button"
                aria-label="Delete sticker"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'REMOVE_STICKER', payload: stickerData.id });
                }}
                className="w-full h-full rounded-full bg-[#EF4444] hover:bg-[#DC2626] active:scale-95 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(239,68,68,0.45)] border-2 border-white/60 cursor-pointer outline-none transition-transform duration-100 ease-out flex-shrink-0"
              >
                <X size={20} weight="bold" className="block shrink-0 pointer-events-none" />
              </button>
            </motion.div>

            {/* Rotation Handle — Bottom-Center (38px Touch Target, 20px Icon) */}
            <motion.div
              key="rotate-handle"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute -bottom-3 inset-x-0 mx-auto w-10 h-10 z-40 flex items-center justify-center pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button 
                type="button"
                aria-label="Rotate sticker"
                onPointerDown={startRotation}
                className="w-full h-full rounded-full bg-[#18191C]/95 hover:bg-neutral-800 active:scale-95 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.6)] border-2 border-white/60 cursor-grab active:cursor-grabbing outline-none transition-transform duration-100 ease-out flex-shrink-0 touch-none"
              >
                <ArrowsClockwise size={20} weight="bold" className="block shrink-0 pointer-events-none" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
