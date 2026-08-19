import { cn } from "@/lib/utils";
import { Container } from "./Container";
import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Fondo de la sección. */
  tone?: "default" | "subtle" | "brand";
};

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-bg",
  subtle: "bg-bg-subtle",
  brand: "bg-brand-900 text-white",
};

export function Section({
  children,
  className,
  containerClassName,
  id,
  tone = "default",
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", toneClasses[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
