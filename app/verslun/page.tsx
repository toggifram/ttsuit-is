import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { ShopCatalog } from "@/components/shop-catalog";
import { getCatalogProducts } from "@/lib/catalog";
import { breadcrumbJsonLd, collectionJsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const shopDescription =
  "Peysur, bindi, yfirhafnir, fylgihluti og gjafabréf — vefverslun Tjé Tjé.";

export const metadata: Metadata = pageMetadata({
  title: "Allar vörur",
  description: shopDescription,
  path: "/verslun",
  images: [
    { url: "/images/studio/allar-vorur.jpg", alt: "Vefverslun Tjé Tjé" },
  ],
});

export default async function VerslunPage() {
  const products = await getCatalogProducts();
  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          name: "Allar vörur",
          path: "/verslun",
          description: shopDescription,
          products,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsíða", path: "/" },
          { name: "Verslun", path: "/verslun" },
        ])}
      />
      <ShopCatalog products={products} title="Allar vörur" activeId="all" />
    </>
  );
}
