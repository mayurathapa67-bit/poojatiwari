import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const SEED_PATH = "data/seed.json";
const DATA_DIR = path.join(process.cwd(), "data");

// Simple in-memory cache so a single page load (which fires many section
// requests) doesn't hammer the GitHub API.
let cache: Record<string, unknown> | null = null;
let cacheTime = 0;
const CACHE_TTL = 30_000;

async function readLocal(): Promise<Record<string, unknown>> {
  for (const file of ["db.json", "seed.json"]) {
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
      return JSON.parse(raw);
    } catch {
      // try next file
    }
  }
  return {};
}

async function readGithub(): Promise<Record<string, unknown> | null> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${SEED_PATH}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const file = (await res.json()) as { content?: string };
    if (!file.content) return null;
    const content = Buffer.from(file.content, "base64").toString("utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function readDB(): Promise<Record<string, unknown>> {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) return cache;

  const gh = await readGithub();
  if (gh && Object.keys(gh).length > 0) {
    cache = gh;
    cacheTime = now;
    return gh;
  }

  const local = await readLocal();
  cache = local;
  cacheTime = now;
  return local;
}

async function commitToGithub(data: Record<string, unknown>): Promise<boolean> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return false;
  try {
    const getRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${SEED_PATH}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (!getRes.ok) return false;
    const current = (await getRes.json()) as { sha?: string; content?: string };
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([k]) => k !== "password" && k !== "data")
    );
    const body: Record<string, unknown> = {
      message: "Update portfolio content",
      content: Buffer.from(JSON.stringify(cleaned, null, 2)).toString("base64"),
      branch: GITHUB_BRANCH,
    };
    if (current.sha) body.sha = current.sha;

    const putRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${SEED_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    return putRes.ok;
  } catch {
    return false;
  }
}

export async function writeDB(
  data: Record<string, unknown>,
  _location?: string
): Promise<boolean> {
  const committed = await commitToGithub(data);
  if (committed) return true;
  // Fall back to local filesystem (dev / non-GitHub deployments).
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      path.join(DATA_DIR, "db.json"),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    return true;
  } catch {
    return false;
  }
}

export function readDrafts(): Record<string, unknown> {
  try {
    const raw = fsSync.readFileSync(path.join(DATA_DIR, "drafts.json"), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function writeDrafts(data: Record<string, unknown>): void {
  try {
    fsSync.mkdirSync(DATA_DIR, { recursive: true });
    fsSync.writeFileSync(
      path.join(DATA_DIR, "drafts.json"),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch {
    // ignore – drafts are best-effort
  }
}

export function clearDraft(section: string): boolean {
  try {
    const drafts = readDrafts();
    delete drafts[section];
    writeDrafts(drafts);
    return true;
  } catch {
    return false;
  }
}
