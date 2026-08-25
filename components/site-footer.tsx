import Link from "next/link";

import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { brand, nav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-20">
        <div className="md:col-span-5">
          <Logo size="lg" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            Sérsaumur og tilbúin föt. Jakkaföt, jakkar, skyrtur og fylgihlutir
            — saumuð að þér, eða tilbúin þegar þú vilt þau strax.
          </p>
          <p className="mt-4 font-serif text-xl text-white/90 italic">
            {brand.tagline}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/50">
            Flýtileiðir
          </p>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/hafa-samband#bokun"
                className="text-sm text-white/80 transition-colors hover:text-white"
              >
                Bóka mælingu
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/50">
            Póstlistinn
          </p>
          <p className="mt-4 mb-4 text-sm text-white/70">
            Ný efni, skyrtudagar og fréttir — beint til þín.
          </p>
          <NewsletterForm variant="dark" />
          <div className="mt-8 space-y-1 text-sm text-white/70">
            <p>
              <a className="hover:text-white" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
            </p>
            <p>
              <a
                className="hover:text-white"
                href={brand.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              {" · "}
              <a
                className="hover:text-white"
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-white/45 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {brand.name} · {brand.legalName}
          </p>
          <p>{brand.domain}</p>
        </div>
      </div>
    </footer>
  );
}
