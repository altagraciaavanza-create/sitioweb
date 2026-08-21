import { CTASection } from "@/components/ui/CTASection";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/editing/EditableText";
import type { BlockContent } from "@/db/blocks";

export function CtaBlock({ id, content }: { id: string; content: BlockContent<"cta"> }) {
  const { eyebrow, title, description, ctaLabel, ctaHref, titleColor, descriptionColor } = content;

  return (
    <CTASection
      eyebrow={eyebrow}
      title={title}
      description={description}
      titleNode={
        <EditableText
          blockId={id}
          field="title"
          value={title}
          as="h2"
          className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
          colorField="titleColor"
          colorValue={titleColor}
          style={titleColor ? { color: titleColor } : undefined}
        />
      }
      descriptionNode={
        description ? (
          <EditableText
            blockId={id}
            field="description"
            value={description}
            as="p"
            className="mt-4 text-lg text-brand-100"
            colorField="descriptionColor"
            colorValue={descriptionColor}
            style={descriptionColor ? { color: descriptionColor } : undefined}
            multiline
          />
        ) : null
      }
    >
      <Button href={ctaHref} variant="secondary" size="lg" className="bg-white">
        {ctaLabel}
      </Button>
    </CTASection>
  );
}
