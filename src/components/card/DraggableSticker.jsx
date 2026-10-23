import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence, useMotionValue } from 'framer-motion';
import { Check, ArrowsClockwise, X } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';
import { STICKERS } from '@/data/cardData';

export function DraggableSticker({ stickerData }) {
  const { dispatch } = useCard();
  const [isEditingSticker, setIsEditingSticker] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
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

  // Automatically enter edit mode when newly added
  useEffect(() => {
    setIsEditingSticker(true);
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
    dispatch({
      type: 'UPDATE_STICKER_POS',
      payload: { 
        id: stickerData.id, 
        pos: { x: stickerData.x + info.offset.x, y: stickerData.y + info.offset.y } 
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
      // Direct GPU transform update via MotionValue (Instant 1:1 cursor tracking with 0 re-renders)
      rotate.set(newRot);
      
      // Update degree readout pill text directly in DOM
      if (degreeTextRef.current) {
        degreeTextRef.current.textContent = `${Math.round(newRot)}°`;
      }
    };

    const onUp = () => {
      setIsRotating(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);

      // Single commit to global context on release
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
      className={"absolute pointer-events-auto top-0 left-0 " + (stickerData.stickerId === "cmiygl" ? "w-44 h-44" : "w-36 h-36") + " z-40 drop-shadow-[2px_6px_8px_rgba(0,0,0,0.5)] " + (isEditingSticker ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer')}
      drag={isEditingSticker}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{ rotate }}
      initial={{ x: stickerData.x, y: stickerData.y }}
      animate={{ x: stickerData.x, y: stickerData.y }}
      transition={{ 
        x: { type: "spring", stiffness: 400, damping: 40 }, 
        y: { type: "spring", stiffness: 400, damping: 40 } 
      }}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        if (!isEditingSticker) {
          e.stopPropagation();
          setIsEditingSticker(true);
        }
      }}
    >
      <div className="w-full h-full relative" onPointerDown={(e) => { if (isEditingSticker) dragControls.start(e); }}>
        <img src={imageUrl} alt="Sticker" className="w-full h-full object-contain pointer-events-none select-none" draggable={false} />
      </div>
      
      <AnimatePresence>
        {isEditingSticker && (
          <>
            {/* Frosted Dashed Bounding Box */}
            <motion.div
              key="bounding-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-[-8px] rounded-[22px] border-2 border-dashed border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.12)] pointer-events-none z-30"
            />

            {/* Live Rotation Degree Readout */}
            {isRotating && (
              <motion.div
                key="degree-tooltip"
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#18191C]/95 backdrop-blur-md border border-white/25 text-[11px] font-bold text-white tracking-wider pointer-events-none z-50 shadow-2xl flex items-center gap-1 font-sans"
              >
                <span ref={degreeTextRef}>{Math.round(latestRotationRef.current)}°</span>
              </motion.div>
            )}

            {/* Check Button (Confirm) — Top */}
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
              className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#16171A]/90 backdrop-blur-md border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer pointer-events-auto z-50 text-white hover:text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-400/60 transition-colors outline-none"
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={(e) => { e.stopPropagation(); setIsEditingSticker(false); }}
            >
              <Check size={18} weight="regular" />
            </motion.button>
            
            {/* Rotate Button (Spin) — Right */}
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
              className="absolute top-1/2 right-[-20px] -translate-y-1/2 w-9 h-9 rounded-full bg-[#16171A]/90 backdrop-blur-md border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto z-50 text-white hover:text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400/60 transition-colors outline-none"
              onPointerDown={startRotation}
              onClick={(e) => e.stopPropagation()} 
            >
              <ArrowsClockwise size={18} weight="regular" />
            </motion.button>

            {/* Delete Button (Remove) — Bottom */}
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
              className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#16171A]/90 backdrop-blur-md border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer pointer-events-auto z-50 text-[#FF383C] hover:bg-[#FF383C]/25 hover:border-[#FF383C]/60 transition-colors outline-none"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsEditingSticker(false); 
                dispatch({ type: 'REMOVE_STICKER', payload: stickerData.id });
              }}
            >
              <X size={18} weight="regular" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
