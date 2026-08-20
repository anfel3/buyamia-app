export type CartProductInput = {
  id: string;
  imageKey?: string;
  name: string;
  price: number;
  seller?: string;
};

export type CartItem = CartProductInput & {
  quantity: number;
};

export function addCartItem(items: CartItem[], product: CartProductInput, quantity = 1): CartItem[] {
  const safeQuantity = Math.max(1, Math.floor(quantity));
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + safeQuantity } : item,
    );
  }

  return [...items, { ...product, quantity: safeQuantity }];
}

export function removeCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.id !== productId);
}

export function setCartItemQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  const safeQuantity = Math.max(1, Math.floor(quantity));

  return items.map((item) => (item.id === productId ? { ...item, quantity: safeQuantity } : item));
}

export function incrementCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
}

export function decrementCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.map((item) =>
    item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
  );
}

export function getCartLineSubtotal(item: CartItem) {
  return item.price * item.quantity;
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + getCartLineSubtotal(item), 0);
}

export const getCartTotal = getCartSubtotal;

export function parseIdrPrice(price: string) {
  return Number(price.replace(/[^0-9]/g, '')) || 0;
}
