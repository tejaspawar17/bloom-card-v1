---
name: heroui-design-system
description: HeroUI component library architecture, dark-mode glass surfaces, gradient scroll masks, chip systems, and Apple HIG design tokens adapted for the Bloom Card studio. Use when designing, styling, refactoring, or auditing UI components, windows, chips, forms, scroll areas, and micro-interactions.
---

# HeroUI Design System for Bloom Card

This skill encodes the design system rules, component anatomy, surface hierarchy, and styling techniques derived from **HeroUI** (formerly NextUI) and adapted specifically for the **Bloom Card** studio.

HeroUI provides the bridge between **Apple Human Interface Guidelines (HIG)** and **modern React / Tailwind CSS web development**, delivering dark-mode-first translucent materials, concentric squircle geometry, masked gradient blurs, and tactile interactive states.

---

## 1. Surface & Translucency Hierarchy

HeroUI organizes interfaces into stacked depth layers using backdrop filters, calibrated alphas, and gradient stroke bevels:

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: Pure Deep Canvas (#000000)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Level 1: Outer Glass Window (.figma-window)           │  │
│  │ rgba(10, 12, 11, 0.96) | blur(30px) saturate(180%)    │  │
│  │ Radius: 28px | Aura Gradient Glow Backplate           │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Level 2: Inner Panel Surface (.figma-inner-panel)│  │  │
│  │  │ rgba(14, 16, 15, 0.80) | blur(24px)             │  │  │
│  │  │ Radius: 20px | Concentric Bevel Mask            │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │ Level 3: Header Bar (.figma-panel-header) │  │  │  │
│  │  │  │ rgba(22, 25, 23, 0.75) | blur(16px)      │  │  │  │
│  │  │  │ Border-bottom: 0.5px solid rgba(white, 0.1)│  │  │
│  │  │  ├───────────────────────────────────────────┤  │  │  │
│  │  │  │ Level 4: Interactive Content Area         │  │  │  │
│  │  │  │ Cards / Chips / Thumbnails / Scroll Rails │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Exact Surface Tokens

```css
/* Outer Window Container */
.figma-window {
  background: rgba(10, 12, 11, 0.96);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.12);
}

/* Inner Panel Surface */
.figma-inner-panel {
  background: rgba(14, 16, 15, 0.80);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 -1px 2px rgba(0, 0, 0, 0.3);
}

/* Panel Header */
.figma-panel-header {
  background: rgba(22, 25, 23, 0.75);
  backdrop-filter: blur(16px) saturate(130%);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.10);
}
```

---

## 2. HeroUI Concentric Bevels (CSS Mask Exclusions)

HeroUI achieves crisp, high-end Apple-style gradient borders without clipping inner content by using CSS mask composites:

```css
/* Inner Panel Gradient Bevel */
.figma-inner-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 0.5px; /* Stroke thickness */
  background: linear-gradient(
    160deg, 
    rgba(255, 255, 255, 0.18) 0%, 
    rgba(255, 255, 255, 0.04) 50%, 
    rgba(255, 255, 255, 0.08) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 20;
}
```

---

## 3. HeroUI Frosted Edge Scroll Mask Technique

Derived from HeroUI's [AvatarGroup](https://heroui.com/en/docs/react/components/avatar-group) scroll-fade architecture. Instead of placing a flat gradient overlay that blocks text clarity, combine `backdrop-filter`, a dark tint, and a CSS mask gradient to create a natural optical vanishing edge:

### Top Edge Mask (Activates when `scrollTop > 4`):
```jsx
<div
  className={cn(
    "absolute top-0 left-0 right-[10px] h-[20px] pointer-events-none rounded-t-[12px] z-20 transition-opacity duration-200",
    canScrollUp ? "opacity-100" : "opacity-0"
  )}
  style={{
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    background: 'linear-gradient(to bottom, rgba(14, 16, 15, 0.85) 0%, rgba(14, 16, 15, 0.25) 60%, transparent 100%)',
    maskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)',
  }}
/>
```

### Bottom Edge Mask (Activates when `scrollTop + clientHeight < scrollHeight - 6`):
```jsx
<div
  className={cn(
    "absolute bottom-0 left-0 right-[10px] h-[24px] pointer-events-none rounded-b-[12px] z-20 transition-opacity duration-200",
    canScrollDown ? "opacity-100" : "opacity-0"
  )}
  style={{
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    background: 'linear-gradient(to top, rgba(14, 16, 15, 0.90) 0%, rgba(14, 16, 15, 0.30) 60%, transparent 100%)',
    maskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 100%)',
  }}
/>
```

### Golden Rule of Scrollbar Placement:
- The blur **MUST** stop before the scrollbar track: `left-0 right-[10px]`.
- The panel body **MUST** use asymmetric padding: `pl-[18px] pr-1`.
- The scrollbar rail lives in the `pr-1` right padding gutter outside the grid.
- **Never** stretch the blur across the full container width (`w-full`) when a scrollbar is present.

---

## 4. HeroUI Interactive Chip System (`OccasionPicker`)

Reference: [HeroUI Chip](https://heroui.com/docs/components/chip)

### Anatomy:
- Full capsule radius: `rounded-full` (`border-radius: 9999px`).
- Leading emoji / icon: calibrated size (`w-3 h-3` or `w-3.5 h-3.5`).
- Trailing label text: optical tracking.

### States & Styles:
- **Default / Inactive**:
  - Background: `rgba(114, 114, 114, 0.08)`
  - Border: `1px solid rgba(255, 255, 255, 0.08)`
  - Top highlight: `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.08)`
  - Text: `rgba(229, 229, 234, 0.70)`
- **Hover**:
  - Background: `rgba(153, 153, 153, 0.15)`
  - Text: `#FFFFFF`
- **Active / Selected**:
  - Background: `rgba(37, 99, 235, 0.35)` (HeroUI Primary Tint)
  - Border: `1px solid #3b82f6` (HeroUI Blue)
  - Outer Glow: `box-shadow: 0 0 10px rgba(59, 130, 246, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.30)`
  - Text: `#FFFFFF font-semibold`
- **Tap State (Tactile Spring)**:
  - `active:scale-[0.96]` with spring transition (`stiffness: 400, damping: 25`).

---

## 5. HeroUI Selection Highlight Geometry

When an item (Flower card, Sticker card, Back image) is selected in a grid:

- **Concentric Inner/Outer Radii Rule**:
  $$\text{Outer Radius} = \text{Inner Radius} + \text{Padding/Offset}$$
  - Thumbnail Squircle: `rounded-[12px]`
  - Outer Blue Highlight: `rounded-[15px]`
- **Geometry Offset**:
  - `absolute -top-[0px] -left-[3px]`
  - Outer box is `6px` wider than inner thumbnail:
    - Laptop: Thumbnail `44x44px` $\rightarrow$ Selection Box `50x64px`
    - Desktop: Thumbnail `59x59px` $\rightarrow$ Selection Box `65x82px`
- **Color Tokens**:
  - Selected: `#0088FF` (HeroUI Vibrant Blue)
  - Hover: `rgba(255, 255, 255, 0.08)`
  - Default: `transparent`

---

## 6. Optical Typography Mapping (SF Pro on Inter)

HeroUI adopts Apple's optical sizing curve. In Bloom Card, map SF Pro tokens directly onto Inter:

| Role | Font Size | Line Height | Letter Spacing | Weight | Tailwind Class |
|---|---|---|---|---|---|
| **Title 2** | `20px` | `25px` | `-0.013em` | Bold 700 | `text-[20px] leading-[25px] tracking-[-0.013em] font-bold` |
| **Headline** | `17px` | `22px` | `-0.0253em` | SemiBold 600 | `text-[17px] leading-[22px] tracking-[-0.0253em] font-semibold` |
| **Body** | `17px` | `22px` | `-0.0253em` | Regular 400 | `text-[17px] leading-[22px] tracking-[-0.0253em] font-normal` |
| **Subheadline** | `13px` | `18px` | `-0.0177em` | Regular 400 | `text-[13px] leading-[18px] tracking-[-0.0177em] font-normal` |
| **Footnote** | `13px` | `18px` | `-0.0062em` | Regular 400 | `text-[13px] leading-[18px] tracking-[-0.0062em] font-normal` |
| **Caption 2** | `11px` | `13px` | `+0.0055em` | Regular 400 / 600 | `text-[11px] leading-[13px] tracking-[0.0055em]` |
| **Micro** | `10px` | `12px` | `+0.0050em` | Regular 400 | `text-[10px] leading-[12px] tracking-[0.005em]` |

*Note: As font size decreases, tracking MUST increase positively (+0.0055em) to preserve legibility in dark mode.*

---

## 7. HeroUI Liquid Glass Buttons & Modals

### Liquid Glass Button (`LiquidGlassButton.jsx`):
- Backdrop: `backdrop-filter: blur(20px)`
- Border: `1px solid rgba(255, 255, 255, 0.15)`
- Shadow: `0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
- Tap interaction: `whileTap={{ scale: 0.94 }}`

### Modals & Dialogs (`WindowModal.jsx`):
- **Scrim**: `background: rgba(0, 0, 0, 0.75)`, `backdrop-filter: blur(16px)`
- **Modal Window**: `rgba(20, 22, 21, 0.96)`, `backdrop-filter: blur(30px)`, `border-radius: 28px`
- **Form Inputs**: `bg-black/60 border border-white/20 rounded-xl p-3 text-xs text-white focus:border-blue-400 outline-none`

---

## 8. Viewport Sizing & Responsive Rules

HeroUI components adapt dynamically between compact laptop screens and large desktop monitors:

| Element | Laptop Viewport (`~1024px` width) | Desktop Viewport (`≥1280px` width) |
|---|---|---|
| **Outer Window Width** | `w-[280px]` (Inner `260px`) | `xl:w-[360px] 2xl:w-[402px]` |
| **Center Card Width** | `w-[216px]` (Height `301px`) | `xl:w-[280px]` to `xl:w-[320px]` |
| **Left / Right Gutters** | `~100px - 110px` (Clean clearance) | `~120px - 150px` |
| **Thumbnail Dimensions** | `44x44px` (Card `44x64px`) | `59x59px` (Card `59x82px`) |
| **Flower Panel Height** | `h-[190px]` (Shows 2 rows + peek) | `xl:h-[246px]` |
| **Sticker Panel Height** | `h-[120px]` (Shows 1 row + peek) | `xl:h-[150px]` |
| **Window Vertical Gap** | `gap-[14px]` | `xl:gap-[28px]` |
| **Occasion Chip Height** | `min-h-[22px] px-2 text-[10.5px]` | `min-h-[29px] px-2.5 text-[12px]` |

### Golden Heuristic:
Never allow the combined width of Left Panel + Right Panel + Center Card + Minimum Gutters (200px) to exceed the viewport width. Use responsive clamps and Tailwind breakpoints (`xl:`) to maintain balanced gutters on all screen scales.
