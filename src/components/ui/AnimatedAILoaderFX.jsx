import React, { useMemo } from 'react';

/**
 * AnimatedAILoaderFX
 * Exact component from Framer Marketplace (by DiverseKit)
 * https://www.framer.com/marketplace/components/animatedailoaderfx/
 * 
 * Text removed as requested, with support for children / Reveal button.
 */
export default function AnimatedAILoaderFX({
  size = 200,
  animationDuration = 2.5,
  // Bloom gradient palette
  colorLight = "#ffffff",
  colorMid = "#86B75A",
  colorDark = "#132013",
  colorMidAlt = "#CFC531",
  colorDarkAlt = "#4F793E",
  children,
  className = "",
  style = {},
}) {
  const keyframeId = useMemo(
    () => `loader-rotate-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const keyframes = `
    @keyframes ${keyframeId} {
      0% {
        transform: rotate(90deg);
        box-shadow:
          0 10px 20px 0 ${colorLight} inset,
          0 20px 30px 0 ${colorMid} inset,
          0 60px 60px 0 ${colorDark} inset;
      }
      50% {
        transform: rotate(270deg);
        box-shadow:
          0 10px 20px 0 ${colorLight} inset,
          0 20px 10px 0 ${colorMidAlt} inset,
          0 40px 60px 0 ${colorDarkAlt} inset;
      }
      100% {
        transform: rotate(450deg);
        box-shadow:
          0 10px 20px 0 ${colorLight} inset,
          0 20px 30px 0 ${colorMid} inset,
          0 60px 60px 0 ${colorDark} inset;
      }
    }
  `;

  const wrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: "transparent",
    userSelect: "none",
    ...style,
  };

  const loaderStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    backgroundColor: "transparent",
    animation: `${keyframeId} ${animationDuration}s linear infinite`,
    zIndex: 0,
    pointerEvents: "none",
  };

  return (
    <div style={wrapperStyle} className={className}>
      <style>{keyframes}</style>
      <div style={loaderStyle} />
      {children}
    </div>
  );
}
