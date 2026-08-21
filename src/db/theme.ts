import { z } from "zod";

/**
 * Tokens de color que puede definir un perfil de identidad visual. Son
 * exactamente las variables CSS que ya usa todo el sitio (ver
 * src/app/globals.css, bloque `@theme inline`) — por eso alcanza con
 * inyectarlas como estilos inline en el contenedor del sitio público
 * (ver SiteChrome.tsx) para que absolutamente todos los componentes que
 * ya usan clases como bg-bg, text-fg-muted, bg-brand-500, etc. cambien
 * solos, sin tocar cada componente uno por uno.
 */
export const THEME_COLOR_KEYS = [
  "bg",
  "bgSubtle",
  "fg",
  "fgMuted",
  "border",
  "brand50",
  "brand100",
  "brand300",
  "brand500",
  "brand600",
  "brand700",
  "brand900",
  "accent500",
  "accent600",
] as const;

export type ThemeColorKey = (typeof THEME_COLOR_KEYS)[number];

export const THEME_COLOR_LABELS: Record<ThemeColorKey, string> = {
  bg: "Fondo principal",
  bgSubtle: "Fondo de secciones / tarjetas",
  fg: "Texto principal / títulos",
  fgMuted: "Texto secundario (párrafos)",
  border: "Bordes y divisores",
  brand50: "Marca — fondo suave",
  brand100: "Marca — borde suave",
  brand300: "Marca — borde hover",
  brand500: "Marca — botones y links",
  brand600: "Marca — hover de botones",
  brand700: "Marca — texto de énfasis",
  brand900: "Marca — fondo oscuro (secciones destacadas)",
  accent500: "Acento secundario",
  accent600: "Acento secundario — hover",
};

// Nota: --color-border en el original claro es sólido (#e6e3da); acá va un
// hex igual, sin transparencia, porque el input type="color" del editor
// solo admite hex sólido. Los perfiles con fondo oscuro pueden usar un gris
// claro sólido (en vez de blanco semitransparente) y va a verse bien igual.
const hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Tiene que ser un color hexadecimal, ej: #1F7A5C");

export const themeColorsSchema = z.object({
  bg: hex,
  bgSubtle: hex,
  fg: hex,
  fgMuted: hex,
  border: hex,
  brand50: hex,
  brand100: hex,
  brand300: hex,
  brand500: hex,
  brand600: hex,
  brand700: hex,
  brand900: hex,
  accent500: hex,
  accent600: hex,
});

export type ThemeColors = z.infer<typeof themeColorsSchema>;

export const themeFontFamilyValues = ["inter", "nexa"] as const;
export type ThemeFontFamily = (typeof themeFontFamilyValues)[number];

export const themeFontFamilyLabels: Record<ThemeFontFamily, string> = {
  inter: "Inter (la actual del sitio)",
  nexa: "Nexa (tipografía de marca)",
};

/** El look actual del sitio, tal cual está hoy — punto de partida para un perfil nuevo. */
export const DEFAULT_THEME_COLORS: ThemeColors = {
  bg: "#fefdfb",
  bgSubtle: "#f6f4ef",
  fg: "#1c1c1a",
  fgMuted: "#57564f",
  border: "#e6e3da",
  brand50: "#eef6f3",
  brand100: "#d3e9e1",
  brand300: "#86c3af",
  brand500: "#1f7a5c",
  brand600: "#186349",
  brand700: "#124b38",
  brand900: "#0a2c21",
  accent500: "#d97a3f",
  accent600: "#b4622f",
};

/**
 * Preset "Deep Navy" según la guía de marca
 * (Alta_Gracia_Avanza_Guia_Paleta_Colores_v2.pdf): botón para arrancar un
 * perfil nuevo con estos valores ya cargados en vez de partir de cero.
 */
export const DEEP_NAVY_PRESET_COLORS: ThemeColors = {
  bg: "#061124",
  bgSubtle: "#0f244c",
  fg: "#ffffff",
  fgMuted: "#94a3b8",
  border: "#ffffff", // el editor no admite alpha; se puede suavizar a mano si hace falta
  brand50: "#0f244c",
  brand100: "#16305e",
  brand300: "#ff9d6b",
  brand500: "#ff7a3d",
  brand600: "#e8672d",
  brand700: "#ffc857",
  brand900: "#04101f",
  accent500: "#ffc857",
  accent600: "#e0ac3f",
};

/** Mapea las keys camelCase (DB/formulario) a los nombres de variable CSS reales. */
export const THEME_COLOR_TO_CSS_VAR: Record<ThemeColorKey, string> = {
  bg: "--color-bg",
  bgSubtle: "--color-bg-subtle",
  fg: "--color-fg",
  fgMuted: "--color-fg-muted",
  border: "--color-border",
  brand50: "--color-brand-50",
  brand100: "--color-brand-100",
  brand300: "--color-brand-300",
  brand500: "--color-brand-500",
  brand600: "--color-brand-600",
  brand700: "--color-brand-700",
  brand900: "--color-brand-900",
  accent500: "--color-accent-500",
  accent600: "--color-accent-600",
};

// ---------------------------------------------------------------------------
// Forma (radios de esquinas)
// ---------------------------------------------------------------------------

export const themeShapeValues = ["square", "soft", "rounded", "pill"] as const;
export type ThemeShape = (typeof themeShapeValues)[number];

export const themeShapeLabels: Record<ThemeShape, string> = {
  square: "Cuadrado",
  soft: "Sutil (la actual)",
  rounded: "Redondeado",
  pill: "Muy redondeado",
};

/** Cada preset pisa los 4 tokens --radius-* que ya usa todo el sitio. */
export const THEME_SHAPE_PRESETS: Record<ThemeShape, { sm: string; md: string; lg: string; xl: string }> = {
  square: { sm: "0.0625rem", md: "0.125rem", lg: "0.25rem", xl: "0.375rem" },
  soft: { sm: "0.375rem", md: "0.625rem", lg: "1rem", xl: "1.5rem" }, // = valores originales del sitio
  rounded: { sm: "0.5rem", md: "0.875rem", lg: "1.25rem", xl: "2rem" },
  pill: { sm: "0.75rem", md: "1.25rem", lg: "1.75rem", xl: "2.5rem" },
};

// ---------------------------------------------------------------------------
// Sombras / profundidad
// ---------------------------------------------------------------------------

export const themeShadowValues = ["flat", "subtle", "elevated"] as const;
export type ThemeShadowStyle = (typeof themeShadowValues)[number];

export const themeShadowLabels: Record<ThemeShadowStyle, string> = {
  flat: "Plano (sin sombras)",
  subtle: "Sutil (la actual)",
  elevated: "Elevado / dramático",
};

export const THEME_SHADOW_PRESETS: Record<ThemeShadowStyle, { sm: string; md: string; lg: string }> = {
  flat: { sm: "none", md: "none", lg: "none" },
  subtle: {
    // = valores originales del sitio
    sm: "0 1px 2px rgba(28, 28, 26, 0.06)",
    md: "0 6px 20px rgba(28, 28, 26, 0.08)",
    lg: "0 16px 40px rgba(28, 28, 26, 0.12)",
  },
  elevated: {
    sm: "0 2px 4px rgba(0, 0, 0, 0.1)",
    md: "0 12px 32px rgba(0, 0, 0, 0.16)",
    lg: "0 28px 64px rgba(0, 0, 0, 0.24)",
  },
};

// ---------------------------------------------------------------------------
// Escala tipográfica y densidad
// ---------------------------------------------------------------------------

/**
 * Multiplicador aplicado a TODA la escala de tamaños de texto de Tailwind
 * (text-xs a text-9xl) de una sola vez: un perfil "Grande" hace que todos
 * los títulos, párrafos y textos chicos del sitio se vean
 * proporcionalmente más grandes, sin tener que definir un tamaño por cada
 * texto individual (algo que además Tailwind no permite hacer vía CSS
 * variables por elemento). Esta es la forma real y mantenible de controlar
 * "el tamaño de las letras y los títulos" de todo un sitio a la vez.
 */
export const themeTypeScaleValues = [0.925, 1, 1.08, 1.18] as const;
export type ThemeTypeScale = (typeof themeTypeScaleValues)[number];

export const themeTypeScaleLabels: Record<string, string> = {
  "0.925": "Compacta",
  "1": "Normal (la actual)",
  "1.08": "Grande",
  "1.18": "Muy grande",
};

/** Tamaños base de Tailwind (rem) — se multiplican por el typeScale del perfil. */
const BASE_TEXT_SIZES_REM: Record<string, number> = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  "2xl": 1.5,
  "3xl": 1.875,
  "4xl": 2.25,
  "5xl": 3,
  "6xl": 3.75,
  "7xl": 4.5,
  "8xl": 6,
  "9xl": 8,
};

/**
 * Densidad: unidad base de espaciado (rem) de la que Tailwind deriva TODOS
 * los paddings/márgenes/gaps (p-4, gap-6, etc. son múltiplos de esta
 * unidad) — subirla o bajarla achica o agranda el espaciado de todo el
 * sitio de una sola vez, sin tocar componente por componente.
 */
export const themeDensityValues = [0.2, 0.25, 0.3125] as const;
export type ThemeDensity = (typeof themeDensityValues)[number];

export const themeDensityLabels: Record<string, string> = {
  "0.2": "Compacta",
  "0.25": "Normal (la actual)",
  "0.3125": "Espaciosa",
};

export const themeHeaderDisplayValues = ["name", "logo", "both"] as const;
export type ThemeHeaderDisplay = (typeof themeHeaderDisplayValues)[number];

export const themeHeaderDisplayLabels: Record<ThemeHeaderDisplay, string> = {
  name: "Solo el nombre en texto",
  logo: "Solo el logo",
  both: "Logo + nombre",
};

export const themeDesignSchema = z.object({
  shape: z.enum(themeShapeValues),
  shadowStyle: z.enum(themeShadowValues),
  typeScale: z.number().min(0.7).max(1.6),
  density: z.number().min(0.15).max(0.5),
  logoUrl: z.string().nullable().optional(),
  headerDisplay: z.enum(themeHeaderDisplayValues),
});

export type ThemeDesign = z.infer<typeof themeDesignSchema>;

export const DEFAULT_THEME_DESIGN: ThemeDesign = {
  shape: "soft",
  shadowStyle: "subtle",
  typeScale: 1,
  density: 0.25,
  logoUrl: null,
  headerDisplay: "name",
};

/** Arma el objeto de estilos inline (CSS custom properties) para un perfil completo. */
export function themeToCssVars(
  colors: ThemeColors,
  fontFamily: ThemeFontFamily,
  design: ThemeDesign = DEFAULT_THEME_DESIGN
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const key of THEME_COLOR_KEYS) {
    vars[THEME_COLOR_TO_CSS_VAR[key]] = colors[key];
  }

  vars["--font-sans"] =
    fontFamily === "nexa"
      ? 'var(--font-nexa), "Segoe UI", ui-sans-serif, system-ui, sans-serif'
      : '"Inter", "Segoe UI", ui-sans-serif, system-ui, -apple-system, sans-serif';

  const shape = THEME_SHAPE_PRESETS[design.shape] ?? THEME_SHAPE_PRESETS.soft;
  vars["--radius-sm"] = shape.sm;
  vars["--radius-md"] = shape.md;
  vars["--radius-lg"] = shape.lg;
  vars["--radius-xl"] = shape.xl;

  const shadow = THEME_SHADOW_PRESETS[design.shadowStyle] ?? THEME_SHADOW_PRESETS.subtle;
  vars["--shadow-sm"] = shadow.sm;
  vars["--shadow-md"] = shadow.md;
  vars["--shadow-lg"] = shadow.lg;

  for (const [key, remValue] of Object.entries(BASE_TEXT_SIZES_REM)) {
    vars[`--text-${key}`] = `${(remValue * design.typeScale).toFixed(4)}rem`;
  }

  vars["--spacing"] = `${design.density}rem`;

  return vars;
}
