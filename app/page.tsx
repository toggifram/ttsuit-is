import Image from "next/image";
import Link from "next/link";

import { testimonials } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Tjé Tjé — sérsaumur og vefverslun</h1>
      <section className="grid bg-white md:grid-cols-2">
        <HeroFrame
          href="/hafa-samband#bokun"
          image="/images/studio/grey-polo.jpg"
          alt="Sérsaumur hjá Tjé Tjé"
          title="Sérsaumur"
          text="Mæling, efni og snið eftir þér. 4–6 vikur."
          cta="Bóka sérsaum"
          priority
        />
        <HeroFrame
          href="/verslun"
          image="/images/studio/brown-zip.jpg"
          alt="Vefverslun Tjé Tjé"
          title="Vefverslun"
          text="Tilbúinn fatnaður — greiðsla fer í gegnum Shopify."
          cta="Skoða vefverslun"
          priority
        />
      </section>

      <section className="border-y border-black/8 bg-white">
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

      <Look
        href="/verslun"
        image="/images/studio/group.jpg"
        alt="Þrír í Tjé Tjé prjónafatnaði"
        kicker="Tjé Tjé"
        title="Prjónafatnaður"
        text="Nýja línan — peysur, polo og cardigan saumaðir með TT merkinu."
        cta="Skoða línuna"
      />

      <section className="grid md:grid-cols-2">
        <Look
          href="/verslun"
          image="/images/studio/navy-shawl.jpg"
          alt="Navy cardigan"
          title="Cardigan"
          text="Sjal-kragi og þungt prjón."
        />
        <Look
          href="/verslun"
          image="/images/studio/olive-zip.jpg"
          alt="Olive zip peysa"
          title="Quarter-zip"
          text="Prjónapeysa með rennilás og skyrtu undir."
        />
      </section>

      <section className="grid md:grid-cols-2">
        <Look
          href="/verslun"
          image="/images/studio/taupe-cardigan.jpg"
          alt="Taupe cardigan"
          title="Zip cardigan"
          text="Klassískt cable-knit yfir hvítri skyrtu."
        />
        <Look
          href="/verslun"
          image="/images/studio/black-polo.jpg"
          alt="Svart prjóna-polo"
          title="Polo"
          text="Rifjað prjón, hreint snið."
        />
      </section>

      <section className="grid md:grid-cols-2">
        <Look
          href="/verslun"
          image="/images/studio/navy-back.jpg"
          alt="Bakning af prjónapeysu"
          title="Passformið"
          text="Sniðið sést best að aftan."
        />
        <Look
          href="/verslun"
          image="/images/studio/navy-logo.jpg"
          alt="TJ merki á peysu"
          title="TJ"
          text="Merkið á brjóstinu — saumað inn."
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

function HeroFrame({
  href,
  image,
  alt,
  title,
  text,
  cta,
  priority = false,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  text: string;
  cta: string;
  priority?: boolean;
}) {
  return (
    <div className="relative min-h-[85vh] overflow-hidden bg-white md:min-h-[calc(100dvh-6.75rem)]">
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        className="object-cover object-[center_15%]"
        sizes="(min-width:768px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-12 md:pb-14">
        <h2 className="text-4xl font-medium tracking-tight text-forest md:text-5xl">
          {title}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-ink/70">{text}</p>
        <Link
          href={href}
          className="mt-6 inline-flex h-12 items-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

function Look({
  href,
  image,
  alt,
  title,
  text,
  kicker,
  cta,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  text: string;
  kicker?: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[560px] flex-col bg-white md:min-h-[72vh]"
    >
      <div className="relative min-h-0 flex-1">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain object-center p-6 transition-transform duration-700 group-hover:scale-[1.02] md:p-8"
          sizes="(min-width:768px) 50vw, 100vw"
        />
      </div>
      <div className="px-6 pb-8 md:px-10 md:pb-10">
        {kicker ? <p className="text-sm text-ink/45">{kicker}</p> : null}
        <h2 className="text-2xl font-medium text-forest md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-ink/60">{text}</p>
        {cta ? (
          <span className="mt-4 inline-block text-sm text-forest underline-offset-4 group-hover:underline">
            {cta}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
