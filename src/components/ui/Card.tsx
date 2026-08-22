import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // bg-fg/5: un tinte sutil del color de texto sobre lo que sea que
        // haya detrás — así la tarjeta siempre contrasta con la sección que
        // la contiene (clara u oscura, tone="default" o "subtle") sin
        // necesitar un tercer color de "superficie" en el sistema de temas.
        "rounded-lg border border-border bg-fg/5 p-6 shadow-sm transition-shadow duration-150 hover:bg-fg/8 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
