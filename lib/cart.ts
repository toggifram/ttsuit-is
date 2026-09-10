export type CartItem = {
  variantId: string;
  handle: string;
  title: string;
  image: string;
  href: string;
  size?: string;
  color?: string;
  quantity: number;
  quantityAvailable?: number;
  priceAmount: number;
};

export const CART_STORAGE_KEY = "tjetje-cart";
export const CHECKOUT_CART_BACKUP_KEY = `${CART_STORAGE_KEY}-pending-checkout`;

export function parseCartItems(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.priceAmount * item.quantity, 0);
}
