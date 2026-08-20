import { readJson, removeStoredValue, storageKeys, writeJson } from './storage';
import type { LocalStorageDriver } from './storage';

export type AuthRole = 'hotel' | 'restaurant' | 'service_provider' | 'supplier' | 'viewer';

export type AuthUser = {
  dashboardUrl?: string;
  email: string;
  id: string;
  name: string;
  onboardingStatus?: string;
  providerId?: string;
  role: AuthRole | 'main_admin';
  verificationStatus?: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  role?: AuthRole;
};

export class LocalAuthError extends Error {
  code:
    | 'duplicate_email'
    | 'invalid_credentials'
    | 'password_mismatch'
    | 'storage_error'
    | 'user_not_found';

  constructor(message: string, code: LocalAuthError['code']) {
    super(message);
    this.name = 'LocalAuthError';
    this.code = code;
  }
}

type StoredAccount = {
  createdAt: string;
  email: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  role: AuthUser['role'];
  userId: string;
};

type StoredSession = {
  userId: string;
};

type AuthOptions = {
  createId?: (email: string) => string;
  hashString?: (value: string) => Promise<string>;
  now?: () => string;
  storage?: LocalStorageDriver;
};

const defaultNow = () => new Date().toISOString();

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isStoredAccount(value: unknown): value is StoredAccount {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const account = value as Partial<StoredAccount>;

  return (
    typeof account.createdAt === 'string' &&
    typeof account.email === 'string' &&
    typeof account.name === 'string' &&
    typeof account.passwordHash === 'string' &&
    typeof account.passwordSalt === 'string' &&
    typeof account.role === 'string' &&
    typeof account.userId === 'string'
  );
}

function isStoredAccounts(value: unknown): value is StoredAccount[] {
  return Array.isArray(value) && value.every(isStoredAccount);
}

function isStoredSession(value: unknown): value is StoredSession {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as Partial<StoredSession>).userId === 'string',
  );
}

function toAuthUser(account: StoredAccount): AuthUser {
  return {
    email: account.email,
    id: account.userId,
    name: account.name,
    role: account.role,
  };
}

function createSalt() {
  const cryptoObject = globalThis.crypto;

  if (cryptoObject?.randomUUID) {
    return cryptoObject.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function defaultCreateId(email: string) {
  const cryptoObject = globalThis.crypto;
  const suffix = cryptoObject?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `local-${email.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${suffix}`;
}

async function defaultHashString(value: string) {
  const Crypto = await import('expo-crypto');

  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);
}

async function hashPassword(password: string, salt: string, hashString = defaultHashString) {
  return hashString(`${salt}:${password}`);
}

async function readAccounts(storage?: LocalStorageDriver) {
  return readJson(storageKeys.users, [], isStoredAccounts, storage);
}

async function writeAccounts(accounts: StoredAccount[], storage?: LocalStorageDriver) {
  await writeJson(storageKeys.users, accounts, storage);
}

async function writeSession(userId: string, storage?: LocalStorageDriver) {
  await writeJson(storageKeys.session, { userId }, storage);
}

export async function signUp(request: SignUpRequest, options: AuthOptions = {}) {
  const email = normalizeEmail(request.email);
  const accounts = await readAccounts(options.storage);

  if (accounts.some((account) => normalizeEmail(account.email) === email)) {
    throw new LocalAuthError('A local account already exists for this email.', 'duplicate_email');
  }

  if (request.password !== request.passwordConfirmation) {
    throw new LocalAuthError('Passwords do not match.', 'password_mismatch');
  }

  const salt = createSalt();
  const account: StoredAccount = {
    createdAt: options.now?.() ?? defaultNow(),
    email,
    name: request.name.trim() || email,
    passwordHash: await hashPassword(request.password, salt, options.hashString),
    passwordSalt: salt,
    role: request.role ?? 'viewer',
    userId: options.createId?.(email) ?? defaultCreateId(email),
  };

  await writeAccounts([...accounts, account], options.storage);
  await writeSession(account.userId, options.storage);

  return toAuthUser(account);
}

export async function signIn(request: SignInRequest, options: AuthOptions = {}) {
  const email = normalizeEmail(request.email);
  const accounts = await readAccounts(options.storage);
  const account = accounts.find((item) => normalizeEmail(item.email) === email);

  if (!account) {
    throw new LocalAuthError('Email or password is incorrect.', 'invalid_credentials');
  }

  const passwordHash = await hashPassword(request.password, account.passwordSalt, options.hashString);

  if (passwordHash !== account.passwordHash) {
    throw new LocalAuthError('Email or password is incorrect.', 'invalid_credentials');
  }

  await writeSession(account.userId, options.storage);

  return toAuthUser(account);
}

export async function getCurrentUser(options: Pick<AuthOptions, 'storage'> = {}) {
  const session = await readJson<StoredSession | null>(
    storageKeys.session,
    null,
    (value): value is StoredSession | null => value === null || isStoredSession(value),
    options.storage,
  );

  if (!session) {
    return null;
  }

  const accounts = await readAccounts(options.storage);
  const account = accounts.find((item) => item.userId === session.userId);

  if (!account) {
    await removeStoredValue(storageKeys.session, options.storage);
    return null;
  }

  return toAuthUser(account);
}

export async function signOut(options: Pick<AuthOptions, 'storage'> = {}) {
  await removeStoredValue(storageKeys.session, options.storage);
}
