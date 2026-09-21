import { brand } from "@/lib/site";

export function MaintenanceScreen() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-forest px-6 py-16 text-center text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo.svg"
        alt="Tjé Tjé"
        width={168}
        height={72}
        className="block h-14 w-auto max-w-none border-0 bg-transparent object-contain md:h-16"
      />
      <h1 className="mt-12 max-w-xl font-serif text-4xl leading-tight md:text-5xl">
        Við erum að uppfæra síðuna hjá okkur.
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
        Nýja síðan er á leiðinni. Komdu aftur eftir smá stund.
      </p>
      <a
        href={`mailto:${brand.email}`}
        className="mt-10 text-[13px] tracking-[0.08em] text-white/80 underline-offset-4 hover:text-white hover:underline"
      >
        {brand.email}
      </a>
    </div>
  );
}
