import { NextResponse } from "next/server";
import { readDrafts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(readDrafts());
}
