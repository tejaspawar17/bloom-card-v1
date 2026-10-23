# Bloom Card — Project Handoff & Architecture Guide

## 1. Project Architecture & Visual Rules
- **Stack:** React 19, Vite, Tailwind CSS v4, Framer Motion, and HeroUI / Base UI primitives.
- **Design Aesthetic:** Dark Apple-style glassmorphism with high-end tactility:
  - Deep dark surfaces (`rgba(14, 16, 15, 0.80)`, `backdrop-blur-[24px]`).
  - Subtle concentric borders (`border-white/10`, `border-white/5`).
  - Fluid spring physics (`type: "spring", stiffness: 280, damping: 22, mass: 0.9`).
  - Authentic multi-layer aura glow behind windows (`figma-aura-gradient blur-[10px]` + `bg-black/60 blur-[10px]`).
- **Zero CSS Zoom:** Standard CSS breakpoints and viewport-adaptive units only. The `style={{ zoom }}` property is strictly forbidden.

---

## 2. Completed Layout & Responsive State (Commit `afa9dff`)
A rock-solid 2-tier responsive token architecture is in place, calibrated for compact laptops (`1024x575`) up through large desktop displays (`1440x900+`):

### Outer Windows & Center Stage
- **Outer Sidebar Windows:** Locked to `w-[304px] xl:w-[380px] 2xl:w-[402px] flex-shrink-0 select-none`.
- **Studio Layout (`DesignPage.jsx`):** 3-column grid (`grid-cols-[auto_1fr_auto]`) with `gap-3 xl:gap-8 px-3 xl:px-8 pt-1 lg:pt-1.5 xl:pt-6 pb-1`.
- **Center Stage & Card (`CardViewer.jsx`):** 
  - Dynamic width clamp: `w-[min(315px,calc((100vh-185px)*688/960))] xl:w-[360px] 2xl:w-[380px]` with `aspect-[688/960]`.
  - On $1024 \times 575$: Resolves to $280\text{px}$ width ($390\text{px}$ height), ensuring the blue `Confirm` button is 100% visible above the fold with $>20\text{px}$ breathing room and zero page scrolling.
  - Floating controls: Left vertical switcher (`44px`) and right action buttons (Eye, Flip, $44\text{px}$) fit within $1024\text{px}$ without overlapping side panels.

### Internal Card Grids (`LeftPanel.jsx`, `RightPanel.jsx`, `WindowSelectBackImage.jsx`)
- **Card Item Geometry:** `w-[60px] h-[82px] xl:w-[66px] xl:h-[90px]` with $60\text{px}$ ($66\text{px}$) thumbnails and $+3\text{px}$ selection squircle overhang (`w-[66px] xl:w-[72px] -left-[3px]`).
- **4-Column Grid Width & Gap:** `gap-x-2.5 xl:gap-x-3.5` ($10\text{px}$ gap on compact), giving an exact grid width of $4 \times 60\text{px} + 3 \times 10\text{px} = 270\text{px}$.
- **Gutter Clearance & Centering:** 
  - `LeftPanel.jsx` & `RightPanel.jsx`: `pl-[14px] pr-[20px]`. Leaves a dedicated $20\text{px}$ right gutter so the $6\text{px}$ scrollbar rail never collides with column 4 (`Parijat`, `Sunflower`, `Igor`).
  - `WindowSelectBackImage.jsx`: Symmetric `px-[17px]` ($17 + 270 + 17 = 304\text{px}$) for optical centering.
- **Top Squircle Clearance:** Scrollable content wrappers have `pt-2.5 pb-4` ($10\text{px}$ top breathing room) so the top row's blue selection ring (`Blond`, `Parijat`, `Default 1`) is never clipped.
- **Scrollbar Track (`scroll-area.jsx`):** Vertical scrollbar is `w-1.5` ($6\text{px}$) positioned at `right-1.5` (`6px` from right window edge), completely clear of the content area.
- **Bottom Fade Mask:** Soft, subtle pointer-events-none gradient (`h-6 bg-gradient-to-t from-[#141414]/90 to-transparent right-[16px] bottom-0`) with zero `backdrop-blur`.

---

## 3. Next Pending Milestones

### Milestone 1: Recipient Route (`/view`) with Base64 URL Encoding
- Build a lightweight recipient mode reachable via `/view?card=<base64>` or `?preview=recipient`.
- Encode card configuration (occasion, flower, pokemon, message, custom image, stickers) into URL-safe Base64 state so users can test and share unique card links without backend dependency.
- Provide clean, read-only recipient view with immediate access to unboxing/revealing.

### Milestone 2: 4-Stage "FIFA / Pokémon Pack Reveal" Experience
- Implement interactive Framer Motion state machine:
  1. `idle`: Mystery foil pack resting on dark studio stage with wax seal / pull tab.
  2. `charging`: User press/hold triggers energy buildup, tactile foil shake, and glowing particles.
  3. `flashing`: Wax seal pops, foil tears open, screen flashes with chromatic light burst.
  4. `revealed`: Card slams face-down onto surface with heavy tactile thud, ready to be flipped and inspected.
- Floating glass dock with `Flip Card` and `Replay Unboxing` controls.

---

## 4. Strict Coding Constraints & Rules
- **DO NOT USE CSS `zoom`:** Never introduce `zoom: 0.9` or similar non-standard zoom properties. All responsive sizing must rely on Tailwind breakpoints (`xl:`, `2xl:`) and CSS math (`calc`, `min`, `clamp`).
- **PRESERVE LOCKED TOKENS:** Do NOT change window widths (`304px` / `380px` / `402px`), grid gaps (`gap-x-2.5`), or padding (`pl-[14px] pr-[20px]`) without explicit approval.
- **DO NOT TOUCH UNRELATED LAYOUT FILES:** When working on specific feature components or modals, never modify unrelated studio layout files (`DesignPage.jsx`, `FigmaWindow.jsx`, `OccasionPicker.jsx`).
- **NO EXTRA BACKPLATES:** Do not insert artificial solid container `div`s inside `FigmaWindow.jsx`. Respect the authentic Figma layer hierarchy.
