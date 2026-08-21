import type { ReactNode } from "react";
import { Section } from "./Section";

export function CTASection({
  eyebrow,
  title,
  description,
  children,
  titleNode,
  descriptionNode,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Reemplaza el <h2> plano — lo usa CtaBlock para inyectar un EditableText. */
  titleNode?: ReactNode;
  /** Reemplaza el <p> plano de la bajada — mismo motivo que `titleNode`. */
  descriptionNode?: ReactNode;
}) {
  return (
    <Section tone="brand">
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow ? (
          <p className="text-sm font-medium tracking-wide text-brand-100 uppercase">
            {eyebrow}
          </p>
        ) : null}
        {titleNode ?? (
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
        )}
        {descriptionNode ?? (description ? <p className="mt-4 text-lg text-brand-100">{description}</p> : null)}
        {children ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {children}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
