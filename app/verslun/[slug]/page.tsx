import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShopCatalog } from "@/components/shop-catalog";
import { getCatalogProducts } from "@/lib/catalog";
import { categoryFromSlug, shopCategories } from "@/lib/product";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return shopCategories
    .filter((cat) => cat.slug)
    .map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryFromSlug(slug);
  if (!cat) return { title: "Verslun" };
  return {
    title: cat.label,
    description: `${cat.label} í vefverslun Tjé Tjé.`,
  };
}

export default async function VerslunFlokkurPage({ params }: Props) {
  const { slug } = await params;
  const cat = categoryFromSlug(slug);
  if (!cat || cat.id === "all") notFound();

  const all = await getCatalogProducts();
  const products = all.filter((product) => product.category === cat.id);

  return (
    <ShopCatalog products={products} title={cat.label} activeId={cat.id} />
  );
}
