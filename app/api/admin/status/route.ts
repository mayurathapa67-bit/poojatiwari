import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const isConfigured = !!process.env.EDGE_CONFIG && !!process.env.EDGE_CONFIG_TOKEN;
  return NextResponse.json({ isConfigured });
}
