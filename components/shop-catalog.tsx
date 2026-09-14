import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import {
  hrefForCategory,
  shopCategories,
  type Product,
} from "@/lib/product";
import { cn } from "@/lib/utils";

export function ShopCatalog({
  products,
  title,
  activeId,
}: {
  products: Product[];
  title: string;
  activeId: (typeof shopCategories)[number]["id"];
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 text-center md:px-10 md:py-16">
        <h1 className="font-serif text-4xl text-forest md:text-5xl">{title}</h1>
        <nav
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          aria-label="Vöruflokkar"
        >
          {shopCategories.map((cat) => (
            <Link
              key={cat.id}
              href={hrefForCategory(cat.id)}
              className={cn(
                "text-[13px] transition-colors",
                activeId === cat.id
                  ? "text-forest underline decoration-forest/40 underline-offset-8"
                  : "text-ink/40 hover:text-ink"
              )}
            >
              {cat.label}
            </Link>
          ))}
        </nav>
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 gap-2 bg-white px-2 sm:px-3 md:grid-cols-3 lg:grid-cols-4 lg:px-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="px-5 pb-16 text-center text-sm text-ink/50">
          Engar vörur í þessum flokki enn. Þegar Shopify er tengt birtast þær
          hér.
        </p>
      )}
    </section>
  );
}
