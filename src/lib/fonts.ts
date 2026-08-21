import localFont from "next/font/local";

/**
 * Tipografía de marca (Nexa), provista por Gustavo en
 * public/brand/fonts/. Se carga siempre (next/font la expone como
 * variable CSS en <html>) pero solo se usa cuando la nueva identidad
 * visual está activa (ver globals.css, selector [data-brand-theme="brand"]
 * y el interruptor de /admin/settings) — así el sitio actual no cambia de
 * tipografía hasta que se prenda ese switch.
 */
export const nexa = localFont({
  src: [
    { path: "../../public/brand/fonts/NexaThin.otf", weight: "100", style: "normal" },
    { path: "../../public/brand/fonts/NexaThinItalic.otf", weight: "100", style: "italic" },
    { path: "../../public/brand/fonts/NexaLight.otf", weight: "300", style: "normal" },
    { path: "../../public/brand/fonts/NexaLightItalic.otf", weight: "300", style: "italic" },
    { path: "../../public/brand/fonts/NexaRegular.otf", weight: "400", style: "normal" },
    { path: "../../public/brand/fonts/NexaRegularItalic.otf", weight: "400", style: "italic" },
    { path: "../../public/brand/fonts/NexaBold.otf", weight: "700", style: "normal" },
    { path: "../../public/brand/fonts/NexaBoldItalic.otf", weight: "700", style: "italic" },
    { path: "../../public/brand/fonts/NexaXBold.otf", weight: "800", style: "normal" },
    { path: "../../public/brand/fonts/NexaXBoldItalic.otf", weight: "800", style: "italic" },
    { path: "../../public/brand/fonts/NexaBlack.otf", weight: "900", style: "normal" },
    { path: "../../public/brand/fonts/NexaBlackItalic.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-nexa",
  display: "swap",
});
