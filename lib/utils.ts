import { clsx, type ClassValue } from "clsx";

export type ImageLike = {
  original?: string;
  medium?: string;
  thumb?: string;
  large?: string;
};

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function imageSrc(
  img?: ImageLike | string | null,
  size: keyof ImageLike = "original"
): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img[size] || img.original || "";
}

export function genId(items: { id: number }[]): number {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}

/**
 * Estimate reading time in minutes from a block of text (200 wpm).
 */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatArray(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
