# Bloom Card 🌸

A **mood-based greeting card generator** built with React + Vite + Tailwind CSS v4.

Pick a mood → get a flower recommendation → customize your card → share it.

## Card Types

| Type | Description |
|---|---|
| 📄 **Paper** | Classic paper greeting card with flower art |
| ✨ **Metallic** | Shiny metallic card with glass effects |
| ⚡ **Pokémon** | Pokémon-style card with Pokémon picker |

## Features

- 🌸 10 moods → unique flower recommendations with meanings
- 🃏 3 card types (Paper, Metallic, Pokémon)
- ✏️ Custom title + message composition
- 🔄 3D card flip animation
- 🔗 Generate & copy shareable link
- 🎨 Liquid Glass UI (dark, frosted glass aesthetic)

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **lucide-react** (icons)
- **clsx** (conditional classes)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── components/
│   ├── cards/
│   │   ├── CardViewer.jsx     # 3D flip wrapper
│   │   ├── PaperCard.jsx      # Paper card front/back
│   │   ├── MetallicCard.jsx   # Metallic card front/back
│   │   └── PokemonCard.jsx    # Pokémon card front/back
│   ├── Navbar.jsx
│   ├── MoodPicker.jsx
│   ├── CardTypePicker.jsx
│   ├── MessageModal.jsx
│   ├── TitleModal.jsx
│   └── ShareModal.jsx
├── context/
│   └── CardContext.jsx        # Global state (useReducer)
├── data/
│   └── cardData.js            # Moods, flowers, Pokémon data
└── pages/
    ├── DesignPage.jsx         # Main card builder
    └── AboutPage.jsx
```

## Design Reference

Based on Figma design: [Bloom Card V1](https://www.figma.com/design/JJfrZuiT9mrMr58QdVS53d/Bloom-Card-V1)

## License

MIT
