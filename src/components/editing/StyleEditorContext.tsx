"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ContainerStyle } from "@/db/blocks";

/**
 * Qué controles mostrar en el panel de estilo (ver ContainerStylePanel.tsx)
 * para el elemento seleccionado. Una sección de ancho completo no se ve
 * distinta con bordes redondeados, por ejemplo, así que no todos los
 * elementos soportan las mismas propiedades.
 */
export type StyleSupports = {
  background?: boolean;
  padding?: boolean;
  /** Máximo del control de espaciado, en px (default 160). */
  paddingMax?: number;
  radius?: boolean;
  /** Ancho máximo — solo tiene sentido en tarjetas, no en secciones. */
  width?: boolean;
  /** Máximo del control de ancho, en px (default 480). */
  widthMax?: number;
  /** Espaciado externo (arriba/abajo) — el equivalente a "posición" en un
   * sitio de flujo normal, sin romper el layout con posicionamiento libre. */
  margin?: boolean;
};

export type StyleEditorTarget = {
  /** Título mostrado arriba del panel, ej: "Sección · Actualidad". */
  label: string;
  value: ContainerStyle;
  supports: StyleSupports;
  /** Aplica el cambio visualmente al instante (antes de que termine de guardar). */
  onChange: (style: ContainerStyle) => void;
  /** Persiste el valor final. */
  onSave: (style: ContainerStyle) => Promise<{ error?: string } | void>;
};

type StyleEditorContextValue = {
  target: StyleEditorTarget | null;
  open: (target: StyleEditorTarget) => void;
  close: () => void;
};

const StyleEditorContext = createContext<StyleEditorContextValue>({
  target: null,
  open: () => {},
  close: () => {},
});

/**
 * Contexto que sostiene "qué contenedor está seleccionado ahora mismo" en
 * modo edición en vivo — lo abre cualquier ContainerStyleTrigger.tsx (el
 * engranaje que aparece sobre una sección o tarjeta) y lo consume un único
 * ContainerStylePanel.tsx montado una vez cerca de la raíz (ver
 * SiteChrome.tsx), para no tener un panel flotante por cada elemento.
 */
export function StyleEditorProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<StyleEditorTarget | null>(null);

  return (
    <StyleEditorContext.Provider value={{ target, open: setTarget, close: () => setTarget(null) }}>
      {children}
    </StyleEditorContext.Provider>
  );
}

export function useStyleEditor() {
  return useContext(StyleEditorContext);
}
