import "./LiquidGlassIconButton.css";

export default function LiquidGlassIconButton({
  label = "Preview",
  onClick,
  icon,
  className = "",
  size = "md",
  ...rest
}) {
  return (
    <button
      type="button"
      className={`liquid-glass-icon-button ${size === 'sm' ? 'liquid-glass-icon-button--sm' : size === 'lg' ? 'liquid-glass-icon-button--lg' : ''} ${className}`}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="liquid-glass-icon-button__glass">
        {icon || <img src="/assets/dae45.svg" alt="" />}
      </span>
    </button>
  );
}
