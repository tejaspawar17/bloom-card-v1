# Bloom Card V1 - Exact Design System & Tokens

This document contains the EXACT Figma measurements, variables, tokens, and component specifications extracted directly from Dev Mode to ensure pixel-perfect fidelity.

## 1. Global Tokens

### Colors
- **App Background:** \#000000\
- **Window Panel Fill:** \
gba(0, 0, 0, 0.4)\
- **Window Panel Stroke:** \
gba(255, 255, 255, 0.2)\
- **Primary Selection (Blue):** \#0088FF\
- **Image Container Fill:** \
gba(0, 0, 0, 0.4)\ (Used behind images/stickers)
- **Inactive Text:** \
gba(229, 229, 234, 0.7)\ (Apple HIG \#E5E5EA\)
- **Hover/Overlay Surface:** \
gba(153, 153, 153, 0.15)\
- **Outer Aura Gradient:** \linear-gradient(180deg, rgba(19, 32, 19, 1) 0%, rgba(79, 121, 62, 1) 13%, rgba(113, 157, 83, 1) 42%, rgba(134, 183, 90, 1) 60%, rgba(207, 197, 49, 1) 78%, rgba(173, 217, 173, 1) 94%, rgba(124, 224, 220, 1) 100%)\

### Border Radii
- **Aura / Outer Glow:** \40px\
- **Window Panel:** \20px\
- **Selection Highlight Rectangles:** \15px\
- **Image/Thumbnail Containers:** \12px\
- **Pills/Avatars:** \9999px\ / \500px\

---

## 2. Core Layout & Container Components

### Window Background (Aura Glow)
- **Dimensions:** W: \380px\-\402px\, H: Contextual/Hug
- **Border Radius:** \40px\
- **Layer 1 (Bottom):** Fill \
gba(0, 0, 0, 0.5)\ with \lur(10px)\ and \ox-shadow: 0px 40px 40px 0px rgba(40,40,40,0.20)\
- **Layer 2 (Top):** The 7-stop Aura Gradient (defined in tokens)
- **Role:** Behind the main glass windows to provide lighting.

### Window Panel (Glass Container)
- **Fill:** \
gba(0, 0, 0, 0.4)\
- **Stroke:** \
gba(255, 255, 255, 0.2)\, 1px
- **Border Radius:** \20px\
- **Role:** The individual frosted sections (Occasion, Flower, Upload, etc.)

---

## 3. Interactive Components

### Occasion Chip (\1249:16482\)
- **Container Layout:** Flex row wrap, Column Gap: \6px\, Row Gap: \8px\
- **Padding:** \12px\ (Left/Right), \7px\ (Top/Bottom)
- **Inner Gap:** \4px\
- **Default Fill:** \
gba(114, 114, 114, 0.08)\
- **Typography:** \13px\, Line Height: \18px\
- **Active State:** Fill \#0088FF\ (or blue tint), Text color \white\.

### Flower Grid Item (\1249:16897\)
- **Grid Layout:** Gap-x: \12px\, Gap-y: \14px\
- **Item Dimensions:** W: \66px\, H: \90px\
- **Image Container:** \66x66\ square, \12px\ radius, \
gba(0, 0, 0, 0.4)\ fill. Image is inset.
- **Label:** Y-offset starts at \72px\ (\66px\ + gap), \11px\ font size.
- **Active / Selected State:** A \72x90\ rectangle behind the item with \#0088FF\ fill and \15px\ radius.
- **Hover State:** A \72x90\ rectangle behind with \
gba(153, 153, 153, 0.15)\.

### Back Image Upload Slot (\1249:16476\)
- **Dimensions:** W: \66px\, H: \66px\
- **Image Container:** \12px\ radius.
- **Active / Selected State:** A \72x72\ rectangle behind the item with \#0088FF\ fill and \15px\ radius.
- **Empty Slot Fill:** \#202221\ (Dark grey)

### Emote Chip (\1249:16477\)
- **Dimensions:** Exactly \34x34\
- **Border Radius:** \500px\ (Perfect circle)
- **Container Gap:** \6px\
- **Default State:** Transparent or faint white hover.
- **Active / Selected State:** Fill \#0088FF\.

### Sticker Grid Item (\1249:16478\)
- **Dimensions:** W: \66px\, H: \90px\
- **Image Container:** \66x66\, \12px\ radius, \
gba(0,0,0,0.4)\ fill.
- **Selection State:** *None* (Stickers are stamped, not toggled).
- **Hover State:** A \72x90\ rectangle behind with \
gba(153, 153, 153, 0.15)\ fill and \15px\ radius.
