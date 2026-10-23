import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import "./VerticalCardSelector.css";

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 1
};

export default function VerticalCardSelector({
  "aria-label": ariaLabel = "Choose a card image",
  className = "",
  defaultValue = "pokemon",
  onValueChange,
  value,
  segments = [],
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

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % segments.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
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
      className={`vertical-glass-segmented-control ${className}`}
      role="radiogroup"
    >
      <div className="vertical-glass-segmented-control__track">
        {segments.map((segment, index) => {
          const isSelected = segment.value === selectedValue;
          return (
            <motion.button
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              key={segment.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={segment.label}
              className="vertical-glass-tab relative"
              onClick={() => select(segment.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              tabIndex={isSelected ? 0 : -1}
            >
              {isSelected && (
                <motion.div
                  layoutId="vertical-segmented-bg"
                  className="absolute inset-0 rounded-[100px] bg-[#3a3a3c] pointer-events-none"
                  transition={springTransition}
                />
              )}
              <div className="vertical-glass-tab__content z-10 relative">
                {segment.icon ? (
                  <span className={`flex items-center justify-center transition-opacity opacity-100`}>
                    {segment.icon}
                  </span>
                ) : (
                  <img
                    alt=""
                    className="vertical-glass-tab__image"
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
