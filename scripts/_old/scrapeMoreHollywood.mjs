import { execSync } from 'child_process';
import fs from 'fs';

const cardRegex = /<a[^>]+href=([^\s>]+)[^>]*>[\s\S]*?<img[^>]+(?:data-src|src)=([^\s>]+)[\s\S]*?<h2[^>]*class=[^>]*card-title[^>]*>([\s\S]*?)<\/h2>/gi;

const existing = JSON.parse(fs.readFileSync('scripts/moviespedia_hollywood.json', 'utf8'));
const seen = new Set(existing.map(x => x.title.toLowerCase()));

console.log(`Starting with ${existing.length} existing Hollywood movies...`);

for (let p = 21; p <= 30; p++) {
  try {
    const url = `https://moviespedia.net/movies/page/${p}/`;
    const html = execSync(`curl.exe -s "${url}"`, { timeout: 15000 }).toString();
    let m;
    let added = 0;
    while ((m = cardRegex.exec(html)) !== null) {
      const href = m[1].replace(/['"]/g, '');
      const img = m[2].replace(/['"]/g, '');
      const title = m[3].replace(/<[^>]+>/g, '').trim();
      if (!seen.has(title.toLowerCase())) {
        seen.add(title.toLowerCase());
        existing.push({ href, img, title });
        added++;
      }
    }
    console.log(`Page ${p}: added ${added}, cumulative: ${existing.length}`);
  } catch (e) {
    console.log(`Page ${p} failed:`, e.message);
  }
}

fs.writeFileSync('scripts/moviespedia_hollywood.json', JSON.stringify(existing, null, 2));
console.log(`Successfully updated scripts/moviespedia_hollywood.json with ${existing.length} movies!`);
