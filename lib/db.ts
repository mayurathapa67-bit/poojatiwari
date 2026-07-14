// SAFE VERSION - NO FILE READING
// Accepts optional second parameter for compatibility

export function readDB() {
  return {}; // Always return empty - pages should use API instead
}

export function writeDB(data: any, _location?: string) {
  // _location parameter is ignored for Vercel compatibility
  console.warn('writeDB called but not implemented for Vercel');
  return false;
}

export function readDrafts() {
  return {};
}

export function writeDrafts(data: any, _location?: string) {
  // _location parameter is ignored
  console.warn('writeDrafts called but not implemented for Vercel');
  return false;
}

export function clearDraft(section: string) {
  return false;
}
