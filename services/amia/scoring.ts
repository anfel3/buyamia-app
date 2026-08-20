import type { Product } from '../../types';
import type { ScoredProduct, ShoppingIntent } from './types';

export const scoreWeights = {
  productType: 5,
  category: 4,
  material: 3,
  room: 3,
  budget: 3,
  color: 2,
  style: 2,
  mood: 1,
  bulk: 2,
} as const;

export function parseCatalogPrice(product: Product) {
  return product.priceIdr ?? (Number(product.idrPrice.replace(/[^0-9]/g, '')) || 0);
}

function productHasMaterial(product: Product, material: string) {
  if (product.material === material) {
    return true;
  }

  return Boolean(product.keywords?.some((keyword) => keyword.toLowerCase() === material));
}

export function scoreProduct(product: Product, intent: ShoppingIntent): ScoredProduct {
  const criteria: ScoredProduct['criteria'] = [];
  const price = parseCatalogPrice(product);

  if (intent.productType && product.productType === intent.productType) {
    criteria.push({ label: `type: ${intent.productType}`, weight: scoreWeights.productType });
  }
  if (intent.category && product.categoryId === intent.category) {
    criteria.push({ label: `category: ${intent.category}`, weight: scoreWeights.category });
  }
  if (intent.material && productHasMaterial(product, intent.material)) {
    criteria.push({ label: `material: ${intent.material}`, weight: scoreWeights.material });
  }
  if (intent.room && product.room === intent.room) {
    criteria.push({ label: `room: ${intent.room}`, weight: scoreWeights.room });
  }
  if (
    (intent.minPrice !== undefined || intent.maxPrice !== undefined) &&
    (intent.minPrice === undefined || price >= intent.minPrice) &&
    (intent.maxPrice === undefined || price <= intent.maxPrice)
  ) {
    criteria.push({ label: 'budget respected', weight: scoreWeights.budget });
  }
  if (intent.color && product.colorName === intent.color) {
    criteria.push({ label: `color: ${intent.color}`, weight: scoreWeights.color });
  }
  if (intent.style && product.style === intent.style) {
    criteria.push({ label: `style: ${intent.style}`, weight: scoreWeights.style });
  }
  if (intent.mood && product.mood === intent.mood) {
    criteria.push({ label: `mood: ${intent.mood}`, weight: scoreWeights.mood });
  }
  if (intent.wantsBulk && product.bulkAvailable) {
    criteria.push({ label: 'bulk compatible', weight: scoreWeights.bulk });
  }

  return {
    criteria,
    product,
    score: criteria.reduce((total, criterion) => total + criterion.weight, 0),
  };
}

export function scoreCatalog(intent: ShoppingIntent, catalog: Product[]): ScoredProduct[] {
  return catalog
    .map((product, index) => ({ index, result: scoreProduct(product, intent) }))
    .filter(({ result }) => result.score > 0)
    .sort((a, b) => b.result.score - a.result.score || a.index - b.index)
    .map(({ result }) => result);
}

export function productMatchesAllRequestedCriteria(product: Product, intent: ShoppingIntent) {
  const price = parseCatalogPrice(product);

  return (
    (!intent.productType || product.productType === intent.productType) &&
    (!intent.category || product.categoryId === intent.category) &&
    (!intent.material || productHasMaterial(product, intent.material)) &&
    (!intent.room || product.room === intent.room) &&
    (!intent.color || product.colorName === intent.color) &&
    (!intent.style || product.style === intent.style) &&
    (!intent.mood || product.mood === intent.mood) &&
    (!intent.wantsBulk || Boolean(product.bulkAvailable)) &&
    (intent.minPrice === undefined || price >= intent.minPrice) &&
    (intent.maxPrice === undefined || price <= intent.maxPrice)
  );
}
