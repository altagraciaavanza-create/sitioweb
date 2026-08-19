"use client";

import { blockRegistrySchema, blockTypes, type BlockType } from "@/db/blocks";
import { addBlock } from "./actions";
import { AdminButton } from "@/components/admin/admin-ui";

export function AddBlockForm({ pageId, slug }: { pageId: string; slug: string }) {
  return (
    <form
      action={async (formData) => {
        const type = formData.get("type") as BlockType;
        await addBlock(pageId, slug, type);
      }}
      className="flex items-end gap-3"
    >
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-fg">
          Agregar bloque
        </label>
        <select
          id="type"
          name="type"
          className="mt-1 rounded-md border border-border px-3 py-2 text-sm"
          defaultValue={blockTypes[0]}
        >
          {blockTypes.map((type) => (
            <option key={type} value={type}>
              {blockRegistrySchema[type].label}
            </option>
          ))}
        </select>
      </div>
      <AdminButton type="submit" variant="secondary">
        Agregar
      </AdminButton>
    </form>
  );
}
