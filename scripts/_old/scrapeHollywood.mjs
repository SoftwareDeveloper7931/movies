import { execSync } from 'child_process';
import fs from 'fs';

const cardRegex = /<a[^>]+href=([^\s>]+)[^>]*>[\s\S]*?<img[^>]+(?:data-src|src)=([^\s>]+)[\s\S]*?<h2[^>]*class=[^>]*card-title[^>]*>([\s\S]*?)<\/h2>/gi;

const scraped = [];
const seen = new Set();

for (let p = 1; p <= 20; p++) {
  try {
    const url = `https://moviespedia.net/movies/page/${p}/`;
    const html = execSync(`curl.exe -s "${url}"`, { timeout: 15000 }).toString();
    let m;
    let pageCount = 0;
    while ((m = cardRegex.exec(html)) !== null) {
      const href = m[1].replace(/['"]/g, '');
      const img = m[2].replace(/['"]/g, '');
      const title = m[3].replace(/<[^>]+>/g, '').trim();
      if (!seen.has(title)) {
        seen.add(title);
        scraped.push({ href, img, title });
        pageCount++;
      }
    }
    console.log(`Page ${p}: added ${pageCount}, total unique: ${scraped.length}`);
  } catch (e) {
    console.log(`Page ${p} error:`, e.message);
  }
}

fs.writeFileSync('scripts/moviespedia_hollywood.json', JSON.stringify(scraped, null, 2));
console.log('Saved', scraped.length, 'movies to scripts/moviespedia_hollywood.json');
