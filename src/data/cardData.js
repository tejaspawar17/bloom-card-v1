// Exact Bloom Card Data matching the UI Reference Screen

export const OCCASIONS = [
  { id: 'sorry', label: "I'm Sorry", emoji: 'pleading-face', defaultSubject: "I'm So Sorry,\nForgive Me?", defaultCardType: 'paper', defaultFlower: 'flower_1', defaultPokemon: 'gengar' },
  { id: 'birthday', label: 'Birthday', emoji: 'birthday-cake', defaultSubject: 'Happy Birthday!\nBest Day!', defaultCardType: 'paper', defaultFlower: 'flower_2', defaultPokemon: 'psyduck' },
  { id: 'celebration', label: 'Celebration', emoji: 'partying-face', defaultSubject: 'Big Congrats!\nCheers! ✨', defaultCardType: 'paper', defaultFlower: 'flower_3', defaultPokemon: 'oshawott' },
  { id: 'thank_you', label: 'Thank You', emoji: 'growing-heart', defaultSubject: 'Thank You\nFor Everything', defaultCardType: 'paper', defaultFlower: 'flower_4', defaultPokemon: 'squirtle' },
  { id: 'get_well', label: 'Get Well Soon', emoji: 'face-with-head-bandage', defaultSubject: 'Get Well Soon,\nRest Up!', defaultCardType: 'paper', defaultFlower: 'flower_5', defaultPokemon: 'psyduck' },
  { id: 'miss_you', label: 'Miss You', emoji: 'smiling-face-with-tear', defaultSubject: 'Missing You\nEvery Day', defaultCardType: 'paper', defaultFlower: 'flower_6', defaultPokemon: 'opposites' },
  { id: 'love', label: 'Love', emoji: 'face-blowing-a-kiss', defaultSubject: 'All My Love,\nAlways Yours', defaultCardType: 'paper', defaultFlower: 'flower_7', defaultPokemon: 'opposites' },
  { id: 'so_proud', label: 'So Proud', emoji: 'smiling-face', defaultSubject: 'You Did It!\nSo Proud!', defaultCardType: 'paper', defaultFlower: 'flower_8', defaultPokemon: 'squirtle' },
  { id: 'sad', label: 'Sad', emoji: 'dizzy-face', defaultSubject: 'Here For You,\nAlways', defaultCardType: 'paper', defaultFlower: 'flower_9', defaultPokemon: 'psyduck' },
  { id: 'angry', label: 'Angry', emoji: 'face-with-symbols-on-mouth', defaultSubject: 'Still Mad!\nTalk Soon.', defaultCardType: 'pokemon', defaultFlower: 'flower_10', defaultPokemon: 'oshawott' },
  { id: 'tired', label: 'Tired', emoji: 'melting-face', defaultSubject: 'Running On Low,\nNeed Rest', defaultCardType: 'paper', defaultFlower: 'flower_10', defaultPokemon: 'psyduck' },
  { id: 'homie', label: 'Homie', emoji: 'people-hugging', defaultSubject: 'Real Ones,\nHomie For Life', defaultCardType: 'pokemon', defaultFlower: 'flower_2', defaultPokemon: 'squirtle' },
];

export const POKEMON_CARDS = [
  { id: 'gengar', name: 'FU Gengar', image: '/pokemon/003-003-gengar.png' },
  { id: 'squirtle', name: 'FU Squirtle', image: '/pokemon/001-003-squirtle.png' },
  { id: 'opposites', name: 'Opposites...', image: '/pokemon/001-002-opposites-attract.png' },
  { id: 'oshawott', name: 'Oshawott', image: '/pokemon/001-002-oshawott.png' },
  { id: 'psyduck', name: 'Psyduck', image: '/pokemon/001-002-psyduck.png' },
];

export const BACK_IMAGES = [
  { id: 'landscape', label: 'Landscape', image: '/assets/polaroid-defaults/image1.png', borderColor: 'border-blue-500' },
  { id: 'portrait', label: 'Portrait', image: '/assets/polaroid-defaults/image2.png', borderColor: 'border-red-500' },
];

export const EMOTE_EMOJIS = [
  { id: 'pleading-face', name: 'Pleading', src: '/assets/emojis/pleading-face.png' },
  { id: 'smiling-face-with-tear', name: 'Tear Smile', src: '/assets/emojis/smiling-face-with-tear.png' },
  { id: 'birthday-cake', name: 'Cake', src: '/assets/emojis/birthday-cake.png' },
  { id: 'face-with-tears-of-joy', name: 'Joy', src: '/assets/emojis/face-with-tears-of-joy.png' },
  { id: 'growing-heart', name: 'Heart', src: '/assets/emojis/growing-heart.png' },
  { id: 'face-blowing-a-kiss', name: 'Kiss', src: '/assets/emojis/face-blowing-a-kiss.png' },
  { id: 'face-with-head-bandage', name: 'Bandage', src: '/assets/emojis/face-with-head-bandage.png' },
  { id: 'smiling-face', name: 'Smile', src: '/assets/emojis/smiling-face.png' },
  { id: 'flexed-biceps', name: 'Flex', src: '/assets/emojis/flexed-biceps.png' },
  { id: 'partying-face', name: 'Party', src: '/assets/emojis/partying-face.png' },
  { id: 'smirking-face', name: 'Smirk', src: '/assets/emojis/smirking-face.png' },
  { id: 'middle-finger', name: 'Middle Finger', src: '/assets/emojis/middle-finger.png' },
  { id: 'face-with-symbols-on-mouth', name: 'Curse', src: '/assets/emojis/face-with-symbols-on-mouth.png' },
  { id: 'dizzy-face', name: 'Dizzy', src: '/assets/emojis/dizzy-face.png' },
  { id: 'people-hugging', name: 'Hug', src: '/assets/emojis/people-hugging.png' },
  { id: 'melting-face', name: 'Melting', src: '/assets/emojis/melting-face.png' }
];

export const STICKERS = [
  { id: 'cmiygl', name: 'CMIYGL', image: '/assets/stickers/CMIYGL.png' },
  { id: 'apples', name: "Don't Let...", image: "/assets/stickers/Don't Let Your Apples Rot.png" },
  { id: 'blond', name: 'Blond', image: '/assets/stickers/Blond.png' },
  { id: 'igor', name: 'Igor', image: '/assets/stickers/IGOR.png' },
  { id: 'sos', name: 'SOS', image: '/assets/stickers/SOS SZA.png' },
  { id: 'brat', name: 'Brat', image: '/assets/stickers/Brat.png' },
  { id: 'believin', name: "Don't Stop...", image: "/assets/stickers/Don't Stop Believin'.png" },
  { id: 'start_living', name: 'Start living', image: '/assets/stickers/Start living.png' },
  { id: 'pink_floyd', name: 'Pink Floyd', image: '/assets/stickers/Pink Floyd.png' },
  { id: 'duck_you', name: 'Duck You', image: '/assets/stickers/Duck You.png' },
  { id: 'smile', name: 'Smile', image: '/assets/stickers/Smile.png' },
];

export const FLOWERS = [
  { id: 'flower_1', name: 'White Tulip', image: '/assets/flower-illustrations/white_tulip.png', meaning: 'Sincere Forgiveness, Humility & A Clean Slate' },
  { id: 'flower_2', name: 'Sunflower', image: '/assets/flower-illustrations/sunflower.png', meaning: 'Pure Joy, Vitality & Radiant Warmth' },
  { id: 'flower_3', name: 'Pink Peony', image: '/assets/flower-illustrations/pink_peony.png', meaning: 'Prosperity, High Honor & Victorious Energy' },
  { id: 'flower_4', name: 'Pink Carnation', image: '/assets/flower-illustrations/pink_carnation.png', meaning: 'Deep Gratitude, Fondness & Eternal Appreciation' },
  { id: 'flower_5', name: 'Lavender', image: '/assets/flower-illustrations/lavender.png', meaning: 'Holistic Healing, Serenity & Restorative Calm' },
  { id: 'flower_6', name: 'Parijat', image: '/assets/flower-illustrations/parijat.png', meaning: 'Enduring Memory, Longing & Unbreakable Bonds' },
  { id: 'flower_7', name: 'Red Rose', image: '/assets/flower-illustrations/red_rose.png', meaning: 'Romance, Soulful Devotion & Deep Passion' },
  { id: 'flower_8', name: 'Gladiolus', image: '/assets/flower-illustrations/gladiolus.png', meaning: 'Strength of Character, Integrity & Heroic Honor' },
  { id: 'flower_9', name: 'White Lily', image: '/assets/flower-illustrations/white_lily.png', meaning: 'Solace, Solemn Comfort & Rebirth of Peace' },
  { id: 'flower_10', name: 'Blue Hydrangea', image: '/assets/flower-illustrations/hydrangea.png', meaning: 'Heartfelt understanding, abundance, and sincere emotion' },
];

export const DEFAULT_STATE = {
  occasion: 'sorry',
  cardType: 'paper',
  pokemonSubtype: 'standard',
  activeSide: 'front',
  selectedPokemon: 'gengar',
  selectedBackImage: 'landscape',
  selectedFlower: 'flower_1',
  subject: "I'm So Sorry,\nForgive Me?",
  message: '',
  to: '',
  from: '',
  trainerName: '',
  trainerBio: '',
  stampEmoji: 'pleading-face',
  placedSticker: null,
  stickerPos: { x: 30, y: 160 },
  stickers: [],
};

