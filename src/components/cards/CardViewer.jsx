import { useCard } from '../../context/CardContext';
import { PaperCardFront, PaperCardBack } from './PaperCard';
import { MetallicCardFront, MetallicCardBack } from './MetallicCard';
import { PokemonCardFront, PokemonCardBack } from './PokemonCard';

/**
 * CardViewer — Shows the correct card type with a 3D flip animation.
 * Handles Paper, Metallic, and Pokémon card types.
 */
export default function CardViewer() {
  const { state, dispatch } = useCard();
  const { cardType, isFlipped } = state;

  const renderFront = () => {
    switch (cardType) {
      case 'metallic': return <MetallicCardFront />;
      case 'pokemon': return <PokemonCardFront />;
      default: return <PaperCardFront />;
    }
  };

  const renderBack = () => {
    switch (cardType) {
      case 'metallic': return <MetallicCardBack />;
      case 'pokemon': return <PokemonCardBack />;
      default: return <PaperCardBack />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card with flip */}
      <div className="card-container" style={{ width: 344, height: 480 }}>
        <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-front">
            {renderFront()}
          </div>
          <div className="card-back">
            {renderBack()}
          </div>
        </div>
      </div>

      {/* Flip button */}
      <button
        onClick={() => dispatch({ type: 'FLIP_CARD' })}
        className="glass-button px-5 py-2 rounded-full text-white/80 text-sm font-medium flex items-center gap-2"
      >
        <span>{isFlipped ? '↩' : '↪'}</span>
        <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
      </button>
    </div>
  );
}
