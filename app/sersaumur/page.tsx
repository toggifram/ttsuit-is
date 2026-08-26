import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { packages, prices, processSteps } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sérsaumur",
  description:
    "Sérsaumuð jakkaföt, jakkar og skyrtur eftir þínum mælingum. Ferlið tekur 4–6 vikur.",
};

export default function SersaumurPage() {
  return (
    <>
      <section className="relative min-h-[52vh] overflow-hidden bg-white">
        <Image
          src="/images/studio/grey-polo.jpg"
          alt="Sérsaumur hjá Tjé Tjé"
          fill
          priority
          className="object-contain object-top p-8"
          sizes="100vw"
        />
        <div className="relative mx-auto flex min-h-[52vh] max-w-[1440px] flex-col justify-end px-5 pb-12 md:px-10 md:pb-16">
          <p className="text-sm text-ink/45">Custom made</p>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-forest md:text-6xl">
            Sérsaumur er málið
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <h2 className="font-serif text-4xl">Saumað eftir þér. Ekki hillunni.</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70">
            Sérsaumur þýðir að engin jakkaföt eru eins. Fatnaðurinn er saumaður
            eftir líkamsbyggingu kaupanda — og þú ræður ferðinni hvað varðar
            efni, útlit og snið.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            Kjarninn er nákvæm mæling. Brjóst, mitti og axlir eru ekki bara
            tölur: við tökum tillit til líkamsstöðu og hvernig þú vilt að
            fötin sitji. Síðan velur þú snið, vasagerð, hnappa, fóður og jafnvel
            saumfar með nafni undir kraga.
          </p>
        </div>
        <div className="relative min-h-[320px] bg-white">
          <Image
            src="/images/studio/navy-logo.jpg"
            alt="TJ merki"
            fill
            className="object-contain p-6"
            sizes="(min-width:768px) 50vw, 100vw"
          />
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <h2 className="font-serif text-4xl">Hvernig er ferlið?</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-5">
            {processSteps.map((step) => (
              <div key={step.n}>
                <p className="text-[11px] tracking-[0.2em] text-forest/50">
                  {step.n}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[11px] tracking-[0.28em] text-forest/60 uppercase">
          Verðskrá
        </p>
        <h2 className="mt-2 font-serif text-4xl">
          Fötin eru kannski ekki ókeypis. Verðin gætu samt komið þér á óvart.
        </h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Verð flokkast eftir efnisvali og framleiðanda. Við förum betur yfir
          þetta þegar þú mætir í mælingu.
        </p>
        <div className="mt-12 grid gap-px bg-forest/10 sm:grid-cols-2 lg:grid-cols-5">
          {prices.map((item) => (
            <div key={item.name} className="bg-white p-6">
              <h3 className="font-serif text-2xl">{item.name}</h3>
              <p className="mt-2 text-sm text-forest">Frá {item.from}</p>
              <p className="mt-3 text-sm text-ink/60">{item.note}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-16 font-serif text-3xl">Pakkar</h3>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((item) => (
            <div key={item.name} className="border border-forest/10 p-6">
              <h4 className="font-serif text-2xl">{item.name}</h4>
              <p className="mt-2 text-sm text-forest">Frá {item.from}</p>
              <p className="mt-3 text-sm text-ink/65">{item.items}</p>
            </div>
          ))}
        </div>

        <Link
          href="/hafa-samband#bokun"
          className="mt-12 inline-flex h-12 items-center bg-forest px-6 text-[11px] tracking-[0.18em] text-white uppercase hover:bg-forest-mid"
        >
          Bóka mælingu
        </Link>
      </section>
    </>
  );
}
