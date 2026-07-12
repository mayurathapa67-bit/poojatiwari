import fs from "fs";
import path from "path";
import type { PortfolioData, SectionKey } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const DRAFTS_PATH = path.join(DATA_DIR, "drafts.json");

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

export function readDB(): PortfolioData {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as PortfolioData;
  } catch {
    return {} as PortfolioData;
  }
}

export function writeDB(data: PortfolioData): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function readDrafts(): Partial<PortfolioData> {
  try {
    return JSON.parse(fs.readFileSync(DRAFTS_PATH, "utf-8")) as Partial<PortfolioData>;
  } catch {
    return {};
  }
}

export function writeDrafts(drafts: Partial<PortfolioData>): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DRAFTS_PATH, JSON.stringify(drafts, null, 2), "utf-8");
}

export function clearDraft(section: SectionKey): void {
  const drafts = readDrafts();
  if (section in drafts) {
    delete (drafts as Record<string, unknown>)[section];
    writeDrafts(drafts);
  }
}
