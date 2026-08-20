import { addSavedProduct, removeSavedProduct } from '../domain/saved';
import { isStringArray, readJson, storageKeys, writeJson } from './storage';
import type { LocalStorageDriver } from './storage';

type SavedOptions = {
  storage?: LocalStorageDriver;
};

export async function listSavedProductIds(userId: string, options: SavedOptions = {}) {
  return readJson(storageKeys.savedForUser(userId), [], isStringArray, options.storage);
}

export async function saveProduct(userId: string, productId: string, options: SavedOptions = {}) {
  const savedProductIds = await listSavedProductIds(userId, options);
  const nextSavedProductIds = addSavedProduct(savedProductIds, productId);

  await writeJson(storageKeys.savedForUser(userId), nextSavedProductIds, options.storage);

  return nextSavedProductIds;
}

export async function removeSavedProductId(userId: string, productId: string, options: SavedOptions = {}) {
  const savedProductIds = await listSavedProductIds(userId, options);
  const nextSavedProductIds = removeSavedProduct(savedProductIds, productId);

  await writeJson(storageKeys.savedForUser(userId), nextSavedProductIds, options.storage);

  return nextSavedProductIds;
}
