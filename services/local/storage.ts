export type LocalStorageDriver = {
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  setItem: (key: string, value: string) => Promise<void>;
};

export class LocalStorageError extends Error {
  key: string;
  operation: 'read' | 'remove' | 'write';

  constructor(operation: LocalStorageError['operation'], key: string, cause: unknown) {
    super(`Local storage ${operation} failed.`);
    this.name = 'LocalStorageError';
    this.key = key;
    this.operation = operation;
    this.cause = cause;
  }
}

export const storageKeys = {
  amiaForUser: (userId: string) => `@buyamia-app/v1/amia/${encodeURIComponent(userId)}`,
  cartForUser: (userId: string) => `@buyamia-app/v1/cart/${encodeURIComponent(userId)}`,
  savedForUser: (userId: string) => `@buyamia-app/v1/saved/${encodeURIComponent(userId)}`,
  session: '@buyamia-app/v1/auth/session',
  users: '@buyamia-app/v1/auth/users',
} as const;

let defaultStoragePromise: Promise<LocalStorageDriver> | null = null;

async function getDefaultStorage() {
  defaultStoragePromise ??= import('@react-native-async-storage/async-storage').then((module) =>
    module.default as unknown as LocalStorageDriver,
  );

  return defaultStoragePromise;
}

async function resolveStorage(storage?: LocalStorageDriver): Promise<LocalStorageDriver> {
  if (storage) {
    return storage;
  }

  return getDefaultStorage();
}

export async function readJson<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
  storage?: LocalStorageDriver,
): Promise<T> {
  const resolvedStorage = await resolveStorage(storage);
  let raw: string | null;

  try {
    raw = await resolvedStorage.getItem(key);
  } catch (error) {
    throw new LocalStorageError('read', key, error);
  }

  if (raw === null) {
    return fallback;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    await removeStoredValue(key, resolvedStorage);
    return fallback;
  }

  if (!isValid(parsed)) {
    await removeStoredValue(key, resolvedStorage);
    return fallback;
  }

  return parsed;
}

export async function writeJson<T>(
  key: string,
  value: T,
  storage?: LocalStorageDriver,
) {
  const resolvedStorage = await resolveStorage(storage);

  try {
    await resolvedStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new LocalStorageError('write', key, error);
  }
}

export async function removeStoredValue(key: string, storage?: LocalStorageDriver) {
  const resolvedStorage = await resolveStorage(storage);

  try {
    await resolvedStorage.removeItem(key);
  } catch (error) {
    throw new LocalStorageError('remove', key, error);
  }
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
