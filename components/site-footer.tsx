import Link from "next/link";

import { FooterInstagram } from "@/components/instagram-feed";
import { NewsletterForm } from "@/components/newsletter-form";
import { brand, footerNav, socialLinks } from "@/lib/site";

export async function SiteFooter() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto grid max-w-[1440px] items-start gap-8 px-5 py-10 md:grid-cols-3 md:gap-6 md:px-8 md:py-12">
        <div id="postlisti">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-tl.png"
            alt="Tjé Tjé"
            width={151}
            height={90}
            className="block h-14 w-auto max-w-none border-0 bg-transparent object-contain object-left md:h-16"
          />
          <p className="mt-5 text-sm text-white/80">Póstlisti</p>
          <div className="mt-2">
            <NewsletterForm variant="dark" />
          </div>
        </div>

        <div className="flex md:justify-center">
          <div className="grid grid-cols-3 gap-x-8 gap-y-6">
            <div>
              <p className="text-[11px] text-white/45">Verslun</p>
              <ul className="mt-2.5 space-y-1 text-[13px] text-white/80">
                {footerNav.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] text-white/45">Þjónusta</p>
              <ul className="mt-2.5 space-y-1 text-[13px] text-white/80">
                <li>
                  <Link href="/sersaumur" className="hover:text-white">
                    Custom made
                  </Link>
                </li>
                <li>
                  <Link href="/sersaumur#boka-tima" className="hover:text-white">
                    Mæling og mátun
                  </Link>
                </li>
                <li>
                  <a href={`mailto:${brand.email}`} className="hover:text-white">
                    {brand.email}
                  </a>
                </li>
                <li>
                  <Link href="/skilmalar" className="hover:text-white">
                    Skilmálar
                  </Link>
                </li>
                <li>
                  <Link href="/vafrakokur" className="hover:text-white">
                    Vafrakökur
                  </Link>
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

        <div className="md:flex md:justify-end">
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
