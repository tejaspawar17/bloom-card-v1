import "./LiquidGlassIconButton.css";

export default function LiquidGlassIconButton({
  label,
  onClick,
  icon,
  className = "",
  size = "md",
  ...rest
}) {
  const ariaLabel = rest['aria-label'] || label || "Action";
  return (
    <button
      type="button"
      className={`liquid-glass-icon-button ${size === 'sm' ? 'liquid-glass-icon-button--sm' : size === 'lg' ? 'liquid-glass-icon-button--lg' : ''} ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
      {...rest}
    >
      <span className="liquid-glass-icon-button__glass">
        {icon || <img src="/assets/dae45.svg" alt="" />}
      </span>
    </button>
  );
}
