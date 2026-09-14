import { PeacoatMeasureDiagram } from "@/components/peacoat-measure-diagram";
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
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
      <p className="max-w-3xl text-[14px] leading-relaxed text-ink/70">
        {chart.intro}
      </p>

      <div className="mt-5 grid items-center gap-6 md:grid-cols-[minmax(0,240px)_1fr]">
        <figure className="mx-auto w-full max-w-[240px]">
          <PeacoatMeasureDiagram className="h-auto w-full" />
          <figcaption className="sr-only">{chart.diagramAlt}</figcaption>
        </figure>

        <ol className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {chart.legend.map((item) => (
            <li key={item.n} className="flex gap-3 text-[13px] leading-snug">
              <span
                aria-hidden
                className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-[#3d6aa0]/40 text-[11px] text-[#3d6aa0]"
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

      <div className="mt-6">
        <table className="w-full table-fixed border-collapse text-left text-[11px] sm:text-[13px]">
          <caption className="mb-2 text-left text-[12px] text-ink/50">
            Allar tölur í {chart.unit}
          </caption>
          <thead>
            <tr className="border-b border-border text-[10px] tracking-[0.12em] text-ink/50 uppercase sm:text-[11px]">
              <th scope="col" className="w-[14%] py-2 pr-2 font-normal">
                Stærð
              </th>
              {chart.columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-1 py-2 font-normal sm:px-2"
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
                    className="py-2 pr-2 text-left font-medium sm:py-2.5"
                  >
                    {row.size}
                    {active ? (
                      <span className="ml-1 hidden text-[10px] font-normal tracking-normal text-forest/70 sm:inline">
                        valin
                      </span>
                    ) : null}
                  </th>
                  {chart.columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-1 py-2 tabular-nums sm:px-2 sm:py-2.5"
                    >
                      {row.values[column.key]}
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
