import type { ReactNode } from "react";
import { Section } from "./Section";

export function CTASection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <Section tone="brand">
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow ? (
          <p className="text-sm font-medium tracking-wide text-brand-100 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-lg text-brand-100">{description}</p>
        ) : null}
        {children ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {children}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
