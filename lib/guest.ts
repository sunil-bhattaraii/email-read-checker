import type { Pixel } from "@/lib/types";

export const GUEST_PIXELS_KEY = "erc_guest_pixels";

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
