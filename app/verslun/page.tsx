import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { giftCards } from "@/lib/site";

export const metadata: Metadata = {
  title: "Verslun",
  description:
    "Tilbúin föt, skyrtur, fylgihlutir og gjafabréf. Vefverslun Tjé Tjé tengist Shopify á næstunni.",
};

const coming = [
  { title: "Peysur", image: "/images/studio/brown-zip.jpg" },
  { title: "Cardigan", image: "/images/studio/navy-shawl.jpg" },
  { title: "Polo", image: "/images/studio/black-polo.jpg" },
  { title: "Prjón", image: "/images/studio/taupe-cardigan.jpg" },
];

export default function VerslunPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm text-ink/50">Ready to wear</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
          Verslunin er á leiðinni
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">
          Tilbúinn fatnaður og fylgihlutir fá sína eigin vörusíðu í gegnum
          Shopify — greiðsla, sending og lager allt á einum stað. Á meðan getur
          þú bókað mælingu eða sent okkur línu um gjafabréf.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4">
        {coming.map((item) => (
          <div key={item.title} className="relative aspect-[3/4] overflow-hidden bg-white">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-contain p-4"
              sizes="(min-width:1024px) 25vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h2 className="text-2xl font-medium text-forest">{item.title}</h2>
              <p className="mt-1 text-sm text-ink/45">Kemur bráðum</p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <h2 className="font-serif text-4xl">Gjafabréf</h2>
          <p className="mt-3 max-w-xl text-ink/70">
            Gjöf sem gleður — við reddum málunum í bókstaflegri merkingu. Þegar
            Shopify fer í loftið er hægt að kaupa gjafabréf beint hér. Í bili
            sendu okkur póst.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {giftCards.map((card) => (
              <div
                key={card.price}
                className="border border-forest/10 bg-white p-6"
              >
                <p className="text-[11px] tracking-[0.18em] text-forest/50 uppercase">
                  {card.name}
                </p>
                <p className="mt-3 font-serif text-3xl">{card.price}</p>
              </div>
            ))}
          </div>
          <Link
            href="/hafa-samband"
            className="mt-10 inline-flex h-12 items-center bg-forest px-6 text-[11px] tracking-[0.18em] text-white uppercase hover:bg-forest-mid"
          >
            Fá gjafabréf
          </Link>
        </div>
      </section>
    </>
  );
}
