"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag } from "lucide-react";

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
import { brand, nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="bg-forest text-center text-[11px] tracking-[0.18em] text-white/90">
        <Link
          href="/hafa-samband#bokun"
          className="block px-4 py-2 transition-colors hover:text-white"
        >
          Sérsaumur á 4–6 vikum · Bókaðu mælingu
        </Link>
      </div>
      <div className="border-b border-black/8">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-8 px-4 md:h-[4.5rem] md:px-6">
          <Link
            href="/"
            className="flex h-12 w-[116px] shrink-0 items-center md:h-14 md:w-[135px]"
            aria-label={brand.name}
          >
            <Logo size="md" variant="dark" />
          </Link>

          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-[13px] text-ink/80 transition-colors hover:text-ink",
                  pathname === item.href && "text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            <Button
              nativeButton={false}
              variant="ghost"
              size="icon"
              render={<Link href="/verslun" />}
              className="text-ink hover:bg-black/5"
              aria-label="Leita í verslun"
            >
              <Search className="size-4" />
            </Button>
            <Button
              nativeButton={false}
              variant="ghost"
              size="icon"
              render={<Link href="/verslun" />}
              className="text-ink hover:bg-black/5"
              aria-label="Karfa"
            >
              <ShoppingBag className="size-4" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/hafa-samband#bokun" />}
              className="ml-2 h-9 rounded-none bg-forest px-4 text-[12px] text-white hover:bg-forest-mid"
            >
              Bóka mælingu
            </Button>
          </div>

          <div className="ml-auto md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-ink hover:bg-black/5"
                    aria-label="Opna valmynd"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-white">
                <SheetHeader>
                  <SheetTitle>
                    <Logo size="sm" variant="dark" />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {nav.map((item) => (
                    <SheetClose
                      key={item.label}
                      render={
                        <Link
                          href={item.href}
                          className="py-3 text-base text-ink/80"
                        />
                      }
                    >
                      {item.label}
                    </SheetClose>
                  ))}
                  <SheetClose
                    render={
                      <Link
                        href="/hafa-samband#bokun"
                        className="mt-4 bg-forest px-4 py-3 text-center text-sm text-white"
                      />
                    }
                  >
                    Bóka mælingu
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
