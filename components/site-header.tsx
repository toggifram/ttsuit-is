"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { brand, nav, navLeft, navRight } from "@/lib/site";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  pathname,
  className,
}: {
  href: string;
  label: string;
  pathname: string;
  className?: string;
}) {
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "text-[13px] tracking-[0.04em] text-white/80 transition-colors hover:text-white",
        active && "text-white",
        className
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-forest text-white">
      <div className="border-b border-white/10 text-center text-[11px] tracking-[0.18em] text-white/85">
        <Link
          href="/hafa-samband#bokun"
          className="block px-4 py-2 transition-colors hover:text-white"
        >
          Sérsaumur á 4–6 vikum · Bókaðu mælingu
        </Link>
      </div>
      <div className="relative mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[4.5rem] md:px-8">
        <nav className="hidden items-center gap-8 md:flex">
          {navLeft.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              pathname={pathname}
            />
          ))}
        </nav>

        <Link
          href="/"
          className="justify-self-center"
          aria-label={brand.name}
        >
          <Logo
            size="md"
            variant="light"
            className="object-center"
          />
        </Link>

        <nav className="hidden items-center justify-end gap-8 md:flex">
          {navRight.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              pathname={pathname}
            />
          ))}
        </nav>

        <div className="absolute right-4 md:hidden">
          <Sheet>
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
                  <Logo size="sm" variant="light" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {nav.map((item) => (
                  <SheetClose
                    key={item.label}
                    render={
                      <Link
                        href={item.href}
                        className="py-3 text-base text-white/85"
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
