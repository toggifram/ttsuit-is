import Link from "next/link";

import { categoryLooks } from "@/lib/product";

export function CategoryLooks() {
  return (
    <section aria-label="Verslun" className="bg-white">
      <div className="grid grid-cols-3">
        {categoryLooks.map((look) => (
          <Link
            key={look.id}
            href={look.href}
            className="group relative aspect-[4/5] overflow-hidden bg-[#ebe6dc]"
          >
            <img
              src={look.image}
              alt={look.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ objectPosition: look.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-[18%] px-2 text-center text-white">
              <p className="text-[9px] tracking-[0.28em] uppercase md:text-[11px]">
                Versla núna
              </p>
              <p className="mt-1.5 text-[13px] font-medium md:text-2xl">
                {look.label}
              </p>
            </div>
            <span className="sr-only">
              Versla {look.label.toLowerCase()} núna
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
