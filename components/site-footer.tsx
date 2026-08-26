import Link from "next/link";

import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { brand, footerNav, socialLinks } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-16">
        <div className="md:col-span-3" id="postlisti">
          <Logo size="lg" variant="light" />
          <p className="mt-6 text-sm text-white/80">Póstlisti</p>
          <div className="mt-3">
            <NewsletterForm variant="dark" />
          </div>
        </div>
        <div className="md:col-span-3">
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
        <div className="md:col-span-3">
          <p className="text-xs text-white/45">Fylgdu okkur</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
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
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 py-4 text-xs text-white/40 md:px-8">
          <p>
            © {new Date().getFullYear()} {brand.name} · {brand.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
