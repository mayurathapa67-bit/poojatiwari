import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || "main";

    if (!githubToken || !githubRepo) {
      return NextResponse.json(
        { error: "Server not configured for submissions." },
        { status: 500 }
      );
    }

    const filePath = "data/submissions.json";
    const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=${githubBranch}`;

    const headers: Record<string, string> = {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    };

    const getResponse = await fetch(apiUrl, { headers });

    let currentSubmissions: unknown[] = [];
    let sha: string | undefined;

    if (getResponse.ok) {
      const currentFile = await getResponse.json();
      sha = currentFile.sha;
      const content = Buffer.from(currentFile.content, "base64").toString("utf-8");
      try {
        currentSubmissions = JSON.parse(content);
        if (!Array.isArray(currentSubmissions)) currentSubmissions = [];
      } catch {
        currentSubmissions = [];
      }
    } else if (getResponse.status !== 404) {
      const errorText = await getResponse.text();
      return NextResponse.json(
        { error: "Failed to read submissions file.", details: errorText },
        { status: 500 }
      );
    }

    const newSubmission = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
      name,
      email,
      subject: String(body.subject ?? "").trim(),
      message,
      timestamp: new Date().toISOString(),
      archived: false,
    };

    const updatedSubmissions = [...currentSubmissions, newSubmission];
    const newContent = JSON.stringify(updatedSubmissions, null, 2);
    const newContentBase64 = Buffer.from(newContent).toString("base64");

    const putBody: Record<string, unknown> = {
      message: `Add contact submission from ${name}`,
      content: newContentBase64,
      branch: githubBranch,
    };
    if (sha) putBody.sha = sha;

    const putResponse = await fetch(
      `https://api.github.com/repos/${githubRepo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(putBody),
      }
    );

    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      return NextResponse.json(
        { error: "Failed to save submission.", details: errorText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Message saved!" });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
