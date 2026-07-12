import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDB, writeDB, readDrafts, writeDrafts, clearDraft } from "@/lib/db";
import type { PortfolioData, SectionKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";

const VALID_SECTIONS: SectionKey[] = [
  "personalInfo",
  "hero",
  "about",
  "experience",
  "projects",
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
    const db = await readDB();
    return NextResponse.json(db[section]);
  } catch (err) {
    console.error("[content/section] GET failed:", err);
    return NextResponse.json({}, { status: 200 });
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

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (data === undefined) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // --- Draft mode: save to local drafts file only ---
    if (publishMode === "draft") {
      const drafts = readDrafts();
      (drafts as Record<string, unknown>)[section] = data;
      writeDrafts(drafts);
      return NextResponse.json({ success: true, state: "draft" });
    }

    const db = await readDB();
    (db[section] as PortfolioData[SectionKey]) = data as PortfolioData[SectionKey];
    clearDraft(section);

    // --- Local mode: save to local db.json only ---
    if (publishMode === "local") {
      await writeDB(db, "local");
      return NextResponse.json({ success: true, state: "local", edge: false, github: false });
    }

    // --- Publish mode: Edge Config + GitHub + local db.json ---
    const result = await writeDB(db, "all");

    const routes: Record<string, string> = {
      personalInfo: "/",
      hero: "/",
      about: "/about",
      experience: "/experience",
      projects: "/projects",
      contact: "/contact",
    };
    if (routes[section]) revalidatePath(routes[section]);

    return NextResponse.json({ success: true, state: "published", ...result });
  } catch (err) {
    console.error("[content/section] POST failed:", err);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}
