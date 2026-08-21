"use client";

import { useMemo, useRef, useState, useTransition, type CSSProperties } from "react";
import { AdminButton, AdminField, AdminInput } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import {
  THEME_COLOR_KEYS,
  THEME_COLOR_LABELS,
  DEFAULT_THEME_COLORS,
  DEEP_NAVY_PRESET_COLORS,
  themeFontFamilyValues,
  themeFontFamilyLabels,
  themeShapeValues,
  themeShapeLabels,
  themeShadowValues,
  themeShadowLabels,
  themeTypeScaleValues,
  themeTypeScaleLabels,
  themeDensityValues,
  themeDensityLabels,
  themeHeaderDisplayValues,
  themeHeaderDisplayLabels,
  DEFAULT_THEME_DESIGN,
  themeToCssVars,
  type ThemeColors,
  type ThemeFontFamily,
  type ThemeDesign,
  type ThemeShape,
  type ThemeShadowStyle,
  type ThemeHeaderDisplay,
} from "@/db/theme";
import { createTheme, updateTheme, uploadThemeLogo, type ThemeInput } from "./actions";

type ThemeDef = {
  id: string;
  name: string;
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
} & ThemeDesign;

export function ThemeForm({
  theme,
  onSuccess,
}: {
  /** Si viene un theme, edita; si no, crea uno nuevo. */
  theme?: ThemeDef;
  onSuccess?: () => void;
}) {
  const [name, setName] = useState(theme?.name ?? "");
  const [colors, setColors] = useState<ThemeColors>(theme?.colors ?? DEFAULT_THEME_COLORS);
  const [fontFamily, setFontFamily] = useState<ThemeFontFamily>(theme?.fontFamily ?? "inter");
  const [shape, setShape] = useState<ThemeShape>(theme?.shape ?? DEFAULT_THEME_DESIGN.shape);
  const [shadowStyle, setShadowStyle] = useState<ThemeShadowStyle>(
    theme?.shadowStyle ?? DEFAULT_THEME_DESIGN.shadowStyle
  );
  const [typeScale, setTypeScale] = useState<number>(theme?.typeScale ?? DEFAULT_THEME_DESIGN.typeScale);
  const [density, setDensity] = useState<number>(theme?.density ?? DEFAULT_THEME_DESIGN.density);
  const [logoUrl, setLogoUrl] = useState<string | null>(theme?.logoUrl ?? null);
  const [headerDisplay, setHeaderDisplay] = useState<ThemeHeaderDisplay>(
    theme?.headerDisplay ?? DEFAULT_THEME_DESIGN.headerDisplay
  );
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const design: ThemeDesign = useMemo(
    () => ({ shape, shadowStyle, typeScale, density, logoUrl, headerDisplay }),
    [shape, shadowStyle, typeScale, density, logoUrl, headerDisplay]
  );

  const previewVars = useMemo(
    () => themeToCssVars(colors, fontFamily, design),
    [colors, fontFamily, design]
  );

  function setColor(key: keyof ThemeColors, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const formData = new FormData();
    formData.set("logo", file);
    startTransition(async () => {
      const result = await uploadThemeLogo(formData);
      setUploadingLogo(false);
      if (result.error) {
        toast({ variant: "danger", title: "No se pudo subir el logo", description: result.error });
        return;
      }
      if (result.url) {
        setLogoUrl(result.url);
        toast({ variant: "success", title: "Logo subido" });
      }
    });
  }

  function handleSubmit() {
    if (!name.trim()) {
      setError("Ponele un nombre al perfil.");
      return;
    }
    setError(null);
    const input: ThemeInput = { name: name.trim(), colors, fontFamily, ...design };
    startTransition(async () => {
      const result = theme ? await updateTheme(theme.id, input) : await createTheme(input);
      if (result.error) {
        setError(result.error);
        toast({ variant: "danger", title: "No se pudo guardar", description: result.error });
        return;
      }
      toast({ variant: "success", title: theme ? "Perfil actualizado" : "Perfil creado" });
      onSuccess?.();
    });
  }

  return (
    <div className="space-y-6">
      <AdminField label="Nombre del perfil" htmlFor="theme-name">
        <AdminInput
          id="theme-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Identidad Deep Navy"
        />
      </AdminField>

      <div className="flex flex-wrap gap-2">
        <AdminButton
          type="button"
          variant="secondary"
          onClick={() => setColors(DEEP_NAVY_PRESET_COLORS)}
        >
          Cargar valores de la guía (Deep Navy)
        </AdminButton>
        <AdminButton type="button" variant="secondary" onClick={() => setColors(DEFAULT_THEME_COLORS)}>
          Reiniciar al diseño original
        </AdminButton>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Tipografía</p>
        <div className="flex flex-wrap gap-3">
          {themeFontFamilyValues.map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="fontFamily"
                checked={fontFamily === value}
                onChange={() => setFontFamily(value)}
              />
              {themeFontFamilyLabels[value]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Colores</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {THEME_COLOR_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-2 rounded-md border border-border p-2">
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => setColor(key, e.target.value)}
                className="h-9 w-9 flex-shrink-0 cursor-pointer rounded border border-border"
                aria-label={THEME_COLOR_LABELS[key]}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-fg">{THEME_COLOR_LABELS[key]}</p>
                <input
                  type="text"
                  value={colors[key]}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="w-full bg-transparent text-xs text-fg-muted focus-visible:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-fg">Forma (bordes)</p>
          <div className="flex flex-col gap-2">
            {themeShapeValues.map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
              >
                <input
                  type="radio"
                  name="shape"
                  checked={shape === value}
                  onChange={() => setShape(value)}
                />
                {themeShapeLabels[value]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-fg">Sombras / profundidad</p>
          <div className="flex flex-col gap-2">
            {themeShadowValues.map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
              >
                <input
                  type="radio"
                  name="shadowStyle"
                  checked={shadowStyle === value}
                  onChange={() => setShadowStyle(value)}
                />
                {themeShadowLabels[value]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-fg">Tamaño de textos y títulos</p>
          <div className="flex flex-col gap-2">
            {themeTypeScaleValues.map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
              >
                <input
                  type="radio"
                  name="typeScale"
                  checked={typeScale === value}
                  onChange={() => setTypeScale(value)}
                />
                {themeTypeScaleLabels[String(value)]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-fg">Densidad / espaciado</p>
          <div className="flex flex-col gap-2">
            {themeDensityValues.map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
              >
                <input
                  type="radio"
                  name="density"
                  checked={density === value}
                  onChange={() => setDensity(value)}
                />
                {themeDensityLabels[String(value)]}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Logo en el header</p>
        <div className="flex flex-wrap items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Logo del perfil"
              className="h-12 w-auto rounded border border-border bg-white p-1"
            />
          ) : (
            <span className="text-xs text-fg-muted">Todavía no subiste un logo para este perfil.</span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleLogoChange(e.target.files)}
          />
          <AdminButton
            type="button"
            variant="secondary"
            disabled={uploadingLogo}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadingLogo ? "Subiendo..." : logoUrl ? "Cambiar logo" : "Subir logo"}
          </AdminButton>
          {logoUrl ? (
            <button
              type="button"
              onClick={() => setLogoUrl(null)}
              className="text-sm text-red-600 hover:underline"
            >
              Quitar logo
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {themeHeaderDisplayValues.map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="headerDisplay"
                checked={headerDisplay === value}
                onChange={() => setHeaderDisplay(value)}
                disabled={value !== "name" && !logoUrl}
              />
              {themeHeaderDisplayLabels[value]}
            </label>
          ))}
        </div>
        {!logoUrl && headerDisplay !== "name" ? (
          <p className="mt-1 text-xs text-fg-muted">Subí un logo para poder mostrarlo en el header.</p>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-fg">Vista previa</p>
        <div
          style={previewVars as CSSProperties}
          className="space-y-4 rounded-lg border border-border p-6"
        >
          <div style={{ background: "var(--color-bg)" }} className="space-y-4 rounded-md p-5">
            <div className="flex items-center gap-2">
              {logoUrl && headerDisplay !== "name" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="" className="h-7 w-auto" />
              ) : null}
              {headerDisplay !== "logo" || !logoUrl ? (
                <p
                  style={{ color: "var(--color-fg)", fontFamily: "var(--font-sans)" }}
                  className="text-xl font-bold"
                >
                  Alta Gracia Avanza
                </p>
              ) : null}
            </div>
            <p style={{ color: "var(--color-fg-muted)", fontFamily: "var(--font-sans)" }} className="text-sm">
              Así se ve un párrafo de texto normal con este perfil aplicado.
            </p>
            <div
              style={{
                background: "var(--color-bg-subtle)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
              }}
              className="border p-4"
            >
              <p style={{ color: "var(--color-fg)" }} className="text-sm font-semibold">
                Una tarjeta o sección
              </p>
              <p style={{ color: "var(--color-fg-muted)" }} className="mt-1 text-xs">
                Texto secundario dentro de una tarjeta.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                style={{
                  background: "var(--color-brand-500)",
                  color: "#fff",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-sm)",
                }}
                className="px-4 py-2 text-sm font-semibold"
              >
                Botón principal
              </button>
              <span
                style={{
                  background: "var(--color-brand-50)",
                  color: "var(--color-brand-700)",
                  borderRadius: "var(--radius-xl)",
                }}
                className="inline-flex items-center px-3 py-1 text-xs font-medium"
              >
                Badge / énfasis
              </span>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <AdminButton type="button" onClick={handleSubmit} disabled={pending}>
        {pending ? "Guardando..." : theme ? "Guardar cambios" : "Crear perfil"}
      </AdminButton>
    </div>
  );
}
