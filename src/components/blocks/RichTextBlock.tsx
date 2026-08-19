import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import type { BlockContent } from "@/db/blocks";

export function RichTextBlock({ content }: { content: BlockContent<"rich_text"> }) {
  const { title, body, align } = content;

  return (
    <Section tone="default">
      <div
        className={cn(
          "mx-auto max-w-3xl",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {title ? (
          <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
            {title}
          </h2>
        ) : null}
        <div className="mt-6 whitespace-pre-line text-lg leading-relaxed text-fg-muted">
          {body}
        </div>
      </div>
    </Section>
  );
}
