export type ViewsImageTheme = "light" | "dark";

const THEMES: Record<
  ViewsImageTheme,
  { background: string; border: string; icon: string; text: string }
> = {
  light: {
    background: "#ffffff",
    border: "#e5e7eb",
    icon: "#4f46e5",
    text: "#111827",
  },
  dark: {
    background: "#1f2937",
    border: "#374151",
    icon: "#818cf8",
    text: "#f9fafb",
  },
};

export function isViewsImageTheme(
  value: string | null
): value is ViewsImageTheme {
  return value === "light" || value === "dark";
}

function formatCount(views: number): string {
  return views.toLocaleString("en-US");
}

export function renderViewsImage(
  views: number,
  theme: ViewsImageTheme = "light"
): string {
  const safeViews =
    Number.isFinite(views) && views > 0 ? Math.floor(views) : 0;
  const label = formatCount(safeViews);
  const { background, border, icon, text } = THEMES[theme];

  const height = 28;
  const padding = 10;
  const iconSize = 16;
  const gap = 5;
  const fontSize = 13;
  const textWidth = Math.max(8, label.length * 7.8 + 2);
  const width = Math.ceil(padding * 2 + iconSize + gap + textWidth);
  const iconY = (height - iconSize) / 2;
  const textX = padding + iconSize + gap;

  const eye = [
    `<path d="M1 8C4.4 3.1 11.6 3.1 15 8C11.6 12.9 4.4 12.9 1 8Z" fill="none" stroke="${icon}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<circle cx="8" cy="8" r="2.3" fill="${icon}"/>`,
  ].join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${safeViews} views">`,
    `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${(height - 1) / 2}" fill="${background}" stroke="${border}"/>`,
    `<g transform="translate(${padding} ${iconY})">${eye}</g>`,
    `<text x="${textX}" y="${height / 2}" dominant-baseline="central" font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="600" fill="${text}">${label}</text>`,
    `</svg>`,
  ].join("");
}
