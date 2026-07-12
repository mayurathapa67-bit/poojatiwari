import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  const debugInfo: Record<string, unknown> = {
    hasGithubToken: !!token,
    githubRepo: repo || null,
    githubBranch: branch,
    tokenPreview: token ? token.substring(0, 8) + "..." : null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  if (token && repo) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/contents/data/seed.json?ref=${branch}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        debugInfo.githubRead = "success";
        debugInfo.fileSha = data.sha;
        debugInfo.fileSize = data.size;
      } else {
        debugInfo.githubRead = `failed (HTTP ${res.status})`;
        const errText = await res.text().catch(() => "");
        debugInfo.githubError = errText;
      }
    } catch (error) {
      debugInfo.githubRead = "error";
      debugInfo.githubError = error instanceof Error ? error.message : "Unknown error";
    }
  } else {
    debugInfo.githubRead = "skipped (token or repo missing)";
  }

  return NextResponse.json(debugInfo);
}
