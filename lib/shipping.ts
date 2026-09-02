import { formatMoney } from "@/lib/product";

export type ShippingSource = "local" | "drop";

export type ShippingMethod = {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  /** Shown instead of a krónur amount when the price is arranged later. */
  priceLabel?: string;
  source: ShippingSource;
};

export const PICKUP_BY_ARRANGEMENT_ID = "saekja-samkomulag";

/** Built-in methods. Drop rates will be concatenated once that API is connected. */
export const LOCAL_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: PICKUP_BY_ARRANGEMENT_ID,
    title: "Sækja eftir samkomulagi (TT hefur samband)",
    description: "",
    priceAmount: 0,
    priceLabel: "Eftir samkomulagi",
    source: "local",
  },
];

export function listShippingMethods(): ShippingMethod[] {
  return LOCAL_SHIPPING_METHODS;
}

export function getShippingMethod(id: string) {
  return listShippingMethods().find((method) => method.id === id) ?? null;
}

export function shippingPriceText(method: ShippingMethod) {
  return method.priceLabel ?? formatMoney(method.priceAmount);
}

export function addressLooksComplete(fields: {
  name: string;
  email: string;
  address1: string;
  city: string;
  zip: string;
}) {
  return (
    fields.name.trim().length > 1 &&
    fields.email.includes("@") &&
    fields.address1.trim().length >= 3 &&
    fields.city.trim().length >= 2 &&
    fields.zip.trim().length >= 3
  );
}
