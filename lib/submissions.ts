import type { Submission } from "./submission-types";

const FILE_PATH = "data/submissions.json";

function env() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) return null;
  return { token, repo, branch };
}

async function readFromGitHub(): Promise<{
  submissions: Submission[];
  sha: string | null;
}> {
  const e = env();
  if (!e) return { submissions: [], sha: null };

  const url = `https://api.github.com/repos/${e.repo}/contents/${FILE_PATH}?ref=${e.branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${e.token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (res.status === 404) return { submissions: [], sha: null };
  if (!res.ok) {
    console.error("[submissions] GitHub read failed:", res.status, await res.text());
    return { submissions: [], sha: null };
  }

  const data = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  let submissions: Submission[] = [];
  try {
    submissions = JSON.parse(decoded);
    if (!Array.isArray(submissions)) submissions = [];
  } catch {
    submissions = [];
  }
  return { submissions, sha: data.sha as string };
}

async function writeToGitHub(
  submissions: Submission[],
  sha: string | null
): Promise<boolean> {
  const e = env();
  if (!e) return false;

  const content = Buffer.from(JSON.stringify(submissions, null, 2)).toString("base64");
  const body: Record<string, unknown> = {
    message: "Update submissions",
    content,
    branch: e.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${e.repo}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${e.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    console.error("[submissions] GitHub write failed:", res.status, await res.text());
    return false;
  }
  return true;
}

export async function readSubmissions(): Promise<Submission[]> {
  const { submissions } = await readFromGitHub();
  return submissions;
}

export async function writeSubmissions(submissions: Submission[]): Promise<void> {
  const { sha } = await readFromGitHub();
  await writeToGitHub(submissions, sha);
}

export async function addSubmission(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<Submission> {
  const { submissions, sha } = await readFromGitHub();
  const submission: Submission = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    timestamp: new Date().toISOString(),
    archived: false,
  };
  submissions.push(submission);
  await writeToGitHub(submissions, sha);
  return submission;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const { submissions, sha } = await readFromGitHub();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  submissions.splice(idx, 1);
  return writeToGitHub(submissions, sha);
}

export async function archiveSubmission(
  id: string,
  archived = true
): Promise<boolean> {
  const { submissions, sha } = await readFromGitHub();
  const sub = submissions.find((s) => s.id === id);
  if (!sub) return false;
  sub.archived = archived;
  return writeToGitHub(submissions, sha);
}
