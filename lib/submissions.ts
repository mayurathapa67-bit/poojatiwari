import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Submission } from "./submission-types";

const SUBMISSIONS_PATH = path.join(process.cwd(), "data", "submissions.json");

function ensureFile(): void {
  try {
    const dir = path.dirname(SUBMISSIONS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(SUBMISSIONS_PATH)) {
      fs.writeFileSync(SUBMISSIONS_PATH, "[]", "utf-8");
    }
  } catch (err) {
    console.error("[submissions] ensureFile failed (read-only filesystem?):", err);
  }
}

/**
 * Read submissions. If the file is missing or unreadable (e.g. Vercel's
 * read-only FS), fall back to an empty array instead of throwing.
 */
export function readSubmissions(): Submission[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(SUBMISSIONS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch {
    return [];
  }
}

export function writeSubmissions(submissions: Submission[]): void {
  try {
    ensureFile();
    fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (err) {
    console.error("[submissions] writeSubmissions failed (read-only filesystem?):", err);
  }
}

export function addSubmission(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Submission {
  const submissions = readSubmissions();
  const submission: Submission = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    timestamp: new Date().toISOString(),
  };
  submissions.push(submission);
  writeSubmissions(submissions);
  return submission;
}

export function deleteSubmission(id: string): boolean {
  const submissions = readSubmissions();
  const next = submissions.filter((s) => s.id !== id);
  if (next.length === submissions.length) return false;
  writeSubmissions(next);
  return true;
}

export function archiveSubmission(id: string, archived = true): boolean {
  const submissions = readSubmissions();
  let changed = false;
  const next = submissions.map((s) => {
    if (s.id === id) {
      changed = true;
      return { ...s, archived };
    }
    return s;
  });
  if (!changed) return false;
  writeSubmissions(next);
  return true;
}
