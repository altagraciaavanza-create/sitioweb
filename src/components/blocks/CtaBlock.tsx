import type { CSSProperties } from "react";
import Link from "next/link";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { ElementColorTrigger } from "@/components/editing/ElementColorTrigger";
import { updateBlockContainerStyle, updateBlockColorField } from "@/app/actions/editable-blocks";
import { cn } from "@/lib/utils";
import type { BlockContent } from "@/db/blocks";

export function CtaBlock({ id, content }: { id: string; content: BlockContent<"cta"> }) {
  const {
    eyebrow,
    title,
    description,
    ctaLabel,
    ctaHref,
    style,
    titleColor,
    descriptionColor,
    buttonColor,
    containerStyle = {},
  } = content;
  const solid = style === "solid";
  const sectionStyle: CSSProperties = {
    backgroundColor: containerStyle.background,
    paddingTop: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    paddingBottom: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    marginTop: containerStyle.marginTop != null ? `${containerStyle.marginTop}px` : undefined,
    marginBottom: containerStyle.marginBottom != null ? `${containerStyle.marginBottom}px` : undefined,
  };

  return (
    <section
      data-style-box
      className={cn(
        "relative group/styleable px-8",
        solid ? "bg-brand-500 py-16 md:py-[90px]" : "bg-bg py-16 md:py-[110px]"
      )}
      style={sectionStyle}
    >
      <ContainerStyleTrigger
        label="Sección CTA"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={updateBlockContainerStyle.bind(null, id)}
      />
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow ? (
          <EditableText
            blockId={id}
            field="eyebrow"
            value={eyebrow}
            as="p"
            className={
              solid
                ? "mb-3 text-sm font-bold tracking-wide text-brand-900/70 uppercase"
                : "mb-3 text-sm font-bold tracking-wide text-accent-500 uppercase"
            }
          />
        ) : null}
        <EditableText
          blockId={id}
          field="title"
          value={title}
          as="h2"
          className={
            solid
              ? "text-3xl font-black tracking-tight text-brand-900 md:text-4xl"
              : "text-3xl font-black tracking-tight text-fg md:text-4xl"
          }
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
            className={
              solid
                ? "mt-4 text-lg leading-relaxed text-brand-900/85"
                : "mt-4 text-lg leading-relaxed text-fg-muted"
            }
            colorField="descriptionColor"
            colorValue={descriptionColor}
            style={descriptionColor ? { color: descriptionColor } : undefined}
            multiline
          />
        ) : null}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <span style={{ position: "relative", display: "inline-block" }}>
            <Link
              href={ctaHref}
              className={
                solid
                  ? "rounded-[10px] bg-brand-900 px-8 py-4 text-base font-black text-white transition-opacity hover:opacity-90"
                  : "rounded-[10px] bg-brand-500 px-8 py-4 text-base font-black text-brand-900 transition-colors hover:bg-accent-500"
              }
              style={buttonColor ? { backgroundColor: buttonColor } : undefined}
            >
              {ctaLabel}
            </Link>
            <ElementColorTrigger
              label="Color del botón"
              value={buttonColor}
              onSave={updateBlockColorField.bind(null, id, "buttonColor")}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
