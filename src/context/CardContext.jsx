import { createContext, useContext, useReducer } from 'react';
import { DEFAULT_STATE, OCCASIONS, FLOWERS, POKEMON_CARDS } from '../data/cardData';

const CardContext = createContext(null);

function cardReducer(state, action) {
  switch (action.type) {
    case 'SET_OCCASION': {
      const occ = OCCASIONS.find((o) => o.id === action.payload);
      return {
        ...state,
        occasion: action.payload,
        cardType: occ?.defaultCardType || 'paper',
        activeSide: 'front',
        subject: occ ? occ.defaultSubject : state.subject,
        selectedFlower: occ?.defaultFlower || state.selectedFlower,
        selectedPokemon: occ?.defaultPokemon || state.selectedPokemon,
      };
    }
    case 'SET_CARD_TYPE':
      return { ...state, cardType: action.payload, activeSide: 'front' };
    case 'SET_POKEMON_SUBTYPE':
      return { ...state, pokemonSubtype: action.payload };
    case 'SET_ACTIVE_SIDE':
      return { ...state, activeSide: action.payload };
    case 'TOGGLE_SIDE':
      return { ...state, activeSide: state.activeSide === 'front' ? 'back' : 'front' };
    case 'SET_SELECTED_POKEMON':
      return { ...state, selectedPokemon: action.payload };
    case 'SET_SELECTED_FLOWER':
      return { ...state, selectedFlower: action.payload };
    case 'SET_BACK_IMAGE':
      return { ...state, selectedBackImage: action.payload };
    case 'SET_SUBJECT':
      return { ...state, subject: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_TO':
      return { ...state, to: action.payload };
    case 'SET_FROM':
      return { ...state, from: action.payload };
    case 'SET_TRAINER_NAME':
      return { ...state, trainerName: action.payload };
    case 'SET_TRAINER_BIO':
      return { ...state, trainerBio: action.payload };
    case 'SET_STAMP_EMOJI':
      return { ...state, stampEmoji: action.payload };
    case 'SET_BG_IMAGE_CHOICE':
      return { ...state, bgImageChoice: action.payload };
    case 'SET_STICKER_POS': return { ...state, stickerPos: action.payload };
        case 'ADD_STICKER':
      return { 
        ...state, 
        stickers: [...(state.stickers || []), action.payload] 
      };
    case 'UPDATE_STICKER_POS':
      return {
        ...state,
        stickers: state.stickers.map(s => 
          s.id === action.payload.id ? { ...s, ...action.payload.pos } : s
        )
      };
    case 'REMOVE_STICKER':
      return {
        ...state,
        stickers: state.stickers.filter(s => s.id !== action.payload)
      };
    case 'SET_PLACED_STICKER':
      // Toggle off if already placed, otherwise place it
      return { ...state, placedSticker: state.placedSticker === action.payload ? null : action.payload };
    case 'HYDRATE_CARD':
      return { ...state, ...action.payload, activeSide: 'front' };
    default:
      return state;
  }
}

export function CardProvider({ children }) {
  const [state, dispatch] = useReducer(cardReducer, DEFAULT_STATE);

  const flower = FLOWERS.find((f) => f.id === state.selectedFlower) || FLOWERS[0];
  const pokemonCard = POKEMON_CARDS.find((p) => p.id === state.selectedPokemon) || POKEMON_CARDS[0];

  return (
    <CardContext.Provider value={{ state, dispatch, flower, pokemonCard }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCard() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
}


