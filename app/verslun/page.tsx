import type { Metadata } from "next";

import { ShopCatalog } from "@/components/shop-catalog";
import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Allar vörur",
  description:
    "Peysur, bindi, yfirhafnir, fylgihluti og gjafabréf — vefverslun Tjé Tjé.",
};

export default async function VerslunPage() {
  const products = await getCatalogProducts();
  return (
    <ShopCatalog products={products} title="Allar vörur" activeId="all" />
  );
}
