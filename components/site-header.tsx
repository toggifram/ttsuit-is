"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";

import { CartButton } from "@/components/cart-drawer";
import { HashLink } from "@/components/hash-link";
import { LogoHomeLink } from "@/components/logo-home-link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { nav, navLeft, navRight, sersaumurMenu } from "@/lib/site";
import { cn } from "@/lib/utils";

const promoCopy =
  "Við vorum að opna nýja heimasíðu, 15% afsláttur af tilbúnum fatnaði ef þú skráir þig á póstlistann";

function PromoTicker() {
  return (
    <div className="border-b border-white/10 px-4 py-2 text-center text-[11px] leading-relaxed tracking-[0.08em] text-white/85">
      <Link href="#postlisti" className="hover:text-white">
        {promoCopy}
      </Link>
    </div>
  );
}

function SersaumurNav({ pathname }: { pathname: string }) {
  const active =
    pathname === "/sersaumur" || pathname.startsWith("/sersaumur/");

  return (
    <div className="group relative -my-7 flex items-center py-7">
      <Link
        href="/sersaumur"
        className={cn(
          "text-[13px] text-white/80 transition-colors hover:text-white",
          active && "text-white"
        )}
      >
        Sérsaumur
      </Link>
      <div className="pointer-events-none absolute top-full left-0 z-50 min-w-[12.5rem] pt-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <div className="bg-forest py-2 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          {sersaumurMenu.map((item) => (
            <HashLink
              key={item.href}
              hash={item.hash}
              href={item.href}
              className="block px-4 py-2 text-[13px] text-white/80 hover:text-white"
            >
              {item.label}
            </HashLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active =
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "text-[13px] text-white/80 transition-colors hover:text-white",
        active && "text-white"
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-forest text-white">
      <PromoTicker />
      <div className="relative mx-auto flex h-16 max-w-[1440px] items-center px-4 md:h-[4.5rem] md:px-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex items-center">
            <nav className="pointer-events-auto hidden items-center gap-7 pr-8 lg:flex">
              {navLeft.map((item) =>
                item.href === "/sersaumur" ? (
                  <SersaumurNav key={item.label} pathname={pathname} />
                ) : (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                  />
                )
              )}
            </nav>
            <LogoHomeLink className="pointer-events-auto" />
            <nav className="pointer-events-auto hidden items-center gap-7 pl-8 lg:flex">
              {navRight.map((item) => (
                <NavLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                />
              ))}
            </nav>
          </div>
        </div>

        <div className="relative z-10 ml-auto flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            <Button
              nativeButton={false}
              variant="ghost"
              size="icon"
              render={<Link href="/verslun" />}
              className="text-white hover:bg-white/10 hover:text-white"
              aria-label="Leita í verslun"
            >
              <Search className="size-4" />
            </Button>
            <CartButton />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <CartButton className="md:hidden" />
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 hover:text-white"
                    aria-label="Opna valmynd"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-white/10 bg-forest text-white"
              >
                <SheetHeader>
                  <SheetTitle className="text-white">
                    <LogoHomeLink
                      size="sm"
                      onClick={() => setMenuOpen(false)}
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {nav.map((item) => (
                    <Fragment key={item.label}>
                      <SheetClose
                        render={
                          <Link
                            href={item.href}
                            className="py-3 text-base text-white/85"
                          />
                        }
                      >
                        {item.label}
                      </SheetClose>
                      {item.href === "/sersaumur"
                        ? sersaumurMenu.map((sub) => (
                            <SheetClose
                              key={sub.href}
                              render={
                                <HashLink
                                  hash={sub.hash}
                                  href={sub.href}
                                  className="py-2 pl-3 text-sm text-white/55"
                                />
                              }
                            >
                              {sub.label}
                            </SheetClose>
                          ))
                        : null}
                    </Fragment>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
