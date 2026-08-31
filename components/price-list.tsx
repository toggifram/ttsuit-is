import { packages, prices } from "@/lib/site";

export function PriceList() {
  return (
    <>
      <div className="mt-12 grid gap-px bg-forest/10 sm:grid-cols-2 lg:grid-cols-5">
        {prices.map((item) => (
          <div key={item.name} className="bg-white p-6 md:p-8">
            <h3 className="font-serif text-2xl text-forest">{item.name}</h3>
            <p className="mt-2 text-sm text-forest/80">Frá {item.from}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              {item.note}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mt-16 font-serif text-3xl text-forest">Pakkar</h3>
      <p className="mt-3 max-w-xl text-sm text-ink/65">
        Við elskum öll pakka. Þú getur alltaf bætt við skyrtu, vesti eða
        fylgihlutum.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <div key={item.name} className="bg-white px-6 py-8">
            <h4 className="font-serif text-2xl text-forest">{item.name}</h4>
            <p className="mt-2 text-sm text-forest/80">Frá {item.from}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {item.items}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
