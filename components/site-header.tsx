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
import { brand, nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-forest text-white">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 md:h-24 md:px-8">
        <nav className="hidden flex-1 items-center gap-8 md:flex">
          {nav.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[11px] font-medium tracking-[0.22em] uppercase text-white/80 transition-colors hover:text-white",
                pathname === item.href && "text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex shrink-0 items-center" aria-label={brand.name}>
          <Logo size="md" />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
          {nav.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[11px] font-medium tracking-[0.22em] uppercase text-white/80 transition-colors hover:text-white",
                pathname === item.href && "text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button
            nativeButton={false}
            render={<Link href="/hafa-samband#bokun" />}
            className="h-10 rounded-none border border-white/30 bg-transparent px-4 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-white hover:text-forest"
          >
            Bóka mælingu
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-end md:hidden">
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
              className="border-forest/20 bg-forest text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-white">
                  <Logo size="sm" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {nav.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="py-3 text-sm tracking-[0.16em] uppercase text-white/85"
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
                      className="mt-4 border border-white/40 px-4 py-3 text-center text-xs tracking-[0.18em] uppercase"
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
    </header>
  );
}
