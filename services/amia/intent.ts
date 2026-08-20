import type { ParsedShoppingMessage, ShoppingIntent } from './types';
import {
  bulkSynonyms,
  categorySynonyms,
  cheaperSynonyms,
  colorSynonyms,
  comparisonSynonyms,
  findCanonicalValue,
  greetingSynonyms,
  includesPhrase,
  materialSynonyms,
  moodSynonyms,
  normalizeText,
  productTypeSynonyms,
  roomSynonyms,
  styleSynonyms,
} from './synonyms';

const fieldNames: (keyof ShoppingIntent)[] = [
  'category',
  'productType',
  'material',
  'room',
  'color',
  'style',
  'mood',
  'minPrice',
  'maxPrice',
  'quantity',
  'wantsBulk',
  'wantsComparison',
  'wantsCheaper',
];

const frenchSignals = [
  'bonjour',
  'salut',
  'moins',
  'cher',
  'chere',
  'je cherche',
  'salon',
  'bambou',
  'marron',
  'commander',
  'comparer',
  'premiers',
  'prefere',
  'préférence',
] as const;

function parsePriceValue(raw: string) {
  const cleaned = raw.replace(/\s+/g, '').replace(/,/g, '.');
  const value = Number.parseFloat(cleaned);

  return Number.isFinite(value) ? Math.round(value) : undefined;
}

function extractPrices(text: string) {
  const accentless = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const values: number[] = [];
  let match: RegExpExecArray | null;
  const millionPattern = /\b(\d+(?:[,.]\d+)?)\s*(?:million|millions|juta)\b/g;

  while ((match = millionPattern.exec(accentless))) {
    const parsed = parsePriceValue(match[1]);
    if (parsed !== undefined) {
      values.push(parsed * 1_000_000);
    }
  }

  const groupedPattern = /\b(\d{1,3}(?:[,. ]\d{3})+)\s*(?:idr|rp)?\b/g;
  while ((match = groupedPattern.exec(accentless))) {
    const parsed = Number(match[1].replace(/[^0-9]/g, ''));
    if (Number.isFinite(parsed)) {
      values.push(parsed);
    }
  }

  const plainPattern = /\b(\d{5,})\s*(?:idr|rp)?\b/g;
  while ((match = plainPattern.exec(accentless))) {
    const parsed = Number(match[1]);
    if (Number.isFinite(parsed)) {
      values.push(parsed);
    }
  }

  return values;
}

function extractQuantity(normalizedText: string) {
  const orderPattern = /\b(?:commander|commande|order|buy|need|besoin de|quantity|quantite|pcs|pieces|units|unites)\s+(\d{1,4})\b/;
  const orderMatch = normalizedText.match(orderPattern);

  if (orderMatch) {
    return Number(orderMatch[1]);
  }

  const trailingPattern = /\b(\d{1,4})\s*(?:pcs|pieces|units|unites|chaises|chairs|tables)\b/;
  const trailingMatch = normalizedText.match(trailingPattern);

  return trailingMatch ? Number(trailingMatch[1]) : undefined;
}

function hasAny(normalizedText: string, phrases: readonly string[]) {
  return phrases.some((phrase) => includesPhrase(normalizedText, phrase));
}

function detectLanguage(normalizedText: string) {
  return hasAny(normalizedText, frenchSignals) ? 'fr' : 'en';
}

function detectPreferredIndex(normalizedText: string) {
  if (hasAny(normalizedText, ['second', 'deuxieme', 'deuxième'])) {
    return 1;
  }
  if (hasAny(normalizedText, ['first', 'premier', 'premiere', 'première'])) {
    return 0;
  }
  if (hasAny(normalizedText, ['third', 'troisieme', 'troisième'])) {
    return 2;
  }

  return undefined;
}

export function parseShoppingIntent(text: string): ShoppingIntent {
  return parseShoppingMessage(text).intent;
}

export function parseShoppingMessage(text: string): ParsedShoppingMessage {
  const normalized = normalizeText(text);
  const intent: ShoppingIntent = {};
  const isGreeting = hasAny(normalized, greetingSynonyms);
  const prices = extractPrices(text);
  const quantity = extractQuantity(normalized);
  const wantsComparison = hasAny(normalized, comparisonSynonyms);
  const wantsCheaper = hasAny(normalized, cheaperSynonyms);
  const wantsBulk = hasAny(normalized, bulkSynonyms) || (quantity !== undefined && quantity >= 10);

  intent.category = findCanonicalValue(categorySynonyms, normalized);
  intent.productType = findCanonicalValue(productTypeSynonyms, normalized);
  intent.material = findCanonicalValue(materialSynonyms, normalized);
  intent.room = findCanonicalValue(roomSynonyms, normalized);
  intent.color = findCanonicalValue(colorSynonyms, normalized);
  intent.style = findCanonicalValue(styleSynonyms, normalized);
  intent.mood = findCanonicalValue(moodSynonyms, normalized);

  if (prices.length > 0) {
    const value = Math.max(...prices);
    const hasLowerBound = hasAny(normalized, ['over', 'above', 'more than', 'plus de', 'au dessus de']);
    const hasUpperBound = hasAny(normalized, ['under', 'below', 'less than', 'moins de', 'sous', 'maximum', 'max']);

    if (hasLowerBound && !hasUpperBound) {
      intent.minPrice = value;
    } else {
      intent.maxPrice = value;
    }
  }

  if (quantity !== undefined && Number.isFinite(quantity)) {
    intent.quantity = Math.max(1, Math.floor(quantity));
  }
  if (wantsBulk) {
    intent.wantsBulk = true;
  }
  if (wantsComparison) {
    intent.wantsComparison = true;
  }
  if (wantsCheaper) {
    intent.wantsCheaper = true;
  }

  if (fieldNames.some((field) => intent[field] !== undefined)) {
    intent.query = normalized;
  }

  const meaningfulIntent = fieldNames.some((field) => intent[field] !== undefined);
  const isOffTopic = !isGreeting && !meaningfulIntent && normalized.length > 0;

  return {
    intent,
    isGreeting,
    isOffTopic,
    language: detectLanguage(normalized),
    preferredProductIndex: detectPreferredIndex(normalized),
  };
}

export function mergeShoppingIntent(previous: ShoppingIntent = {}, next: ShoppingIntent = {}): ShoppingIntent {
  const merged: ShoppingIntent = { ...previous };
  const stickyFields: (keyof ShoppingIntent)[] = [
    'query',
    'category',
    'productType',
    'material',
    'room',
    'color',
    'style',
    'mood',
    'minPrice',
    'maxPrice',
    'quantity',
  ];

  for (const field of stickyFields) {
    if (next[field] !== undefined) {
      Object.assign(merged, { [field]: next[field] });
    }
  }

  merged.wantsBulk = Boolean(previous.wantsBulk || next.wantsBulk);
  merged.wantsComparison = Boolean(next.wantsComparison);
  merged.wantsCheaper = Boolean(next.wantsCheaper);

  return merged;
}

export function hasSearchCriteria(intent: ShoppingIntent) {
  return ['category', 'productType', 'material', 'room', 'color', 'style', 'mood', 'minPrice', 'maxPrice', 'wantsBulk'].some(
    (field) => intent[field as keyof ShoppingIntent] !== undefined,
  );
}
