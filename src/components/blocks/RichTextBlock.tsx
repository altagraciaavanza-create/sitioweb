import { Section } from "@/components/ui/Section";
import { EditableText } from "@/components/editing/EditableText";
import { cn } from "@/lib/utils";
import type { BlockContent } from "@/db/blocks";

export function RichTextBlock({ id, content }: { id: string; content: BlockContent<"rich_text"> }) {
  const { title, body, align, titleColor, bodyColor } = content;

  return (
    <Section tone="default">
      <div
        className={cn(
          "mx-auto max-w-3xl",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {title ? (
          <EditableText
            blockId={id}
            field="title"
            value={title}
            as="h2"
            className="text-3xl font-bold tracking-tight text-fg md:text-4xl"
            colorField="titleColor"
            colorValue={titleColor}
            style={titleColor ? { color: titleColor } : undefined}
          />
        ) : null}
        <EditableText
          blockId={id}
          field="body"
          value={body}
          as="div"
          className="mt-6 whitespace-pre-line text-lg leading-relaxed text-fg-muted"
          colorField="bodyColor"
          colorValue={bodyColor}
          style={bodyColor ? { color: bodyColor } : undefined}
          multiline
        />
      </div>
    </Section>
  );
}
