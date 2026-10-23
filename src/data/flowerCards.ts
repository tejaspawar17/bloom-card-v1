export type FlowerCard = {
  id: string;
  name: string;
  botanicalName: string;
  headline: string;
  folklore: string;
  sentiment: string;
  image: string;
};

export const FLOWER_CARDS: FlowerCard[] = [
  {
    id: 'parijat',
    name: 'Parijat',
    botanicalName: 'Nyctanthes arbor-tristis',
    headline: 'Night-flowering Jasmine',
    folklore: 'In Hindu mythology, Parijat is a heavenly tree brought to earth by Lord Krishna.',
    sentiment: 'Eternal Love & Devotion',
    image: '/assets/flower-illustrations/parijat.png'
  },
  {
    id: 'hydrangea',
    name: 'Blue Hydrangea',
    botanicalName: 'Hydrangea macrophylla',
    headline: 'Heartfelt Emotion',
    folklore: 'Associated with apologies and heartfelt emotions in Japanese legend.',
    sentiment: 'Sincere Apology',
    image: '/assets/flower-illustrations/hydrangea.png'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    botanicalName: 'Lavandula angustifolia',
    headline: 'Serenity & Grace',
    folklore: 'Used since ancient times for its calming and purifying properties.',
    sentiment: 'Calm & Peace',
    image: '/assets/flower-illustrations/lavender.png'
  },
  {
    id: 'red_rose',
    name: 'Red Rose',
    botanicalName: 'Rosa rubiginosa',
    headline: 'Symbol of Romance',
    folklore: 'Sacred to Aphrodite, the goddess of love, representing immortal love.',
    sentiment: 'Deep Love',
    image: '/assets/flower-illustrations/red_rose.png'
  },
  {
    id: 'gladiolus',
    name: 'Gladiolus',
    botanicalName: 'Gladiolus communis',
    headline: 'Strength of Character',
    folklore: 'Named for its sword-shaped leaves, symbolizing strength and moral integrity.',
    sentiment: 'Strength & Honor',
    image: '/assets/flower-illustrations/gladiolus.png'
  },
  {
    id: 'white_tulip',
    name: 'White Tulip',
    botanicalName: 'Tulipa gesneriana',
    headline: 'Purity & Forgiveness',
    folklore: 'Often associated with new beginnings and asking for forgiveness.',
    sentiment: 'Forgiveness',
    image: '/assets/flower-illustrations/white_tulip.png'
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    botanicalName: 'Helianthus annuus',
    headline: 'Radiant Warmth',
    folklore: 'In Greek mythology, the water nymph Clytie turned into a sunflower, forever facing the sun god Apollo.',
    sentiment: 'Adoration & Loyalty',
    image: '/assets/flower-illustrations/sunflower.png'
  },
  {
    id: 'pink_peony',
    name: 'Pink Peony',
    botanicalName: 'Paeonia lactiflora',
    headline: 'Prosperity & Honor',
    folklore: 'Known as the "King of Flowers" in China, symbolizing wealth and high honor.',
    sentiment: 'Good Fortune',
    image: '/assets/flower-illustrations/pink_peony.png'
  },
  {
    id: 'carnation',
    name: 'Carnation',
    botanicalName: 'Dianthus caryophyllus',
    headline: 'Divine Flower',
    folklore: 'The scientific name means "flower of the gods." Pink carnations symbolize a mother\'s undying love.',
    sentiment: 'Gratitude',
    image: '/assets/flower-illustrations/pink_carnation.png'
  }
];
