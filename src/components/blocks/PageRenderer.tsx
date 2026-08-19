import type { PageBlockData } from "@/db/blocks";
import { renderBlock } from "./registry";

export function PageRenderer({ blocks }: { blocks: PageBlockData[] }) {
  return <>{blocks.map((block, index) => renderBlock(block, index))}</>;
}
