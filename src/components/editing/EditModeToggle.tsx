"use client";

import { useEditMode } from "./EditModeContext";

/**
 * Botón flotante, visible solo para un admin loggeado navegando el sitio
 * público, para prender/apagar el modo edición en vivo (ver
 * EditModeContext.tsx). No aparece nunca para un visitante normal.
 */
export function EditModeToggle() {
  const { isAdmin, editMode, setEditMode } = useEditMode();

  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => setEditMode(!editMode)}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 18px",
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        background: editMode ? "#1f7a5c" : "#111827",
        color: "#ffffff",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
      {editMode ? "Editando — hacé doble clic en un texto" : "Modo edición"}
    </button>
  );
}
