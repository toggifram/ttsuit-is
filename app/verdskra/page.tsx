import type { Metadata } from "next";
import Link from "next/link";

import { PriceList } from "@/components/price-list";

export const metadata: Metadata = {
  title: "Verðskrá",
  description:
    "Verðskrá og pakkar hjá Tjé Tjé. Sérsaumaður jakki, buxur, vesti, skyrta og fylgihlutir — frá 6.490 kr. Sett frá 89.990 kr.",
};

export default function VerdskraPage() {
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
          <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
            Sérsaumur
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl text-forest md:text-6xl">
            Verðskrá og pakkar
          </h1>
          <p className="mt-5 max-w-2xl font-serif text-2xl text-forest/80 italic md:text-3xl">
            Fötin eru kannski ekki ókeypis þó verðin séu góð.
          </p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            Allar flíkur hjá Tjé Tjé eru sérsaumaðar eftir líkamsbyggingu
            kaupanda. Hér finnur þú föt á ásættanlegu verði. Verðflokkarnir
            fara eftir efnisvali og frá hvaða framleiðanda efnin koma. Við
            förum betur yfir þetta í sameiningu þegar þú mætir í mælingu.
          </p>
          <PriceList />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 md:grid-cols-12 md:px-8 md:py-20">
          <div className="md:col-span-7">
            <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
              Afhending
            </p>
            <h2 className="mt-3 font-serif text-4xl text-forest md:text-5xl">
              4–6 vikur
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink/70">
              Frá mælingu og þar til þú getur klætt þig í sérsauminn. Brúðkaup
              og aðrir fastir dagar: sendu línu snemma og við finnum leið.
            </p>
          </div>
          <div className="flex flex-col justify-center md:col-span-5">
            <div className="bg-cream px-6 py-8 md:px-8">
              <p className="font-serif text-2xl text-forest">
                Tilbúinn í mælingu?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                Við förum yfir efni og verð án pressu. Þú sendir línu og við
                finnum tíma sem hentar.
              </p>
              <Link
                href="/sersaumur#boka-tima"
                className="mt-6 inline-flex h-12 items-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
              >
                Bóka tíma
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
