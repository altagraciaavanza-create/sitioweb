import { Card } from "./Card";
import type { Principle } from "@/data/principles";

export function PrincipleCard({ principle }: { principle: Principle }) {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold text-fg">{principle.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        {principle.description}
      </p>
    </Card>
  );
}
