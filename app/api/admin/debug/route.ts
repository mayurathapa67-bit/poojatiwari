import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const edgeConfigUrl = process.env.EDGE_CONFIG;

  const debugInfo: Record<string, unknown> = {
    hasEdgeConfig: !!edgeConfigUrl,
    edgeConfigPreview: edgeConfigUrl ? edgeConfigUrl.substring(0, 50) + "..." : null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  // Test read via SDK
  try {
    const testData = await get("test");
    debugInfo.edgeConfigRead = "success";
    debugInfo.testValue = testData;
  } catch (error) {
    debugInfo.edgeConfigRead = "failed";
    debugInfo.readError = error instanceof Error ? error.message : "Unknown error";
  }

  // Test write via REST API
  try {
    if (!edgeConfigUrl) {
      debugInfo.edgeConfigWrite = "skipped (EDGE_CONFIG not set)";
    } else {
      const parsedUrl = new URL(edgeConfigUrl);
      const edgeConfigId = parsedUrl.pathname.split("/").pop();
      const token = parsedUrl.searchParams.get("token");

      if (!edgeConfigId || !token) {
        debugInfo.edgeConfigWrite = "skipped (could not parse ID or token from EDGE_CONFIG URL)";
      } else {
        const teamId = parsedUrl.searchParams.get("teamId") || process.env.VERCEL_TEAM_ID || "";
        const apiUrl = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamId ? `?teamId=${teamId}` : ""}`;
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                operation: "upsert",
                key: "test",
                value: "working",
              },
            ],
          }),
        });
        debugInfo.edgeConfigWrite = res.ok ? "success" : `failed (HTTP ${res.status})`;
        if (!res.ok) {
          debugInfo.writeResponse = await res.text().catch(() => "");
        }
      }
    }
  } catch (error) {
    debugInfo.edgeConfigWrite = "failed";
    debugInfo.writeError = error instanceof Error ? error.message : "Unknown error";
  }

  return NextResponse.json(debugInfo);
}