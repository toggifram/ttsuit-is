import Image from "next/image";
import Link from "next/link";

import { ProductRail } from "@/components/product-rail";
import { CategoryLooks } from "@/components/category-looks";
import { testimonials } from "@/lib/site";
import { getHomeProducts } from "@/lib/shopify";

export default async function HomePage() {
  const products = await getHomeProducts();

  return (
    <>
      <h1 className="sr-only">Tjé Tjé — sérsaumur og vefverslun</h1>
      <section className="grid bg-white md:grid-cols-2">
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
        <div className="mx-auto max-w-[34rem] px-6 py-14 text-center md:py-20">
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

      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-20">
          <h2 className="text-2xl font-medium md:text-3xl">Ánægðir í fötunum</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.name}>
                <blockquote className="text-[17px] leading-relaxed text-ink/80">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm text-ink/50">
                  {item.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 py-16 md:flex-row md:items-center md:px-10 md:py-20">
          <div>
            <h2 className="text-3xl font-medium text-white md:text-4xl">
              Fáðu persónulega ráðgjöf
            </h2>
            <p className="mt-3 max-w-lg text-sm text-white/70">
              Spurning um snið eða passform? Bókaðu mælingu eða sendu okkur línu.
            </p>
          </div>
          <Link
            href="/hafa-samband#bokun"
            className="inline-flex h-11 items-center bg-white px-6 text-sm text-forest hover:bg-cream"
          >
            Bóka mælingu
          </Link>
        </div>
      </section>
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
    <div className="relative min-h-[85vh] overflow-hidden bg-white md:min-h-[calc(100dvh-6.75rem)]">
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
      <div className="absolute inset-0 flex items-center justify-center px-6">
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
