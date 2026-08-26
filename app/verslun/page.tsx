import type { Metadata } from "next";

import { ShopCatalog } from "@/components/shop-catalog";
import { getCatalogProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Verslun",
  description:
    "Peysur, bindi, yfirhafnir, fylgihluti og gjafabréf — vefverslun Tjé Tjé.",
};

export default async function VerslunPage() {
  const products = await getCatalogProducts();
  return <ShopCatalog products={products} />;
}
