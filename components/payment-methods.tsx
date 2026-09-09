import { paymentMethodsLabel, paymentProvider } from "@/lib/payments";
import { cn } from "@/lib/utils";

export function PaymentMethods({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {compact ? null : (
        <p className="text-[11px] tracking-[0.14em] text-ink/45 uppercase">
          Greiðsla
        </p>
      )}
      <p className="text-[13px] leading-relaxed text-ink/65">
        Kortagreiðsla fer um{" "}
        <span className="font-semibold text-ink">{paymentProvider.name}</span>
        {" — "}
        {paymentMethodsLabel()}.
      </p>
      {compact ? null : (
        <ul className="flex flex-wrap gap-1.5">
          {paymentProvider.methods.map((name) => (
            <li
              key={name}
              className="border border-border bg-white px-2 py-1 text-[11px] tracking-wide text-ink/70"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
