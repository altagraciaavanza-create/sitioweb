import type { CSSProperties } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { ElementColorTrigger } from "@/components/editing/ElementColorTrigger";
import { updateBlockContainerStyle, updateHeroCtaColor } from "@/app/actions/editable-blocks";
import type { BlockContent } from "@/db/blocks";

export function HeroBlock({ id, content }: { id: string; content: BlockContent<"hero"> }) {
  const {
    eyebrow,
    title,
    description,
    primaryCta,
    secondaryCta,
    titleColor,
    descriptionColor,
    titleStyle,
    containerStyle = {},
  } = content;
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
      className="relative group/styleable overflow-hidden bg-bg px-8 pt-16 pb-16 md:pt-[120px] md:pb-[100px]"
      style={sectionStyle}
    >
      <ContainerStyleTrigger
        label="Sección Hero"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={updateBlockContainerStyle.bind(null, id)}
      />
      {/* Líneas decorativas del mockup: un haz diagonal arriba a la derecha,
          con una de las líneas resaltada en dorado. Puramente decorativo. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 620 620"
        fill="none"
        className="pointer-events-none absolute -top-20 -right-16 hidden h-[620px] w-[620px] opacity-50 md:block"
      >
        <line x1="0" y1="600" x2="600" y2="0" stroke="var(--color-brand-100)" strokeWidth="1.5" />
        <line x1="80" y1="620" x2="620" y2="80" stroke="var(--color-brand-100)" strokeWidth="1.5" />
        <line x1="160" y1="620" x2="620" y2="160" stroke="var(--color-brand-100)" strokeWidth="1.5" />
        <line x1="240" y1="620" x2="620" y2="240" stroke="var(--color-accent-500)" strokeWidth="2" />
        <line x1="320" y1="620" x2="620" y2="320" stroke="var(--color-brand-100)" strokeWidth="1.5" />
      </svg>

      <Container className="relative flex flex-col items-start gap-0">
        {eyebrow ? (
          <EditableText
            blockId={id}
            field="eyebrow"
            value={eyebrow}
            as="p"
            className="mb-5 text-[13px] font-bold tracking-[0.14em] text-accent-500 uppercase"
          />
        ) : null}
        <EditableText
          blockId={id}
          field="title"
          value={title}
          as="h1"
          className="mb-7 max-w-3xl text-4xl leading-[1.08] font-black tracking-tight text-fg sm:text-5xl md:text-[68px] md:leading-[1.04] md:tracking-[-0.02em]"
          colorField="titleColor"
          colorValue={titleColor}
          style={titleColor ? { color: titleColor } : undefined}
          lineBreakEditable
          sizeField="titleStyle"
          sizeValue={titleStyle}
          sizeSupports={{ fontSize: true, fontSizeMin: 28, fontSizeMax: 120, fontSizeDefault: 68, margin: true }}
        />
        {description ? (
          <EditableText
            blockId={id}
            field="description"
            value={description}
            as="p"
            className="mb-11 max-w-xl text-lg leading-relaxed text-fg-muted md:text-xl"
            colorField="descriptionColor"
            colorValue={descriptionColor}
            style={descriptionColor ? { color: descriptionColor } : undefined}
            multiline
          />
        ) : null}
        {primaryCta || secondaryCta ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            {primaryCta ? (
              <span style={{ position: "relative", display: "inline-block" }}>
                <Link
                  href={primaryCta.href}
                  className="rounded-[10px] bg-brand-500 px-8 py-4 text-center text-base font-black text-brand-900 transition-colors hover:bg-accent-500"
                  style={primaryCta.color ? { backgroundColor: primaryCta.color } : undefined}
                >
                  {primaryCta.label}
                </Link>
                <ElementColorTrigger
                  label="Color del botón principal"
                  value={primaryCta.color}
                  onSave={updateHeroCtaColor.bind(null, id, "primaryCta", primaryCta)}
                />
              </span>
            ) : null}
            {secondaryCta ? (
              <span style={{ position: "relative", display: "inline-block" }}>
                <Link
                  href={secondaryCta.href}
                  className="rounded-[10px] border-[1.5px] border-accent-500 px-8 py-4 text-center text-base font-black text-accent-500 transition-colors hover:bg-accent-500/10"
                  style={secondaryCta.color ? { borderColor: secondaryCta.color, color: secondaryCta.color } : undefined}
                >
                  {secondaryCta.label}
                </Link>
                <ElementColorTrigger
                  label="Color del botón secundario"
                  value={secondaryCta.color}
                  onSave={updateHeroCtaColor.bind(null, id, "secondaryCta", secondaryCta)}
                />
              </span>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
