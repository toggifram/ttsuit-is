import { cn } from "@/lib/utils";

export function ProductImageBadges({
  soldOut,
  sellingFast,
  badge,
  compact = false,
}: {
  soldOut?: boolean;
  sellingFast?: boolean;
  badge?: string;
  compact?: boolean;
}) {
  const chip = cn(
    "absolute z-10 px-1.5 py-0.5 text-[10px] tracking-[0.12em] text-white",
    compact ? "top-2" : "top-3"
  );

  return (
    <>
      {soldOut ? (
        <span className={cn(chip, "bg-forest", compact ? "left-2" : "left-3")}>
          UPPSELT
        </span>
      ) : badge ? (
        <span className={cn(chip, "bg-black", compact ? "left-2" : "left-3")}>
          {badge}
        </span>
      ) : null}
      {!soldOut && sellingFast ? (
        <span className={cn(chip, "bg-forest", compact ? "right-2" : "right-3")}>
          SELST HRATT
        </span>
      ) : null}
    </>
  );
}
