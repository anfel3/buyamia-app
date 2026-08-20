export function addSavedProduct(savedProductIds: string[], productId: string) {
  return savedProductIds.includes(productId) ? savedProductIds : [...savedProductIds, productId];
}

export function removeSavedProduct(savedProductIds: string[], productId: string) {
  return savedProductIds.filter((id) => id !== productId);
}

export function isProductSaved(savedProductIds: string[], productId: string) {
  return savedProductIds.includes(productId);
}

export function assertAuthenticated(userId?: string | null) {
  if (!userId) {
    return { ok: false as const, message: 'Please sign in before using this feature.' };
  }

  return { ok: true as const };
}
