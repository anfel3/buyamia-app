import type { Product } from '../../types';

export const AMIA_ASSISTANT_NAME = 'Amia Local Smart Shopping Assistant';

export type ShoppingIntent = {
  query?: string;
  category?: string;
  productType?: string;
  material?: string;
  room?: string;
  color?: string;
  style?: string;
  mood?: string;
  minPrice?: number;
  maxPrice?: number;
  quantity?: number;
  wantsBulk?: boolean;
  wantsComparison?: boolean;
  wantsCheaper?: boolean;
};

export type AmiaLanguage = 'en' | 'fr';

export type ParsedShoppingMessage = {
  intent: ShoppingIntent;
  isGreeting: boolean;
  isOffTopic: boolean;
  language: AmiaLanguage;
  preferredProductIndex?: number;
};

export type ScoreCriterion = {
  label: string;
  weight: number;
};

export type ScoredProduct = {
  criteria: ScoreCriterion[];
  product: Product;
  score: number;
};

export type AmiaMessage = {
  author: 'Amia' | 'You';
  id: string;
  text: string;
};

export type AmiaPreferences = {
  budget?: {
    maxPrice?: number;
    minPrice?: number;
  };
  color?: string;
  material?: string;
  mood?: string;
  productType?: string;
  room?: string;
  style?: string;
};

export type AmiaMemory = {
  currentIntent: ShoppingIntent;
  lastMessages: AmiaMessage[];
  preferences: AmiaPreferences;
  recentRecommendedProductIds: string[];
  updatedAt: string;
};

export type AmiaEngineState = {
  currentIntent?: ShoppingIntent;
  recentRecommendedProductIds?: string[];
  turnCount?: number;
};

export type AmiaEngineReply = {
  intent: ShoppingIntent;
  language: AmiaLanguage;
  productIds: string[];
  scoredProducts: ScoredProduct[];
  suggestions: string[];
  text: string;
};
