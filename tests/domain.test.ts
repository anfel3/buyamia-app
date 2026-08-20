import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  addCartItem,
  decrementCartItem,
  getCartSubtotal,
  incrementCartItem,
  removeCartItem,
  setCartItemQuantity,
} from '../services/domain/cart';
import { addSavedProduct, assertAuthenticated, isProductSaved, removeSavedProduct } from '../services/domain/saved';
import { validateEmail, validatePassword } from '../services/domain/validation';
import * as localAuth from '../services/local/auth';
import * as localCart from '../services/local/cart';
import * as localSaved from '../services/local/saved';
import type { LocalStorageDriver } from '../services/local/storage';
import { readJson, storageKeys } from '../services/local/storage';

const product = {
  id: 'eco-friendly-bamboo-table',
  name: 'Eco Friendly Bamboo side table',
  price: 1000000,
};

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

const hashString = async (value: string) => createHash('sha256').update(value).digest('hex');
const createId = (email: string) => `user-${email}`;
const now = () => '2026-08-21T00:00:00.000Z';

function authOptions(storage: LocalStorageDriver) {
  return { createId, hashString, now, storage };
}

test('validates sign-in and sign-up email/password fields', () => {
  assert.equal(validateEmail('not-an-email').valid, false);
  assert.equal(validateEmail('buyer@example.com').valid, true);
  assert.equal(validatePassword('').message, 'Please enter your password.');
  assert.equal(validatePassword('short').message, 'Password must contain at least 8 characters.');
  assert.equal(validatePassword('Password123').valid, true);
});

test('creates a local account, normalizes email, stores a session and avoids clear passwords', async () => {
  const storage = new MemoryStorage();
  const user = await localAuth.signUp(
    {
      email: ' Buyer@Example.COM ',
      name: 'Buyer One',
      password: 'Password123',
      passwordConfirmation: 'Password123',
    },
    authOptions(storage),
  );

  assert.equal(user.email, 'buyer@example.com');
  assert.equal(user.name, 'Buyer One');
  assert.equal((await localAuth.getCurrentUser({ storage }))?.id, user.id);
  assert.equal(storage.values.get(storageKeys.users)?.includes('"password"'), false);
  assert.equal(storage.values.get(storageKeys.users)?.includes('Password123'), false);
});

test('refuses duplicate local account emails', async () => {
  const storage = new MemoryStorage();
  const request = {
    email: 'buyer@example.com',
    name: 'Buyer One',
    password: 'Password123',
    passwordConfirmation: 'Password123',
  };

  await localAuth.signUp(request, authOptions(storage));

  await assert.rejects(
    localAuth.signUp({ ...request, email: ' BUYER@example.com ' }, authOptions(storage)),
    (error) => error instanceof localAuth.LocalAuthError && error.code === 'duplicate_email',
  );
});

test('signs in with the correct password and refuses a wrong password', async () => {
  const storage = new MemoryStorage();

  await localAuth.signUp(
    {
      email: 'buyer@example.com',
      name: 'Buyer One',
      password: 'Password123',
      passwordConfirmation: 'Password123',
    },
    authOptions(storage),
  );
  await localAuth.signOut({ storage });

  const user = await localAuth.signIn(
    { email: ' BUYER@example.com ', password: 'Password123' },
    authOptions(storage),
  );

  assert.equal(user.email, 'buyer@example.com');
  await assert.rejects(
    localAuth.signIn({ email: 'buyer@example.com', password: 'WrongPassword123' }, authOptions(storage)),
    (error) => error instanceof localAuth.LocalAuthError && error.code === 'invalid_credentials',
  );
});

test('restores and clears local sessions', async () => {
  const storage = new MemoryStorage();
  const user = await localAuth.signUp(
    {
      email: 'buyer@example.com',
      name: 'Buyer One',
      password: 'Password123',
      passwordConfirmation: 'Password123',
    },
    authOptions(storage),
  );

  assert.equal((await localAuth.getCurrentUser({ storage }))?.id, user.id);
  await localAuth.signOut({ storage });
  assert.equal(await localAuth.getCurrentUser({ storage }), null);
});

test('adds existing cart products by increasing quantity instead of duplicating rows', () => {
  const items = addCartItem(addCartItem([], product), product);

  assert.equal(items.length, 1);
  assert.equal(items[0].quantity, 2);
});

test('changes cart quantities with a minimum of one and computes totals with reduce', () => {
  let items = addCartItem([], product, 2);
  items = incrementCartItem(items, product.id);
  items = decrementCartItem(items, product.id);
  items = setCartItemQuantity(items, product.id, 0);

  assert.equal(items[0].quantity, 1);
  assert.equal(getCartSubtotal(items), 1000000);
});

test('removes cart items', () => {
  const items = removeCartItem(addCartItem([], product), product.id);

  assert.deepEqual(items, []);
});

test('adds and removes saved products without duplicates', () => {
  let saved = addSavedProduct([], product.id);
  saved = addSavedProduct(saved, product.id);

  assert.deepEqual(saved, [product.id]);
  assert.equal(isProductSaved(saved, product.id), true);
  assert.deepEqual(removeSavedProduct(saved, product.id), []);
});

test('requires authentication for protected actions', () => {
  assert.deepEqual(assertAuthenticated(null), {
    ok: false,
    message: 'Please sign in before using this feature.',
  });
  assert.deepEqual(assertAuthenticated('user-1'), { ok: true });
});

test('keeps saved products isolated between local users', async () => {
  const storage = new MemoryStorage();
  await localSaved.saveProduct('user-a', 'eco-friendly-bamboo-table', { storage });
  await localSaved.saveProduct('user-b', 'hand-carved-armchair', { storage });

  assert.deepEqual(await localSaved.listSavedProductIds('user-a', { storage }), ['eco-friendly-bamboo-table']);
  assert.deepEqual(await localSaved.listSavedProductIds('user-b', { storage }), ['hand-carved-armchair']);
});

test('keeps carts isolated, prevents duplicates, changes quantities and computes totals', async () => {
  const storage = new MemoryStorage();
  let cartA = await localCart.addCartProduct('user-a', 'eco-friendly-bamboo-table', 1, { storage });
  cartA = await localCart.addCartProduct('user-a', 'eco-friendly-bamboo-table', 2, { storage });
  cartA = await localCart.updateCartProductQuantity('user-a', 'eco-friendly-bamboo-table', 0, { storage });
  const cartB = await localCart.addCartProduct('user-b', 'hand-carved-armchair', 1, { storage });

  assert.equal(cartA.length, 1);
  assert.equal(cartA[0].quantity, 1);
  assert.equal(getCartSubtotal(cartA), 1000000);
  assert.deepEqual(cartB.map((item) => item.id), ['hand-carved-armchair']);
  assert.deepEqual((await localCart.getCart('user-a', { storage })).map((item) => item.id), [
    'eco-friendly-bamboo-table',
  ]);
});

test('removes local cart products and preserves empty state', async () => {
  const storage = new MemoryStorage();
  await localCart.addCartProduct('user-a', 'eco-friendly-bamboo-table', 1, { storage });

  assert.deepEqual(await localCart.removeCartProduct('user-a', 'eco-friendly-bamboo-table', { storage }), []);
  assert.deepEqual(await localCart.getCart('user-a', { storage }), []);
});

test('falls back safely and clears invalid local JSON data', async () => {
  const storage = new MemoryStorage();
  await storage.setItem(storageKeys.users, '{not-json');
  await storage.setItem(storageKeys.session, JSON.stringify({ userId: 'user-a' }));
  await storage.setItem(storageKeys.savedForUser('user-a'), JSON.stringify([1, 2, 3]));
  await storage.setItem(storageKeys.cartForUser('user-a'), JSON.stringify([{ id: 'bad' }]));

  assert.equal(await localAuth.getCurrentUser({ storage }), null);
  assert.deepEqual(await localSaved.listSavedProductIds('user-a', { storage }), []);
  assert.deepEqual(await localCart.getCart('user-a', { storage }), []);
  assert.equal(storage.values.has(storageKeys.users), false);
  assert.equal(storage.values.has(storageKeys.savedForUser('user-a')), false);
  assert.equal(storage.values.has(storageKeys.cartForUser('user-a')), false);
});

test('readJson returns the fallback when data is absent', async () => {
  const storage = new MemoryStorage();

  assert.deepEqual(
    await readJson('missing-key', ['fallback'], (value): value is string[] => Array.isArray(value), storage),
    ['fallback'],
  );
});
