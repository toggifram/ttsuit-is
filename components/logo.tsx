import Image from "next/image";

import { cn } from "@/lib/utils";

const sizes = {
  sm: { className: "h-10 w-auto md:h-11", width: 160, height: 70 },
  md: { className: "h-12 w-auto md:h-14", width: 200, height: 88 },
  lg: { className: "h-16 w-auto md:h-[4.5rem]", width: 260, height: 114 },
} as const;

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof sizes;
}) {
  const s = sizes[size];
  return (
    <Image
      src="/brand/logo.png"
      alt="Tjé Tjé"
      width={s.width}
      height={s.height}
      className={cn("object-contain", s.className, className)}
      priority
    />
  );
}
