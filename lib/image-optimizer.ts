import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { ImageSet } from "./types";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function uniqueName(prefix: string, ext = "jpg"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

async function write(buffer: Buffer, relativePath: string): Promise<void> {
  const full = path.join(process.cwd(), "public", relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, buffer);
}

/**
 * Local-only image processing. Generates resized JPEG derivatives with sharp
 * and writes them under /public/uploads. On Vercel this will fail (read-only FS)
 * — uploads must be committed manually there.
 */
export async function processProfileImage(buffer: Buffer): Promise<ImageSet> {
  const base = uniqueName("profile");
  const original = `/uploads/${base}`;
  const thumb = `/uploads/${base.replace(".jpg", "-thumb.jpg")}`;

  const img = sharp(buffer, { failOn: "none" }).rotate();
  const resized = await img.resize(800, 800, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer();
  await write(resized, original);

  const thumbBuf = await sharp(resized)
    .resize(400, 400, { fit: "cover" })
    .jpeg({ quality: 80 })
    .toBuffer();
  await write(thumbBuf, thumb);

  return { original, thumb };
}

export async function processProjectImage(buffer: Buffer): Promise<ImageSet> {
  const base = uniqueName("project");
  const original = `/uploads/projects/${base}`;
  const thumb = `/uploads/projects/${base.replace(".jpg", "-thumb.jpg")}`;
  const medium = `/uploads/projects/${base.replace(".jpg", "-medium.jpg")}`;
  const large = `/uploads/projects/${base.replace(".jpg", "-large.jpg")}`;

  const img = sharp(buffer, { failOn: "none" }).rotate();
  const full = await img.resize(1200, 675, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
  await write(full, original);

  const thumbBuf = await sharp(full).resize(400, 225, { fit: "cover" }).jpeg({ quality: 78 }).toBuffer();
  await write(thumbBuf, thumb);

  const mediumBuf = await sharp(full).resize(800, 450, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer();
  await write(mediumBuf, medium);

  const largeBuf = await sharp(full).resize(1200, 675, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer();
  await write(largeBuf, large);

  return { original, thumb, medium, large };
}

export function uploadsDir(): string {
  return UPLOADS_DIR;
}
