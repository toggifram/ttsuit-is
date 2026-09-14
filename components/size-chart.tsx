import Image from "next/image";

import { sizesMatch, type SizeChart } from "@/lib/size-charts";
import { cn } from "@/lib/utils";

export function SizeChartPanel({
  chart,
  selectedSize,
}: {
  chart: SizeChart;
  selectedSize?: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8">
      <p className="max-w-xl text-[14px] leading-relaxed text-ink/70">
        {chart.intro}
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:items-start">
        <figure className="mx-auto w-full max-w-[220px]">
          <Image
            src={chart.diagram.src}
            alt={chart.diagram.alt}
            width={chart.diagram.width}
            height={chart.diagram.height}
            className="h-auto w-full bg-white"
          />
          <figcaption className="sr-only">{chart.diagram.alt}</figcaption>
        </figure>

        <ol className="space-y-3 text-[13px] leading-snug text-ink/75">
          {chart.legend.map((item) => (
            <li key={item.n} className="flex gap-3">
              <span
                aria-hidden
                className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-forest/30 text-[11px] text-forest"
              >
                {item.n}
              </span>
              <span>
                <span className="font-medium text-ink">{item.label}</span>
                <span className="text-ink/55"> — {item.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
          <caption className="sr-only">
            Stærðartafla í {chart.unit} fyrir {chart.title}
          </caption>
          <thead>
            <tr className="border-b border-border text-[11px] tracking-[0.14em] text-ink/50 uppercase">
              <th scope="col" className="py-2 pr-3 font-normal">
                Stærð
              </th>
              {chart.columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-2 py-2 font-normal"
                >
                  <span className="block">{column.label}</span>
                  <span className="mt-0.5 block text-[10px] tracking-normal text-ink/40 normal-case">
                    {column.hint}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => {
              const active = sizesMatch(row.size, selectedSize);
              return (
                <tr
                  key={row.size}
                  className={cn(
                    "border-b border-border/80",
                    active ? "bg-cream text-forest" : "text-ink"
                  )}
                >
                  <th
                    scope="row"
                    className="py-2.5 pr-3 text-left font-medium"
                  >
                    {row.size}
                    {active ? (
                      <span className="ml-2 text-[10px] font-normal tracking-normal text-forest/70">
                        valin
                      </span>
                    ) : null}
                  </th>
                  {chart.columns.map((column) => (
                    <td key={column.key} className="px-2 py-2.5 whitespace-nowrap">
                      {row.values[column.key]} {chart.unit}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
