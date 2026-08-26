import Image from "next/image";

import { cn } from "@/lib/utils";

const sizes = {
  sm: { className: "h-10 w-auto", width: 160, height: 68 },
  md: { className: "h-11 w-auto md:h-12", width: 200, height: 85 },
  lg: { className: "h-14 w-auto md:h-16", width: 260, height: 110 },
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
