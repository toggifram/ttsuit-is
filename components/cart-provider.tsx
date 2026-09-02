"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CART_STORAGE_KEY,
  cartCount,
  cartTotal,
  type CartItem,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Ignore broken localStorage.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((row) => row.variantId === item.variantId);
        const max = Math.min(
          20,
          item.quantityAvailable ?? existing?.quantityAvailable ?? 20
        );
        if (max < 1) return current;
        if (existing) {
          return current.map((row) =>
            row.variantId === item.variantId
              ? {
                  ...row,
                  ...item,
                  quantity: Math.min(max, row.quantity + quantity),
                }
              : row
          );
        }
        return [
          ...current,
          { ...item, quantity: Math.min(max, quantity) },
        ];
      });
      setOpen(true);
    },
    []
  );

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((current) => {
      if (quantity < 1) return current.filter((row) => row.variantId !== variantId);
      return current.map((row) => {
        if (row.variantId !== variantId) return row;
        const max = Math.min(20, row.quantityAvailable ?? 20);
        return { ...row, quantity: Math.min(max, quantity) };
      });
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((current) => current.filter((row) => row.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: cartCount(items),
      totalAmount: cartTotal(items),
      addItem,
      setQuantity,
      removeItem,
      clear,
      open,
      setOpen,
    }),
    [addItem, clear, items, open, removeItem, setQuantity]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
