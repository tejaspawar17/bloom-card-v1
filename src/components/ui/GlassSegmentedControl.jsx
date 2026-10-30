import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./GlassSegmentedControl.css";

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 1
};

export default function GlassSegmentedControl({
  "aria-label": ariaLabel = "Choose a card image",
  className = "",
  defaultValue = "pokemon",
  onValueChange,
  value,
  segments = [],
  layoutId = "segmented-bg",
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const buttonRefs = useRef([]);
  const selectedValue = value ?? internalValue;

  function select(nextValue) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  function handleKeyDown(event, index) {
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % segments.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + segments.length) % segments.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = segments.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextValue = segments[nextIndex].value;
    select(nextValue);
    buttonRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      aria-label={ariaLabel}
      className={`glass-segmented-control ${className}`}
      role="radiogroup"
    >
      <div className="glass-segmented-control__glass" />
      <div className="glass-segmented-control__track">
        {segments.map((segment, index) => {
          const isSelected = segment.value === selectedValue;
          return (
            <motion.button
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              key={segment.slotKey ?? segment.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={segment.label}
              className="glass-tab relative"
              onClick={() => select(segment.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              tabIndex={isSelected ? 0 : -1}
            >
              {isSelected && (
                <motion.div 
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-[100px] bg-[#3a3a3c] pointer-events-none"
                  transition={springTransition}
                />
              )}
              <div className={`glass-tab__content z-10 relative ${segment.icon ? "glass-tab__content--icon" : ""}`}>
                {segment.icon ? (
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={segment.iconKey ?? segment.value}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        isSelected ? "text-white" : "text-white/75"
                      }`}
                    >
                      {segment.icon}
                    </motion.span>
                  </AnimatePresence>
                ) : (
                  <img
                    alt=""
                    className="glass-tab__image"
                    src={segment.image}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
