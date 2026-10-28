import React from 'react';
import { useCard } from '@/context/CardContext';
import { OCCASIONS } from '@/data/cardData';
import FigmaWindow from './ui/FigmaWindow';
import WindowPanel from './ui/WindowPanel';
import OccasionPicker from '@/components/ui/OccasionPicker';
import FlowerPokemonGrid from '@/components/studio/FlowerPokemonGrid';

export default function LeftPanel() {
  const { state, dispatch } = useCard();
  const [hasPickedOccasion, setHasPickedOccasion] = React.useState(false);

  const isPokemonMode = state.cardType === 'pokemon';
  const listTitle = isPokemonMode ? 'Pick Your Pokémon' : 'Pick Your Bloom';

  return (
    <FigmaWindow aria-label="Occasion and Item Selector" gapClassName="gap-[20px] xl:gap-[24px] 2xl:gap-[28px]">
      {/* 1. Select Occasion (Figma: no chip forced selected initially until user clicks) */}
      <OccasionPicker 
        value={hasPickedOccasion ? OCCASIONS.find(o => o.id === state.occasion)?.label : null}
        onChange={(label) => {
          setHasPickedOccasion(Boolean(label));
          const occ = OCCASIONS.find(o => o.label === label);
          if (occ) dispatch({ type: 'SET_OCCASION', payload: occ.id });
        }}
      />

      {/* 2. Select Flower / Pokemon (Figma #1166:16778: padding 16px 4px 18px 18px, Grid 328x246) */}
      <WindowPanel
        title={listTitle}
        bodyClassName="pt-[13px] pr-[4px] pb-[15px] pl-[15px] xl:pt-[15px] xl:pr-[4px] xl:pb-[17px] xl:pl-[17px] 2xl:pt-[16px] 2xl:pr-[4px] 2xl:pb-[18px] 2xl:pl-[18px] overflow-hidden"
      >
        <FlowerPokemonGrid />
      </WindowPanel>
    </FigmaWindow>
  );
}
