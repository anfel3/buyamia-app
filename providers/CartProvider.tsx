import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { CartItem } from '../services/domain/cart';
import { getCartSubtotal, getCartTotal } from '../services/domain/cart';
import * as localCart from '../services/local/cart';
import { LocalStorageError } from '../services/local/storage';
import type { Product } from '../types';
import { useAuth } from './AuthProvider';

type ActionResult = {
  message?: string;
  ok: boolean;
  reason?: 'auth_required' | 'storage_error';
};

type CartContextValue = {
  addProduct: (product: Product, quantity?: number) => Promise<ActionResult>;
  error: string;
  items: CartItem[];
  loading: boolean;
  refreshCart: () => Promise<void>;
  removeProduct: (productId: string) => Promise<ActionResult>;
  setQuantity: (productId: string, quantity: number) => Promise<ActionResult>;
  subtotal: number;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function messageFromError(error: unknown) {
  if (error instanceof LocalStorageError) {
    return 'Local cart storage could not be read or updated.';
  }
  if (error instanceof Error) {
    return error.message;
  }

  return 'Cart could not be updated.';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshCart = useCallback(async () => {
    setError('');

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setItems(await localCart.getCart(user.id));
    } catch (cartError) {
      setItems([]);
      setError(messageFromError(cartError));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const guardedCartAction = useCallback(
    async (operation: (userId: string) => Promise<CartItem[]>): Promise<ActionResult> => {
      if (!user) {
        return { ok: false, reason: 'auth_required', message: 'Please sign in before using the cart.' };
      }

      setError('');
      setLoading(true);

      try {
        setItems(await operation(user.id));
        return { ok: true };
      } catch (cartError) {
        const message = messageFromError(cartError);
        setError(message);
        return { ok: false, reason: 'storage_error', message };
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const subtotal = getCartSubtotal(items);
  const total = getCartTotal(items);

  const value = useMemo<CartContextValue>(
    () => ({
      addProduct: (product, quantity = 1) =>
        guardedCartAction((userId) => localCart.addCartProduct(userId, product.id, quantity)),
      error,
      items,
      loading,
      refreshCart,
      removeProduct: (productId) =>
        guardedCartAction((userId) => localCart.removeCartProduct(userId, productId)),
      setQuantity: (productId, quantity) =>
        guardedCartAction((userId) =>
          localCart.updateCartProductQuantity(userId, productId, Math.max(1, Math.floor(quantity))),
        ),
      subtotal,
      total,
    }),
    [error, guardedCartAction, items, loading, refreshCart, subtotal, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }

  return context;
}
