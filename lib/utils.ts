import { clsx, type ClassValue } from "clsx";
import type { ImageSet } from "./types";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function imageSrc(
  img?: ImageSet | string,
  size: keyof ImageSet = "original"
): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img[size] || img.original || "";
}

export function genId(items: { id: number }[]): number {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}

export function formatArray(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
