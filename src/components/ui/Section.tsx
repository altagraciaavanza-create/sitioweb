import { cn } from "@/lib/utils";
import { Container } from "./Container";
import type { CSSProperties, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Fondo de la sección. */
  tone?: "default" | "subtle" | "brand";
  /**
   * Override de estilo puntual (fondo/espaciado) guardado desde el modo
   * edición en vivo — ver ContainerStyleTrigger.tsx. Un valor inline
   * siempre gana sobre las clases de Tailwind de acá arriba.
   */
  style?: CSSProperties;
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
  style,
}: SectionProps) {
  return (
    <section
      id={id}
      // `data-style-box` + "group/styleable" son el gancho que usa
      // ContainerStyleTrigger.tsx para saber qué elemento está editando y
      // dónde mostrar su engranaje — no tienen efecto visual propio.
      data-style-box
      className={cn("relative group/styleable py-16 md:py-24", toneClasses[tone], className)}
      style={style}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
