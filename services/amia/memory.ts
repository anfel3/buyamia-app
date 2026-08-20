import { readJson, removeStoredValue, storageKeys, writeJson } from '../local/storage';
import type { LocalStorageDriver } from '../local/storage';
import type { AmiaMemory, AmiaMessage, AmiaPreferences, ShoppingIntent } from './types';

export const GUEST_AMIA_USER_ID = 'guest';
const MAX_MESSAGES = 20;

type AmiaMemoryOptions = {
  now?: () => string;
  storage?: LocalStorageDriver;
};

const defaultNow = () => new Date().toISOString();

export function amiaUserKey(userId?: string | null) {
  return userId || GUEST_AMIA_USER_ID;
}

function preferencesFromIntent(intent: ShoppingIntent): AmiaPreferences {
  return {
    budget: intent.minPrice !== undefined || intent.maxPrice !== undefined
      ? {
          maxPrice: intent.maxPrice,
          minPrice: intent.minPrice,
        }
      : undefined,
    color: intent.color,
    material: intent.material,
    mood: intent.mood,
    productType: intent.productType,
    room: intent.room,
    style: intent.style,
  };
}

function isMessage(value: unknown): value is AmiaMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const message = value as Partial<AmiaMessage>;

  return (
    (message.author === 'Amia' || message.author === 'You') &&
    typeof message.id === 'string' &&
    typeof message.text === 'string'
  );
}

function isShoppingIntent(value: unknown): value is ShoppingIntent {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isAmiaMemory(value: unknown): value is AmiaMemory {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const memory = value as Partial<AmiaMemory>;

  return (
    isShoppingIntent(memory.currentIntent) &&
    Array.isArray(memory.lastMessages) &&
    memory.lastMessages.every(isMessage) &&
    Boolean(memory.preferences && typeof memory.preferences === 'object') &&
    Array.isArray(memory.recentRecommendedProductIds) &&
    memory.recentRecommendedProductIds.every((id) => typeof id === 'string') &&
    typeof memory.updatedAt === 'string'
  );
}

export function createEmptyAmiaMemory(now = defaultNow): AmiaMemory {
  return {
    currentIntent: {},
    lastMessages: [],
    preferences: {},
    recentRecommendedProductIds: [],
    updatedAt: now(),
  };
}

function normalizeMemory(memory: AmiaMemory, now = defaultNow): AmiaMemory {
  return {
    ...memory,
    lastMessages: memory.lastMessages.slice(-MAX_MESSAGES),
    preferences: preferencesFromIntent(memory.currentIntent),
    recentRecommendedProductIds: memory.recentRecommendedProductIds.slice(0, 10),
    updatedAt: memory.updatedAt || now(),
  };
}

export async function readAmiaMemory(userId?: string | null, options: AmiaMemoryOptions = {}) {
  const key = storageKeys.amiaForUser(amiaUserKey(userId));
  const fallback = createEmptyAmiaMemory(options.now);

  return normalizeMemory(await readJson(key, fallback, isAmiaMemory, options.storage), options.now);
}

export async function writeAmiaMemory(userId: string | null | undefined, memory: AmiaMemory, options: AmiaMemoryOptions = {}) {
  const key = storageKeys.amiaForUser(amiaUserKey(userId));
  const nextMemory = normalizeMemory(
    {
      ...memory,
      preferences: preferencesFromIntent(memory.currentIntent),
      updatedAt: options.now?.() ?? defaultNow(),
    },
    options.now,
  );

  await writeJson(key, nextMemory, options.storage);

  return nextMemory;
}

export async function appendAmiaMessages(
  userId: string | null | undefined,
  memory: AmiaMemory,
  messages: AmiaMessage[],
  options: AmiaMemoryOptions = {},
) {
  return writeAmiaMemory(
    userId,
    {
      ...memory,
      lastMessages: [...memory.lastMessages, ...messages].slice(-MAX_MESSAGES),
    },
    options,
  );
}

export async function clearAmiaMemory(userId?: string | null, options: AmiaMemoryOptions = {}) {
  await removeStoredValue(storageKeys.amiaForUser(amiaUserKey(userId)), options.storage);

  return createEmptyAmiaMemory(options.now);
}
