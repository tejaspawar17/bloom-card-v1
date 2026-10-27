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
    const stickerWidth = stickerData.stickerId === "cmiygl" ? 176 : 144;
    const stickerHeight = stickerWidth;

    // Clamp position so sticker stays on card and never overlaps the top segmented control
    const clampedX = Math.max(-stickerWidth * 0.4, Math.min(cardWidth - stickerWidth * 0.6, stickerData.x + info.offset.x));
    const clampedY = Math.max(4, Math.min(cardHeight - stickerHeight * 0.6, stickerData.y + info.offset.y));

    dispatch({
      type: 'UPDATE_STICKER_POS',
      payload: { 
        id: stickerData.id, 
        pos: { x: clampedX, y: clampedY } 
      }
    });
  };

  const startRotation = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
    
    if (!stickerRef.current) return;
    
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

    const onUp = () => {
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

  const imageUrl = STICKERS.find(s => s.id === stickerData.stickerId)?.image;
  if (!imageUrl) return null;

  return (
    <motion.div 
      ref={stickerRef}
      className={"absolute pointer-events-auto top-0 left-0 " + (stickerData.stickerId === "cmiygl" ? "w-44 h-44" : "w-36 h-36") + " z-40 " + (isEditingSticker ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer')}
      drag={isEditingSticker}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{ rotate }}
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

      <div className="w-full h-full relative" onPointerDown={(e) => { if (isEditingSticker) dragControls.start(e); }}>
        <img src={imageUrl} alt="Sticker" className="w-full h-full object-contain pointer-events-none select-none" draggable={false} />
      </div>
      
      <AnimatePresence>
        {isEditingSticker && (
          <>
            {/* Option A: Inward Frosted Dashed Bounding Box (Never protrudes outside sticker bounds) */}
            <motion.div
              key="bounding-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 rounded-[18px] border-2 border-dashed border-white/50 shadow-[0_0_12px_rgba(255,255,255,0.15)] pointer-events-none z-30"
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

            {/* Option A: Check Button (Confirm) — Inset at Top-Left */}
            <motion.button 
              key="check-handle"
              type="button"
              aria-label="Confirm sticker placement"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingSticker(false);
              }}
              className="absolute top-1.5 left-1.5 w-7 h-7 rounded-full bg-[#0088FF] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,136,255,0.5)] border border-white/50 cursor-pointer z-40 outline-none"
            >
              <Check size={14} weight="bold" />
            </motion.button>

            {/* Option A: Delete Button (X) — Inset at Top-Right */}
            <motion.button 
              key="delete-handle"
              type="button"
              aria-label="Delete sticker"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'REMOVE_STICKER', payload: stickerData.id });
              }}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-[0_2px_8px_rgba(220,38,38,0.5)] border border-white/50 cursor-pointer z-40 outline-none hover:bg-red-500"
            >
              <X size={13} weight="bold" />
            </motion.button>

            {/* Option A: Rotation Handle — Inset at Bottom-Center */}
            <motion.button 
              key="rotate-handle"
              type="button"
              aria-label="Rotate sticker"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onPointerDown={startRotation}
              className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#1A1A1A]/95 text-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.6)] border border-white/30 cursor-grab active:cursor-grabbing z-40 outline-none hover:bg-neutral-800"
            >
              <ArrowsClockwise size={14} weight="bold" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
