import { execSync } from 'child_process';

const searchQueries = ['dangal', 'rrr', 'kgf', 'jawan', 'pathaan', 'pushpa'];

for (const q of searchQueries) {
  try {
    const html = execSync(`curl.exe -s "https://moviespedia.net/?s=${q}"`, { timeout: 10000 }).toString();
    const matches = [...html.matchAll(/class="card-title"[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log(`Search "${q}":`, matches.length, 'results:', matches.slice(0, 3));
  } catch (e) {
    console.log(`Search "${q}" failed:`, e.message);
  }
}
