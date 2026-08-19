import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "neutral" | "accent";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-700",
    neutral: "bg-bg-subtle text-fg-muted",
    accent: "bg-accent-500/10 text-accent-600",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
