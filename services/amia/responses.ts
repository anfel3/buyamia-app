import type { Product } from '../../types';
import { getProductById, products as defaultProducts } from '../../data';
import { hasSearchCriteria, mergeShoppingIntent, parseShoppingMessage } from './intent';
import { parseCatalogPrice, productMatchesAllRequestedCriteria, scoreCatalog } from './scoring';
import type { AmiaEngineReply, AmiaEngineState, AmiaLanguage, ScoredProduct, ShoppingIntent } from './types';

const successTemplates = {
  en: [
    'I found products from the Buyamia catalog that match your request.',
    'Here are the closest Buyamia catalog matches for your criteria.',
    'I found local catalog options that fit your shopping preferences.',
  ],
  fr: [
    'J’ai trouvé des produits du catalogue Buyamia qui correspondent à votre demande.',
    'Voici les meilleures correspondances du catalogue Buyamia pour vos critères.',
    'J’ai trouvé des options locales Buyamia adaptées à vos préférences.',
  ],
} as const;

const partialTemplates = {
  en: [
    'I could not find an exact catalog match, but these are the closest available options.',
    'There is no exact match for every criterion, so I’m showing the nearest Buyamia products.',
  ],
  fr: [
    'Je n’ai pas trouvé de correspondance exacte, mais voici les options disponibles les plus proches.',
    'Aucun produit ne réunit tous les critères, donc je vous montre les produits Buyamia les plus proches.',
  ],
} as const;

const formatPrice = (value: number) => `IDR ${value.toLocaleString('en-US')}`;

const pick = <T,>(items: readonly T[], turnCount = 0) => items[turnCount % items.length];

function topReason(result: ScoredProduct, language: AmiaLanguage) {
  const reasons = result.criteria.slice(0, 3).map((criterion) => criterion.label).join(', ');

  if (language === 'fr') {
    return `${result.product.name} arrive en tête grâce à: ${reasons}.`;
  }

  return `${result.product.name} is the closest match because of: ${reasons}.`;
}

function suggestionsForIntent(intent: ShoppingIntent, language: AmiaLanguage) {
  if (!intent.maxPrice) {
    return language === 'fr'
      ? ['Moins de 2 millions IDR', 'Budget flexible']
      : ['Under 2 million IDR', 'Flexible budget'];
  }
  if (!intent.material) {
    return language === 'fr' ? ['Bambou', 'Bois naturel'] : ['Bamboo', 'Natural wood'];
  }
  if (!intent.style) {
    return language === 'fr' ? ['Moderne', 'Traditionnel'] : ['Modern', 'Traditional'];
  }

  return language === 'fr' ? ['Montre-moi moins cher', 'Compare les deux premiers'] : ['Show me cheaper', 'Compare the first two'];
}

function followUpQuestion(intent: ShoppingIntent, language: AmiaLanguage) {
  if (!intent.productType && !intent.category) {
    return language === 'fr'
      ? 'Quel type de produit recherchez-vous dans le catalogue Buyamia ?'
      : 'What type of Buyamia product are you looking for?';
  }
  if (!intent.maxPrice && !intent.minPrice) {
    return language === 'fr' ? 'Quel est votre budget ?' : 'What is your budget?';
  }
  if (!intent.room) {
    return language === 'fr' ? 'Pour quelle pièce est-ce prévu ?' : 'Which room is this for?';
  }
  if (!intent.material) {
    return language === 'fr'
      ? 'Avez-vous une préférence de matériau ?'
      : 'Do you have a preferred material?';
  }

  return undefined;
}

function compareProducts(productIds: string[], language: AmiaLanguage) {
  const compared = productIds.map((id) => getProductById(id)).filter((product): product is Product => Boolean(product));

  if (compared.length < 2) {
    return language === 'fr'
      ? 'Je peux comparer deux produits après vous avoir proposé au moins deux options du catalogue.'
      : 'I can compare two products after recommending at least two catalog options.';
  }

  const [first, second] = compared;
  const firstPrice = parseCatalogPrice(first);
  const secondPrice = parseCatalogPrice(second);
  const cheaper = firstPrice === secondPrice ? undefined : firstPrice < secondPrice ? first : second;

  if (language === 'fr') {
    return [
      `${first.name} est un produit ${first.material} pour ${first.room}, style ${first.style}, à ${formatPrice(firstPrice)}.`,
      `${second.name} est un produit ${second.material} pour ${second.room}, style ${second.style}, à ${formatPrice(secondPrice)}.`,
      cheaper ? `${cheaper.name} est l’option la moins chère.` : 'Les deux produits ont le même prix catalogue.',
    ].join(' ');
  }

  return [
    `${first.name} is a ${first.material} product for ${first.room}, ${first.style} style, at ${formatPrice(firstPrice)}.`,
    `${second.name} is a ${second.material} product for ${second.room}, ${second.style} style, at ${formatPrice(secondPrice)}.`,
    cheaper ? `${cheaper.name} is the lower-priced option.` : 'Both products have the same catalog price.',
  ].join(' ');
}

function cheaperProducts(intent: ShoppingIntent, recentIds: string[], catalog: Product[]) {
  const referenceProducts = recentIds.map((id) => catalog.find((product) => product.id === id)).filter((product): product is Product => Boolean(product));
  const referencePrice = referenceProducts.length
    ? Math.min(...referenceProducts.map(parseCatalogPrice))
    : intent.maxPrice;

  if (!referencePrice) {
    return [] as ScoredProduct[];
  }

  const cheaperIntent = {
    ...intent,
    maxPrice: referencePrice - 1,
    wantsCheaper: false,
    wantsComparison: false,
  };

  return scoreCatalog(cheaperIntent, catalog)
    .filter((result) => parseCatalogPrice(result.product) < referencePrice)
    .slice(0, 3);
}

function productIdsFrom(results: ScoredProduct[]) {
  return results.map((result) => result.product.id);
}

export function createAmiaReply(
  input: string,
  state: AmiaEngineState = {},
  catalog: Product[] = defaultProducts,
): AmiaEngineReply {
  const parsed = parseShoppingMessage(input);
  const intent = mergeShoppingIntent(state.currentIntent, parsed.intent);
  const turnCount = state.turnCount ?? 0;
  const recentIds = state.recentRecommendedProductIds ?? [];

  if (parsed.isGreeting && !hasSearchCriteria(parsed.intent)) {
    const text = parsed.language === 'fr'
      ? 'Bonjour. Je suis Amia, l’assistante d’achat locale intelligente de Buyamia. Quel produit recherchez-vous ?'
      : 'Hello. I am Amia, Buyamia’s local smart shopping assistant. What are you shopping for?';

    return { intent, language: parsed.language, productIds: recentIds, scoredProducts: [], suggestions: suggestionsForIntent(intent, parsed.language), text };
  }

  if (parsed.intent.wantsComparison) {
    const productIds = recentIds.length >= 2 ? recentIds.slice(0, 2) : productIdsFrom(scoreCatalog(intent, catalog).slice(0, 2));
    const text = compareProducts(productIds, parsed.language);

    return { intent, language: parsed.language, productIds, scoredProducts: [], suggestions: suggestionsForIntent(intent, parsed.language), text };
  }

  if (parsed.preferredProductIndex !== undefined && recentIds[parsed.preferredProductIndex]) {
    const preferredId = recentIds[parsed.preferredProductIndex];
    const product = preferredId ? catalog.find((item) => item.id === preferredId) : undefined;
    const text = product
      ? parsed.language === 'fr'
        ? `D’accord, je garde ${product.name} comme préférence pour cette conversation.`
        : `Got it, I’ll keep ${product.name} as your preferred option in this conversation.`
      : parsed.language === 'fr'
        ? 'Je garde votre préférence pour la suite de la conversation.'
        : 'I’ll keep your preference for the rest of this conversation.';

    return { intent, language: parsed.language, productIds: product ? [product.id] : recentIds, scoredProducts: [], suggestions: suggestionsForIntent(intent, parsed.language), text };
  }

  if (parsed.intent.wantsCheaper) {
    const results = cheaperProducts(intent, recentIds, catalog);
    const text = results.length
      ? parsed.language === 'fr'
        ? `Voici une option moins chère disponible dans le catalogue Buyamia. ${topReason(results[0], parsed.language)}`
        : `Here is a lower-priced option available in the Buyamia catalog. ${topReason(results[0], parsed.language)}`
      : parsed.language === 'fr'
        ? 'Je ne trouve pas d’option moins chère dans le catalogue Buyamia pour ces critères.'
        : 'I cannot find a cheaper Buyamia catalog option for those criteria.';

    return { intent, language: parsed.language, productIds: productIdsFrom(results), scoredProducts: results, suggestions: suggestionsForIntent(intent, parsed.language), text };
  }

  if (parsed.isOffTopic && !hasSearchCriteria(intent)) {
    const text = parsed.language === 'fr'
      ? 'Je peux aider uniquement avec les produits du catalogue Buyamia et vos préférences d’achat locales.'
      : 'I can help only with Buyamia catalog products and local shopping preferences.';

    return { intent, language: parsed.language, productIds: [], scoredProducts: [], suggestions: suggestionsForIntent(intent, parsed.language), text };
  }

  const scored = scoreCatalog(intent, catalog);
  const exactResults = scored.filter((result) => productMatchesAllRequestedCriteria(result.product, intent));
  const visibleResults = (exactResults.length ? exactResults : scored).slice(0, 3);
  const question = followUpQuestion(intent, parsed.language);

  if (!visibleResults.length) {
    const text = question ?? (parsed.language === 'fr'
      ? 'Je ne trouve aucun produit Buyamia correspondant à cette demande dans le catalogue local.'
      : 'I cannot find a Buyamia product matching that request in the local catalog.');

    return { intent, language: parsed.language, productIds: [], scoredProducts: [], suggestions: suggestionsForIntent(intent, parsed.language), text };
  }

  const intro = exactResults.length ? pick(successTemplates[parsed.language], turnCount) : pick(partialTemplates[parsed.language], turnCount);
  const bulkNote = intent.wantsBulk
    ? parsed.language === 'fr'
      ? ' Les résultats affichés indiquent une compatibilité avec les commandes en gros lorsque cette information existe dans le catalogue.'
      : ' The displayed results use catalog bulk-order compatibility where it is available.'
    : '';
  const text = `${intro} ${topReason(visibleResults[0], parsed.language)}${bulkNote}${question ? ` ${question}` : ''}`;

  return {
    intent,
    language: parsed.language,
    productIds: productIdsFrom(visibleResults),
    scoredProducts: visibleResults,
    suggestions: suggestionsForIntent(intent, parsed.language),
    text,
  };
}
