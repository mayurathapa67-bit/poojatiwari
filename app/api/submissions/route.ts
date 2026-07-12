import { NextRequest, NextResponse } from "next/server";
import { readSubmissions } from "@/lib/submissions";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = readSubmissions().sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp)
  );
  return NextResponse.json(submissions);
}
