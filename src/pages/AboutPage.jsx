import React from 'react';
import { BloomLogo, WindowPanel } from '@/components/ui';

export default function AboutPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-16">
      <div className="figma-window max-w-2xl w-full p-8 md:p-12 flex flex-col items-center text-center gap-6 select-none">
        {/* Master Component: Bloom Logo */}
        <BloomLogo size="lg" version="ver. 1.1" />

        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Mood-Driven Greetings & Pokémon Cards
        </h1>

        <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-lg">
          Bloom transforms real feelings into collectible physical-digital cards.
          Pick any occasion or mood—from honest apologies to celebratory milestones—and Bloom pairs it with the botanical flower meaning or custom Pokémon card, styled in Liquid Glass aesthetics.
        </p>

        {/* 3 Card Types rendered in Master WindowPanel components */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4 text-left">
          <WindowPanel title="Paper Card" bodyClassName="p-4 flex flex-col items-center text-center gap-1.5">
            <span className="text-3xl">📄</span>
            <p className="text-xs text-neutral-400">Classic pressed card with flower textures & date stamps.</p>
          </WindowPanel>

          <WindowPanel title="Metallic Card" bodyClassName="p-4 flex flex-col items-center text-center gap-1.5">
            <span className="text-3xl">✨</span>
            <p className="text-xs text-neutral-400">Shimmering foil card with liquid glass badges.</p>
          </WindowPanel>

          <WindowPanel title="Pokémon & Trainer" bodyClassName="p-4 flex flex-col items-center text-center gap-1.5">
            <span className="text-3xl">⚡</span>
            <p className="text-xs text-neutral-400">Battle card format with polaroid frames, stamps & bios.</p>
          </WindowPanel>
        </div>
      </div>
    </div>
  );
}
