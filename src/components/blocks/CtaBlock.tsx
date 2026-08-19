import { CTASection } from "@/components/ui/CTASection";
import { Button } from "@/components/ui/Button";
import type { BlockContent } from "@/db/blocks";

export function CtaBlock({ content }: { content: BlockContent<"cta"> }) {
  const { eyebrow, title, description, ctaLabel, ctaHref } = content;

  return (
    <CTASection eyebrow={eyebrow} title={title} description={description}>
      <Button href={ctaHref} variant="secondary" size="lg" className="bg-white">
        {ctaLabel}
      </Button>
    </CTASection>
  );
}
