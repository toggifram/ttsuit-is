import Link from "next/link";

import { FooterInstagram } from "@/components/instagram-feed";
import { HashLink } from "@/components/hash-link";
import { NewsletterForm } from "@/components/newsletter-form";
import { hrefForCategory, shopCategories } from "@/lib/product";
import { brand, footerWe, sersaumurMenu, socialLinks } from "@/lib/site";

export async function SiteFooter() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto grid max-w-[1440px] items-start gap-8 px-5 py-10 md:grid-cols-12 md:gap-6 md:px-8 md:py-12">
        <div id="postlisti" className="md:col-span-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-tl.png"
            alt="Tjé Tjé"
            width={151}
            height={90}
            className="block h-14 w-auto max-w-none border-0 bg-transparent object-contain object-left md:h-16"
          />
          <p className="mt-5 text-sm text-white/80">Póstlisti</p>
          <p className="mt-1.5 max-w-[13.5rem] text-[12px] leading-snug text-white/55">
            Gleymdu ekki að skrá þig — 15% af tilbúnum fatnaði í vefverslun.
          </p>
          <div className="mt-3">
            <NewsletterForm variant="dark" />
          </div>
        </div>

        <div className="md:col-span-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            <div>
              <p className="text-[11px] text-white/45">Vefverslun</p>
              <ul className="mt-2.5 space-y-1 text-[13px] text-white/80">
                {shopCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={hrefForCategory(cat.id)}
                      className="hover:text-white"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] text-white/45">Sérsaumur</p>
              <ul className="mt-2.5 space-y-1 text-[13px] text-white/80">
                {sersaumurMenu.map((item) => (
                  <li key={item.hash}>
                    <HashLink
                      hash={item.hash}
                      href={item.href}
                      className="hover:text-white"
                    >
                      {item.label}
                    </HashLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] text-white/45">Við</p>
              <ul className="mt-2.5 space-y-1 text-[13px] text-white/80">
                {footerWe.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${brand.email}`} className="hover:text-white">
                    {brand.email}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] text-white/45">Fylgdu okkur</p>
              <ul className="mt-2.5 space-y-1 text-[13px] text-white/80">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 md:flex md:justify-end">
          <FooterInstagram />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 py-3 text-xs text-white/40 md:px-8">
          <p>
            © {new Date().getFullYear()} {brand.name} · {brand.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
