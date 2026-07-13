import { NextRequest, NextResponse } from "next/server";
import { readSubmissions } from "@/lib/submissions";
import type { Submission } from "@/lib/submission-types";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const submissions: Submission[] = await readSubmissions();
    submissions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return NextResponse.json(submissions, {
      headers: { "Cache-Control": "no-store, must-revalidate" },
    });
  } catch (err) {
    console.error("[submissions] GET failed:", err);
    return NextResponse.json([]);
  }
}
