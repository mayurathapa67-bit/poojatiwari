import fs from "fs";
import path from "path";
import type { PortfolioData, SectionKey } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const SEED_PATH = path.join(DATA_DIR, "seed.json");
const DRAFTS_PATH = path.join(DATA_DIR, "drafts.json");

export const SECTION_KEYS: SectionKey[] = [
  "personalInfo",
  "hero",
  "about",
  "experience",
  "projects",
  "contact",
  "socials",
];

/** True when running on Vercel (reads come from the committed seed.json). */
const isVercel =
  process.env.VERCEL === "1" || process.env.VERCEL_ENV != null;

/* ----------------------------- Edge Config ----------------------------- */

async function readFromEdge(): Promise<PortfolioData | null> {
  if (!process.env.EDGE_CONFIG) return null;
  try {
    const { getAll } = await import("@vercel/edge-config");
    const all = (await getAll()) as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of SECTION_KEYS) {
      if (all[key] == null) return null; // incomplete config -> fall through
      result[key] = all[key];
    }
    return result as unknown as PortfolioData;
  } catch (e) {
    console.error("[db] Edge Config read failed:", e);
    return null;
  }
}

/** Write via the Vercel REST API (requires EDGE_CONFIG_TOKEN + EDGE_CONFIG_ID). */
async function writeToEdge(data: PortfolioData): Promise<boolean> {
  const conn = process.env.EDGE_CONFIG;
  const token = process.env.EDGE_CONFIG_TOKEN;
  const idMatch = conn?.match(/ecfg_[a-z0-9]+/i);
  const id = idMatch?.[0] || process.env.EDGE_CONFIG_ID;
  if (!id || !token) return false;
  try {
    const items = SECTION_KEYS.map((key) => ({
      op: "update" as const,
      key,
      value: data[key],
    }));
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
      console.error("[db] Edge Config write failed:", res.status);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[db] Edge Config write error:", e);
    return false;
  }
}

/* ------------------------------- Local files ------------------------------ */

async function readLocal(): Promise<PortfolioData> {
  if (isVercel) {
    try {
      return JSON.parse(fs.readFileSync(SEED_PATH, "utf-8")) as PortfolioData;
    } catch {
      /* ignore */
    }
  } else {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as PortfolioData;
    } catch {
      /* ignore */
    }
    try {
      return JSON.parse(fs.readFileSync(SEED_PATH, "utf-8")) as PortfolioData;
    } catch {
      /* ignore */
    }
  }
  return {} as PortfolioData;
}

function writeLocal(data: PortfolioData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("[db] writeLocal failed (read-only FS?):", e);
  }
}

/* ------------------------------- GitHub commit ------------------------------ */

async function commitToGitHub(data: PortfolioData): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // "owner/repo"
  if (!token || !repo) return false;

  const [owner, name] = repo.split("/");
  if (!owner || !name) return false;

  const filePath = "data/seed.json";
  const api = "https://api.github.com";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "portfolio-admin",
  };

  try {
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
    let sha: string | undefined;
    const cur = await fetch(`${api}/repos/${owner}/${name}/contents/${filePath}`, {
      headers,
    });
    if (cur.ok) sha = (await cur.json()).sha as string;

    const res = await fetch(`${api}/repos/${owner}/${name}/contents/${filePath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "chore: update portfolio content via admin panel",
        content,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[db] GitHub commit failed:", res.status);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[db] GitHub commit error:", e);
    return false;
  }
}

/* ------------------------------- Public API ------------------------------ */

export async function readDB(): Promise<PortfolioData> {
  if (process.env.EDGE_CONFIG) {
    const edge = await readFromEdge();
    if (edge) return edge;
  }
  return readLocal();
}

export async function writeDB(
  data: PortfolioData
): Promise<{ edge: boolean; github: boolean }> {
  const result = { edge: false, github: false };

  if (process.env.EDGE_CONFIG) result.edge = await writeToEdge(data);
  writeLocal(data);
  result.github = await commitToGitHub(data);

  return result;
}

/* ------------------------------- Drafts (local) ------------------------------ */

export function readDrafts(): Partial<PortfolioData> {
  try {
    return JSON.parse(fs.readFileSync(DRAFTS_PATH, "utf-8")) as Partial<PortfolioData>;
  } catch {
    return {};
  }
}

export function writeDrafts(drafts: Partial<PortfolioData>): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DRAFTS_PATH, JSON.stringify(drafts, null, 2), "utf-8");
  } catch (err) {
    console.error("[db] writeDrafts failed (read-only filesystem?):", err);
  }
}

export function clearDraft(section: SectionKey): void {
  const drafts = readDrafts();
  if (section in drafts) {
    delete (drafts as Record<string, unknown>)[section];
    writeDrafts(drafts);
  }
}
