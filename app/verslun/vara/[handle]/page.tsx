import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { ProductDetail } from "@/components/product-detail";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import { categoryLabel, hrefForCategory, productHref } from "@/lib/product";
import {
  breadcrumbJsonLd,
  lowestPrice,
  pageMetadata,
  productAvailable,
  productDescription,
  productJsonLd,
  productShareImages,
} from "@/lib/seo";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ litur?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { handle } = await params;
  const query = await searchParams;
  const product = await getCatalogProduct(handle);
  if (!product) return { title: "Vara" };
  const litur = Array.isArray(query.litur) ? query.litur[0] : query.litur;
  const price = lowestPrice(product);
  return pageMetadata({
    title: litur ? `${product.title} — ${litur}` : product.title,
    description: productDescription(product),
    path: product.href,
    url: productHref(product.handle, litur),
    images: productShareImages(product, litur),
    priceAmount: price,
    availability: productAvailable(product) ? "in stock" : "out of stock",
  });
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
    <>
      <JsonLd data={productJsonLd(product, litur)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsíða", path: "/" },
          { name: "Verslun", path: "/verslun" },
          { name: categoryLabel(product.category), path: hrefForCategory(product.category) },
          { name: product.title, path: product.href },
        ])}
      />
      <ProductDetail
        key={`${product.handle}:${litur ?? ""}`}
        product={product}
        related={related}
        initialColor={litur}
      />
    </>
  );
}
