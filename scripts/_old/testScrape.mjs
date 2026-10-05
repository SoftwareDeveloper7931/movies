import { execSync } from 'child_process';
import fs from 'fs';

const allMovies = [];
const cardRegex = /<a[^>]+href=([^\s>]+)[^>]*>[\s\S]*?<img[^>]+(?:data-src|src)=([^\s>]+)[\s\S]*?<h2[^>]*class=[^>]*card-title[^>]*>([\s\S]*?)<\/h2>/gi;

for (let p = 1; p <= 5; p++) {
  const url = p === 1 ? 'https://moviespedia.net/movies/' : `https://moviespedia.net/movies/page/${p}/`;
  try {
    console.log(`Fetching page ${p}...`);
    const html = execSync(`curl.exe -s "${url}"`, { timeout: 15000 }).toString();
    let m;
    let pageCount = 0;
    while ((m = cardRegex.exec(html)) !== null) {
      allMovies.push({
        href: m[1],
        img: m[2],
        title: m[3].replace(/<[^>]+>/g, '').trim()
      });
      pageCount++;
    }
    console.log(`Page ${p} returned ${pageCount} movies.`);
  } catch (e) {
    console.log(`Page ${p} failed:`, e.message);
  }
}

console.log(`Total scraped from 5 pages: ${allMovies.length}`);
console.log('Sample titles:', allMovies.slice(0, 10).map(x => x.title));
