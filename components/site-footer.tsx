import Link from "next/link";

import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { brand, footerNav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-16">
        <div className="md:col-span-4">
          <Logo size="lg" variant="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            Sérsaumur og tilbúin föt. Finndu þitt snið — eða verslaðu þegar þú
            vilt fötin strax.
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-white/45">Verslun</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {footerNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs text-white/45">Þjónusta</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/sersaumur" className="hover:text-white">
                Custom made
              </Link>
            </li>
            <li>
              <Link href="/hafa-samband#bokun" className="hover:text-white">
                Mæling og mátun
              </Link>
            </li>
            <li>
              <a href={`mailto:${brand.email}`} className="hover:text-white">
                {brand.email}
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs text-white/45">Póstlisti</p>
          <p className="mt-4 mb-4 text-sm text-white/70">
            Ný efni og fréttir, beint til þín.
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 text-xs text-white/40 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {brand.name} · {brand.legalName}
          </p>
          <p>
            <a href={brand.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
              Instagram
            </a>
            {" · "}
            <a href={brand.facebook} target="_blank" rel="noreferrer" className="hover:text-white">
              Facebook
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
