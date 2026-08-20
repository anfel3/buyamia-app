export type SynonymDictionary = Record<string, readonly string[]>;

export const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const includesPhrase = (normalizedText: string, phrase: string) => {
  const normalizedPhrase = normalizeText(phrase);

  return (` ${normalizedText} `).includes(` ${normalizedPhrase} `);
};

export const greetingSynonyms = [
  'bonjour',
  'bonsoir',
  'salut',
  'hello',
  'hi',
  'hey',
  'good morning',
  'good afternoon',
] as const;

export const comparisonSynonyms = [
  'compare',
  'comparison',
  'compare les',
  'comparer',
  'comparaison',
  'les deux premiers',
  'deux premiers',
  'two first',
  'first two',
] as const;

export const cheaperSynonyms = [
  'moins cher',
  'moins chere',
  'moins couteux',
  'cheaper',
  'lower price',
  'lower priced',
  'less expensive',
] as const;

export const bulkSynonyms = [
  'achat en gros',
  'commande en gros',
  'en gros',
  'gros volume',
  'wholesale',
  'bulk',
  'bulk order',
  'large order',
  'order',
  'commander',
] as const;

export const categorySynonyms: SynonymDictionary = {
  art: ['art', 'sculpture', 'pottery', 'ceramique', 'peinture', 'painting'],
  'beauty-care': ['beauty', 'beauty care', 'beaute', 'soin', 'soins', 'wellness'],
  'food-beverage': ['food', 'beverage', 'kitchenware', 'cookware', 'cuisine', 'ustensiles'],
  furniture: ['furniture', 'meuble', 'meubles', 'mobilier', 'ameublement'],
  'home-decoration': ['home decor', 'home decoration', 'decoration', 'decor', 'objet decoratif'],
  jewelry: ['jewelry', 'bijou', 'bijoux', 'accessoire', 'accessories'],
};

export const productTypeSynonyms: SynonymDictionary = {
  armchair: ['fauteuil', 'armchair'],
  chair: ['chaise', 'chaises', 'siege', 'siège', 'chair', 'chairs', 'seating', 'assise'],
  cookware: ['cookware', 'ustensiles', 'batterie de cuisine', 'set cuisine'],
  package: ['package', 'pack', 'bundle', 'lot', 'ensemble'],
  table: ['table', 'tables', 'bureau', 'desk', 'side table', 'table d appoint', 'table basse'],
  vehicle: ['vehicle', 'vehicles', 'voiture', 'vehicule', 'véhicule', 'fleet', 'flotte'],
};

export const materialSynonyms: SynonymDictionary = {
  bamboo: ['bamboo', 'bambou'],
  'coconut-shell': ['coconut shell', 'coconut', 'noix de coco', 'coque de coco'],
  glass: ['glass', 'verre'],
  metal: ['metal', 'métal', 'metallic'],
  natural: ['natural', 'naturel', 'ecologique', 'ecolo', 'eco friendly', 'eco-friendly', 'sustainable'],
  wood: ['wood', 'bois', 'wooden'],
};

export const roomSynonyms: SynonymDictionary = {
  Bathroom: ['bathroom', 'salle de bain', 'bain'],
  Bedroom: ['bedroom', 'chambre'],
  Garden: ['garden', 'jardin', 'outdoor', 'exterieur', 'extérieur', 'patio'],
  Kitchen: ['kitchen', 'cuisine'],
  'Living Room': ['living room', 'salon', 'sejour', 'séjour'],
};

export const colorSynonyms: SynonymDictionary = {
  beige: ['beige', 'cream', 'creme', 'sand', 'natural beige'],
  black: ['black', 'noir', 'noire'],
  blue: ['blue', 'bleu', 'bleue'],
  brown: ['brown', 'marron', 'brun', 'brune', 'walnut'],
  green: ['green', 'vert', 'verte', 'lime'],
  pink: ['pink', 'rose'],
  red: ['red', 'rouge'],
  white: ['white', 'blanc', 'blanche'],
  yellow: ['yellow', 'jaune'],
};

export const styleSynonyms: SynonymDictionary = {
  bohemian: ['bohemian', 'boheme', 'bohème', 'boho'],
  coastal: ['coastal', 'bord de mer', 'plage'],
  industrial: ['industrial', 'industriel'],
  minimalist: ['minimalist', 'minimaliste', 'simple'],
  modern: ['modern', 'moderne', 'contemporary', 'contemporain'],
  rustic: ['rustic', 'rustique', 'hand carved', 'sculpte', 'sculpté'],
  scandinavian: ['scandinavian', 'scandinave', 'nordic', 'nordique'],
  traditional: ['traditional', 'traditionnel', 'traditionnelle', 'classic', 'classique'],
};

export const moodSynonyms: SynonymDictionary = {
  calm: ['calm', 'calme', 'serene', 'apaisant'],
  cozy: ['cozy', 'cosy', 'chaleureux', 'warm'],
  elegant: ['elegant', 'elegante', 'élégant', 'raffine', 'raffiné'],
  energetic: ['energetic', 'energique', 'énergique', 'vibrant'],
  formal: ['formal', 'formel', 'professional'],
  playful: ['playful', 'ludique', 'joyeux'],
  romantic: ['romantic', 'romantique'],
};

export function findCanonicalValue(dictionary: SynonymDictionary, normalizedText: string) {
  for (const [canonical, aliases] of Object.entries(dictionary)) {
    if (aliases.some((alias) => includesPhrase(normalizedText, alias))) {
      return canonical;
    }
  }

  return undefined;
}
