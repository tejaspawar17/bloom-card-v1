import { createContext, useContext, useReducer } from 'react';
import { DEFAULT_CARD_STATE, FLOWERS } from '../data/cardData';

const CardContext = createContext(null);

function cardReducer(state, action) {
  switch (action.type) {
    case 'SET_MOOD':
      return {
        ...state,
        mood: action.payload,
        flower: FLOWERS[action.payload] || null,
        // Reset card-specific data when mood changes
        pokemon: null,
      };
    case 'SET_CARD_TYPE':
      return { ...state, cardType: action.payload };
    case 'SET_POKEMON':
      return { ...state, pokemon: action.payload };
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_FROM':
      return { ...state, from: action.payload };
    case 'SET_TO':
      return { ...state, to: action.payload };
    case 'FLIP_CARD':
      return { ...state, isFlipped: !state.isFlipped };
    case 'SET_FLIPPED':
      return { ...state, isFlipped: action.payload };
    case 'RESET':
      return { ...DEFAULT_CARD_STATE };
    default:
      return state;
  }
}

export function CardProvider({ children }) {
  const [state, dispatch] = useReducer(cardReducer, DEFAULT_CARD_STATE);

  return (
    <CardContext.Provider value={{ state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCard() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('useCard must be used within CardProvider');
  return ctx;
}
