import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product-detail";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ litur?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getCatalogProduct(handle);
  if (!product) return { title: "Vara" };
  return {
    title: product.title,
    description:
      product.description ??
      `${product.title} — ${product.subtitle} í vefverslun Tjé Tjé.`,
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const query = await searchParams;
  const product = await getCatalogProduct(handle);
  if (!product) notFound();

  const litur = Array.isArray(query.litur) ? query.litur[0] : query.litur;

  const catalog = await getCatalogProducts();
  const related = catalog.filter(
    (item) =>
      item.category === product.category && item.handle !== product.handle
  );

  return (
    <ProductDetail
      key={`${product.handle}:${litur ?? ""}`}
      product={product}
      related={related}
      initialColor={litur}
    />
  );
}
