import React from "react";
import { NotePencil, Check } from "@phosphor-icons/react";
import "./TertiaryLiquidGlassButton.css";

export default function TertiaryLiquidGlassButton({ label = "Edit", onClick, isEditing = false, className = "" }) {
  return (
    <button
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
    </button>
  );
}
