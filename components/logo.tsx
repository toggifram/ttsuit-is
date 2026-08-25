import { cn } from "@/lib/utils";

const sizes = {
  sm: "text-[1.85rem] md:text-3xl",
  md: "text-[2.15rem] md:text-[2.45rem]",
  lg: "text-5xl md:text-6xl",
} as const;

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof sizes;
}) {
  return (
    <span
      className={cn(
        "font-script inline-block px-1 leading-none tracking-tight text-white",
        sizes[size],
        className
      )}
    >
      Tjé Tjé
    </span>
  );
}
