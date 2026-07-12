import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const edgeConfigUrl = process.env.EDGE_CONFIG;
  const edgeConfigToken = process.env.EDGE_CONFIG_TOKEN;

  const debugInfo: Record<string, unknown> = {
    hasEdgeConfig: !!edgeConfigUrl,
    edgeConfigPreview: edgeConfigUrl ? edgeConfigUrl.substring(0, 50) + "..." : null,
    hasEdgeConfigToken: !!edgeConfigToken,
    tokenPreview: edgeConfigToken ? edgeConfigToken.substring(0, 20) + "..." : null,
    hasEdgeConfigId: !!process.env.EDGE_CONFIG_ID,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  try {
    const testData = await get("test");
    debugInfo.edgeConfigRead = "success";
    debugInfo.testValue = testData;
  } catch (error) {
    debugInfo.edgeConfigRead = "failed";
    debugInfo.readError = error instanceof Error ? error.message : "Unknown error";
  }

  try {
    const conn = process.env.EDGE_CONFIG;
    const token = process.env.EDGE_CONFIG_TOKEN;
    const idMatch = conn?.match(/ecfg_[a-z0-9]+/i);
    const id = idMatch?.[0] || process.env.EDGE_CONFIG_ID;

    if (id && token) {
      const teamId = process.env.VERCEL_TEAM_ID;
      const url = `https://api.vercel.com/v1/edge-config/${id}/items${teamId ? `?teamId=${teamId}` : ""}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ op: "update", key: "test", value: "working" }],
        }),
      });
      debugInfo.edgeConfigWrite = res.ok ? "success" : `failed (HTTP ${res.status})`;
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        debugInfo.writeResponse = text;
      }
    } else {
      debugInfo.edgeConfigWrite = "skipped (missing id or token)";
    }
  } catch (error) {
    debugInfo.edgeConfigWrite = "failed";
    debugInfo.writeError = error instanceof Error ? error.message : "Unknown error";
  }

  return NextResponse.json(debugInfo);
}