import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";

const SECTIONS = ["personalInfo", "hero", "about", "experience", "projects", "contact", "socials"];

export async function GET() {
  try {
    if (process.env.EDGE_CONFIG) {
      const allData: Record<string, unknown> = {};
      let allPresent = true;
      for (const s of SECTIONS) {
        try {
          const val = await get(s);
          if (val == null) { allPresent = false; break; }
          allData[s] = val;
        } catch {
          allPresent = false;
          break;
        }
      }
      if (allPresent) {
        return NextResponse.json(allData);
      }
    }
    const { default: seed } = await import("@/data/seed.json");
    return NextResponse.json(seed);
  } catch (err) {
    console.error("[content] GET failed:", err);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[content] POST body:", JSON.stringify(body, null, 2));

    const { password, data } = body as {
      password?: string;
      data?: Record<string, unknown>;
    };

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Missing data payload" }, { status: 400 });
    }

    const edgeConfigUrl = process.env.EDGE_CONFIG;
    if (!edgeConfigUrl) {
      return NextResponse.json({ error: "EDGE_CONFIG not set" }, { status: 500 });
    }

    const parsedUrl = new URL(edgeConfigUrl);
    const edgeConfigId = parsedUrl.pathname.split("/").pop();
    const token = parsedUrl.searchParams.get("token");

    if (!edgeConfigId || !token) {
      return NextResponse.json({ error: "Invalid EDGE_CONFIG format" }, { status: 500 });
    }

    const items = SECTIONS.filter((s) => s in data).map((s) => ({
      operation: "upsert" as const,
      key: s,
      value: data[s],
    }));

    if (items.length === 0) {
      return NextResponse.json({ error: "No valid sections found in request" }, { status: 400 });
    }

    const teamId = parsedUrl.searchParams.get("teamId") || process.env.VERCEL_TEAM_ID || "";
    const apiUrl = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamId ? `?teamId=${teamId}` : ""}`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("[content] Edge Config write failed:", res.status, errorText);
      return NextResponse.json(
        {
          error: "Failed to write to Edge Config",
          details: errorText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      edge: true,
      message: `Successfully published ${items.length} sections to Edge Config`,
    });
  } catch (err) {
    console.error("[content] POST failed:", err);
    return NextResponse.json(
      {
        error: "Failed to publish",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}