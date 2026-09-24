import { cn } from "@/lib/utils";

export function ColorSwatch({
  colors,
  className,
}: {
  colors: string[];
  className?: string;
}) {
  const stripes = colors.length ? colors : ["#8a8a8a"];
  if (stripes.length === 1) {
    return (
      <span
        className={cn("block size-full", className)}
        style={{ backgroundColor: stripes[0] }}
      />
    );
  }

  return (
    <span className={cn("flex size-full overflow-hidden", className)}>
      {stripes.map((hex, index) => (
        <span
          key={`${hex}-${index}`}
          className="min-w-0 flex-1"
          style={{ backgroundColor: hex }}
        />
      ))}
    </span>
  );
}
