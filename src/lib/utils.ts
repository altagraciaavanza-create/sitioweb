type ClassValue = string | number | null | undefined | false;

/** Combina clases condicionalmente, filtrando valores falsy. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

/** Formatea una fecha ISO a formato legible en español (es-AR). */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
