// SAFE VERSION - No direct file reading!
// This file should ONLY use fetch() to get data from API routes

export async function getDatabase() {
  try {
    const res = await fetch('/api/content', { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Database fetch error:', error);
    return null;
  }
}
