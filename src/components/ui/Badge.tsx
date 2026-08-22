import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "neutral" | "accent" | "solid-accent" | "solid-brand-light" | "solid-muted";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-700",
    neutral: "bg-bg-subtle text-fg-muted",
    accent: "bg-accent-500/10 text-accent-600",
    // Variantes "solid-*": pastillas de color lleno con texto oscuro
    // encima, como en el mockup de la landing (ver ArticleCard.tsx) — a
    // diferencia de las de arriba, que son un tinte suave.
    "solid-accent": "bg-accent-500 text-brand-900",
    "solid-brand-light": "bg-brand-300 text-brand-900",
    "solid-muted": "bg-fg-muted text-bg",
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
