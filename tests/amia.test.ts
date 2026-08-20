import assert from 'node:assert/strict';
import test from 'node:test';

import { products } from '../data';
import {
  clearAmiaMemory,
  createAmiaReply,
  mergeShoppingIntent,
  parseShoppingIntent,
  readAmiaMemory,
  scoreCatalog,
  writeAmiaMemory,
} from '../services/amia';
import type { LocalStorageDriver } from '../services/local/storage';

class MemoryStorage implements LocalStorageDriver {
  values = new Map<string, string>();

  async getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  async removeItem(key: string) {
    this.values.delete(key);
  }

  async setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const now = () => '2026-08-21T00:00:00.000Z';
const productIds = new Set(products.map((product) => product.id));

test('recognizes French product, material and room synonyms with accent normalization', () => {
  const intent = parseShoppingIntent('Je cherche une chaise en bambou pour mon séjour.');

  assert.equal(intent.productType, 'chair');
  assert.equal(intent.material, 'bamboo');
  assert.equal(intent.room, 'Living Room');
});

test('recognizes English category, eco-friendly material and room synonyms', () => {
  const intent = parseShoppingIntent('Hello, I need eco-friendly furniture for a living room');

  assert.equal(intent.category, 'furniture');
  assert.equal(intent.material, 'natural');
  assert.equal(intent.room, 'Living Room');
});

test('extracts budgets written with digits, IDR separators, million and juta forms', () => {
  assert.equal(parseShoppingIntent('moins de 2 millions').maxPrice, 2_000_000);
  assert.equal(parseShoppingIntent('under 2 million').maxPrice, 2_000_000);
  assert.equal(parseShoppingIntent('2,000,000 IDR').maxPrice, 2_000_000);
  assert.equal(parseShoppingIntent('moins de 2 juta').maxPrice, 2_000_000);
});

test('combines multiple criteria and keeps ranked catalog results stable', () => {
  const intent = parseShoppingIntent('Je cherche une chaise en bambou pour mon salon moins de 2 millions');
  const firstRun = scoreCatalog(intent, products).map((result) => result.product.id);
  const secondRun = scoreCatalog(intent, products).map((result) => result.product.id);

  assert.deepEqual(firstRun, secondRun);
  assert.equal(firstRun[0], 'coconut-shell-wood-kitchen-chair');
  assert.ok(scoreCatalog(intent, products)[0].criteria.some((criterion) => criterion.label === 'type: chair'));
});

test('returns only products under the requested budget when budget is part of the score', () => {
  const reply = createAmiaReply('Show me furniture under 2 million IDR');

  assert.ok(reply.productIds.length > 0);
  assert.ok(reply.productIds.every((id) => {
    const product = products.find((item) => item.id === id);

    return product !== undefined && product.priceIdr <= 2_000_000;
  }));
});

test('returns no products when the local catalog has no result under budget', () => {
  const reply = createAmiaReply('under 500000 IDR');

  assert.deepEqual(reply.productIds, []);
});

test('compares the first two recently recommended products without inventing data', () => {
  const reply = createAmiaReply('Compare the first two products', {
    recentRecommendedProductIds: ['eco-friendly-bamboo-table', 'coconut-shell-wood-kitchen-chair'],
  });

  assert.deepEqual(reply.productIds, ['eco-friendly-bamboo-table', 'coconut-shell-wood-kitchen-chair']);
  assert.match(reply.text, /Eco Friendly Bamboo side table/);
  assert.match(reply.text, /Eco Friendly Coconut Shell Wood Kitchen Chair/);
});

test('finds a cheaper catalog option from recent recommendations', () => {
  const reply = createAmiaReply('Show me a cheaper option', {
    currentIntent: { maxPrice: 2_000_000 },
    recentRecommendedProductIds: ['eco-friendly-bamboo-table'],
  });

  assert.deepEqual(reply.productIds, ['beauty-care-package']);
});

test('merges a budget response with the previous shopping intent', () => {
  const previous = parseShoppingIntent('Je cherche une chaise pour le salon');
  const next = parseShoppingIntent('Moins de 2 millions IDR');
  const merged = mergeShoppingIntent(previous, next);

  assert.equal(merged.productType, 'chair');
  assert.equal(merged.room, 'Living Room');
  assert.equal(merged.maxPrice, 2_000_000);
});

test('recognizes bulk quantities and returns bulk-compatible products', () => {
  const reply = createAmiaReply('Je souhaite en commander 20', {
    currentIntent: { category: 'furniture', maxPrice: 2_000_000 },
    recentRecommendedProductIds: ['eco-friendly-bamboo-table', 'coconut-shell-wood-kitchen-chair'],
  });

  assert.equal(reply.intent.quantity, 20);
  assert.equal(reply.intent.wantsBulk, true);
  assert.ok(reply.productIds.length > 0);
  assert.ok(reply.productIds.every((id) => products.find((product) => product.id === id)?.bulkAvailable));
});

test('keeps Amia memory persistent and isolated between users', async () => {
  const storage = new MemoryStorage();
  await writeAmiaMemory(
    'user-a',
    {
      currentIntent: { productType: 'chair', maxPrice: 2_000_000 },
      lastMessages: [{ id: 'a-1', author: 'You', text: 'chair' }],
      preferences: {},
      recentRecommendedProductIds: ['coconut-shell-wood-kitchen-chair'],
      updatedAt: now(),
    },
    { now, storage },
  );
  await writeAmiaMemory(
    'user-b',
    {
      currentIntent: { productType: 'table' },
      lastMessages: [{ id: 'b-1', author: 'You', text: 'table' }],
      preferences: {},
      recentRecommendedProductIds: ['eco-friendly-bamboo-table'],
      updatedAt: now(),
    },
    { now, storage },
  );

  const memoryA = await readAmiaMemory('user-a', { now, storage });
  const memoryB = await readAmiaMemory('user-b', { now, storage });

  assert.equal(memoryA.currentIntent.productType, 'chair');
  assert.equal(memoryA.preferences.budget?.maxPrice, 2_000_000);
  assert.deepEqual(memoryB.recentRecommendedProductIds, ['eco-friendly-bamboo-table']);
});

test('clears only the current Amia conversation', async () => {
  const storage = new MemoryStorage();
  await writeAmiaMemory(
    'user-a',
    {
      currentIntent: { productType: 'chair' },
      lastMessages: [{ id: 'a-1', author: 'You', text: 'chair' }],
      preferences: {},
      recentRecommendedProductIds: ['coconut-shell-wood-kitchen-chair'],
      updatedAt: now(),
    },
    { now, storage },
  );
  await writeAmiaMemory(
    'user-b',
    {
      currentIntent: { productType: 'table' },
      lastMessages: [{ id: 'b-1', author: 'You', text: 'table' }],
      preferences: {},
      recentRecommendedProductIds: ['eco-friendly-bamboo-table'],
      updatedAt: now(),
    },
    { now, storage },
  );

  await clearAmiaMemory('user-a', { now, storage });

  assert.deepEqual((await readAmiaMemory('user-a', { now, storage })).lastMessages, []);
  assert.deepEqual((await readAmiaMemory('user-b', { now, storage })).lastMessages, [
    { id: 'b-1', author: 'You', text: 'table' },
  ]);
});

test('never returns invented product identifiers', () => {
  const replies = [
    createAmiaReply('Bonjour'),
    createAmiaReply('Je la préfère marron et moderne', {
      currentIntent: { productType: 'chair', room: 'Living Room', maxPrice: 2_000_000 },
      recentRecommendedProductIds: ['coconut-shell-wood-kitchen-chair'],
    }),
    createAmiaReply('Compare les deux premiers produits', {
      recentRecommendedProductIds: ['eco-friendly-bamboo-table', 'coconut-shell-wood-kitchen-chair'],
    }),
  ];

  for (const reply of replies) {
    assert.ok(reply.productIds.every((id) => productIds.has(id)));
  }
});
