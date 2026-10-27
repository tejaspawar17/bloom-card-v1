import React, { useMemo } from 'react';

/**
 * Gradient Palettes for AnimatedAILoaderFX
 * - framer: Exact Framer Marketplace purple/violet palette (used for site preloader)
 * - bloom: Bespoke Bloom emerald/forest/solar-gold palette (used for Card Reveal)
 */
export const LOADER_PALETTES = {
  framer: {
    colorLight: "#ffffff",
    colorMid: "#ad5fff",
    colorDark: "#471eec",
    colorMidAlt: "#d60a47",
    colorDarkAlt: "#311e80",
  },
  bloom: {
    colorLight: "#ffffff",
    colorMid: "#86B75A",
    colorDark: "#132013",
    colorMidAlt: "#CFC531",
    colorDarkAlt: "#4F793E",
  },
};

/**
 * AnimatedAILoaderFX
 * Exact component from Framer Marketplace:
 * https://framer.com/m/AnimatedAILoaderFX-ScAzDC.js@qaIw0VNDi8FmQK9IacAM
 * 
 * Features:
 * - Dual-phase rotating gradient box-shadow orb with switchable palettes ('framer' | 'bloom')
 * - Staggered letter-by-letter wave animation on "Generating"
 * - Supports custom children override (e.g. Reveal button)
 */
export default function AnimatedAILoaderFX(props) {
  const {
    palette = "framer",
    text = "Generating",
    size = 180,
    font = {
      fontFamily: '"Inter", sans-serif',
      fontSize: 19,
      fontWeight: 300,
    },
    textColor = "#ffffff",
    animationDuration = 2,
    letterDelay = 0.1,
    children,
    className = "",
    style = {},
  } = props;

  const activePalette = LOADER_PALETTES[palette] || LOADER_PALETTES.framer;
  const colorLight = props.colorLight || activePalette.colorLight;
  const colorMid = props.colorMid || activePalette.colorMid;
  const colorDark = props.colorDark || activePalette.colorDark;
  const colorMidAlt = props.colorMidAlt || activePalette.colorMidAlt;
  const colorDarkAlt = props.colorDarkAlt || activePalette.colorDarkAlt;

  const letters = useMemo(() => (text ? text.split("") : []), [text]);
  const keyframeId = useMemo(
    () => `loader-rotate-${Math.random().toString(36).substr(2, 9)}`,
    []
  );
  const letterKeyframeId = useMemo(
    () => `letter-anim-${Math.random().toString(36).substr(2, 9)}`,
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
    @keyframes ${letterKeyframeId} {
      0%, 100% {
        opacity: 0.4;
        transform: translateY(0);
      }
      20% {
        opacity: 1;
        transform: scale(1.15);
      }
      40% {
        opacity: 0.7;
        transform: translateY(0);
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
    ...font,
    color: textColor,
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

  const getLetterStyle = (index) => ({
    display: "inline-block",
    opacity: 0.4,
    transform: "translateY(0)",
    animation: `${letterKeyframeId} ${animationDuration}s infinite`,
    animationDelay: `${index * letterDelay}s`,
    zIndex: 1,
    borderRadius: "50ch",
    border: "none",
  });

  return (
    <div style={wrapperStyle} className={className}>
      <style>{keyframes}</style>
      <div style={loaderStyle} />
      {children ||
        letters.map((letter, index) => (
          <span key={index} style={getLetterStyle(index)}>
            {letter}
          </span>
        ))}
    </div>
  );
}
