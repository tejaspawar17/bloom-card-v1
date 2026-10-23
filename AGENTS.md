# Bloom Card — Agent Instructions & Operational Rules

> **Permanent Project Guidelines**: Every AI coding agent working in this repository must strictly follow the rules, architecture guidelines, and constraints documented below.

---

## 1. Project Context & Current State
- **Project Name:** Bloom Card — 3D Interactive Card Web Studio
- **Master Handoff & Architecture Baseline:** Consult [`HANDOFF.md`](./HANDOFF.md) for full architectural context, completed phases, and upcoming milestones up to commit `9965223`.
- **Core Technology Stack:** React 19, Tailwind CSS v4, Vite, Framer Motion, Base UI / HeroUI primitives, Lucide / Phosphor Icons.

---

## 2. Bundled Project Skills (`.agents/skills/`)
All skills are version-controlled and bundled directly in `.agents/skills/`. Agents should reference and activate them as follows:

| Skill | Path | When to Use |
| :--- | :--- | :--- |
| **HeroUI Design System** | [`.agents/skills/heroui-design-system`](./.agents/skills/heroui-design-system/SKILL.md) | **Default Active** for all UI, color token, glassmorphism, typography, and component layout tasks. |
| **Caveman Mode** | [`.agents/skills/caveman`](./.agents/skills/caveman/SKILL.md) | **Active on request** (triggered by `/caveman` or when user requests direct, blunt, minimal-fluff responses). |
| **Apple Design Guidelines** | [`.agents/skills/apple-design`](./.agents/skills/apple-design/SKILL.md) | Use for Apple HIG compliance, concentric squircle radii math, tactile spring physics, and SF typography scales. |
| **Emil Design Engineering** | [`.agents/skills/emil-design-eng`](./.agents/skills/emil-design-eng/SKILL.md) | Use for craft micro-interactions, drag/tilt animations, and high-fidelity UI physics. |
| **Figma-to-Code** | [`.agents/skills/figma-to-code`](./.agents/skills/figma-to-code/SKILL.md) | Use when translating visual Figma mocks or Dev Mode measurements to 1:1 code. |
| **Design System & Handoff** | [`.agents/skills/design-design-system`](./.agents/skills/design-design-system/SKILL.md), [`.agents/skills/design-design-handoff`](./.agents/skills/design-design-handoff/SKILL.md) | Use for token integrity, component variants, and handoff consistency. |
| **Vercel Best Practices** | [`.agents/skills/vercel-react-best-practices`](./.agents/skills/vercel-react-best-practices/SKILL.md), [`.agents/skills/vercel-web-design-guidelines`](./.agents/skills/vercel-web-design-guidelines/SKILL.md) | Use for React 19 rendering optimization, bundle efficiency, and web design guidelines. |

---

## 3. Strict Architectural Guardrails

### A. Zero CSS `zoom`
- **Never** use `style={{ zoom: ... }}` or CSS `zoom`.
- All responsiveness must be achieved using standard Tailwind breakpoints (`xl:`, `2xl:`), CSS grid/flexbox, and viewport math (`calc`, `min`, `clamp`).

### B. Two-Tier Responsive Token Architecture
The studio layout is calibrated for compact laptops (`1024x575`) through full desktop setups (`1440x900+`):

1. **Outer Sidebar Windows (`FigmaWindow.jsx`):**
   - Width is locked to `w-[304px] xl:w-[380px] 2xl:w-[402px] flex-shrink-0 select-none`.
   - Never add artificial solid backplates (`bg-[#0c0e0d]/95` or similar) inside `FigmaWindow.jsx`. Maintain the authentic Figma layered aura (`figma-aura-gradient blur-[10px]` + `bg-black/60 blur-[10px]`).

2. **Center Card Stage (`CardViewer.jsx`):**
   - Aspect ratio: `aspect-[688/960]`.
   - Responsive height clamp: `w-[min(315px,calc((100vh-185px)*688/960))] xl:w-[360px] 2xl:w-[380px]`.
   - Viewport Guarantee: At $1024 \times 575$, the center card scales to $280\text{px}$ width ($390\text{px}$ height) so the blue `Confirm` button is 100% visible with $>20\text{px}$ bottom clearance and zero vertical page scroll.

3. **4-Column Card Grids (`LeftPanel.jsx`, `RightPanel.jsx`, `WindowSelectBackImage.jsx`):**
   - Card dimensions: `w-[60px] h-[82px] xl:w-[66px] xl:h-[90px]`.
   - Card horizontal gap: `gap-x-2.5 xl:gap-x-3.5` ($10\text{px}$ gap on compact $\rightarrow$ exact $4 \times 60 + 3 \times 10 = 270\text{px}$ grid).
   - Padding & Clearance:
     - Sidebars with scrollbars: `pl-[14px] pr-[20px]`. The $20\text{px}$ right gutter guarantees a clean $5\text{px}$ clearance between column 4 cards (`Parijat`, `Igor`) with their $+3\text{px}$ blue selection squircles and the $6\text{px}$ scrollbar.
     - Symmetrical panel (Back Image, no scrollbar): `px-[17px]`.
   - Vertical headroom: Inner scrollable content must have `pt-2.5 pb-4` to prevent top blue selection squircles (`Blond`, `Parijat`, `Default 1`) from clipping.
   - Scrollbar positioning: Vertical scrollbar track is `w-1.5` positioned cleanly at `right-1.5` ($6\text{px}$ from right border).
   - Edge fade masks: Subtle, smooth gradient `h-6 bg-gradient-to-t from-[#141414]/90 to-transparent right-[16px] bottom-0` with zero `backdrop-blur`.

### C. Locked Scopes & Permission Rules
- **Do NOT modify without explicit user instruction:**
  - `src/pages/DesignPage.jsx`
  - `src/components/cards/CardViewer.jsx`
  - `src/components/ui/OccasionPicker.jsx`
  - Outer sidebar window widths (`304px`)
- Always run `npm run build` and verify zero TypeScript / Vite bundling errors before finishing any task.

---

## 4. Pending Milestones
1. **Recipient Route (`/view`):** Local Base64 URL state encoding for standalone link testing.
2. **Interactive Pack Reveal:** 4-stage Framer Motion state machine (`idle` $\rightarrow$ `charging` $\rightarrow$ `flashing` $\rightarrow$ `revealed`) with tactile wax seal and floating glass control dock.
