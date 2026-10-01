// Mood → Flower + Card mapping data

export const MOODS = [
  {
    id: 'apologetic',
    label: 'Apologetic',
    emoji: '🥺',
    description: 'Sincere apology',
  },
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😄',
    description: 'Joyful & bright',
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    description: 'Gentle & comforting',
  },
  {
    id: 'angry',
    label: 'Angry',
    emoji: '😡',
    description: 'Bold & fierce',
  },
  {
    id: 'grateful',
    label: 'Grateful',
    emoji: '🙏',
    description: 'Warm & thankful',
  },
  {
    id: 'excited',
    label: 'Excited',
    emoji: '🤩',
    description: 'Electric & vibrant',
  },
  {
    id: 'celebratory',
    label: 'Celebratory',
    emoji: '🎉',
    description: 'Party & festive',
  },
  {
    id: 'love',
    label: 'Love',
    emoji: '❤️',
    description: 'Romantic & warm',
  },
  {
    id: 'birthday',
    label: 'Birthday',
    emoji: '🎂',
    description: 'Special day',
  },
  {
    id: 'friendship',
    label: 'Friendship',
    emoji: '🤝',
    description: 'Bond & loyalty',
  },
];

export const FLOWERS = {
  apologetic: {
    name: 'White Chrysanthemum',
    emoji: '🌸',
    meaning: 'Symbolizes sincerity and honesty — the perfect way to say sorry.',
    color: '#e8e8e8',
    accent: '#9b59b6',
  },
  happy: {
    name: 'Sunflower',
    emoji: '🌻',
    meaning: 'Radiates warmth and positivity — just like your happiness.',
    color: '#FFD700',
    accent: '#FF8C00',
  },
  sad: {
    name: 'Blue Hydrangea',
    emoji: '💙',
    meaning: 'Conveys heartfelt emotion and understanding in tough times.',
    color: '#6baed6',
    accent: '#2171b5',
  },
  angry: {
    name: 'Red Protea',
    emoji: '🌺',
    meaning: 'Bold and fierce, representing courage to express strong feelings.',
    color: '#e74c3c',
    accent: '#c0392b',
  },
  grateful: {
    name: 'Pink Carnation',
    emoji: '🌷',
    meaning: 'A timeless symbol of deep gratitude and admiration.',
    color: '#FF69B4',
    accent: '#C71585',
  },
  excited: {
    name: 'Bird of Paradise',
    emoji: '🦜',
    meaning: 'As vibrant and extraordinary as your excitement.',
    color: '#FF6347',
    accent: '#FF4500',
  },
  celebratory: {
    name: 'Yellow Tulip',
    emoji: '🌼',
    meaning: 'Bright and cheerful — perfect for every celebration.',
    color: '#FFD700',
    accent: '#FFA500',
  },
  love: {
    name: 'Red Rose',
    emoji: '🌹',
    meaning: 'The timeless declaration of deep love and passion.',
    color: '#DC143C',
    accent: '#8B0000',
  },
  birthday: {
    name: 'Gerbera Daisy',
    emoji: '🌸',
    meaning: 'Cheerful and vibrant — the perfect birthday surprise.',
    color: '#FF69B4',
    accent: '#FF1493',
  },
  friendship: {
    name: 'Yellow Acacia',
    emoji: '💛',
    meaning: 'Represents true friendship, secret love, and faithful bonds.',
    color: '#FFD700',
    accent: '#DAA520',
  },
};

export const CARD_TYPES = [
  { id: 'paper', label: 'Paper', icon: '📄' },
  { id: 'metallic', label: 'Metallic', icon: '✨' },
  { id: 'pokemon', label: 'Pokémon', icon: '⚡' },
];

export const POKEMON_LIST = [
  { id: 'pikachu', name: 'Pikachu', type: 'Electric', emoji: '⚡', hp: 60, art: '🐭' },
  { id: 'charmander', name: 'Charmander', type: 'Fire', emoji: '🔥', hp: 39, art: '🦎' },
  { id: 'bulbasaur', name: 'Bulbasaur', type: 'Grass', emoji: '🌿', hp: 45, art: '🦕' },
  { id: 'squirtle', name: 'Squirtle', type: 'Water', emoji: '💧', hp: 44, art: '🐢' },
  { id: 'mewtwo', name: 'Mewtwo', type: 'Psychic', emoji: '🔮', hp: 106, art: '👾' },
  { id: 'eevee', name: 'Eevee', type: 'Normal', emoji: '🌟', hp: 55, art: '🦊' },
  { id: 'gengar', name: 'Gengar', type: 'Ghost', emoji: '👻', hp: 60, art: '😈' },
  { id: 'snorlax', name: 'Snorlax', type: 'Normal', emoji: '😴', hp: 160, art: '🐻' },
];

export const DEFAULT_CARD_STATE = {
  mood: null,
  flower: null,
  cardType: 'paper',
  pokemon: null,
  title: '',
  message: '',
  from: '',
  to: '',
  isFlipped: false,
};
