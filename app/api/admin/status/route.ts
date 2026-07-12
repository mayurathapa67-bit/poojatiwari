import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const isConfigured = !!process.env.GITHUB_TOKEN && !!process.env.GITHUB_REPO;
  return NextResponse.json({ isConfigured });
}
