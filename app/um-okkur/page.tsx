import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Um okkur",
  description:
    "Sagan á bak við Tjé Tjé — Toggi Tuttugu og sérsaumaður herrafatnaður á Íslandi.",
};

const values = [
  {
    title: "Sveigjanleiki",
    text: "Við finnum alltaf tíma, sama hvort það er á virkum degi, um helgi eða á sjálfan aðfangadag.",
  },
  {
    title: "Nákvæmni",
    text: "Hvort þú vilt fötin vel upp að líkama eða með örlítið meira plássi ræðum við og finnum út.",
  },
  {
    title: "Heiðarleiki",
    text: "Ef þú spyrð „hvað finnst þér?“ varðandi efni eða snið, svara ég eins og mér finnst í raun og veru.",
  },
  {
    title: "Allir sáttir",
    text: "Jakkafötin mæta í hús. Þú mátar og ert sáttur. Ef ekki er besta saumastofa bæjarins með okkur í liði.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm text-ink/50">Um okkur</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
          Sagan á bak við nafnið
        </h1>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[420px] bg-white md:min-h-[720px]">
          <Image
            src="/images/studio/group.jpg"
            alt="Tjé Tjé"
            fill
            className="object-contain p-8"
            sizes="(min-width:768px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center bg-cream px-5 py-16 md:px-16">
          <p className="text-[11px] tracking-[0.22em] text-forest/60 uppercase">
            Þorgrímur Smári Ólafsson
          </p>
          <h2 className="mt-3 font-serif text-4xl">Toggi Tuttugu</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75">
            <p>
              Eftir fjölda ára sem afreksmaður í íþróttum var komið að
              endastöð vegna meiðsla. Í tímarúminu sem myndaðist sá ég tækifæri
              og ákvað að stökkva — að hrinda af stað stærri hugmynd á mínum
              eigin forsendum.
            </p>
            <p>
              Mér hefur alltaf fundist gaman að fylgjast með tísku og flottum
              fötum. Eftir samband við efnisframleiðendur út í heimi byrjuðu
              hjólin að snúast. Í dag er verslað með efni meðal annars frá
              Ítalíu, Bretlandi, Þýskalandi, Tyrklandi og víðar.
            </p>
            <p>
              Til að byrja með ætlaði ég að mæla mig og vini mína. Síðan fóru
              fleiri að hafa samband. Ég segi stundum að ég sé frístundaskraddari
              — áhugamál með rekstrarlegu ívafi. Tilfinningin að sjá aðra í
              fötum sem þeir mótuðu sjálfir er geggjuð.
            </p>
            <p>
              Skammstöfunin TT stóð fyrir Toggi Tuttugu — á handboltavellinum
              var ég alltaf númer 20. Tjé Tjé er það sama, sagt upphátt.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-serif text-4xl">Ég vil að þú sért ánægður</h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Allir vilja eiga flott jakkaföt. Stíll einstaklinga er þó
          mismunandi og því mikilvægt að við séum á sömu blaðsíðunni.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <div key={item.title} className="border-t border-forest/15 pt-5">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                {item.text}
              </p>
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
