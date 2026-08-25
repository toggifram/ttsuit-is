import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import { categories, processSteps, testimonials } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="bg-forest px-3 pb-4 pt-1 md:px-6 md:pb-8">
        <h1 className="sr-only">Tjé Tjé — sérsaumur og vefverslun</h1>
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2 md:gap-5">
          <HeroTile
            href="/sersaumur"
            image="/images/measure.jpg"
            alt="Maður í sérsaumuðum jakkafötum"
            title="Sérsaumur"
            priority
          />
          <HeroTile
            href="/verslun"
            image="/images/blazer.jpg"
            alt="Maður í jakka úr vefverslun"
            title="Vefverslun"
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-forest/60 uppercase">
              Vöruflokkar
            </p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">Hvað viltu klæðast?</h2>
          </div>
          <Link
            href="/verslun"
            className="hidden text-[11px] tracking-[0.18em] text-forest uppercase underline-offset-4 hover:underline md:inline"
          >
            Allir flokkar
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <Link key={item.title} href={item.href} className="group relative block aspect-[3/4] overflow-hidden bg-cream">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width:1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 font-serif text-2xl text-white">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <p className="text-[11px] tracking-[0.28em] text-forest/60 uppercase">
            Ferlið
          </p>
          <h2 className="mt-2 max-w-xl font-serif text-4xl md:text-5xl">
            Frá fyrstu línu til fatnaðar sem passar
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-5">
            {processSteps.map((step) => (
              <div key={step.n} className="border-t border-forest/15 pt-5">
                <p className="text-[11px] tracking-[0.2em] text-forest/50">
                  {step.n}
                </p>
                <h3 className="mt-3 font-serif text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[420px] md:min-h-[640px]">
          <Image
            src="/images/hero.jpg"
            alt="Þriggja hluta jakkaföt"
            fill
            className="object-cover"
            sizes="(min-width:768px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center px-5 py-16 md:px-16 md:py-24">
          <p className="text-[11px] tracking-[0.28em] text-forest/60 uppercase">
            Um Tjé Tjé
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Toggi Tuttugu. Nú Tjé Tjé.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
            Á bak við vörumerkið er Þorgrímur Smári Ólafsson. TT stóð fyrir
            Toggi Tuttugu — númerið á handboltavellinum. Tjé Tjé er sama
            hugmyndin, bara sögð upphátt: herrafatnaður sem er saumaður að þér.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/70">
            Engin jakkaföt eru eins. Þú velur efni, snið og smáatriði. Við
            höfum svo tilbúinn fatnað þegar tilefnið bíður ekki.
          </p>
          <Link
            href="/um-okkur"
            className="mt-8 inline-flex h-12 w-fit items-center border border-forest px-6 text-[11px] tracking-[0.18em] text-forest uppercase hover:bg-forest hover:text-white"
          >
            Lesa söguna
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <p className="text-[11px] tracking-[0.28em] text-forest/60 uppercase">
          Viðskiptavinir
        </p>
        <h2 className="mt-2 font-serif text-4xl md:text-5xl">Ánægðir í fötunum</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="border border-forest/10 bg-cream p-8">
              <blockquote className="font-serif text-2xl leading-snug text-ink">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 text-[11px] tracking-[0.16em] text-forest/70 uppercase">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="relative min-h-[380px] md:min-h-[460px]">
          <Image
            src="/images/ready.jpg"
            alt="Maður í svörtum jakka"
            fill
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-forest/55" />
          <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col items-start justify-center px-5 py-16 md:min-h-[460px] md:px-8">
            <p className="text-[11px] tracking-[0.28em] text-white/70 uppercase">
              4–6 vikur
            </p>
            <h2 className="mt-3 max-w-lg font-serif text-4xl text-white md:text-6xl">
              Komdu í mælingu
            </h2>
            <p className="mt-4 max-w-md text-white/85">
              Við finnum alltaf tíma. Sama hvort það er virkur dagur, helgi eða
              aðfangadagur.
            </p>
            <Link
              href="/hafa-samband#bokun"
              className="mt-8 inline-flex h-12 items-center bg-white px-6 text-[11px] tracking-[0.18em] text-forest uppercase hover:bg-cream"
            >
              Bóka tíma
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-forest/60 uppercase">
            Póstlistinn
          </p>
          <h2 className="mt-2 font-serif text-4xl">Missirðu ekki af neinu</h2>
          <p className="mt-4 max-w-md text-ink/70">
            Ný efni, skyrtudagar og aðrar fréttir sendar beint til þín.
          </p>
        </div>
        <NewsletterForm />
      </section>
    </>
  );
}

function HeroTile({
  href,
  image,
  alt,
  title,
  priority = false,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/5] overflow-hidden border-[3px] border-white md:aspect-auto md:min-h-[78vh]"
    >
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(min-width:768px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-center md:p-10">
        <h2 className="font-serif text-4xl text-white md:text-5xl">{title}</h2>
      </div>
    </Link>
  );
}
