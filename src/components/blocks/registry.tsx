import type { ComponentType } from "react";
import { HeroBlock } from "./HeroBlock";
import { RichTextBlock } from "./RichTextBlock";
import { PrinciplesBlock } from "./PrinciplesBlock";
import { TopicGridBlock } from "./TopicGridBlock";
import { ArticleGridBlock } from "./ArticleGridBlock";
import { CtaBlock } from "./CtaBlock";
import { TeamGridBlock } from "./TeamGridBlock";
import { InfoCardsBlock } from "./InfoCardsBlock";
import { AffirmationsBlock } from "./AffirmationsBlock";
import { ImageBlock } from "./ImageBlock";
import { EmptyStateBlock } from "./EmptyStateBlock";
import { ContentListBlock } from "./ContentListBlock";
import { FormBlock } from "./FormBlock";
import type { BlockType, PageBlockData } from "@/db/blocks";

/**
 * Mapa type -> componente. Todos aceptan `{ content }` tipado según su
 * entrada en src/db/blocks.ts. Algunos son async Server Components (los que
 * consultan datos, como TopicGridBlock).
 */
export const blockRegistry: Record<BlockType, ComponentType<{ id: string; content: never }>> = {
  hero: HeroBlock,
  rich_text: RichTextBlock,
  principles: PrinciplesBlock,
  topic_grid: TopicGridBlock,
  article_grid: ArticleGridBlock,
  cta: CtaBlock,
  team_grid: TeamGridBlock,
  info_cards: InfoCardsBlock,
  affirmations: AffirmationsBlock,
  image: ImageBlock,
  empty_state: EmptyStateBlock,
  content_list: ContentListBlock,
  form: FormBlock,
} as unknown as Record<BlockType, ComponentType<{ id: string; content: never }>>;

export function renderBlock(block: PageBlockData, key: string | number) {
  const Component = blockRegistry[block.type] as ComponentType<{ id: string; content: unknown }>;
  if (!Component) return null;
  return <Component key={key} id={block.id} content={block.content} />;
}
