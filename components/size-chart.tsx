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
    <div className="min-h-0 flex-1 overflow-auto px-4 pb-5 sm:px-6 sm:pb-6">
      <table className="w-full table-fixed border-collapse text-left text-[11px] sm:text-[13px]">
        <caption className="mb-2 text-left text-[11px] text-ink/50 sm:text-[12px]">
          Allar tölur í {chart.unit}
        </caption>
        <thead>
          <tr className="border-b border-border text-[10px] tracking-[0.1em] text-ink/50 uppercase sm:text-[11px] sm:tracking-[0.12em]">
            <th scope="col" className="w-[13%] py-2 pr-1 font-normal sm:pr-2">
              Stærð
            </th>
            {chart.columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-0.5 py-2 font-normal sm:px-2"
              >
                <span className="block">{column.label}</span>
                {column.hint ? (
                  <span className="mt-0.5 hidden text-[10px] tracking-normal text-ink/40 normal-case sm:block">
                    {column.hint}
                  </span>
                ) : null}
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
                  className="py-2 pr-1 text-left font-medium sm:py-2.5 sm:pr-2"
                >
                  {row.size}
                </th>
                {chart.columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-0.5 py-2 tabular-nums sm:px-2 sm:py-2.5"
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
  );
}
