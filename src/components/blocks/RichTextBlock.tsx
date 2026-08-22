import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { updateBlockContainerStyle } from "@/app/actions/editable-blocks";
import { cn } from "@/lib/utils";
import type { BlockContent } from "@/db/blocks";

export function RichTextBlock({ id, content }: { id: string; content: BlockContent<"rich_text"> }) {
  const { title, body, align, tone, titleColor, bodyColor, containerStyle = {} } = content;
  const sectionStyle: CSSProperties = {
    backgroundColor: containerStyle.background,
    paddingTop: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    paddingBottom: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    marginTop: containerStyle.marginTop != null ? `${containerStyle.marginTop}px` : undefined,
    marginBottom: containerStyle.marginBottom != null ? `${containerStyle.marginBottom}px` : undefined,
  };

  return (
    <Section tone={tone} style={sectionStyle}>
      <ContainerStyleTrigger
        label="Sección de texto"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={updateBlockContainerStyle.bind(null, id)}
      />
      <div
        className={cn(
          "mx-auto max-w-3xl",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {align === "center" ? (
          <div className="mx-auto mb-7 h-[3px] w-12 bg-accent-500" />
        ) : null}
        {title ? (
          <EditableText
            blockId={id}
            field="title"
            value={title}
            as="h2"
            className="text-3xl font-black tracking-tight text-fg md:text-4xl"
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
