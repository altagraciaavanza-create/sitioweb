import { Container } from "@/components/ui/Container";
import type { BlockContent } from "@/db/blocks";

export function ImageBlock({ content }: { content: BlockContent<"image"> }) {
  const { imageUrl, alt, caption } = content;

  return (
    <div className="py-10">
      <Container>
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={alt}
            className="w-full rounded-lg object-cover"
          />
          {caption ? (
            <figcaption className="mt-3 text-center text-sm text-fg-muted">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      </Container>
    </div>
  );
}
