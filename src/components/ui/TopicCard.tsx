import Link from "next/link";
import { Card } from "./Card";
import type { Topic } from "@/data/topics";

export function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link href={`/ideas/${topic.slug}`} className="block h-full">
      <Card className="h-full hover:border-brand-300">
        <h3 className="text-lg font-semibold text-fg">{topic.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          {topic.summary}
        </p>
        <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600">
          Ver propuesta →
        </span>
      </Card>
    </Link>
  );
}
