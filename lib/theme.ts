export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const listeners = new Set<() => void>();

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function notify() {
  for (const listener of listeners) listener();
}

export function applyTheme(theme: Theme, persist: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures (e.g. disabled cookies).
    }
  }
  notify();
}

export function toggleTheme() {
  applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getThemeSnapshot(): Theme {
  return currentTheme();
}

export function getServerThemeSnapshot(): Theme {
  return "light";
}

function hasStoredTheme(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function watchSystemTheme(): () => void {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (hasStoredTheme()) return;
    applyTheme(query.matches ? "dark" : "light", false);
  };
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
