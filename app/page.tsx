import Image from "next/image";
import Link from "next/link";

import { ProductRail } from "@/components/product-rail";
import { CategoryLooks } from "@/components/category-looks";
import { InstagramFeed } from "@/components/instagram-feed";
import { SersaumurFeature } from "@/components/sersaumur-feature";
import { getHomeProducts } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getHomeProducts();

  return (
    <>
      <h1 className="sr-only">Tjé Tjé — sérsaumur og vefverslun</h1>
      <section className="grid gap-2 bg-white px-2 md:grid-cols-2">
        <HeroFrame
          href="/hafa-samband#bokun"
          image="/images/studio/suit-bag.png"
          alt="Sérsaumur hjá Tjé Tjé"
          cta="Bóka sérsaum"
          fit="contain"
          priority
        />
        <HeroFrame
          href="/verslun"
          image="/images/studio/shop-pair.png"
          alt="Vefverslun Tjé Tjé"
          cta="Skoða vefverslun"
          fit="contain"
          priority
        />
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[34rem] px-6 pt-4 pb-10 text-center md:pt-5 md:pb-12">
          <blockquote>
            <p className="font-serif text-[15px] leading-[1.85] text-forest/90 md:text-base">
              „Fatnaður sem endurspeglar þinn stíl og endist umfram árstíðir.
              Hvort sem hann er sérsniðinn að þér eða valinn úr okkar eigin
              línum, leggjum við áherslu á vönduð efni, gott snið og tímalausa
              hönnun.“
            </p>
          </blockquote>
        </div>
      </section>

      <ProductRail products={products} />

      <CategoryLooks />

      <SersaumurFeature />

      <InstagramFeed />
    </>
  );
}

function HeroFrame({
  href,
  image,
  alt,
  cta,
  fit = "cover",
  priority = false,
}: {
  href: string;
  image: string;
  alt: string;
  cta: string;
  fit?: "cover" | "contain";
  priority?: boolean;
}) {
  return (
    <div className="relative min-h-[85vh] overflow-hidden bg-white md:min-h-[calc(100dvh-7.25rem)]">
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        className={
          fit === "contain"
            ? "object-contain object-center p-8 md:p-14"
            : "object-cover object-[center_12%]"
        }
        sizes="(min-width:768px) 50vw, 100vw"
      />
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
        <Link
          href={href}
          className="inline-flex h-12 items-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
