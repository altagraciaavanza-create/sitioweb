"use client";

import { useState } from "react";
import { AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { PostForm } from "./PostForm";
import { createPost, updatePost, deletePost } from "./actions";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string | null;
  category: string;
  coverImageUrl?: string | null;
  status: string;
  publishedAt?: Date | string | null;
};

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; post: Post };

export function PostsManager({ items }: { items: Post[] }) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nueva publicación</AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no hay publicaciones cargadas.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((post) => (
            <AdminCard key={post.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {post.title}
                  {post.status === "draft" ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Borrador
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">/actualidad/{post.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ mode: "edit", post })}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Editar
                </button>
                <AdminDeleteButton
                  action={deletePost.bind(null, post.id)}
                  confirmMessage={`¿Eliminar "${post.title}"?`}
                  successMessage="Publicación eliminada."
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Editar: ${modal.post.title}` : "Nueva publicación"}
        maxWidth="max-w-2xl"
      >
        {modal.mode === "create" ? (
          <PostForm action={createPost} onSuccess={() => setModal({ mode: "closed" })} />
        ) : modal.mode === "edit" ? (
          <PostForm
            action={updatePost.bind(null, modal.post.id)}
            post={modal.post}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : null}
      </Modal>
    </div>
  );
}
