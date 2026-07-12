import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
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

export async function GET() {
  const data = readDB();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, data } = body as {
      password?: string;
      data?: Partial<PortfolioData>;
    };

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const db = readDB();
    let updated = 0;
    for (const key of Object.keys(data) as SectionKey[]) {
      if (VALID_SECTIONS.includes(key)) {
        (db[key] as PortfolioData[SectionKey]) = data[key] as PortfolioData[SectionKey];
        updated++;
      }
    }

    if (updated === 0) {
      return NextResponse.json(
        { error: "No valid sections provided" },
        { status: 400 }
      );
    }

    writeDB(db);
    return NextResponse.json({ success: true, updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update database" },
      { status: 500 }
    );
  }
}
