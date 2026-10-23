import React from "react";
import { NotePencil, Check } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import "./TertiaryLiquidGlassButton.css";

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 1
};

export default function TertiaryLiquidGlassButton({ label = "Edit", onClick, isEditing = false, className = "" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={springTransition}
      type="button"
      className={`tertiary-liquid-glass-button ${className}`}
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
    >
      <span className="tertiary-liquid-glass-button__glass">
        {isEditing ? (
          <Check size={32} color="#ffffff" weight="regular" />
        ) : (
          <NotePencil size={32} color="#ffffff" weight="regular" />
        )}
      </span>
    </motion.button>
  );
}
