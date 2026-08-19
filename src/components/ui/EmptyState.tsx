import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-bg-subtle px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-fg-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
