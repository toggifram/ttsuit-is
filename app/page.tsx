import Image from "next/image";
import Link from "next/link";

import { testimonials } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[78vh] overflow-hidden bg-forest md:min-h-[86vh]">
        <Image
          src="/images/suit.jpg"
          alt="Maður í jakkafötum"
          fill
          priority
          className="object-cover object-[center_18%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-[1440px] flex-col justify-end px-5 pb-12 md:min-h-[86vh] md:px-10 md:pb-16">
          <p className="text-sm text-white/80">Sérsaumur og tilbúin föt</p>
          <h1 className="mt-2 max-w-xl text-4xl font-medium tracking-tight text-white md:text-6xl">
            Ekki bara passa inn.
            <br />
            Finndu þitt snið.
          </h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-white">
            <Link href="/sersaumur" className="underline-offset-4 hover:underline">
              Sérsaumur
            </Link>
            <Link href="/verslun" className="underline-offset-4 hover:underline">
              Vefverslun
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-black/8 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 md:grid-cols-4 md:px-10 md:py-14">
          {services.map((item) => (
            <div key={item.title}>
              <h2 className="text-[15px] font-medium">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Campaign
        href="/sersaumur"
        image="/images/measure.jpg"
        alt="Sérsaumuð jakkaföt"
        kicker="Custom made"
        title="Sérsaumur eftir þér"
        text="Mæling, efnisval og saumur eftir líkama þínum. 4–6 vikur frá mælingu."
        cta="Skoða sérsaum"
        tall
      />

      <section className="grid md:grid-cols-2">
        <SplitCard
          href="/sersaumur"
          image="/images/hero.jpg"
          alt="Jakkaföt"
          title="Jakkaföt"
          text="Eitt sett, heilög þrenna eða allur pakkinn."
        />
        <SplitCard
          href="/sersaumur"
          image="/images/blazer.jpg"
          alt="Jakkar"
          title="Jakkar"
          text="Þegar tilefnið er jakki — ekki endilega jakkaföt."
        />
      </section>

      <Campaign
        href="/verslun"
        image="/images/ready.jpg"
        alt="Vefverslun"
        kicker="Ready to wear"
        title="Vefverslunin"
        text="Tilbúinn fatnaður og fylgihlutir. Shopify tengist hér á næstunni — greiðsla og sending á einum stað."
        cta="Skoða verslun"
      />

      <section className="grid md:grid-cols-2">
        <SplitCard
          href="/verslun"
          image="/images/shirts.jpg"
          alt="Skyrtur"
          title="Skyrtur"
          text="Hundruð efna. Við finnum það sem hentar þér."
        />
        <SplitCard
          href="/verslun"
          image="/images/coat.jpg"
          alt="Fylgihlutir"
          title="Fylgihlutir"
          text="Bindi, klútar, axlabönd og smáatriðin sem klára lookið."
        />
      </section>

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

const services = [
  {
    title: "Sérsaumur",
    text: "Jakkaföt saumuð eftir þínum mælingum. Þú velur efni, snið og smáatriði.",
  },
  {
    title: "Persónuleg ráðgjöf",
    text: "Við förum yfir fit og stíl saman — og ég segi þér hvað mér finnst, hreint út.",
  },
  {
    title: "4–6 vikur",
    text: "Frá mælingu þar til þú klæðist fötunum. Mátun innifalin.",
  },
  {
    title: "Vefverslun",
    text: "Tilbúin föt og gjafabréf. Greiðsla fer í gegnum Shopify þegar verslunin opnar.",
  },
];

function Campaign({
  href,
  image,
  alt,
  kicker,
  title,
  text,
  cta,
  tall = false,
}: {
  href: string;
  image: string;
  alt: string;
  kicker: string;
  title: string;
  text: string;
  cta: string;
  tall?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden ${tall ? "min-h-[72vh] md:min-h-[82vh]" : "min-h-[58vh] md:min-h-[70vh]"}`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-5 py-10 md:px-10 md:py-14">
        <p className="text-sm text-white/75">{kicker}</p>
        <h2 className="mt-1 text-3xl font-medium text-white md:text-5xl">
          {title}
        </h2>
        <p className="mt-3 max-w-md text-sm text-white/80">{text}</p>
        <span className="mt-5 inline-block text-sm text-white underline-offset-4 group-hover:underline">
          {cta}
        </span>
      </div>
    </Link>
  );
}

function SplitCard({
  href,
  image,
  alt,
  title,
  text,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  text: string;
}) {
  return (
    <Link href={href} className="group relative block min-h-[520px] overflow-hidden md:min-h-[70vh]">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        sizes="(min-width:768px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
        <h2 className="text-2xl font-medium text-white md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-white/80">{text}</p>
      </div>
    </Link>
  );
}
