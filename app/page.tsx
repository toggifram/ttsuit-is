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
      <section className="grid md:grid-cols-2">
        <HeroFrame
          href="/sersaumur#boka-tima"
          image="/images/studio/suit-bag.png"
          alt="Sérsaumur hjá Tjé Tjé"
          eyebrow="Sérsaumur á 4–6 vikum"
          headline="Saumað fyrir þig"
          cta="Bóka sérsaum"
          fit="contain"
          priority
        />
        <HeroFrame
          href="/verslun"
          image="/images/studio/shop-pair.png"
          alt="Vefverslun Tjé Tjé"
          eyebrow="Tilbúin föt og fylgihlutir"
          headline="Nýja línan"
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
  eyebrow,
  headline,
  cta,
  fit = "cover",
  priority = false,
}: {
  href: string;
  image: string;
  alt: string;
  eyebrow: string;
  headline: string;
  cta: string;
  fit?: "cover" | "contain";
  priority?: boolean;
}) {
  return (
    <div className="relative min-h-[85vh] overflow-hidden bg-white md:min-h-[calc(100dvh-6.8rem)]">
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
        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-white uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] md:text-xs">
            {eyebrow}
          </p>
          <p className="mt-3 font-serif text-[2.65rem] leading-[0.95] font-medium text-white italic drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-[3.35rem] lg:text-[3.75rem]">
            {headline}
          </p>
          <Link
            href={href}
            className="mt-7 inline-flex h-12 items-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
          >
            {cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
