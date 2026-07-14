import fs from 'fs';
import path from 'path';

// Safe database functions that work on both localhost and Vercel
// All file reads are wrapped in try/catch to prevent crashes

const DB_PATH = path.join(process.cwd(), 'content.json');
const DRAFTS_PATH = path.join(process.cwd(), 'data', 'drafts.json');
const SEED_PATH = path.join(process.cwd(), 'data', 'seed.json');

export function readDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('⚠️ readDB failed (normal on Vercel):', error);
  }
  return {}; // Return empty object on Vercel
}

export function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.warn('⚠️ writeDB failed (normal on Vercel):', error);
    return false;
  }
}

export function readDrafts() {
  try {
    if (fs.existsSync(DRAFTS_PATH)) {
      const content = fs.readFileSync(DRAFTS_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('️ readDrafts failed (normal on Vercel):', error);
  }
  return {};
}

export function writeDrafts(data: any) {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DRAFTS_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.warn('⚠️ writeDrafts failed (normal on Vercel):', error);
    return false;
  }
}

export function clearDraft(section: string) {
  try {
    const drafts = readDrafts();
    delete drafts[section];
    writeDrafts(drafts);
    return true;
  } catch (error) {
    console.warn('⚠️ clearDraft failed:', error);
    return false;
  }
} 