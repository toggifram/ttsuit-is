export type CartItem = {
  variantId: string;
  handle: string;
  title: string;
  image: string;
  href: string;
  size?: string;
  quantity: number;
  priceAmount: number;
};

export const CART_STORAGE_KEY = "tjetje-cart";

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.priceAmount * item.quantity, 0);
}
