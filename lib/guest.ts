import type { Pixel } from "@/lib/types";

export const GUEST_PIXELS_KEY = "erc_guest_pixels";
export const GUEST_OWNED_COOKIE = "erc_guest_owned";

export function addGuestOwnedPixel(pixelId: string): void {
  try {
    const prefix = `${GUEST_OWNED_COOKIE}=`;
    const raw = document.cookie.split("; ").find((c) => c.startsWith(prefix));
    const ids = raw
      ? decodeURIComponent(raw.slice(prefix.length))
          .split(",")
          .filter(Boolean)
      : [];
    if (ids.includes(pixelId)) return;
    ids.push(pixelId);
    if (ids.length > 200) ids.splice(0, ids.length - 200);
    const secure = process.env.NODE_ENV === "production" ? "; secure" : "";
    document.cookie = `${GUEST_OWNED_COOKIE}=${encodeURIComponent(
      ids.join(",")
    )}; path=/; max-age=31536000; samesite=lax${secure}`;
  } catch {
    // Ignore, counting will just include own previews.
  }
}

export function genPixelId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function loadGuestPixels(): Pixel[] {
  try {
    const raw = window.localStorage.getItem(GUEST_PIXELS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestPixels(pixels: Pixel[]): void {
  window.localStorage.setItem(GUEST_PIXELS_KEY, JSON.stringify(pixels));
}

export function clearGuestPixels(): void {
  window.localStorage.removeItem(GUEST_PIXELS_KEY);
}

export function pixelUrl(pixelId: string): string {
  return `${window.location.origin}/p/${pixelId}`;
}
