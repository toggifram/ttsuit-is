import { PackageCalculator } from "@/components/package-calculator";
import {
  accessoryPrices,
  garmentPrices,
  priceNotes,
  priceTiers,
} from "@/lib/site";

function isk(amount: number) {
  return new Intl.NumberFormat("is-IS").format(amount);
}

function AmountCells({ amounts }: { amounts: readonly number[] }) {
  return (
    <>
      {priceTiers.map((_, i) => (
        <td
          key={priceTiers[i]}
          className="px-2 py-3 text-center font-serif text-[13px] text-forest tabular-nums md:px-3 md:text-[15px]"
        >
          {amounts[i] != null ? isk(amounts[i]) : ""}
        </td>
      ))}
    </>
  );
}

export function PriceList() {
  return (
    <>
      <h3 className="mt-12 font-serif text-3xl text-forest">Efnisflokkar</h3>
      <p className="mt-3 max-w-xl text-sm text-ink/65">
        Verð fer eftir efnisvali. Flokkur 1 er upphafsverð — hærri flokkar eru
        fínni dúkur frá öðrum framleiðendum.
      </p>

      <div className="mt-8 overflow-x-auto bg-white">
        <table className="w-full min-w-[44rem] border-collapse">
          <thead>
            <tr className="border-b border-forest/15">
              <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-[0.16em] text-forest/55 uppercase">
                Efnisval
              </th>
              {priceTiers.map((tier) => (
                <th
                  key={tier}
                  className="px-2 py-4 text-center text-[11px] font-semibold tracking-[0.08em] text-forest/55 uppercase"
                >
                  {tier}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {garmentPrices.map((row, index) => (
              <tr
                key={row.name}
                className={
                  index === garmentPrices.length - 1
                    ? "border-b border-forest/20"
                    : "border-b border-forest/10"
                }
              >
                <th
                  scope="row"
                  className="px-5 py-3 text-left font-serif text-[15px] font-normal text-forest md:text-lg"
                >
                  {row.name}
                </th>
                <AmountCells amounts={row.amounts} />
              </tr>
            ))}
            {accessoryPrices.map((row) => (
              <tr key={row.name} className="border-b border-forest/10 last:border-b-0">
                <th
                  scope="row"
                  className="px-5 py-3 text-left font-serif text-[15px] font-normal text-forest md:text-lg"
                >
                  {row.name}
                </th>
                <AmountCells amounts={row.amounts} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-1 text-sm leading-relaxed text-ink/60">
        {priceNotes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>

      <PackageCalculator />
    </>
  );
}
