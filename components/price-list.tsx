import { PackageCalculator } from "@/components/package-calculator";
import {
  accessoryPrices,
  garmentPrices,
  priceGroups,
  priceNotes,
  priceTierShorts,
  priceTiers,
} from "@/lib/site";

const allPrices = [...garmentPrices, ...accessoryPrices];

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

function priceRow(name: string) {
  return allPrices.find((row) => row.name === name);
}

function PricePairs({ amounts }: { amounts: readonly number[] }) {
  const pairs = priceTierShorts.flatMap((short, i) =>
    amounts[i] != null ? [{ short, amount: amounts[i]! }] : []
  );

  if (pairs.length === 1) {
    return (
      <p className="font-serif text-[15px] text-forest tabular-nums">
        {isk(pairs[0].amount)}
      </p>
    );
  }

  return (
    <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
      {pairs.map((pair) => (
        <div key={pair.short} className="flex items-baseline justify-between gap-2">
          <dt className="text-[11px] tracking-[0.08em] text-ink/50">{pair.short}</dt>
          <dd className="font-serif text-[14px] text-forest tabular-nums">
            {isk(pair.amount)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function MobilePriceCards() {
  return (
    <div className="mt-8 space-y-3 md:hidden">
      {priceGroups.map((group) => (
        <article key={group.title} className="bg-white px-4 py-5">
          <h4 className="font-serif text-xl text-forest">{group.title}</h4>
          <div className="mt-2 divide-y divide-forest/10">
            {group.names.map((name) => {
              const row = priceRow(name);
              if (!row) return null;
              return (
                <div key={name} className="py-3 first:pt-2 last:pb-0">
                  {group.names.length > 1 ? (
                    <p className="mb-2 text-[13px] font-semibold text-ink">
                      {row.name}
                    </p>
                  ) : null}
                  <PricePairs amounts={row.amounts} />
                </div>
              );
            })}
          </div>
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
