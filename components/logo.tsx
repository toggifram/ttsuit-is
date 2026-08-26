import { cn } from "@/lib/utils";

const sizes = {
  sm: { className: "h-10 w-[96px]", width: 96, height: 40 },
  md: { className: "h-12 w-[116px] md:h-14 md:w-[135px]", width: 135, height: 56 },
  lg: { className: "h-16 w-[154px] md:h-[72px] md:w-[174px]", width: 174, height: 72 },
} as const;

const SRC = {
  dark: "/brand/logo-dark.png?v=4",
  light: "/brand/logo.png?v=4",
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
    // Native img: Next's optimizer palettizes this PNG and the flex
    // header + Tailwind img max-width:100% can collapse it to 0px.
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
