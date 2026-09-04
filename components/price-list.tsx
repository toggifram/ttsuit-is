import { PackageCalculator } from "@/components/package-calculator";
import {
  accessoryPrices,
  garmentPrices,
  priceNotes,
  priceTiers,
} from "@/lib/site";

const priceRows = [...garmentPrices, ...accessoryPrices];

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

function MobilePriceCards() {
  return (
    <div className="mt-8 space-y-3 md:hidden">
      {priceRows.map((row) => (
        <article key={row.name} className="bg-white px-5 py-5">
          <h4 className="font-serif text-xl text-forest">{row.name}</h4>
          <dl className="mt-3 divide-y divide-forest/10">
            {priceTiers.map((tier, i) =>
              row.amounts[i] != null ? (
                <div
                  key={tier}
                  className="flex items-baseline justify-between gap-4 py-2 text-sm"
                >
                  <dt className="text-ink/55">{tier}</dt>
                  <dd className="font-serif text-[15px] text-forest tabular-nums">
                    {isk(row.amounts[i]!)}
                  </dd>
                </div>
              ) : null
            )}
          </dl>
        </article>
      ))}
    </div>
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

      <MobilePriceCards />

      <div className="mt-8 hidden overflow-x-auto bg-white md:block">
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
