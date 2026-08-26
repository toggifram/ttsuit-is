import Image from "next/image";

import { cn } from "@/lib/utils";

const sizes = {
  sm: { className: "h-9 w-auto", width: 140, height: 61 },
  md: { className: "h-10 w-auto md:h-11", width: 180, height: 79 },
  lg: { className: "h-14 w-auto md:h-16", width: 240, height: 105 },
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
    <Image
      src={variant === "dark" ? "/brand/logo-dark.png" : "/brand/logo.png"}
      alt="Tjé Tjé"
      width={s.width}
      height={s.height}
      className={cn("object-contain", s.className, className)}
      priority
    />
  );
}
