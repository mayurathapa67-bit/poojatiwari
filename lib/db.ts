import fs from "fs";
import path from "path";
import type { PortfolioData, SectionKey } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const DRAFTS_PATH = path.join(DATA_DIR, "drafts.json");
const SEED_PATH = path.join(DATA_DIR, "seed.json");

const VALID_SECTIONS: SectionKey[] = [
  "personalInfo",
  "hero",
  "about",
  "experience",
  "projects",
  "contact",
  "socials",
];

export function isSection(key: string): key is SectionKey {
  return (VALID_SECTIONS as string[]).includes(key);
}

/**
 * Read the live database. On Vercel (and other read-only / ephemeral
 * filesystems) db.json may be missing or unwritable — in that case we
 * gracefully fall back to the committed seed.json so the site never 500s.
 */
export function readDB(): PortfolioData {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as PortfolioData;
  } catch {
    try {
      return JSON.parse(fs.readFileSync(SEED_PATH, "utf-8")) as PortfolioData;
    } catch {
      return {} as PortfolioData;
    }
  }
}

/**
 * Persist the database. Writes can fail on read-only serverless
 * filesystems (e.g. Vercel) — we log the failure instead of throwing so
 * the request still resolves successfully.
 */
export function writeDB(data: PortfolioData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[db] writeDB failed (read-only filesystem?):", err);
  }
}

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
