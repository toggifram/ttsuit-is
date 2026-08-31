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
          className="px-1 py-[0.7rem] text-center font-serif text-[13px] italic text-white/90 md:text-[17px]"
        >
          {amounts[i] != null ? isk(amounts[i]) : ""}
        </td>
      ))}
    </>
  );
}

export function PriceList() {
  return (
    <div className="relative mt-10 overflow-hidden bg-forest px-4 py-10 text-gold md:mt-12 md:px-12 md:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 size-[28rem] opacity-25"
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 0% 0%, transparent 0deg 11deg, rgb(212 197 161 / 0.18) 11deg 12deg)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-tl.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[55%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.12] mix-blend-screen"
      />
      <p
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 font-serif text-[11px] tracking-[0.55em] text-gold/25 uppercase md:block"
        style={{ writingMode: "vertical-rl" }}
      >
        Suit
      </p>

      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse">
          <thead>
            <tr className="border-b border-gold/55">
              <th className="w-[22%] pb-4 text-left align-bottom font-serif text-sm font-normal tracking-wide italic md:text-base">
                Efnisval
              </th>
              {priceTiers.map((tier) => (
                <th
                  key={tier}
                  className="relative h-24 w-[13%] align-bottom font-normal"
                >
                  <span className="absolute bottom-4 left-1/2 origin-bottom-left -translate-x-[0.35rem] -rotate-45 whitespace-nowrap font-serif text-[12px] italic md:text-sm">
                    {tier}
                  </span>
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
                    ? "border-b border-gold/55"
                    : undefined
                }
              >
                <th
                  scope="row"
                  className="py-[0.7rem] pr-4 text-left font-serif text-[15px] font-normal italic md:text-xl"
                >
                  {row.name}
                </th>
                <AmountCells amounts={row.amounts} />
              </tr>
            ))}
            {accessoryPrices.map((row) => (
              <tr key={row.name}>
                <th
                  scope="row"
                  className="py-[0.7rem] pr-4 text-left font-serif text-[15px] font-normal italic md:text-xl"
                >
                  {row.name}
                </th>
                <AmountCells amounts={row.amounts} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="relative mt-10 space-y-1 text-center font-serif text-[13px] italic text-white/80 md:text-[15px]">
        {priceNotes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </div>
  );
}
