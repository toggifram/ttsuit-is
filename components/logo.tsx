import { cn } from "@/lib/utils";

const sizes = {
  sm: { className: "h-10 w-[95px]", width: 95, height: 40 },
  md: { className: "h-12 w-[113px] md:h-14 md:w-[132px]", width: 132, height: 56 },
  lg: { className: "h-16 w-[151px] md:h-[72px] md:w-[170px]", width: 170, height: 72 },
} as const;

const SRC = {
  dark: "/brand/logo-dark.svg",
  light: "/brand/logo.svg",
} as const;

export function Logo({
  className,
  size = "md",
  variant = "light",
}: {
  className?: string;
  size?: keyof typeof sizes;
  variant?: "light" | "dark";
}) {
  const s = sizes[size];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[variant]}
      alt="Tjé Tjé"
      width={s.width}
      height={s.height}
      className={cn("block max-w-none object-contain object-left", s.className, className)}
    />
  );
}
