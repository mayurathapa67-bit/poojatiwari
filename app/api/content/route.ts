import { NextRequest, NextResponse } from "next/server";
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

async function readFromEdge(): Promise<PortfolioData | null> {
  if (!process.env.EDGE_CONFIG) return null;
  try {
    const { getAll } = await import("@vercel/edge-config");
    const all = (await getAll()) as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of VALID_SECTIONS) {
      if (all[key] == null) return null;
      result[key] = all[key];
    }
    return result as unknown as PortfolioData;
  } catch {
    return null;
  }
}

async function readSeed(): Promise<PortfolioData> {
  try {
    const { default: seed } = await import("@/data/seed.json");
    return seed as PortfolioData;
  } catch {
    return {} as PortfolioData;
  }
}

export async function GET() {
  try {
    if (process.env.EDGE_CONFIG) {
      const edge = await readFromEdge();
      if (edge) return NextResponse.json(edge);
    }
    const seed = await readSeed();
    return NextResponse.json(seed);
  } catch (err) {
    console.error("[content] GET failed:", err);
    return NextResponse.json({} as PortfolioData, { status: 200 });
  }
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

    const conn = process.env.EDGE_CONFIG;
    const token = process.env.EDGE_CONFIG_TOKEN;
    const idMatch = conn?.match(/ecfg_[a-z0-9]+/i);
    const id = idMatch?.[0] || process.env.EDGE_CONFIG_ID;

    if (!id || !token) {
      return NextResponse.json(
        { error: "Edge Config not configured — set EDGE_CONFIG, EDGE_CONFIG_TOKEN, and EDGE_CONFIG_ID env vars" },
        { status: 500 }
      );
    }

    const items = VALID_SECTIONS.filter((key) => key in data).map((key) => ({
      op: "update" as const,
      key,
      value: data[key],
    }));

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No valid sections provided" },
        { status: 400 }
      );
    }

    const teamId = process.env.VERCEL_TEAM_ID;
    const url = `https://api.vercel.com/v1/edge-config/${id}/items${
      teamId ? `?teamId=${teamId}` : ""
    }`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      console.error("[content] Edge Config write failed:", res.status);
      return NextResponse.json(
        { error: "Failed to publish to Edge Config" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updated: items.length,
      message: "Published to Edge Config",
    });
  } catch (err) {
    console.error("[content] POST failed:", err);
    return NextResponse.json(
      { error: "Failed to publish to Edge Config" },
      { status: 500 }
    );
  }
}
