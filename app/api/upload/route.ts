import { NextRequest, NextResponse } from "next/server";
import { processProfileImage, processProjectImage } from "@/lib/image-optimizer";
import type { ImageSet } from "@/lib/types";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = "admin2024";
const MAX_PROFILE = 5 * 1024 * 1024;
const MAX_PROJECT = 3 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const password = form.get("password");
    const kind = String(form.get("kind") ?? "profile");
    const file = form.get("file");

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const max = kind === "project" ? MAX_PROJECT : MAX_PROFILE;
    if (file.size > max) {
      return NextResponse.json(
        { error: `Image too large (max ${Math.round(max / 1024 / 1024)}MB)` },
        { status: 400 }
      );
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG or WebP images are allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let image: ImageSet;
    if (kind === "project") {
      image = await processProjectImage(buffer);
    } else {
      image = await processProfileImage(buffer);
    }

    return NextResponse.json({ success: true, image });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Could not save image. On Vercel the filesystem is read-only — upload locally, then commit the file under /public/uploads to deploy.",
      },
      { status: 500 }
    );
  }
}
