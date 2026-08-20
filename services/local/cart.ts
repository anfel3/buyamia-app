import { products } from '../../data';
import type { Product } from '../../types';
import {
  addCartItem,
  parseIdrPrice,
  removeCartItem,
  setCartItemQuantity,
} from '../domain/cart';
import type { CartItem, CartProductInput } from '../domain/cart';
import { readJson, storageKeys, writeJson } from './storage';
import type { LocalStorageDriver } from './storage';

type CartOptions = {
  storage?: LocalStorageDriver;
};

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    Number.isFinite(item.quantity)
  );
}

function isCartItems(value: unknown): value is CartItem[] {
  return Array.isArray(value) && value.every(isCartItem);
}

function inputFromProduct(product: Product): CartProductInput {
  return {
    id: product.id,
    imageKey: product.imageKey,
    name: product.name,
    price: parseIdrPrice(product.idrPrice),
    seller: product.seller,
  };
}

function normalizeItems(items: CartItem[]) {
  return items.map((item) => ({
    ...item,
    quantity: Math.max(1, Math.floor(item.quantity)),
  }));
}

async function writeCart(userId: string, items: CartItem[], options: CartOptions = {}) {
  const nextItems = normalizeItems(items);
  await writeJson(storageKeys.cartForUser(userId), nextItems, options.storage);

  return nextItems;
}

export async function getCart(userId: string, options: CartOptions = {}) {
  const items = await readJson(storageKeys.cartForUser(userId), [], isCartItems, options.storage);

  return normalizeItems(items);
}

export async function addCartProduct(userId: string, productId: string, quantity = 1, options: CartOptions = {}) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    throw new Error('Product could not be found.');
  }

  const items = await getCart(userId, options);

  return writeCart(userId, addCartItem(items, inputFromProduct(product), quantity), options);
}

export async function updateCartProductQuantity(userId: string, productId: string, quantity: number, options: CartOptions = {}) {
  const items = await getCart(userId, options);

  return writeCart(userId, setCartItemQuantity(items, productId, quantity), options);
}

export async function removeCartProduct(userId: string, productId: string, options: CartOptions = {}) {
  const items = await getCart(userId, options);

  return writeCart(userId, removeCartItem(items, productId), options);
}

export async function clearCart(userId: string, options: CartOptions = {}) {
  return writeCart(userId, [], options);
}
