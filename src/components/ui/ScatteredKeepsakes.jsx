import React from 'react';
import KeepsakeFolder from './KeepsakeFolder';

/**
 * ScatteredKeepsakes Component (Option B: Ambient Layered Margins with Safe Clipping)
 * Scatters 3 distinct Keepsake folders throughout the background at different scroll depths.
 * On desktop: Flanks the central narrative column in wide gutters.
 * On mobile: Tucks along the margins with safe clipping without causing horizontal scrollbars or blocking text.
 */
export default function ScatteredKeepsakes() {
  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Folder 01: Upper Left Margin (Hero & CTA depth) */}
      <div className="absolute top-[140px] left-[-32px] sm:left-[2%] md:left-[3%] lg:left-[5%] xl:left-[9%] 2xl:left-[14%] pointer-events-auto">
        <KeepsakeFolder
          label="ARCHIVE 01"
          defaultRotation={-8}
          cards={[
            { id: '1a', title: 'Card 01', note: 'Placeholder', color: '#86B75A' },
            { id: '1b', title: 'Card 02', note: 'Placeholder', color: '#CFC531' },
            { id: '1c', title: 'Card 03', note: 'Placeholder', color: '#7CE0DC' },
          ]}
        />
      </div>

      {/* Folder 02: Mid Right Margin (How It Works depth) */}
      <div className="absolute top-[520px] right-[-34px] sm:right-[2%] md:right-[3%] lg:right-[5%] xl:right-[9%] 2xl:right-[14%] pointer-events-auto">
        <KeepsakeFolder
          label="ARCHIVE 02"
          defaultRotation={7}
          cards={[
            { id: '2a', title: 'Card 04', note: 'Placeholder', color: '#CFC531' },
            { id: '2b', title: 'Card 05', note: 'Placeholder', color: '#86B75A' },
            { id: '2c', title: 'Card 06', note: 'Placeholder', color: '#7CE0DC' },
          ]}
        />
      </div>

      {/* Folder 03: Lower Left Margin (About Creator depth) */}
      <div className="absolute top-[960px] left-[-28px] sm:left-[2%] md:left-[3%] lg:left-[5%] xl:left-[9%] 2xl:left-[14%] pointer-events-auto">
        <KeepsakeFolder
          label="ARCHIVE 03"
          defaultRotation={-5}
          cards={[
            { id: '3a', title: 'Card 07', note: 'Placeholder', color: '#7CE0DC' },
            { id: '3b', title: 'Card 08', note: 'Placeholder', color: '#86B75A' },
            { id: '3c', title: 'Card 09', note: 'Placeholder', color: '#CFC531' },
          ]}
        />
      </div>
    </div>
  );
}
