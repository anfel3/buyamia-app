import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { isProductSaved } from '../services/domain/saved';
import * as localSaved from '../services/local/saved';
import { LocalStorageError } from '../services/local/storage';
import { useAuth } from './AuthProvider';

type ActionResult = {
  message?: string;
  ok: boolean;
  reason?: 'auth_required' | 'storage_error';
};

type SavedContextValue = {
  error: string;
  isSaved: (productId: string) => boolean;
  loading: boolean;
  refreshSaved: () => Promise<void>;
  savedProductIds: string[];
  toggleSaved: (productId: string) => Promise<ActionResult>;
};

const SavedContext = createContext<SavedContextValue | undefined>(undefined);

function messageFromError(error: unknown) {
  if (error instanceof LocalStorageError) {
    return 'Local saved products could not be read or updated.';
  }
  if (error instanceof Error) {
    return error.message;
  }

  return 'Saved products could not be updated.';
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshSaved = useCallback(async () => {
    setError('');

    if (!user) {
      setSavedProductIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setSavedProductIds(await localSaved.listSavedProductIds(user.id));
    } catch (savedError) {
      setSavedProductIds([]);
      setError(messageFromError(savedError));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshSaved();
  }, [refreshSaved]);

  const toggleSaved = useCallback(
    async (productId: string): Promise<ActionResult> => {
      if (!user) {
        return {
          ok: false,
          reason: 'auth_required',
          message: 'Please sign in before saving products.',
        };
      }

      setError('');
      const previousSavedIds = savedProductIds;
      const nextSavedIds = isProductSaved(savedProductIds, productId)
        ? savedProductIds.filter((id) => id !== productId)
        : [...savedProductIds, productId];

      setSavedProductIds(nextSavedIds);

      try {
        setSavedProductIds(
          isProductSaved(savedProductIds, productId)
            ? await localSaved.removeSavedProductId(user.id, productId)
            : await localSaved.saveProduct(user.id, productId),
        );
        return { ok: true };
      } catch (savedError) {
        const message = messageFromError(savedError);
        setSavedProductIds(previousSavedIds);
        setError(message);
        return { ok: false, reason: 'storage_error', message };
      }
    },
    [savedProductIds, user],
  );

  const value = useMemo<SavedContextValue>(
    () => ({
      error,
      isSaved: (productId) => isProductSaved(savedProductIds, productId),
      loading,
      refreshSaved,
      savedProductIds,
      toggleSaved,
    }),
    [error, loading, refreshSaved, savedProductIds, toggleSaved],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const context = useContext(SavedContext);

  if (!context) {
    throw new Error('useSaved must be used inside SavedProvider.');
  }

  return context;
}
