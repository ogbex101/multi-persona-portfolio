import { useEffect } from "react";
import { hexToRgbTriplet } from "@/lib/colors";

interface NicheTheme {
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  font_family?: string | null;
  custom_css?: string | null;
}

export function NicheThemeProvider({ theme, children }: { theme?: NicheTheme; children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme?.primary_color) root.style.setProperty("--brand-primary", hexToRgbTriplet(theme.primary_color));
    if (theme?.secondary_color) root.style.setProperty("--brand-secondary", hexToRgbTriplet(theme.secondary_color));
    if (theme?.accent_color) root.style.setProperty("--brand-accent", hexToRgbTriplet(theme.accent_color));
    if (theme?.primary_color) root.style.setProperty("--brand-primary-hex", theme.primary_color);
    if (theme?.accent_color) root.style.setProperty("--brand-accent-hex", theme.accent_color);
    if (theme?.font_family) root.style.setProperty("--font-family", theme.font_family);

    let styleEl: HTMLStyleElement | null = null;
    if (theme?.custom_css) {
      styleEl = document.createElement("style");
      styleEl.id = "niche-custom-css";
      styleEl.textContent = theme.custom_css;
      document.head.appendChild(styleEl);
    }
    return () => {
      if (styleEl) styleEl.remove();
    };
  }, [theme?.primary_color, theme?.secondary_color, theme?.accent_color, theme?.font_family, theme?.custom_css]);

  return <>{children}</>;
}
