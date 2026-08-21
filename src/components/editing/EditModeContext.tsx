"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Modo edición en vivo del sitio público: lo que le permite a un admin
 * loggeado hacer doble clic sobre un texto de la home (u otra página que ya
 * use el page builder) y editarlo ahí mismo, con guardado directo a la base
 * de datos — sin pasar por el formulario de /admin/pages.
 *
 * `isAdmin` se calcula en el servidor (RootLayout, vía getSession()) y se
 * pasa como prop inicial acá: un visitante normal nunca ve el botón de
 * "Modo edición" ni paga el costo de los componentes editables (siguen
 * renderizando como texto plano). El propio `editMode` arranca siempre en
 * false tanto en servidor como cliente, así que no hay mismatch de
 * hidratación.
 */
type EditModeValue = {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
};

const EditModeContext = createContext<EditModeValue>({
  isAdmin: false,
  editMode: false,
  setEditMode: () => {},
});

export function EditModeProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: ReactNode;
}) {
  const [editMode, setEditMode] = useState(false);

  return (
    <EditModeContext.Provider value={{ isAdmin, editMode: isAdmin && editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
