"use client";

import { useMemo, useState } from "react";

import { HashLink } from "@/components/hash-link";
import {
  estimatePackage,
  extraOptions,
  formatIsk,
  garmentOptions,
  type Canvas,
  type ExtraKey,
  type GarmentKey,
} from "@/lib/price-calc";
import { priceTiers } from "@/lib/site";
import { cn } from "@/lib/utils";

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-10 px-4 text-sm transition-colors",
        selected
          ? "bg-forest text-white"
          : "border border-forest/20 bg-white text-forest hover:border-forest"
      )}
    >
      {children}
    </button>
  );
}

function toggle<T extends string>(list: T[], key: T) {
  return list.includes(key) ? list.filter((item) => item !== key) : [...list, key];
}

export function PackageCalculator() {
  const [garments, setGarments] = useState<GarmentKey[]>([]);
  const [extras, setExtras] = useState<ExtraKey[]>([]);
  const [tier, setTier] = useState(0);
  const [canvas, setCanvas] = useState<Canvas>("none");
  const [rush, setRush] = useState(false);

  const result = useMemo(
    () => estimatePackage({ garments, extras, tier, canvas, rush }),
    [garments, extras, tier, canvas, rush]
  );
  const hasJacket = garments.includes("jakki");

  function toggleExtra(key: ExtraKey) {
    setExtras((current) => {
      let next = toggle(current, key);
      if (key === "skyrta") next = next.filter((item) => item !== "sex-skyrtur");
      if (key === "sex-skyrtur") next = next.filter((item) => item !== "skyrta");
      return next;
    });
  }

  return (
    <div
      id="reiknivel"
      className="mt-16 scroll-mt-36 border border-forest/10 bg-white"
    >
      <div className="grid md:grid-cols-12">
        <div className="px-6 py-8 md:col-span-7 md:px-10 md:py-10">
          <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
            Reiknivél
          </p>
          <h3 className="mt-2 font-serif text-3xl text-forest md:text-4xl">
            Hvað kostar pakkinn þinn?
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/65">
            Veldu flíkur og efnisflokk. Þetta er áætlun út frá verðskránni —
            lokaorðið ræðst þegar þú velur efni í mælingu.
          </p>

          <p className="mt-8 text-[11px] tracking-[0.16em] text-forest/55 uppercase">
            Flíkur
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {garmentOptions.map((item) => (
              <Chip
                key={item.key}
                selected={garments.includes(item.key)}
                onClick={() => setGarments((current) => toggle(current, item.key))}
              >
                {item.label}
              </Chip>
            ))}
          </div>

          <p className="mt-8 text-[11px] tracking-[0.16em] text-forest/55 uppercase">
            Skyrtur og fylgihlutir
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {extraOptions.map((item) => (
              <Chip
                key={item.key}
                selected={extras.includes(item.key)}
                onClick={() => toggleExtra(item.key)}
              >
                {item.label}
              </Chip>
            ))}
          </div>

          <p className="mt-8 text-[11px] tracking-[0.16em] text-forest/55 uppercase">
            Efnisflokkur
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {priceTiers.map((label, index) => (
              <Chip
                key={label}
                selected={tier === index}
                onClick={() => setTier(index)}
              >
                {index + 1}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-ink/50">
            Flokkur 1 er upphafsverð. 5 og 6 innifela hálfan striga.
          </p>

          <p className="mt-8 text-[11px] tracking-[0.16em] text-forest/55 uppercase">
            Strigi
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["none", "Enginn"],
                ["half", "Hálfur"],
                ["full", "Fullur"],
              ] as const
            ).map(([value, label]) => (
              <Chip
                key={value}
                selected={canvas === value}
                onClick={() => setCanvas(value)}
              >
                {label}
              </Chip>
            ))}
          </div>
          {!hasJacket ? (
            <p className="mt-2 text-[12px] text-ink/50">
              Strigi á við jakka og jakkaföt.
            </p>
          ) : null}

          <label className="mt-8 flex cursor-pointer items-center gap-2.5 text-sm text-forest">
            <input
              type="checkbox"
              checked={rush}
              onChange={(e) => setRush(e.target.checked)}
              className="size-3.5 accent-forest"
            />
            Flýtismeðferð +20%
          </label>
        </div>

        <div className="flex flex-col justify-between bg-cream px-6 py-8 md:col-span-5 md:px-10 md:py-10">
          {result.lines.length ? (
            <ul className="space-y-2 text-sm text-ink/70">
              {result.lines.map((line) => (
                <li key={line.label} className="flex justify-between gap-4">
                  <span>{line.label}</span>
                  <span className="shrink-0 tabular-nums">
                    {line.amount < 0 ? "−" : ""}
                    {formatIsk(Math.abs(line.amount))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink/55">
              Veldu flíkur til að sjá áætlun.
            </p>
          )}
          <div className="mt-8">
            <p className="text-[11px] tracking-[0.16em] text-forest/55 uppercase">
              Áætlað verð
            </p>
            <p className="mt-2 font-serif text-4xl text-forest tabular-nums md:text-5xl">
              {formatIsk(result.total)}
            </p>
            <HashLink
              hash="boka-tima"
              href="/sersaumur#boka-tima"
              className="mt-6 inline-flex h-12 items-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
            >
              Bóka tíma
            </HashLink>
          </div>
        </div>
      </div>
    </div>
  );
}
