import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const isConfigured = !!process.env.EDGE_CONFIG;
  return NextResponse.json({ isConfigured });
}
