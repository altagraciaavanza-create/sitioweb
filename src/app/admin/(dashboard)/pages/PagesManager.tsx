"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminButton, AdminCard, AdminEmpty } from "@/components/admin/admin-ui";
import { Modal } from "@/components/ui/Modal";
import { CreatePageForm } from "./CreatePageForm";

type Page = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
};

export function PagesManager({ items }: { items: Page[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setOpen(true)}>Nueva página</AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no hay páginas creadas.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((page) => (
            <AdminCard key={page.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {page.title}
                  <span
                    className={
                      "ml-2 rounded-full px-2 py-0.5 text-xs " +
                      (page.status === "published"
                        ? "bg-brand-50 text-brand-700"
                        : "bg-bg-subtle text-fg-muted")
                    }
                  >
                    {page.status === "published" ? "Publicada" : "Borrador"}
                  </span>
                </p>
                <p className="text-xs text-fg-muted">{page.slug === "" ? "/" : `/${page.slug}`}</p>
              </div>
              <Link href={`/admin/pages/${page.id}`} className="text-sm text-brand-600 hover:underline">
                Editar
              </Link>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva página">
        <CreatePageForm />
      </Modal>
    </div>
  );
}
