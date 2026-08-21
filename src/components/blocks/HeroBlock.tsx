import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditableText } from "@/components/editing/EditableText";
import type { BlockContent } from "@/db/blocks";

export function HeroBlock({ id, content }: { id: string; content: BlockContent<"hero"> }) {
  const { eyebrow, title, description, primaryCta, secondaryCta, titleColor, descriptionColor } = content;

  return (
    <section className="relative overflow-hidden bg-bg">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-brand-50),_transparent_60%)]"
      />
      <Container className="flex flex-col items-start gap-8 py-20 md:py-32">
        {eyebrow ? (
          <p className="text-sm font-medium tracking-wide text-brand-600 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <EditableText
          blockId={id}
          field="title"
          value={title}
          as="h1"
          className="max-w-3xl text-4xl font-extrabold tracking-tight text-fg sm:text-5xl md:text-6xl"
          colorField="titleColor"
          colorValue={titleColor}
          style={titleColor ? { color: titleColor } : undefined}
        />
        {description ? (
          <EditableText
            blockId={id}
            field="description"
            value={description}
            as="p"
            className="max-w-xl text-lg leading-relaxed text-fg-muted md:text-xl"
            colorField="descriptionColor"
            colorValue={descriptionColor}
            style={descriptionColor ? { color: descriptionColor } : undefined}
            multiline
          />
        ) : null}
        {primaryCta || secondaryCta ? (
          <div className="flex flex-wrap gap-4">
            {primaryCta ? (
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button href={secondaryCta.href} size="lg" variant="secondary">
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
