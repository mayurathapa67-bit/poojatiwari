import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";

    if (!token || !repo) {
      return NextResponse.json(
        { error: "GitHub credentials missing" },
        { status: 500 }
      );
    }

    const url = `https://api.github.com/repos/${repo}/contents/data/submissions.json?ref=${branch}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 0 },
    });

    if (response.status === 404) {
      return NextResponse.json([]);
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const submissions = JSON.parse(content);

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Submissions API error:", error);
    return NextResponse.json(
      { error: "Failed to load submissions" },
      { status: 500 }
    );
  }
}
