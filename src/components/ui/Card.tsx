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
        "rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow duration-150 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
