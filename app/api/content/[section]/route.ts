import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDB, writeDB, readDrafts, writeDrafts, clearDraft } from "@/lib/db";
import { resolveSection } from "@/lib/defaults";
import type { PortfolioData, SectionKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";

const VALID_SECTIONS: SectionKey[] = [
  "personal",
  "nav",
  "hero",
  "about",
  "services",
  "portfolio",
  "blog",
  "experience",
  "testimonials",
  "contact",
  "socials",
];

export async function GET(
  _req: NextRequest,
  { params }: { params: { section: string } }
) {
  const section = params.section as SectionKey;
  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  try {
    const db = (await readDB()) as unknown as PortfolioData;
    const sectionData = resolveSection(section, db);
    return NextResponse.json(sectionData);
  } catch (err) {
    console.error("[content/section] GET failed:", err);
    return NextResponse.json(resolveSection(section, {}), { status: 200 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const section = params.section as SectionKey;

    if (!VALID_SECTIONS.includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const body = await req.json();
    const { password, data, publishMode } = body as {
      password?: string;
      data?: unknown;
      publishMode?: "draft" | "local" | "publish";
    };

    console.log("[content/section] Password check:", {
      hasEnvVar: !!(process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD),
      inputLength: password?.length ?? 0,
    });
    if (password?.trim() !== ADMIN_PASSWORD?.trim()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (data === undefined) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (publishMode === "draft") {
      const drafts = readDrafts();
      (drafts as Record<string, unknown>)[section] = data;
      writeDrafts(drafts);
      return NextResponse.json({ success: true, state: "draft" });
    }

    const db = (await readDB()) as unknown as PortfolioData;
    (db as unknown as Record<SectionKey, unknown>)[section] = data;
    clearDraft(section);

    if (publishMode === "local") {
      const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV != null;
      if (!isVercel) {
        await writeDB(db as unknown as Record<string, unknown>);
      }
      return NextResponse.json({ success: true, state: "local", github: false });
    }

    const result = await writeDB(db as unknown as Record<string, unknown>, "all");

    const routes: Record<string, string> = {
      personal: "/",
      nav: "/",
      hero: "/",
      about: "/about",
      services: "/services",
      portfolio: "/portfolio",
      blog: "/blog",
      experience: "/experience",
      testimonials: "/",
      contact: "/contact",
      socials: "/",
    };
    if (routes[section]) revalidatePath(routes[section]);

    return NextResponse.json({
      success: true,
      state: "published",
      ...(typeof result === "object" && result ? result : {}),
    });
  } catch (err) {
    console.error("[content/section] POST failed:", err);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}
