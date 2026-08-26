export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductCategory =
  | "peysur"
  | "bindi"
  | "yfirhafnir"
  | "fylgihlutir"
  | "gjafabref";

export const shopCategories = [
  { id: "all", label: "Allar vörur" },
  { id: "peysur", label: "Peysur" },
  { id: "bindi", label: "Bindi" },
  { id: "yfirhafnir", label: "Yfirhafnir" },
  { id: "fylgihlutir", label: "Fylgihluti" },
  { id: "gjafabref", label: "Gjafabréf" },
] as const;

export type Product = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  imageAlt: string;
  price: string;
  badge?: string;
  colors: ProductColor[];
  category: ProductCategory;
};

export function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function formatMoney(amount: string | number, currency = "ISK") {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return "";
  if (currency === "ISK") {
    return `${Math.round(value).toLocaleString("is-IS")} kr.`;
  }
  return new Intl.NumberFormat("is-IS", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
